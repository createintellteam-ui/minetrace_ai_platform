"""
MineTrace AI - FastAPI backend.

Serves pre-aggregated DuckDB views and small server-side aggregations as JSON.
The frontend calls these; it never pulls raw tables.

Run:  python -m uvicorn backend.main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
import json
import os
from contextlib import contextmanager

# Load .env file if it exists (for API keys etc.)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, rely on system env vars

import duckdb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = os.environ.get("MINETRACE_DB", "data/minetrace.duckdb")
MASTER = os.environ.get("MINETRACE_MASTER", "data/master")

app = FastAPI(title="MineTrace AI API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])


@contextmanager
def _con():
    con = duckdb.connect(DB_PATH, read_only=True)
    try:
        yield con
    finally:
        con.close()


def _rows(sql, params=None):
    with _con() as con:
        cur = con.execute(sql, params or [])
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]


def _one(sql, params=None):
    r = _rows(sql, params)
    return r[0] if r else {}


def _read_master(name):
    with open(os.path.join(MASTER, name)) as f:
        return json.load(f)


# ------------------------------------------------------------------ health
@app.get("/api/health")
def health():
    if not os.path.exists(DB_PATH):
        raise HTTPException(503, f"DB not found at {DB_PATH}; run the generator.")
    return {"status": "ok", "db": DB_PATH}


# ---- Command centre: everything the landing screen needs in one call ----
@app.get("/api/command_centre")
def command_centre():
    import random as _r

    # latest day + morning shift production (shift-scoped, like the mockup)
    latest = _one("SELECT MAX(CAST(trip_start_time AS DATE)) AS d FROM trips").get("d")
    prod = _one("""SELECT ROUND(SUM(production_tonnes_actual),0) AS actual,
                          ROUND(SUM(production_tonnes_target),0) AS target
                   FROM shifts WHERE shift_type='Morning'
                   AND shift_date=(SELECT MAX(shift_date) FROM shifts)""")
    actual = prod.get("actual") or 0
    target = prod.get("target") or 1
    pct = round(100.0 * actual / target, 0) if target else 0

    active = _one("""SELECT COUNT(DISTINCT truck_id) AS n FROM trips
                     WHERE CAST(trip_start_time AS DATE)=?""", [latest]).get("n") or 0
    total_trucks = _one("SELECT COUNT(*) AS n FROM trucks").get("n") or 45
    disc = _one("""SELECT COUNT(*) AS n,
                          SUM(CASE WHEN pattern_count>2 THEN 1 ELSE 0 END) AS crit
                   FROM weighbridge WHERE discrepancy_flag=true
                   AND CAST(timestamp AS DATE)=?""", [latest])
    workers_total = _one("SELECT COUNT(*) AS n FROM workers").get("n") or 340
    workers_on_site = round(workers_total * 0.64)

    minerals = _rows("""SELECT mineral_type, ROUND(AVG(grade_lims_pct),1) AS grade
                        FROM trips GROUP BY mineral_type""")
    mmap = {'Iron Ore': ('Fe', 'Iron Ore'), 'Chrome Ore': ('Cr', 'Chrome'),
            'Manganese Ore': ('Mn', 'Manganese'), 'Bauxite': ('Al', 'Bauxite'),
            'Limestone': ('CaCO3', 'Limestone')}
    minerals_out = [{'code': mmap[m['mineral_type']][0], 'name': mmap[m['mineral_type']][1],
                     'grade': m['grade']} for m in minerals if m['mineral_type'] in mmap]

    # top anomaly + wrong-zone truck for the alert strip
    top = _rows("SELECT * FROM v_truck_anomalies LIMIT 1")
    top = top[0] if top else {}
    top_trip_loss = _one("""SELECT ROUND(MAX(ABS(weight_difference_tonnes)),1) AS l
                            FROM trips WHERE truck_id=?""", [top.get('truck_id')]).get('l')
    wz = _one("""SELECT truck_id, stockyard_zone_actual FROM trips
                 WHERE zone_mismatch=true LIMIT 1""")

    # compliance
    cp = os.path.join(os.path.dirname(MASTER), "raw", "compliance_deadlines.json")
    comp = json.load(open(cp)) if os.path.exists(cp) else {}
    ibm_days = comp.get('ibm_monthly_production_return', {}).get('days_left', 14)
    roy = comp.get('royalty_payment', {}).get('amount_inr', 0)
    roy_l = f"₹{roy/100000:.1f}L" if roy else "—"
    vf = comp.get('vehicle_fitness', {}).get('expiring_trucks', 6)
    wc = comp.get('worker_safety_certs', {}).get('expiring_within_30_days', 14)

    alerts = [
        {'tone': 'd', 'title': 'Weight discrepancy',
         'text': f"Truck {top.get('truck_id','—')} — {top_trip_loss}T loss"},
        {'tone': 'w', 'title': 'Wrong zone entry',
         'text': f"{wz.get('truck_id','—')} in {wz.get('stockyard_zone_actual','—')} — grade mismatch"},
        {'tone': 'i', 'title': 'Gate alert · Site B', 'text': 'Unverified person detected'},
        {'tone': 'w', 'title': 'Compliance due', 'text': f"IBM return — {ibm_days} days left"},
    ]
    radar = [
        {'label': 'IBM return', 'sub': 'All minerals', 'tag': f'{ibm_days}d'},
        {'label': 'Royalty ' + roy_l, 'sub': 'Odisha govt.', 'tag': '8d'},
        {'label': f'{vf} truck certs', 'sub': 'Expiring soon', 'tag': '11d'},
        {'label': f'{wc} worker certs', 'sub': 'Expiring 30d', 'tag': '30d'},
        {'label': 'EC monitoring', 'sub': 'Submitted Jun 30', 'tag': 'Done'},
        {'label': 'Mining leases', 'sub': 'Valid to 2031', 'tag': 'Valid'},
    ]
    ai_actions = [
        f"{top.get('truck_id','OD09AB4421')} — repeated weight losses. Investigate driver route.",
        "DZ-01 — 67% failure probability. Schedule maintenance before next shift.",
        f"IBM return — {ibm_days} days remaining. Start data compilation today.",
    ]

    # fleet/worker map: real trucks per site, synthetic positions (seeded)
    _r.seed(7)
    mineral_labels = {'Fe': 'Iron', 'Cr': 'Chrome', 'Mn': 'Mn',
                      'Al': 'Bauxite', 'CaCO3': 'Limestone'}
    site_map = []
    all_sites = _rows("SELECT DISTINCT site_assigned AS site_id FROM trucks ORDER BY site_assigned")
    site_meta = {s["site_id"]: s for s in
                 json.load(open(os.path.join(MASTER, "mine_master.json")))["sites"]}
    for row in all_sites:
        sid = row["site_id"]
        meta = site_meta.get(sid, {})
        mcode = meta.get("mineral_code", "Fe")
        sname = f"{meta.get('name', sid).split()[0]} — {mineral_labels.get(mcode, mcode)}"
        trucks = _rows("SELECT truck_id FROM trucks WHERE site_assigned=? LIMIT 3", [sid])
        dots = []
        for tk in trucks:
            tid = tk['truck_id']
            status = 'chrome' if mcode == 'Cr' else 'loaded'
            if tid == 'OD09AB4421':
                status = 'alert'
            dots.append({'id': tid[-4:], 'status': status,
                         'x': _r.randint(15, 80), 'y': _r.randint(25, 75)})
        site_map.append({'site_id': sid, 'name': sname, 'dots': dots})

    return {
        'company': 'Bharat Multi-Mineral Corp — Odisha',
        'shift': 'Morning shift · All 3 sites · 06:00–14:00',
        'sites_count': 5,
        'kpis': {
            'total_production_t': actual, 'pct_target': pct,
            'active_trucks': active, 'total_trucks': total_trucks,
            'discrepancies': disc.get('n') or 0, 'discrepancies_critical': disc.get('crit') or 0,
            'workers_on_site': workers_on_site, 'workers_total': workers_total,
        },
        'minerals': minerals_out,
        'alerts': alerts,
        'compliance_radar': radar,
        'ai_actions': ai_actions,
        'map': site_map,
    }


# ================================================================ OPERATIONS
@app.get("/api/dashboard/kpis")
def kpis():
    return _one("SELECT * FROM v_exec_kpis")

@app.get("/api/dashboard/trend")
def trend():
    return _rows("SELECT * FROM v_production_trend")

@app.get("/api/dashboard/grade_distribution")
def grade_distribution():
    return _rows("SELECT * FROM v_grade_distribution")

@app.get("/api/reconciliation/waterfall")
def waterfall():
    return _one("SELECT * FROM v_waterfall_total")

# Entry gate AI vision -> scan confidence + recent scans
@app.get("/api/gate/scans")
def gate_scans():
    stats = _one("""SELECT ROUND(AVG(grade_confidence_pct),1) AS avg_confidence,
                           ROUND(AVG(rgb_score),3) AS avg_rgb,
                           ROUND(AVG(multispectral_score),3) AS avg_multispectral,
                           COUNT(*) AS total_scans FROM scans""")
    recent = _rows("""SELECT scan_id, truck_id, camera_id, mineral_type,
                             grade_predicted_pct, grade_confidence_pct, bucket_number,
                             scan_timestamp
                      FROM scans ORDER BY scan_timestamp DESC LIMIT 15""")
    return {"stats": stats, "recent": recent}

# Pit & grade AI -> 4-way grade reconciliation
@app.get("/api/pit/grade")
def pit_grade():
    accuracy = _one("SELECT * FROM v_grade_accuracy")
    by_mineral = _rows("""SELECT mineral_type,
                                 ROUND(AVG(grade_lims_pct),2) AS lims,
                                 ROUND(AVG(grade_camera_pct),2) AS camera,
                                 ROUND(AVG(grade_eye_estimate_pct),2) AS eye,
                                 ROUND(AVG(grade_xrf_pct),2) AS xrf
                          FROM trips GROUP BY mineral_type""")
    sample = _rows("""SELECT trip_id, truck_id, mineral_type, grade_band,
                             grade_camera_pct, grade_eye_estimate_pct,
                             grade_lims_pct, grade_xrf_pct,
                             ROUND(weight_at_pit_tonnes,1) AS weight_at_pit_tonnes
                      FROM trips ORDER BY trip_start_time DESC LIMIT 20""")
    return {"accuracy": accuracy, "by_mineral": by_mineral, "sample": sample}

# Fleet tracking
@app.get("/api/fleet/summary")
def fleet_summary():
    per_truck = _rows("""SELECT truck_id, COUNT(*) AS trips,
                                ROUND(AVG(cycle_time_minutes),0) AS avg_cycle_min,
                                ROUND(SUM(weight_at_pit_tonnes),0) AS mined_mt
                         FROM trips GROUP BY truck_id ORDER BY trips DESC LIMIT 20""")
    return {"per_truck": per_truck}

@app.get("/api/fleet/trip/{trip_id}")
def trip_detail(trip_id: str):
    r = _rows("SELECT * FROM trips WHERE trip_id = ?", [trip_id])
    if not r:
        raise HTTPException(404, "trip not found")
    return r[0]

# Weighbridge & reconciliation
@app.get("/api/weighbridge/discrepancies")
def wb_discrepancies():
    flagged = _rows("""SELECT truck_id, COUNT(*) AS flagged_events,
                              ROUND(SUM(ABS(discrepancy_tonnes)),1) AS total_discrepancy_t,
                              MAX(pattern_count) AS max_pattern
                       FROM weighbridge WHERE discrepancy_flag = true
                       GROUP BY truck_id ORDER BY total_discrepancy_t DESC LIMIT 15""")
    totals = _one("""SELECT COUNT(*) AS total_readings,
                            SUM(CASE WHEN discrepancy_flag THEN 1 ELSE 0 END) AS flagged
                     FROM weighbridge""")
    return {"totals": totals, "flagged": flagged}

# Stockyard
@app.get("/api/stockyard/zones")
def stockyard_zones():
    return _rows("SELECT * FROM v_zone_status")

# Dispatch & challan
@app.get("/api/dispatch/summary")
def dispatch_summary():
    status = _one("""SELECT COUNT(*) AS total,
                            SUM(CASE WHEN dispatch_approved THEN 1 ELSE 0 END) AS approved,
                            SUM(CASE WHEN NOT dispatch_approved THEN 1 ELSE 0 END) AS held
                     FROM trips""")
    holds = _rows("""SELECT hold_reason, COUNT(*) AS count FROM trips
                     WHERE NOT dispatch_approved AND hold_reason <> ''
                     GROUP BY hold_reason ORDER BY count DESC""")
    recent = _rows("""SELECT challan_number, truck_id, customer_id, mineral_type,
                             ROUND(weight_at_dispatch_tonnes,1) AS tonnes,
                             dispatch_approved, hold_reason
                      FROM trips ORDER BY dispatch_time DESC LIMIT 15""")
    return {"status": status, "holds": holds, "recent": recent}


# ============================================================ PEOPLE & ASSETS
@app.get("/api/workers")
def workers():
    by_dept = _rows("""SELECT department, COUNT(*) AS headcount,
                              ROUND(AVG(performance_score),0) AS avg_performance
                       FROM workers GROUP BY department ORDER BY headcount DESC""")
    expiring = _rows("""SELECT worker_id, name, department, safety_cert_expiry
                        FROM workers
                        WHERE safety_cert_expiry <= '2026-08-01'
                        ORDER BY safety_cert_expiry LIMIT 15""")
    return {"by_dept": by_dept, "expiring_certs": expiring, "total": len(_rows("SELECT worker_id FROM workers"))}

@app.get("/api/machinery")
def machinery():
    by_type = _rows("""SELECT type, COUNT(*) AS count FROM equipment_master
                       GROUP BY type ORDER BY count DESC""")
    at_risk = _rows("SELECT * FROM v_equipment_at_risk")
    return {"by_type": by_type, "at_risk": at_risk}


# ================================================================ INTELLIGENCE
@app.get("/api/grade/accuracy")
def grade_accuracy():
    return _one("SELECT * FROM v_grade_accuracy")

@app.get("/api/anomalies/trucks")
def truck_anomalies(limit: int = 10):
    return _rows("SELECT * FROM v_truck_anomalies LIMIT ?", [limit])

@app.get("/api/predict/forecast")
def forecast():
    hist = _rows("SELECT * FROM v_production_trend")
    # naive forecast: mean of last 3 days projected 3 days forward
    vals = [h["mined_mt"] for h in hist][-3:]
    avg = round(sum(vals) / len(vals), 0) if vals else 0
    fc = [{"day": f"+{i}", "mined_mt": avg} for i in range(1, 4)]
    return {"history": hist, "forecast": fc}

# Revenue leakage (waterfall in rupees)
@app.get("/api/leakage")
def leakage():
    wf = _one("SELECT * FROM v_waterfall_total")
    price = 40.0 * 83  # ~USD40/t in INR, matches deck ROI example
    lost_mt = (wf.get("pit_mt", 0) or 0) - (wf.get("dispatch_mt", 0) or 0)
    return {"waterfall": wf, "lost_mt": round(lost_mt, 0),
            "lost_value_inr": round(lost_mt * price, 0)}

@app.get("/api/shifts/summary")
def shift_summary():
    return _rows("SELECT * FROM v_shift_summary")

@app.get("/api/shifts/detail")
def shift_detail():
    return _rows("""SELECT shift_date, site_id, shift_type, shift_score,
                          production_pct_achieved, equipment_utilisation_pct
                   FROM shifts ORDER BY shift_date DESC, site_id LIMIT 40""")

@app.get("/api/equipment/at_risk")
def equipment_at_risk():
    return _rows("SELECT * FROM v_equipment_at_risk")


# ========================================================= SAFETY & ENVIRONMENT
@app.get("/api/sensors")
def sensors():
    by_type = _rows("""SELECT sensor_type, site_id,
                              ROUND(AVG(value),1) AS avg_value, MAX(ec_limit) AS ec_limit,
                              SUM(CASE WHEN is_exceedance THEN 1 ELSE 0 END) AS exceedances
                       FROM env_sensors GROUP BY sensor_type, site_id
                       ORDER BY exceedances DESC""")
    return {"by_type": by_type}

@app.get("/api/blasts")
def blasts():
    rows = _rows("""SELECT blast_id, site_id, pit_id, blast_date, explosives_quantity_kg,
                          expected_grade_pct, expected_tonnes, ground_vibration_mms
                   FROM blasts ORDER BY blast_date DESC LIMIT 30""")
    return {"blasts": rows}

@app.get("/api/environment")
def environment():
    exceed = _rows("""SELECT site_id, sensor_type,
                            SUM(CASE WHEN is_exceedance THEN 1 ELSE 0 END) AS exceedances,
                            ROUND(MAX(value),1) AS peak_value, MAX(ec_limit) AS ec_limit
                     FROM env_sensors GROUP BY site_id, sensor_type
                     HAVING SUM(CASE WHEN is_exceedance THEN 1 ELSE 0 END) > 0
                     ORDER BY exceedances DESC""")
    return {"exceedances": exceed}


# ================================================================ BUSINESS
@app.get("/api/finance")
def finance():
    return {"by_mineral": _rows("SELECT * FROM v_finance")}

@app.get("/api/compliance")
def compliance():
    p = os.path.join(os.path.dirname(MASTER), "raw", "compliance_deadlines.json")
    with open(p) as f:
        return json.load(f)

@app.get("/api/documents")
def documents():
    docs = _rows("""SELECT challan_number, truck_id, customer_id, mineral_type,
                          ROUND(weight_at_dispatch_tonnes,1) AS tonnes, dispatch_time
                   FROM trips WHERE dispatch_approved = true
                   ORDER BY dispatch_time DESC LIMIT 20""")
    return {"challans": docs}


# ================================================================ AI ADVISOR (OpenRouter)
import requests as _requests

OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openrouter/free")

# Reliable free models in priority order (July 2026)
# If the user's chosen model fails, we try these in sequence
FALLBACK_MODELS = [
    "openrouter/free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
]


# Check if API key is loaded
@app.get("/api/ai/status")
def ai_status():
    has_key = bool(OPENROUTER_KEY)
    return {
        "has_api_key": has_key,
        "key_prefix": OPENROUTER_KEY[:12] + "..." if has_key else "NOT SET",
        "default_model": OPENROUTER_MODEL,
        "message": "OpenRouter connected" if has_key else "No API key found. Create a .env file with OPENROUTER_API_KEY=your-key"
    }


def _build_mine_context():
    """Gather a concise snapshot of real mine data to feed the LLM."""
    try:
        kpis = _one("SELECT * FROM v_exec_kpis")
        waterfall = _one("SELECT * FROM v_waterfall_total")
        top_trucks = _rows("SELECT * FROM v_truck_anomalies LIMIT 5")
        grade_acc = _one("SELECT * FROM v_grade_accuracy")
        at_risk = _rows("SELECT * FROM v_equipment_at_risk")
        shifts = _rows("SELECT * FROM v_shift_summary")
        finance = _rows("SELECT * FROM v_finance")

        # compliance
        cp = os.path.join(os.path.dirname(MASTER), "raw", "compliance_deadlines.json")
        compliance = json.load(open(cp)) if os.path.exists(cp) else {}

        ctx = f"""=== MINETRACE AI — LIVE MINE DATA SNAPSHOT ===
