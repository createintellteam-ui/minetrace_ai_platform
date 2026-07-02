"""
Transactional (time-series) data generator.

Two reconciliation layers, both in the OMC tender scope:
  1. Per-trip transport reconciliation  (weighbridge: pit vs dispatch weight)
  2. Stage material-balance waterfall     (Pit -> Crusher -> Stockyard -> Dispatch)
     -- calibrated to reproduce the pitch-deck chain exactly.

Also: grade reconciliation (camera / eye / XRF / LIMS), grade-band geofencing
(wrong-zone dilution), dispatch hold/release, plus the bonus operational sets.
"""
import csv
import os
import random
from datetime import datetime, timedelta

import numpy as np

from . import config as C


def _seed():
    random.seed(C.SEED)
    np.random.seed(C.SEED)


def _band_for(mineral_code, grade):
    for band, lo, hi, _price in C.MINERALS[mineral_code]["bands"]:
        if lo <= grade < hi:
            return band
    return C.MINERALS[mineral_code]["bands"][-1][0]


def _write_csv(name, rows, fieldnames):
    os.makedirs(C.OUT_RAW, exist_ok=True)
    path = os.path.join(C.OUT_RAW, name)
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)
    return path, len(rows)


# ============================================================ TRIPS + SCANS + WB
def generate_trips(master):
    _seed()
    trucks = master["fleet"]["trucks"]
    truck_by_id = {t["truck_id"]: t for t in trucks}
    site_by_id = {s["site_id"]: s for s in C.SITES}
    zones = master["zones"]
    zones_by_site = {}
    for z in zones:
        zones_by_site.setdefault(z["site_id"], []).append(z)
    customers = master["customers"]
    cust_by_mineral = {}
    for cu in customers:
        cust_by_mineral.setdefault(cu["mineral_ordered"], []).append(cu["customer_id"])

    trips, scans, wb = [], [], []
    trip_seq = scan_seq = wb_seq = 0
    end = C.DEMO_TODAY
    start = end - timedelta(days=C.DAYS)

    theft_id = C.ANOMALY["theft_truck"]
    theft_counter = {}          # per-truck trip counter for the every-Nth pattern
    theft_ramp = list(C.ANOMALY["theft_escalation_seq_t"])
    theft_ramp_used = 0
    wrong_zone_id = C.ANOMALY["wrong_zone_truck"]
    wrong_zone_budget = C.ANOMALY["wrong_zone_events_last_month"]

    shift_windows = {"Morning": (6, 14), "Afternoon": (14, 22), "Night": (22, 30)}

    day = start
    while day < end:
        weekday = day.weekday()  # 0=Mon
        for t in trucks:
            site = site_by_id[t["site_assigned"]]
            mineral = site["mineral"]
            mref = C.MINERALS[mineral]
            for _ in range(C.TRIPS_PER_TRUCK_PER_DAY):
                trip_seq += 1
                trip_id = f"TRP{trip_seq:08d}"
                pit = random.choice(site["pits"])
                # shift assignment
                shift = random.choices(["Morning", "Afternoon", "Night"],
                                       weights=[0.42, 0.33, 0.25])[0]
                sh0, sh1 = shift_windows[shift]
                hour = int(np.random.randint(sh0, sh1)) % 24
                start_dt = datetime(day.year, day.month, day.day, hour,
                                    int(np.random.randint(0, 60)))

                # ---- ground-truth grade (LIMS) then the 4 measurements ----
                true_grade = float(np.clip(
                    np.random.normal(mref["typical_grade"], mref["grade_sd"]),
                    mref["bands"][-1][1], 100))
                g_lims = round(true_grade, 2)
                g_xrf = round(true_grade + np.random.normal(0, C.GRADE_ACCURACY["xrf_sd"]), 2)
                g_cam = round(true_grade + np.random.normal(0, C.GRADE_ACCURACY["camera_sd"]), 2)
                g_eye = round(true_grade + np.random.normal(0, C.GRADE_ACCURACY["eye_sd"]), 1)
                band = _band_for(mineral, g_lims)

                # ---- weights (pit; scaled later to hit calibration total) ----
                cap = t["capacity_tonnes"]
                pit_w = round(cap * np.random.uniform(0.88, 0.99), 2)

                # transport loss (normal small shrinkage)
                loss = round(pit_w * np.random.uniform(0.003, 0.015), 2)

                # ---- theft anomaly (OD09AB4421 every Nth trip) ----
                pattern_count = 0
                if t["truck_id"] == theft_id:
                    theft_counter[theft_id] = theft_counter.get(theft_id, 0) + 1
                    if theft_counter[theft_id] % C.ANOMALY["theft_every_nth_trip"] == 0:
                        if theft_ramp_used < len(theft_ramp):
                            loss = abs(theft_ramp[theft_ramp_used])
                            pattern_count = theft_ramp_used + 1
                            theft_ramp_used += 1
                        else:
                            loss = round(np.random.uniform(*C.ANOMALY["theft_loss_range_t"]), 2)
                            pattern_count = theft_ramp_used + 1

                dispatch_w = round(pit_w - loss, 2)
                weight_diff = round(dispatch_w - pit_w, 2)

                # ---- geofencing: correct zone by grade band ----
                correct_zone = next(
                    (z["zone_id"] for z in zones_by_site[site["site_id"]]
                     if z["grade_band"] == band),
                    zones_by_site[site["site_id"]][0]["zone_id"])
                actual_zone = correct_zone
                zone_mismatch = False
                # wrong-zone anomaly (chrome truck into iron zone) in last month
                in_last_month = (end - day).days <= 30
                if (t["truck_id"] == wrong_zone_id and in_last_month
                        and wrong_zone_budget > 0 and np.random.rand() < 0.25):
                    actual_zone = "ZONE_Fe_HIGH"      # iron zone (wrong mineral)
                    zone_mismatch = True
                    wrong_zone_budget -= 1

                # ---- dispatch hold/release ----
                cust_id = random.choice(cust_by_mineral.get(mref["name"], ["CUST001"]))
                hold_reason = ""
                approved = True
                if zone_mismatch:
                    approved, hold_reason = False, "Zone mismatch - grade dilution risk"
                elif pattern_count >= 3:
                    approved, hold_reason = False, "Weight discrepancy exceeds tolerance"
                elif band == "Reject":
                    approved, hold_reason = False, "Grade below customer specification"

                cyc = int(np.random.randint(95, 190))
                on_time = bool(approved and np.random.rand() < 0.95)  # ~92.6% overall
                trips.append({
                    "trip_id": trip_id, "truck_id": t["truck_id"],
                    "driver_id": t.get("driver_id", "WRK00005"),
                    "site_id": site["site_id"], "pit_id": pit,
                    "mineral_type": mref["name"],
                    "grade_camera_pct": g_cam, "grade_eye_estimate_pct": g_eye,
                    "grade_lims_pct": g_lims, "grade_xrf_pct": g_xrf,
                    "grade_band": band,
                    "weight_at_pit_tonnes": pit_w,
                    "weight_at_dispatch_tonnes": dispatch_w,
                    "weight_difference_tonnes": weight_diff,
                    "stockyard_zone_assigned": correct_zone,
                    "stockyard_zone_actual": actual_zone,
                    "zone_mismatch": zone_mismatch,
                    "trip_start_time": start_dt.isoformat(),
                    "pit_load_time": (start_dt + timedelta(minutes=12)).isoformat(),
                    "weighbridge_arrive_time": (start_dt + timedelta(minutes=40)).isoformat(),
                    "weighbridge_depart_time": (start_dt + timedelta(minutes=48)).isoformat(),
                    "stockyard_arrive_time": (start_dt + timedelta(minutes=70)).isoformat(),
                    "dispatch_time": (start_dt + timedelta(minutes=cyc)).isoformat(),
                    "cycle_time_minutes": cyc,
                    "challan_number": f"CH{day.year}{trip_seq:07d}",
                    "customer_id": cust_id,
                    "dispatch_approved": approved,
                    "hold_reason": hold_reason,
                    "on_time_dispatch": on_time,
                    "shift": shift,
                    "shift_supervisor_id": "WRK00006" if shift != "Night" else "WRK00007",
                })

                # ---- bucket scans (RGB + multispectral pit camera) ----
                n_buckets = int(np.random.randint(3, 7))
                for b in range(1, n_buckets + 1):
                    scan_seq += 1
                    conf = round(np.random.uniform(0.82, 0.98), 3)
                    scans.append({
                        "scan_id": f"SCN{scan_seq:09d}", "trip_id": trip_id,
                        "truck_id": t["truck_id"], "pit_id": pit,
                        "camera_id": f"CAM_{site['site_id']}_{pit}",
                        "mineral_type": mref["name"],
                        "grade_predicted_pct": round(
                            g_cam + np.random.normal(0, 0.4), 2),
                        "grade_confidence_pct": round(conf * 100, 1),
                        "volume_estimate_tonnes": round(pit_w / n_buckets, 2),
                        "scan_timestamp": (start_dt + timedelta(minutes=b)).isoformat(),
                        "image_path": f"/scans/{site['site_id']}/{trip_id}_b{b}.jpg",
                        "rgb_score": round(np.random.uniform(0.7, 0.99), 3),
                        "multispectral_score": round(np.random.uniform(0.75, 0.99), 3),
                        "bucket_number": b,
                    })

                # ---- weighbridge events (tare + gross, pit + dispatch) ----
                for wtype, wval in [("Pit", pit_w), ("Dispatch", dispatch_w)]:
                    wb_seq += 1
                    flag = abs(weight_diff) > 2.0 and wtype == "Dispatch"
                    wb.append({
                        "wb_reading_id": f"WB{wb_seq:09d}", "trip_id": trip_id,
                        "truck_id": t["truck_id"],
                        "weighbridge_id": f"WB_{site['site_id']}_1",
                        "site_id": site["site_id"], "weight_type": wtype,
                        "weight_tonnes": wval,
                        "timestamp": (start_dt + timedelta(
                            minutes=40 if wtype == "Pit" else cyc)).isoformat(),
                        "operator_id": "WRK00004",
                        "discrepancy_flag": bool(flag),
                        "discrepancy_tonnes": weight_diff if flag else 0.0,
                        "pattern_count": pattern_count,
                    })
        day += timedelta(days=1)

    # ---- calibrate pit tonnage so the total matches the deck headline ----
    raw_pit = sum(r["weight_at_pit_tonnes"] for r in trips)
    scale = C.CALIB["total_mined_mt"] / raw_pit if raw_pit else 1.0
    for r in trips:
        r["weight_at_pit_tonnes"] = round(r["weight_at_pit_tonnes"] * scale, 2)
        r["weight_at_dispatch_tonnes"] = round(r["weight_at_dispatch_tonnes"] * scale, 2)
        r["weight_difference_tonnes"] = round(
            r["weight_at_dispatch_tonnes"] - r["weight_at_pit_tonnes"], 2)

    return trips, scans, wb


