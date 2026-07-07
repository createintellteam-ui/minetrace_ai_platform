"""
Master (static) data generator.
Produces: mine_master, minerals_reference, fleet_master, workers_master,
customers_master, and stockyard_zones (grade-band geo-fenced).
"""
import json
import os
import random
from datetime import date, timedelta

import numpy as np
from faker import Faker

from . import config as C

fake = Faker("en_IN")


def _seed():
    random.seed(C.SEED)
    np.random.seed(C.SEED)
    Faker.seed(C.SEED)


def _write(name, obj):
    os.makedirs(C.OUT_MASTER, exist_ok=True)
    path = os.path.join(C.OUT_MASTER, name)
    with open(path, "w") as f:
        json.dump(obj, f, indent=2, default=str)
    return path


# ---------------------------------------------------------------- mine
def build_mine_master():
    return {
        "company": "Bharat Multi-Mineral Corporation Ltd",
        "cin": "U14100OR2018PTC028741",
        "lease_number": "ML/OD/2018/014",
        "ibm_region": "Bhubaneswar",
        "sites": [
            {
                "site_id": s["site_id"], "name": s["name"],
                "location": s["location"],
                "coordinates": {"lat": s["lat"], "lng": s["lng"]},
                "mineral_primary": C.MINERALS[s["mineral"]]["name"],
                "mineral_code": s["mineral"],
                "pits": s["pits"], "area_ha": s["area_ha"],
                "lease_valid_until": "2031-03-31",
                "ec_granted": "2019-07-15",
            }
            for s in C.SITES
        ],
    }


# ---------------------------------------------------------------- minerals
def build_minerals_reference():
    out = {}
    for code, m in C.MINERALS.items():
        out[code] = {
            "name": m["name"],
            "assay_field": m["assay_field"],
            "grade_bands": [
                {"band": b[0], "min_pct": b[1], "max_pct": b[2],
                 "price_inr_per_tonne": b[3]}
                for b in m["bands"]
            ],
            "royalty_rate_pct": m["royalty_pct"],
            "xrf_parameters": m["xrf_params"],
        }
    return out


# ---------------------------------------------------------------- zones
def build_stockyard_zones():
    """Grade-band geo-fenced stockyard zones (tender: 'grade range wise
    geo-fenced ore stockyard'). One zone per grade band per site."""
    zones = []
    for s in C.SITES:
        m = C.MINERALS[s["mineral"]]
        for i, b in enumerate(m["bands"], 1):
            band, lo, hi, _price = b
            zones.append({
                "zone_id": f"ZONE_{s['mineral']}_{band.upper()}",
                "site_id": s["site_id"],
                "mineral_code": s["mineral"],
                "grade_band": band,
                "grade_min_pct": lo, "grade_max_pct": hi,
                # simple synthetic geofence: a small offset polygon centroid
                "geofence_centroid": {
                    "lat": round(s["lat"] + 0.001 * i, 6),
                    "lng": round(s["lng"] + 0.001 * i, 6),
                },
                "capacity_tonnes": 50_000,
            })
    return zones


