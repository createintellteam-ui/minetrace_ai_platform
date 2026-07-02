"""
MineTrace AI - Synthetic Data Generator
Central configuration: every knob lives here.

Aligned to the OMC EoI (OMC/E-PROC/C&P/015/2026-27) pit-to-dispatch scope and
calibrated to the MineTrace pitch deck headline figures.
"""
from datetime import date

# --------------------------------------------------------------------------
# SCALE KNOBS  -- change these to go from a demo slice to the full spec
# --------------------------------------------------------------------------
# Full spec (per teammate doc): 180 days, 45 trucks/site, ~15 trips/truck/day
#   -> ~364,500 trips, ~500MB.  Set SCALE_PROFILE = "full" for that.
# For local validation / a fast demo build, "demo" keeps everything intact
#   (all anomalies, all datasets) but over a short window.
SCALE_PROFILE = "month"          # "demo" | "month" | "full"

_PROFILES = {
    "demo":  {"days": 7,   "trips_per_truck_per_day": 15},
    "month": {"days": 30,  "trips_per_truck_per_day": 15},
    "full":  {"days": 180, "trips_per_truck_per_day": 15},
}
DAYS = _PROFILES[SCALE_PROFILE]["days"]
TRIPS_PER_TRUCK_PER_DAY = _PROFILES[SCALE_PROFILE]["trips_per_truck_per_day"]

# The "today" the demo is anchored to (matches the tender / compliance dates).
DEMO_TODAY = date(2026, 7, 1)
# Data window ends the day before DEMO_TODAY.
SEED = 42

# --------------------------------------------------------------------------
# CALIBRATION TARGETS  -- make aggregates match the pitch deck
# --------------------------------------------------------------------------
# Deck headline KPIs (Operations Command Dashboard).
# NOTE: the deck's own waterfall has an internal inconsistency
#   (image-1 shows crusher 116,240 MT; page-9 waterfall shows 126,240 MT).
# We calibrate to the page-9 waterfall chain, which is the clean one:
CALIB = {
    "total_mined_mt":      128_540,   # Step 1 - Pit
    "crusher_output_mt":   126_240,   # Step 2 - Crusher  (-1.79% vs pit)
    "stockyard_mt":        102_780,   # Step 3 - Stockyard
    "total_dispatched_mt":  94_320,   # Step 4 - Dispatch (-8.23% vs stockyard)
    "rom_grade_fe_pct":       62.35,  # ROM Grade (Avg)
    "fleet_utilisation_pct":  78.4,
    "on_time_dispatch_pct":   92.6,
}
# These totals describe the CALIBRATION WINDOW below (a representative window
# whose totals the executive HUD reports), independent of SCALE_PROFile volume.
# The generator scales per-trip tonnage so the pit total lands on target.

# --------------------------------------------------------------------------
# MINERALS  -- OMC mines chrome / iron / manganese / bauxite / limestone.
#   (Coal dropped: not an OMC mineral.)  Grade bands drive geo-fenced zones.
# --------------------------------------------------------------------------
MINERALS = {
    "Fe": {
        "name": "Iron Ore", "assay_field": "Fe",
        "bands": [
            ("High",   65.0, 100.0, 8200),
            ("Medium", 60.0,  65.0, 5800),
            ("Low",    55.0,  60.0, 3200),
            ("Reject",  0.0,  55.0, 1400),
        ],
        "royalty_pct": 15.0,
        "xrf_params": ["Fe", "SiO2", "Al2O3", "TiO2", "P", "S"],
        "typical_grade": 62.35, "grade_sd": 3.2,
    },
    "Cr": {
        "name": "Chrome Ore", "assay_field": "Cr2O3",
        "bands": [
            ("High",   52.0, 100.0, 6800),
            ("Medium", 45.0,  52.0, 4200),
            ("Low",    38.0,  45.0, 2100),
        ],
        "royalty_pct": 10.0,
        "xrf_params": ["Cr2O3", "FeO", "SiO2", "Al2O3", "MgO"],
        "typical_grade": 48.0, "grade_sd": 4.0,
    },
    "Mn": {
        "name": "Manganese Ore", "assay_field": "Mn",
        "bands": [
            ("High",   44.0, 100.0, 5400),
            ("Medium", 35.0,  44.0, 3100),
            ("Low",    25.0,  35.0, 1600),
        ],
        "royalty_pct": 14.0,
        "xrf_params": ["Mn", "Fe", "SiO2", "Al2O3", "P"],
        "typical_grade": 39.0, "grade_sd": 5.0,
    },
}