Company: Bharat Multi-Mineral Corporation Ltd, Odisha, India
Sites: 5 (Keonjhar-Iron, Sukinda-Chrome, Bonai-Manganese, Kodingamali-Bauxite, Birmitrapur-Limestone)
Fleet: 75 trucks across 5 sites, 340 workers

--- EXECUTIVE KPIs ---
Total mined: {kpis.get('total_mined_mt')} MT
Total dispatched: {kpis.get('total_dispatched_mt')} MT
ROM grade (Fe avg): {kpis.get('rom_grade_avg_fe_pct')}%
Fleet utilisation: {kpis.get('fleet_utilisation_pct')}%
On-time dispatch: {kpis.get('on_time_dispatch_pct')}%
Zone mismatches: {kpis.get('zone_mismatches')}
Transport loss: {kpis.get('transport_loss_pct')}%

--- RECONCILIATION WATERFALL ---
Pit: {waterfall.get('pit_mt')} MT → Crusher: {waterfall.get('crusher_mt')} MT → Stockyard: {waterfall.get('stockyard_mt')} MT → Dispatch: {waterfall.get('dispatch_mt')} MT
Pit→Crusher loss: {waterfall.get('loss_pit_crusher_pct')}%
Crusher→Stockyard loss: {waterfall.get('loss_crusher_stockyard_pct')}% (DOMINANT LEAK)
Stockyard→Dispatch loss: {waterfall.get('loss_stockyard_dispatch_pct')}%