# ---------------------------------------------------------------- fleet
def build_fleet_master():
    _seed()
    truck_models = [
        ("Tata Prima 4028", 50), ("Tata Prima 4028", 60),
        ("Ashok Leyland 4940", 45), ("BharatBenz 4428", 55),
        ("Eicher Pro 6031", 48),
    ]
    type_by_mineral = {"Fe": "AB", "Cr": "CR", "Mn": "MN", "Al": "BX", "CaCO3": "LS"}
    trucks, driver_seq = [], 5  # WRK00005 is the first named driver
    # Named demo trucks first, pinned to their sites.
    pinned = {
        "OD09AB4421": ("SITE_A", "Tata Prima 4028", 50),
        "OD17YX9021": ("SITE_B", "Tata Prima 4028", 60),
        "OD22MN3301": ("SITE_C", "Ashok Leyland 4940", 45),
        "OD44CR0091": ("SITE_B", "BharatBenz 4428", 55),
        "OD31AL7701": ("SITE_A", "Eicher Pro 6031", 48),
    }
    used_ids = set(pinned)

    def _mk(truck_id, site_id, model, cap):
        return {
            "truck_id": truck_id, "plate_number": truck_id,
            "type": {"AB": "dumper", "CR": "chrome truck",
                     "MN": "manganese", "YX": "dumper",
                     "AL": "dumper"}.get(truck_id[2:4], "dumper"),
            "capacity_tonnes": cap, "model": model,
            "year": int(np.random.randint(2018, 2024)),
            "site_assigned": site_id,
            "insurance_expiry": str(date(2026, 12, 31)),
            "fitness_expiry": str(date(2026, 7, int(np.random.choice([18, 19, 20, 21, 22])))
                                   if np.random.rand() < 0.15 else date(2027, 3, 31)),
            "purchase_date": str(date(int(np.random.randint(2018, 2024)), 1, 1)),
            "current_km": int(np.random.randint(80_000, 320_000)),
        }

    for tid, (site, model, cap) in pinned.items():
        trucks.append(_mk(tid, site, model, cap))

    # Fill the rest up to TRUCKS_PER_SITE per site.
    for s in C.SITES:
        have = sum(1 for t in trucks if t["site_assigned"] == s["site_id"])
        tcode = type_by_mineral[s["mineral"]]
        while have < C.TRUCKS_PER_SITE:
            num = int(np.random.randint(1000, 9999))
            tid = f"OD{np.random.randint(1,99):02d}{tcode}{num:04d}"
            if tid in used_ids:
                continue
            used_ids.add(tid)
            model, cap = truck_models[np.random.randint(len(truck_models))]
            trucks.append(_mk(tid, s["site_id"], model, cap))
            have += 1

    # Other equipment.
    equipment = []
    exc_models = ["Komatsu PC1250", "Hitachi EX1200",
                  "Caterpillar 390F", "Volvo EC950F"]
    for i in range(1, 13):
        s = C.SITES[i % len(C.SITES)]
        equipment.append({
            "equipment_id": f"EX-{i:02d}", "type": "excavator",
            "model": exc_models[i % 4], "site_id": s["site_id"],
            "pit_assigned": s["pits"][i % len(s["pits"])],
            "engine_hours": int(np.random.randint(4000, 22000)),
            "health_score": 12 if i == 7 else int(np.random.randint(60, 96)),
        })
    for i in range(1, 9):
        equipment.append({
            "equipment_id": f"DZ-{i:02d}", "type": "dozer",
            "model": "Caterpillar D9T" if i % 2 else "Komatsu D375A",
            "site_id": C.SITES[i % len(C.SITES)]["site_id"],
            "health_score": 44 if i == 1 else int(np.random.randint(60, 96)),
        })
    for i in range(1, 5):
        equipment.append({"equipment_id": f"DR-{i:02d}", "type": "drill_rig",
                          "model": "Atlas Copco DM45" if i % 2 else "Sandvik DR580",
                          "site_id": C.SITES[i % len(C.SITES)]["site_id"]})
    for eid in ["CV-01", "CV-02"]:
        equipment.append({"equipment_id": eid, "type": "conveyor", "site_id": "SITE_A"})
    for eid in ["GEN-01", "GEN-02", "GEN-03"]:
        equipment.append({"equipment_id": eid, "type": "generator", "site_id": "SITE_B"})
    for eid in ["WP-01", "WP-02"]:
        equipment.append({"equipment_id": eid, "type": "water_pump", "site_id": "SITE_C"})
    for eid in ["FT-01", "FT-02"]:
        equipment.append({"equipment_id": eid, "type": "fuel_tanker", "site_id": "SITE_A"})

    return {"trucks": trucks, "equipment": equipment}


