# MineTrace AI — running the platform

Three layers: **generator** (synthetic data) → **backend** (FastAPI over DuckDB) →
**frontend** (React). The Command centre screen is fully wired; the other 21
screens are scaffolded with the dataset each one connects to.

## 1. Generate data (once)

```bash
pip install faker numpy pandas duckdb
python -m generator.build          # writes data/minetrace.duckdb
```

Edit `generator/config.py` → `SCALE_PROFILE` for demo / month / full volume.

## 2. Backend (FastAPI)

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Every endpoint returns a pre-aggregated summary view (tiny payloads).

## 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173  (proxies /api -> :8000)
```

Open http://localhost:5173 — the Command centre loads live KPIs, the
reconciliation waterfall, production trend, and the top truck anomalies.

## How to add the next screen

1. Add an endpoint in `backend/main.py` (wrap a view — most already exist).
2. Copy `frontend/src/screens/CommandCentre.jsx` as your template.
3. Point `App.jsx` at the new screen instead of `Placeholder`.

Build screens in tender-priority order: Pit & grade AI → Weighbridge →
Stockyard → Dispatch → Revenue leakage → Anomaly detection → AI advisor,
then the lighter bonus screens.

## Layout

```
generator/   synthetic data generator (13 datasets + summary views)
backend/     FastAPI  (main.py, requirements.txt)
frontend/    React + Vite  (src/App.jsx shell, src/screens/, src/lib/api.js)
data/        generated output (duckdb + csv/json)  [created by step 1]
```