# ============================================================ STAGE WATERFALL
def generate_waterfall(trips):
    """Stage material-balance reconciliation, calibrated to the deck chain.
    Split across the demo window by day so it can be filtered."""
    _seed()
    days = sorted({r["trip_start_time"][:10] for r in trips})
    n = len(days) or 1
    tgt = C.CALIB
    rows = []
    # distribute each stage total across days with mild noise, then normalize
    def _split(total):
        w = np.random.uniform(0.8, 1.2, n)
        w = w / w.sum()
        return [round(total * x, 2) for x in w]

    pit = _split(tgt["total_mined_mt"])
    cru = _split(tgt["crusher_output_mt"])
    sty = _split(tgt["stockyard_mt"])
    dis = _split(tgt["total_dispatched_mt"])
    for i, d in enumerate(days):
        rows.append({
            "waterfall_date": d,
            "stage_1_pit_mt": pit[i],
            "stage_2_crusher_mt": cru[i],
            "stage_3_stockyard_mt": sty[i],
            "stage_4_dispatch_mt": dis[i],
            "loss_pit_to_crusher_pct": round((cru[i] - pit[i]) / pit[i] * 100, 2),
            "loss_crusher_to_stockyard_pct": round((sty[i] - cru[i]) / cru[i] * 100, 2),
            "loss_stockyard_to_dispatch_pct": round((dis[i] - sty[i]) / sty[i] * 100, 2),
        })
    return rows


