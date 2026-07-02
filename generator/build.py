"""
MineTrace AI - data generation orchestrator.

Run:  python -m generator.build

Outputs (under data/):
  master/*.json          master/static data
  raw/*.csv , raw/*.json transactional data
  minetrace.duckdb       queryable DB with pre-aggregated summary VIEWS

The summary views are the small, API-shaped payloads the dashboard calls
(instead of pulling raw rows), so the frontend stays fast and cheap.
"""
import json
import os
import time

import duckdb

from . import config as C
from . import master_data as M
from . import transactions as T


def _write_json(name, obj):
    os.makedirs(C.OUT_RAW, exist_ok=True)
    p = os.path.join(C.OUT_RAW, name)
    with open(p, "w") as f:
        json.dump(obj, f, indent=2, default=str)
    return p


def build():
    t0 = time.time()
    print(f"[MineTrace] profile={C.SCALE_PROFILE} days={C.DAYS} "
          f"trucks/site={C.TRUCKS_PER_SITE}")

    master = M.generate_all_master()
    print(f"  master: {len(master['fleet']['trucks'])} trucks, "
          f"{len(master['workers'])} workers, {len(master['zones'])} zones")

    trips, scans, wb = T.generate_trips(master)
    waterfall = T.generate_waterfall(trips)
    shifts = T.generate_shifts()
    health = T.generate_equipment_health(master)
    blasts = T.generate_blasts(master)
    env = T.generate_env_sensors()
    compliance = T.generate_compliance()

    # ---- write raw transactional files ----
    T._write_csv("truck_trips.csv", trips, list(trips[0].keys()))
    T._write_csv("grade_scans.csv", scans, list(scans[0].keys()))
    T._write_csv("weighbridge_readings.csv", wb, list(wb[0].keys()))
    T._write_csv("waterfall_reconciliation.csv", waterfall, list(waterfall[0].keys()))
    T._write_csv("shift_records.csv", shifts, list(shifts[0].keys()))
    T._write_csv("equipment_health.csv", health, list(health[0].keys()))
    # blasts have a couple of extra keys on the pinned row -> union of keys
    blast_fields = list({k for r in blasts for k in r})
    T._write_csv("blast_records.csv",
                 [{k: r.get(k, "") for k in blast_fields} for r in blasts], blast_fields)
    T._write_csv("environment_sensors.csv", env, list(env[0].keys()))
    _write_json("compliance_deadlines.json", compliance)

    print(f"  trips={len(trips):,}  scans={len(scans):,}  wb={len(wb):,}  "
          f"shifts={len(shifts):,}  health={len(health):,}  "
          f"blasts={len(blasts):,}  env={len(env):,}")

    # ---- load DuckDB + build summary views ----
    if os.path.exists(C.OUT_DB):
        os.remove(C.OUT_DB)
    con = duckdb.connect(C.OUT_DB)
    raw = os.path.abspath(C.OUT_RAW)
    for tbl, fname in [
        ("trips", "truck_trips.csv"), ("scans", "grade_scans.csv"),
        ("weighbridge", "weighbridge_readings.csv"),
        ("waterfall", "waterfall_reconciliation.csv"),
        ("shifts", "shift_records.csv"), ("equipment_health", "equipment_health.csv"),
        ("blasts", "blast_records.csv"), ("env_sensors", "environment_sensors.csv"),
    ]:
        con.execute(
            f"CREATE TABLE {tbl} AS SELECT * FROM read_csv_auto('{raw}/{fname}', "
            f"header=true, sample_size=-1)")

    # master tables (from the flat JSON files)
    mp = os.path.abspath(C.OUT_MASTER)
    for tbl, fname in [
        ("workers", "workers_master.json"),
        ("trucks", "fleet_trucks.json"),
        ("equipment_master", "fleet_equipment.json"),
        ("zones", "stockyard_zones.json"),
        ("customers", "customers_master.json"),
    ]:
        con.execute(
            f"CREATE TABLE {tbl} AS SELECT * FROM read_json_auto('{mp}/{fname}')")

    # mineral price/royalty lookup (mineral_name, grade_band -> price, royalty)
    price_rows = []
    for code, m in C.MINERALS.items():
        for band, lo, hi, price in m["bands"]:
            price_rows.append((m["name"], band, float(price), float(m["royalty_pct"])))
    con.execute("CREATE TABLE mineral_prices(mineral_type VARCHAR, grade_band VARCHAR, "
                "price_inr_per_tonne DOUBLE, royalty_pct DOUBLE)")
    con.executemany("INSERT INTO mineral_prices VALUES (?,?,?,?)", price_rows)

    _build_views(con)
    con.close()

    dt = time.time() - t0
    size = os.path.getsize(C.OUT_DB) / 1e6
    print(f"  duckdb: {C.OUT_DB}  ({size:.1f} MB)")
    print(f"[MineTrace] done in {dt:.1f}s")
    return master