--- GRADE ACCURACY (mean absolute error vs LIMS ground truth) ---
AI Camera MAE: {grade_acc.get('camera_mae')}%
Eye estimate MAE: {grade_acc.get('eye_mae')}%
XRF analyser MAE: {grade_acc.get('xrf_mae')}%

--- TOP TRUCK ANOMALIES ---
"""
        for t in top_trucks:
            ctx += f"Truck {t['truck_id']}: {t['trips']} trips, {t['total_loss_t']}T total loss, {t['zone_mismatches']} zone mismatches, {t['holds']} holds\n"

        ctx += "\n--- EQUIPMENT AT RISK ---\n"
        for e in at_risk:
            ctx += f"{e['equipment_id']} ({e['equipment_type']}): health {e['latest_health']}, failure prob {e['peak_failure_prob']}%, component: {e.get('at_risk_component','')}\n"

        ctx += "\n--- SHIFT PERFORMANCE ---\n"
        for s in shifts:
            ctx += f"{s['site_id']} {s['shift_type']}: score {s['avg_score']}, utilisation {s['avg_utilisation']}%\n"

        ctx += "\n--- FINANCE (dispatched, approved) ---\n"
        for f in finance:
            ctx += f"{f['mineral_type']}: {f['dispatched_mt']}MT dispatched, revenue ₹{f['revenue_inr']}, royalty ₹{f['royalty_inr']}\n"

        ctx += f"\n--- COMPLIANCE ---\n"
        for key, val in compliance.items():
            ctx += f"{key}: {json.dumps(val)}\n"

        return ctx
    except Exception as e:
        return f"[Error loading mine data: {e}]"


SYSTEM_PROMPT = """You are MineOS AI Advisor — the intelligent assistant for MineTrace, a pit-to-dispatch mining traceability platform for Bharat Multi-Mineral Corporation in Odisha, India.