# ============================================================ SHIFTS
def generate_shifts():
    _seed()
    rows = []
    end = C.DEMO_TODAY
    start = end - timedelta(days=C.DAYS)
    profiles = {
        "Morning": (87, 4, 87), "Afternoon": (75, 3, 74), "Night": (71, 3, 71),
    }
    day = start
    sid = 0
    while day < end:
        wd = day.weekday()
        for s in C.SITES:
            for stype, (base, sd, util) in profiles.items():
                sid += 1
                score = base + np.random.normal(0, sd)
                u = util
                if stype == "Night" and wd in (3, 4):        # Thu/Fri worse
                    score -= np.random.uniform(4, 7)
                if stype == "Night" and s["site_id"] == "SITE_B":
                    u = 58                                    # the 02:00-04:00 slump
                    score -= C.ANOMALY["night_shift_underperf_pct"]
                target = np.random.randint(1800, 2600)
                pct = np.clip(score / 100 * np.random.uniform(0.95, 1.05), 0.5, 1.1)
                rows.append({
                    "shift_id": f"SH{sid:06d}", "site_id": s["site_id"],
                    "shift_type": stype, "shift_date": str(day),
                    "supervisor_id": "WRK00006" if stype != "Night" else "WRK00007",
                    "crew_count": int(np.random.randint(18, 42)),
                    "production_tonnes_target": int(target),
                    "production_tonnes_actual": int(target * pct),
                    "production_pct_achieved": round(pct * 100, 1),
                    "equipment_utilisation_pct": round(u + np.random.normal(0, 3), 1),
                    "active_trucks_count": int(np.random.randint(10, 15)),
                    "trips_completed": int(np.random.randint(120, 230)),
                    "discrepancies_count": int(np.random.poisson(1.5)),
                    "incidents_count": int(np.random.poisson(0.2)),
                    "avg_cycle_time_minutes": round(np.random.uniform(120, 175), 1),
                    "weighbridge_throughput_tph": round(np.random.uniform(180, 320), 1),
                    "grade_avg_pct": round(np.random.uniform(58, 64), 2),
                    "shift_score": round(np.clip(score, 40, 100), 1),
                    "handover_time_minutes": int(np.random.randint(8, 25)),
                    "notes": "",
                })
        day += timedelta(days=1)
    return rows