def _build_views(con):
    """Pre-aggregated, API-shaped views. Each maps to a dashboard widget /
    endpoint and returns a tiny result set."""

    # Executive HUD KPIs (single row) -> /api/dashboard/kpis
    con.execute("""
    CREATE VIEW v_exec_kpis AS
    SELECT
      (SELECT ROUND(SUM(weight_at_pit_tonnes),0) FROM trips)        AS total_mined_mt,
      (SELECT ROUND(SUM(stage_4_dispatch_mt),0) FROM waterfall)     AS total_dispatched_mt,
      (SELECT ROUND(AVG(grade_lims_pct),2) FROM trips
         WHERE mineral_type='Iron Ore')                            AS rom_grade_avg_fe_pct,
      (SELECT ROUND(AVG(equipment_utilisation_pct),1) FROM shifts)  AS fleet_utilisation_pct,
      (SELECT ROUND(100.0*SUM(CASE WHEN on_time_dispatch THEN 1 ELSE 0 END)/COUNT(*),1)
         FROM trips)                                                AS on_time_dispatch_pct,
      (SELECT COUNT(*) FROM trips)                                  AS total_trips,
      (SELECT SUM(CASE WHEN zone_mismatch THEN 1 ELSE 0 END) FROM trips) AS zone_mismatches,
      (SELECT ROUND(-100.0*SUM(weight_difference_tonnes)/SUM(weight_at_pit_tonnes),2)
         FROM trips)                                                AS transport_loss_pct;
    """)

    # Stage waterfall (deck chain) -> /api/reconciliation/waterfall
    con.execute("""
    CREATE VIEW v_waterfall_total AS
    SELECT
      ROUND(SUM(stage_1_pit_mt),0)       AS pit_mt,
      ROUND(SUM(stage_2_crusher_mt),0)   AS crusher_mt,
      ROUND(SUM(stage_3_stockyard_mt),0) AS stockyard_mt,
      ROUND(SUM(stage_4_dispatch_mt),0)  AS dispatch_mt,
      ROUND(100.0*(SUM(stage_2_crusher_mt)-SUM(stage_1_pit_mt))/SUM(stage_1_pit_mt),2)      AS loss_pit_crusher_pct,
      ROUND(100.0*(SUM(stage_3_stockyard_mt)-SUM(stage_2_crusher_mt))/SUM(stage_2_crusher_mt),2) AS loss_crusher_stockyard_pct,
      ROUND(100.0*(SUM(stage_4_dispatch_mt)-SUM(stage_3_stockyard_mt))/SUM(stage_3_stockyard_mt),2) AS loss_stockyard_dispatch_pct
    FROM waterfall;
    """)

    # Grade reconciliation accuracy (camera/eye/xrf vs LIMS) -> /api/grade/accuracy
    con.execute("""
    CREATE VIEW v_grade_accuracy AS
    SELECT
      ROUND(AVG(ABS(grade_camera_pct - grade_lims_pct)),3) AS camera_mae,
      ROUND(AVG(ABS(grade_eye_estimate_pct - grade_lims_pct)),3) AS eye_mae,
      ROUND(AVG(ABS(grade_xrf_pct - grade_lims_pct)),3) AS xrf_mae,
      COUNT(*) AS n
    FROM trips;
    """)

    # Truck anomaly leaderboard -> /api/anomalies/trucks
    con.execute("""
    CREATE VIEW v_truck_anomalies AS
    SELECT truck_id,
           COUNT(*)                                        AS trips,
           ROUND(-SUM(weight_difference_tonnes),1)         AS total_loss_t,
           SUM(CASE WHEN zone_mismatch THEN 1 ELSE 0 END)  AS zone_mismatches,
           SUM(CASE WHEN NOT dispatch_approved THEN 1 ELSE 0 END) AS holds
    FROM trips GROUP BY truck_id
    ORDER BY total_loss_t DESC;
    """)

    # Production trend by day -> /api/dashboard/trend
    con.execute("""
    CREATE VIEW v_production_trend AS
    SELECT CAST(trip_start_time AS DATE) AS day,
           ROUND(SUM(weight_at_pit_tonnes),0) AS mined_mt,
           ROUND(AVG(grade_lims_pct),2)       AS grade_pct
    FROM trips GROUP BY day ORDER BY day;
    """)

    # Grade band distribution -> /api/dashboard/grade_distribution
    con.execute("""
    CREATE VIEW v_grade_distribution AS
    SELECT mineral_type, grade_band, COUNT(*) AS trips,
           ROUND(SUM(weight_at_pit_tonnes),0) AS tonnes
    FROM trips GROUP BY mineral_type, grade_band ORDER BY mineral_type, grade_band;
    """)

    # Shift performance summary -> /api/shifts/summary
    con.execute("""
    CREATE VIEW v_shift_summary AS
    SELECT site_id, shift_type,
           ROUND(AVG(shift_score),1)               AS avg_score,
           ROUND(AVG(equipment_utilisation_pct),1) AS avg_utilisation
    FROM shifts GROUP BY site_id, shift_type ORDER BY site_id, shift_type;
    """)

    # Equipment at risk -> /api/equipment/at_risk
    con.execute("""
    CREATE VIEW v_equipment_at_risk AS
    SELECT equipment_id, equipment_type, site_id,
           MAX(record_date)                              AS as_of,
           MIN(health_score)                             AS latest_health,
           MAX(failure_probability_pct)                  AS peak_failure_prob,
           MAX(at_risk_component)                        AS at_risk_component
    FROM equipment_health GROUP BY equipment_id, equipment_type, site_id
    HAVING MIN(health_score) < 60
    ORDER BY latest_health ASC;
    """)

    # Finance: revenue + royalty by mineral -> /api/finance
    con.execute("""
    CREATE VIEW v_finance AS
    SELECT t.mineral_type,
           ROUND(SUM(t.weight_at_dispatch_tonnes),0)                    AS dispatched_mt,
           ROUND(SUM(t.weight_at_dispatch_tonnes*p.price_inr_per_tonne),0) AS revenue_inr,
           ROUND(SUM(t.weight_at_dispatch_tonnes*p.price_inr_per_tonne
                     *p.royalty_pct/100.0),0)                           AS royalty_inr
    FROM trips t
    LEFT JOIN mineral_prices p
      ON t.mineral_type=p.mineral_type AND t.grade_band=p.grade_band
    WHERE t.dispatch_approved = true
    GROUP BY t.mineral_type ORDER BY revenue_inr DESC;
    """)

    # Stockyard zone status -> /api/stockyard/zones
    con.execute("""
    CREATE VIEW v_zone_status AS
    SELECT z.zone_id, z.site_id, z.mineral_code, z.grade_band,
           z.capacity_tonnes,
           COALESCE(COUNT(t.trip_id),0)                         AS trips_in,
           COALESCE(ROUND(SUM(t.weight_at_dispatch_tonnes),0),0) AS tonnes_in,
           COALESCE(SUM(CASE WHEN t.zone_mismatch THEN 1 ELSE 0 END),0) AS mismatches
    FROM zones z
    LEFT JOIN trips t ON t.stockyard_zone_actual = z.zone_id
    GROUP BY z.zone_id, z.site_id, z.mineral_code, z.grade_band, z.capacity_tonnes
    ORDER BY z.site_id, z.grade_band;
    """)


if __name__ == "__main__":
    build()