# ---------------------------------------------------------------- workers
def build_workers_master():
    _seed()
    named = [
        ("WRK00001", "Rajan Patnaik", "Pit operations", "Pit supervisor", "SITE_A"),
        ("WRK00002", "Suresh Mahapatra", "Fleet and dispatch", "Driver", "SITE_B"),
        ("WRK00003", "Arun Dash", "Safety", "Safety officer", "SITE_C"),
        ("WRK00004", "Priya Sahu", "Weighbridge operations", "Weighbridge operator", "SITE_A"),
        ("WRK00005", "Raju Kumar", "Fleet and dispatch", "Driver", "SITE_A"),
        ("WRK00006", "Anil Kumar", "Management", "Shift manager", "SITE_A"),
        ("WRK00007", "Manoj Pradhan", "Management", "Shift manager", "SITE_B"),
    ]
    workers, idx = [], 1
    shifts = ["Morning", "Afternoon", "Night"]

    def _rec(wid, name, dept, desig, site, expired=False):
        exp = date(2026, 7, 10) if wid == "WRK00003" else (
            C.DEMO_TODAY + timedelta(days=int(np.random.randint(20, 900))))
        return {
            "worker_id": wid, "name": name, "department": dept,
            "designation": desig, "site_assigned": site,
            "shift": random.choice(shifts),
            "join_date": str(C.DEMO_TODAY - timedelta(days=int(np.random.randint(200, 3000)))),
            "safety_cert_number": f"DGMS/2023/{np.random.randint(10000,99999)}",
            "safety_cert_expiry": str(exp),
            "aadhar_last4": f"{np.random.randint(0,9999):04d}",
            "face_id_enrolled": bool(np.random.rand() < 0.85),
            "performance_score": int(np.random.randint(55, 99)),
            "incidents_this_year": int(np.random.poisson(0.3)),
        }

    for wid, name, dept, desig, site in named:
        workers.append(_rec(wid, name, dept, desig, site))
        idx += 1

    # Remaining workers, honoring corrected department counts.
    remaining = dict(C.WORKER_DEPARTMENTS)
    for _, _, dept, _, _ in named:
        remaining[dept] -= 1
    site_ids = [s["site_id"] for s in C.SITES]
    for dept, count in remaining.items():
        for _ in range(max(0, count)):
            wid = f"WRK{idx:05d}"
            workers.append(_rec(wid, fake.name(), dept, dept.rsplit(" ", 1)[0],
                                random.choice(site_ids)))
            idx += 1
    return workers


# ---------------------------------------------------------------- customers
def build_customers_master():
    return [
        {"customer_id": "CUST001", "name": "SAIL Bhilai Steel Plant",
         "mineral_ordered": "Iron Ore", "grade_specification": "Fe 62%+",
         "monthly_volume_t": 45000, "payment_terms_days": 30,
         "contact": "procurement@sailbhilai.com"},
        {"customer_id": "CUST002", "name": "FACOR Ferro Alloys Nagpur",
         "mineral_ordered": "Chrome Ore", "grade_specification": "Cr2O3 50%+",
         "monthly_volume_t": 12000, "payment_terms_days": 45},
        {"customer_id": "CUST003", "name": "JSW Steel Ballari",
         "mineral_ordered": "Iron Ore", "grade_specification": "Fe 65%+",
         "monthly_volume_t": 28000, "payment_terms_days": 30,
         "outstanding_amount": 11200000, "overdue_days": 12},
        {"customer_id": "CUST004", "name": "Tata Steel Jamshedpur",
         "mineral_ordered": "Iron Ore", "grade_specification": "Fe 60%+",
         "monthly_volume_t": 22000, "payment_terms_days": 30},
        {"customer_id": "CUST005", "name": "MOIL Nagpur",
         "mineral_ordered": "Manganese Ore", "grade_specification": "Mn 35%+",
         "monthly_volume_t": 9800, "payment_terms_days": 30},
        {"customer_id": "CUST006", "name": "NALCO Angul",
         "mineral_ordered": "Bauxite", "grade_specification": "Al2O3 45%+",
         "monthly_volume_t": 35000, "payment_terms_days": 30},
        {"customer_id": "CUST007", "name": "Dalmia Cement Rajgangpur",
         "mineral_ordered": "Limestone", "grade_specification": "CaCO3 75%+",
         "monthly_volume_t": 40000, "payment_terms_days": 45},
    ]


def generate_all_master():
    mine = build_mine_master()
    minerals = build_minerals_reference()
    zones = build_stockyard_zones()
    fleet = build_fleet_master()
    workers = build_workers_master()
    customers = build_customers_master()

    _write("mine_master.json", mine)
    _write("minerals_reference.json", minerals)
    _write("stockyard_zones.json", zones)
    _write("fleet_master.json", fleet)
    _write("fleet_trucks.json", fleet["trucks"])
    _write("fleet_equipment.json", fleet["equipment"])
    _write("workers_master.json", workers)
    _write("customers_master.json", customers)

    return {"mine": mine, "minerals": minerals, "zones": zones,
            "fleet": fleet, "workers": workers, "customers": customers}


if __name__ == "__main__":
    m = generate_all_master()
    print(f"trucks={len(m['fleet']['trucks'])} "
          f"equipment={len(m['fleet']['equipment'])} "
          f"workers={len(m['workers'])} zones={len(m['zones'])} "
          f"customers={len(m['customers'])}")