# ============================================================ EQUIPMENT HEALTH
def generate_equipment_health(master):
    _seed()
    rows = []
    equip = [e for e in master["fleet"]["equipment"]
             if e["type"] in ("excavator", "dozer", "drill_rig")]
    end = C.DEMO_TODAY
    hid = 0
    for e in equip:
        base = e.get("health_score", 80)
        cum_hours = e.get("engine_hours", int(np.random.randint(4000, 20000)))
        for dback in range(C.DAYS, 0, -1):
            hid += 1
            d = end - timedelta(days=dback)
            health = base
            oil_dev = round(np.random.normal(0, 2), 1)
            vib_dev = round(np.random.normal(0, 3), 1)
            fail_p = round(np.random.uniform(1, 8), 1)
            at_risk = ""
            if e["equipment_id"] == C.ANOMALY["declining_dozer"]:
                # DZ-01 declining ramp over the last 30 days
                if dback <= 30:
                    frac = (30 - dback) / 30
                    health = round(82 - frac * (82 - 44))
                    oil_dev = round(-8 - frac * 10, 1)
                    vib_dev = round(frac * 23, 1)
                    fail_p = round(20 + frac * 47, 1)
                    at_risk = "Oil pump / bearing"
            if e["equipment_id"] == C.ANOMALY["failed_excavator"]:
                health = 12
                fail_p = 95.0
                at_risk = "Hydraulic seal"
            cum_hours += np.random.randint(8, 20)
            rows.append({
                "health_id": f"EH{hid:07d}", "equipment_id": e["equipment_id"],
                "equipment_type": e["type"], "site_id": e["site_id"],
                "record_date": str(d), "health_score": int(np.clip(health, 5, 100)),
                "engine_hours_cumulative": int(cum_hours),
                "fuel_consumption_litres": round(np.random.uniform(180, 620), 1),
                "oil_pressure_bar": round(4.5 + oil_dev / 100 * 4.5, 2),
                "oil_pressure_deviation_pct": oil_dev,
                "coolant_temp_celsius": round(np.random.uniform(78, 96), 1),
                "vibration_level": round(np.random.uniform(2, 6) + vib_dev / 10, 2),
                "vibration_deviation_pct": vib_dev,
                "failure_probability_pct": fail_p,
                "at_risk_component": at_risk,
                "maintenance_due": bool(fail_p > 40),
                "maintenance_cost_estimate": int(np.random.randint(40000, 350000)),
                "downtime_hours_this_month": round(np.random.uniform(0, 40), 1),
            })
    return rows