# --------------------------------------------------------------------------
# GRADE MEASUREMENT ACCURACY  (per teammate doc; LIMS = ground truth)
# --------------------------------------------------------------------------
GRADE_ACCURACY = {
    "lims_sd":   0.0,    # ground truth
    "xrf_sd":    0.30,   # most accurate instrument
    "camera_sd": 1.50,   # AI camera prediction
    "eye_sd":    4.00,   # human eye estimate (worst)
}

# --------------------------------------------------------------------------
# SITES  -- mapped to real OMC mineral belts (synthetic blocks)
# --------------------------------------------------------------------------
SITES = [
    {"site_id": "SITE_A", "name": "Keonjhar Iron Ore Block",
     "location": "Keonjhar, Odisha", "lat": 21.6289, "lng": 85.5819,
     "mineral": "Fe", "pits": ["PIT_A1", "PIT_A2", "PIT_A3", "PIT_A4"],
     "area_ha": 124.5},
    {"site_id": "SITE_B", "name": "Sukinda Chrome Block",
     "location": "Jajpur, Odisha", "lat": 21.0012, "lng": 85.7634,
     "mineral": "Cr", "pits": ["PIT_B1", "PIT_B2", "PIT_B3", "PIT_B4", "PIT_B5"],
     "area_ha": 89.2},
    {"site_id": "SITE_C", "name": "Bonai Manganese Block",
     "location": "Sundargarh, Odisha", "lat": 21.9800, "lng": 85.2100,
     "mineral": "Mn", "pits": ["PIT_C1", "PIT_C2"],
     "area_ha": 62.8},
]

TRUCKS_PER_SITE = 15   # -> 45 trucks total across 3 sites (matches doc's fleet)

# --------------------------------------------------------------------------
# WORKERS  -- corrected: 10 departments, counts now sum to 340
#   (doc said "8 departments" but listed 10 summing to 285; fixed here)
# --------------------------------------------------------------------------
WORKER_DEPARTMENTS = {
    "Pit operations":         100,
    "Fleet and dispatch":      64,
    "Safety":                  20,
    "Weighbridge operations":  12,
    "Compliance and legal":    14,
    "Management":              26,
    "Maintenance workshop":    30,
    "Administration":          26,
    "Security":                20,
    "Laboratory":              28,
}   # total = 340

# --------------------------------------------------------------------------
# EMBEDDED DEMO ANOMALIES  (the judge-facing stories)
# --------------------------------------------------------------------------
ANOMALY = {
    # Weight-loss / suspected pilferage on one truck, escalating pattern.
    "theft_truck": "OD09AB4421",
    "theft_every_nth_trip": 5,
    "theft_loss_range_t": (3.5, 4.0),
    "theft_escalation_seq_t": [-0.8, -1.2, -2.1, -3.1, -3.8],  # 17-record ramp
    # Wrong-zone dumping (grade dilution): chrome truck into iron zone.
    "wrong_zone_truck": "OD17YX9021",
    "wrong_zone_events_last_month": 3,
    # Night-shift underperformance, worse Thu/Fri, worst at Site B 02:00-04:00.
    "night_shift_underperf_pct": 2.1,
    # Predictive-maintenance stories.
    "declining_dozer": "DZ-01",
    "failed_excavator": "EX-07",
    # Upcoming blast shown mid-checklist in the demo.
    "demo_blast": {
        "blast_id": "BL-2026-07-01-001", "pit_id": "PIT_B3",
        "planned_time": "13:00", "shot_firer": "Vikram Sahoo",
        "explosives_kg": 840, "holes": 48, "checklist": "4/6",
    },
}

# --------------------------------------------------------------------------
# OUTPUT PATHS
# --------------------------------------------------------------------------
OUT_ROOT   = "data"
OUT_MASTER = f"{OUT_ROOT}/master"
OUT_RAW    = f"{OUT_ROOT}/raw"
OUT_DB     = f"{OUT_ROOT}/minetrace.duckdb"