You have access to LIVE mine data provided below. Use it to answer questions accurately with specific numbers. When asked about production, losses, trucks, grades, equipment, compliance, or finance — always reference the real data.

Rules:
- Give concise, actionable answers (not long essays)
- Use actual numbers from the data — never invent figures
- Format currency in Indian style (₹ Lakhs / Crores)
- If the question is about something not in the data, answer from your general knowledge but mention it's general knowledge
- Use bullet points for lists
- For critical issues (theft, equipment failure, compliance deadlines), lead with the urgency

{mine_data}
"""


@app.post("/api/ai/ask")
def ai_ask(payload: dict):
    q = (payload or {}).get("question", "")
    selected_model = (payload or {}).get("model", OPENROUTER_MODEL)
    if not q:
        return {"question": "", "answer": "Please ask a question.", "stub": False}

    if not OPENROUTER_KEY:
        return _fallback_response(q)

    try:
        mine_data = _build_mine_context()
        system = SYSTEM_PROMPT.replace("{mine_data}", mine_data)

        # Try selected model first, then fall back through reliable models
        models_to_try = [selected_model]
        for m in FALLBACK_MODELS:
            if m not in models_to_try:
                models_to_try.append(m)

        last_error = ""
        for model in models_to_try:
            try:
                resp = _requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "MineTrace AI",
                    },
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user", "content": q},
                        ],
                        "max_tokens": 1000,
                        "temperature": 0.3,
                    },
                    timeout=30,
                )

                if resp.status_code == 200:
                    data = resp.json()
                    answer = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if answer:
                        model_used = data.get("model", model)
                        # Show if we fell back to a different model
                        note = f" (tried {selected_model}, used {model_used})" if model != selected_model else ""
                        return {
                            "question": q,
                            "answer": answer,
                            "model": model_used + note,
                            "stub": False
                        }

                last_error = f"{resp.status_code}: {resp.text[:200]}"

            except Exception as e:
                last_error = str(e)
                continue

        # All models failed — use smart fallback with real data
        fb = _fallback_response(q)
        fb["note"] = f"All models unavailable ({last_error[:100]}). Showing live data instead."
        return fb

    except Exception as e:
        fb = _fallback_response(q)
        fb["error"] = str(e)
        return fb


def _fallback_response(q):
    """Smart fallback using real database data when API is unavailable."""
    ql = q.lower()
    try:
        if any(w in ql for w in ['production', 'mined', 'tonnes', 'output']):
            kpis = _one("SELECT * FROM v_exec_kpis")
            return {"question": q, "stub": True, "answer":
                f"Production summary from live data:\n"
                f"• Total mined: {kpis.get('total_mined_mt')} MT\n"
                f"• Total dispatched: {kpis.get('total_dispatched_mt')} MT\n"
                f"• ROM grade (Fe): {kpis.get('rom_grade_avg_fe_pct')}%\n"
                f"• Fleet utilisation: {kpis.get('fleet_utilisation_pct')}%\n"
                f"• On-time dispatch: {kpis.get('on_time_dispatch_pct')}%"}

        if any(w in ql for w in ['truck', 'od09', 'anomaly', 'theft', 'loss pattern']):
            trucks = _rows("SELECT * FROM v_truck_anomalies LIMIT 5")
            lines = [f"• {t['truck_id']}: {t['total_loss_t']}T loss, {t['holds']} holds, {t['zone_mismatches']} zone mismatches"
                     for t in trucks]
            return {"question": q, "stub": True, "answer":
                f"Top truck anomalies (live data):\n" + "\n".join(lines)}

        if any(w in ql for w in ['crusher', 'leakage', 'waterfall', 'loss', 'revenue']):
            wf = _one("SELECT * FROM v_waterfall_total")
            return {"question": q, "stub": True, "answer":
                f"Revenue leakage waterfall (live data):\n"
                f"• Pit: {wf.get('pit_mt')} MT\n"
                f"• Crusher: {wf.get('crusher_mt')} MT\n"
                f"• Stockyard: {wf.get('stockyard_mt')} MT\n"
                f"• Dispatch: {wf.get('dispatch_mt')} MT\n"
                f"• Biggest leak: Crusher→Stockyard at {wf.get('loss_crusher_stockyard_pct')}%"}

        if any(w in ql for w in ['maintenance', 'equipment', 'dz-01', 'ex-07', 'failure']):
            equip = _rows("SELECT * FROM v_equipment_at_risk")
            lines = [f"• {e['equipment_id']} ({e['equipment_type']}): health {e['latest_health']}, "
                     f"failure prob {e['peak_failure_prob']}% — {e.get('at_risk_component','')}"
                     for e in equip]
            return {"question": q, "stub": True, "answer":
                f"Equipment at risk (live data):\n" + "\n".join(lines)}

        if any(w in ql for w in ['compliance', 'ibm', 'royalty', 'deadline']):
            cp = os.path.join(os.path.dirname(MASTER), "raw", "compliance_deadlines.json")
            comp = json.load(open(cp)) if os.path.exists(cp) else {}
            lines = []
            for k, v in comp.items():
                status = v.get('status', '')
                due = v.get('due', v.get('next_due', ''))
                lines.append(f"• {k.replace('_',' ')}: {status} (due: {due})")
            return {"question": q, "stub": True, "answer":
                f"Compliance status (live data):\n" + "\n".join(lines)}

        if any(w in ql for w in ['grade', 'camera', 'xrf', 'lims', 'accuracy']):
            acc = _one("SELECT * FROM v_grade_accuracy")
            return {"question": q, "stub": True, "answer":
                f"Grade measurement accuracy (live data):\n"
                f"• AI Camera MAE: {acc.get('camera_mae')}% (vs LIMS)\n"
                f"• Eye estimate MAE: {acc.get('eye_mae')}%\n"
                f"• XRF analyser MAE: {acc.get('xrf_mae')}%\n"
                f"• XRF is most accurate, eye estimate least reliable"}

        return {"question": q, "stub": True, "answer":
            "I can answer questions about production, trucks, grades, equipment, "
            "compliance, revenue leakage, and shift performance. "
            "Try asking: 'Which truck is losing the most material?' or "
            "'What is the crusher to stockyard loss?'"}
    except Exception as e:
        return {"question": q, "stub": True, "answer": f"Error querying data: {e}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