# ============================================================ BLASTS
def generate_blasts(master):
    _seed()
    rows = []
    end = C.DEMO_TODAY
    start = end - timedelta(days=C.DAYS)
    # ~24 blasts/month -> scale to window
    n = max(1, round(24 * C.DAYS / 30))
    for i in range(n):
        s = random.choice(C.SITES)
        pit = random.choice(s["pits"])
        d = start + timedelta(days=int(np.random.randint(0, max(1, C.DAYS))))
        mref = C.MINERALS[s["mineral"]]
        expected_grade = round(np.random.normal(mref["typical_grade"], 1.5), 2)
        expected_tonnes = int(np.random.randint(4000, 9000))
        rows.append({
            "blast_id": f"BL-{d}-{i+1:03d}", "site_id": s["site_id"], "pit_id": pit,
            "blast_date": str(d), "blast_time": "13:00",
            "shot_firer_id": "WRK00003", "shot_firer_licence": "SF/OD/2021/0442",
            "planned_blast_time": "13:00", "actual_blast_time": "13:05",
            "holes_count": int(np.random.randint(30, 60)),
            "holes_depth_m": round(np.random.uniform(8, 14), 1),
            "explosives_type": "ANFO",
            "explosives_quantity_kg": int(np.random.randint(600, 1000)),
            "expected_grade_pct": expected_grade,        # feeds reconciliation engine
            "expected_tonnes": expected_tonnes,          # (tender: 'mine plan / blast data')
            "ground_vibration_mms": round(np.random.uniform(2, 9), 2),
            "air_blast_overpressure_db": round(np.random.uniform(105, 128), 1),
            "flyrock_distance_m": int(np.random.randint(40, 180)),
            "dust_cloud_height_m": int(np.random.randint(20, 90)),
            "weather_wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
            "weather_wind_speed_kmh": round(np.random.uniform(4, 22), 1),
            "misfire_count": int(np.random.poisson(0.1)),
            "misfire_resolved": True,
            "villages_notified_count": int(np.random.randint(2, 6)),
            "post_blast_inspection_done": True,
            "dgms_report_submitted": bool(np.random.rand() < 0.9),
            "production_tonnes_post_blast": expected_tonnes + int(np.random.randint(-400, 400)),
        })
    # pinned upcoming demo blast (mid-checklist)
    b = C.ANOMALY["demo_blast"]
    rows.append({
        "blast_id": b["blast_id"], "site_id": "SITE_B", "pit_id": b["pit_id"],
        "blast_date": str(C.DEMO_TODAY), "blast_time": "",
        "shot_firer_id": "WRK-VS", "shot_firer_licence": "SF/OD/2020/0311",
        "planned_blast_time": b["planned_time"], "actual_blast_time": "",
        "holes_count": b["holes"], "holes_depth_m": 11.0,
        "explosives_type": "ANFO", "explosives_quantity_kg": b["explosives_kg"],
        "expected_grade_pct": 48.5, "expected_tonnes": 7200,
        "ground_vibration_mms": 0, "air_blast_overpressure_db": 0,
        "flyrock_distance_m": 0, "dust_cloud_height_m": 0,
        "weather_wind_direction": "NE", "weather_wind_speed_kmh": 9.0,
        "misfire_count": 0, "misfire_resolved": True,
        "villages_notified_count": 4, "post_blast_inspection_done": False,
        "dgms_report_submitted": False, "production_tonnes_post_blast": 0,
        "status": f"pre-blast checklist {b['checklist']}",
        "shot_firer_name": b["shot_firer"],
    })
    return rows


# ============================================================ ENV SENSORS
def generate_env_sensors():
    _seed()
    rows = []
    end = C.DEMO_TODAY
    start = end - timedelta(days=C.DAYS)
    types = [("PM2.5", "ug/m3", 150), ("PM10", "ug/m3", 100),
             ("Noise", "dB", 85), ("Water_pH", "pH", 8.5)]
    rid = 0
    day = start
    # sample every 60 min in demo to keep volume sane; every 15 min at full
    step = 15 if C.SCALE_PROFILE == "full" else 60
    while day < end:
        for s in C.SITES:
            for stype, unit, limit in types:
                for minute in range(0, 24 * 60, step):
                    rid += 1
                    ts = datetime(day.year, day.month, day.day) + timedelta(minutes=minute)
                    if stype == "PM2.5" and s["site_id"] == "SITE_A":
                        val = np.random.uniform(60, 90)
                        if 13 * 60 <= minute <= 14 * 60:
                            val = np.random.uniform(180, 220)     # blast spike
                        elif 14 * 60 < minute <= 16 * 60:
                            val = np.random.uniform(110, 130)     # after suppression
                    elif stype == "PM10" and s["site_id"] == "SITE_B":
                        val = np.random.uniform(80, 96)
                    elif stype == "Noise":
                        val = np.random.uniform(62, 82)
                    elif stype == "Water_pH":
                        val = np.random.uniform(6.8, 8.2)
                    else:
                        val = np.random.uniform(40, 80)
                    exc = val > limit
                    rows.append({
                        "reading_id": f"ENV{rid:08d}", "sensor_id": f"SEN_{s['site_id']}_{stype}",
                        "site_id": s["site_id"], "sensor_type": stype,
                        "timestamp": ts.isoformat(), "value": round(val, 1), "unit": unit,
                        "ec_limit": limit, "is_exceedance": bool(exc),
                        "exceedance_pct_above_limit": round(max(0, (val - limit) / limit * 100), 1),
                        "weather_conditions": random.choice(["Clear", "Hazy", "Windy"]),
                        "nearest_blast_time": "13:00",
                        "dust_suppression_active": bool(np.random.rand() < 0.6),
                    })
        day += timedelta(days=1)
    return rows


# ============================================================ COMPLIANCE
def generate_compliance():
    return {
        "ibm_monthly_production_return": {
            "due": "15th of every month", "last_filed": "2026-06-15",
            "next_due": "2026-07-15", "days_left": 14, "status": "NOT STARTED"},
        "royalty_payment": {
            "amount_inr": 8420000, "due": "2026-08-09", "status": "PENDING"},
        "dgms_quarterly_return": {
            "period": "Q2 2026", "due": "2026-08-01", "status": "DATA COLLECTION"},
        "vehicle_fitness": {
            "expiring_trucks": 6, "window": "2026-07-18 to 2026-07-22",
            "renewal_cost_each_inr": 2400},
        "worker_safety_certs": {
            "expiring_within_30_days": 14, "training_dates": "2026-07-10 to 2026-07-12"},
    }
