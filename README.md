# MineTrace AI — Synthetic Data Generator

Generates the full pit-to-dispatch dataset for the MineTrace AI platform,
aligned to the OMC EoI (`OMC/E-PROC/C&P/015/2026-27`) and calibrated to the
pitch-deck headline figures.

## Run it

```bash
pip install faker numpy pandas duckdb
python -m generator.build
```

Everything lands under `data/`:

| Path | What |
|---|---|
| `data/master/*.json` | Static/master data (mine, minerals, fleet, workers, customers, zones) |
| `data/raw/*.csv`, `*.json` | Transactional data (trips, scans, weighbridge, waterfall, shifts, equipment, blasts, sensors, compliance) |
| `data/minetrace.duckdb` | Queryable DB with pre-aggregated **summary views** — the API-shaped payloads |

## Scale knobs (`generator/config.py`)

`SCALE_PROFILE = "demo" | "month" | "full"`

| Profile | Days | Trips (45-truck fleet) | Use |
|---|---|---|---|
| `demo` | 7 | ~4.7k | fast local build, all anomalies intact |
| `month` | 30 | ~20k | realistic mid-size demo |
| `full` | 180 | ~121k | full spec |

> **Note on the 364,500 figure:** the teammate doc's fleet list says *45 trucks
> total*, but its trip math assumes *45 trucks per site (135 total)*. Default is
> the 45-truck fleet. Set `TRUCKS_PER_SITE = 45` for the literal 364,500 trips.

## Two reconciliation layers (both in tender scope)

1. **Per-trip transport reconciliation** — `trips` / `weighbridge`: `weight_at_pit`
   vs `weight_at_dispatch`. Small transport losses + the OD09AB4421 pilferage ramp.
   Answers *"which truck / route is leaking?"*
2. **Stage material-balance waterfall** — `waterfall`: Pit → Crusher → Stockyard →
   Dispatch, calibrated to the deck chain (128,540 → 126,240 → 102,780 → 94,320).
   Answers *"which processing stage is the dominant loss?"* (Crusher→Stockyard, −18.58%).

## Tender use-case → data mapping

| OMC tender use case | Backed by |
|---|---|
| AI Pit/Shovel Camera (RGB + Multispectral), bucket/truck-wise grade+qty | `grade_scans` (`rgb_score`, `multispectral_score`, `bucket_number`, `grade_predicted_pct`) |
| Grade & Quantity Reconciliation Engine (camera vs eye vs LIMS vs XRF vs mine plan) | `trips` 4-way grade cols + `blasts.expected_grade_pct/expected_tonnes` + `v_grade_accuracy` |
| AI Vision at weighbridge, grade↔weighment link | `weighbridge_readings` + `v_exec_kpis` |
| GPS geofencing, prevent wrong-zone unloading, grade dilution | `stockyard_zones` (grade-band geo-fenced) + `trips.zone_mismatch` + `v_truck_anomalies` |
| Dispatch validation & hold/release workflows | `trips.dispatch_approved` / `hold_reason` |
| Tamper-proof auditable traceability | full trip → challan → customer chain |
| Fleet optimization | `trips.cycle_time_minutes` + `v_shift_summary` |

**Bonus (beyond tender core, kept light):** `equipment_health` (predictive
maintenance — DZ-01, EX-07), `environment_sensors` (ESG), `compliance_deadlines`,
`shift_records`. Good demo texture; not what the tender is scored on — don't lead with them.

## Summary views (API-shaped, tiny payloads)

| View | Endpoint idea |
|---|---|
| `v_exec_kpis` | `/api/dashboard/kpis` |
| `v_waterfall_total` | `/api/reconciliation/waterfall` |
| `v_grade_accuracy` | `/api/grade/accuracy` |
| `v_truck_anomalies` | `/api/anomalies/trucks` |
| `v_production_trend` | `/api/dashboard/trend` |
| `v_grade_distribution` | `/api/dashboard/grade_distribution` |
| `v_shift_summary` | `/api/shifts/summary` |
| `v_equipment_at_risk` | `/api/equipment/at_risk` |

Point your API at these views, not the raw tables — they return a handful of rows.

## Storage: pick at load time (generator is storage-agnostic)

- **DuckDB file** (default, built automatically) — fast analytical queries, ships in-repo, runs offline.
- **Supabase / PostgreSQL** — load `data/raw/*.csv` via `\copy` or `psycopg2`. ⚠️ Full spec (~500MB) exceeds Supabase free-tier 500MB cap; use Pro or a lean profile.
- **Static JSON** — the summary views can be exported to JSON for a no-backend demo.

## Corrections applied vs the original data doc

- Worker departments: doc said "8" but listed 10 summing to 285 → fixed to 10 depts summing to **340**.
- Dropped **Coal** from minerals (not an OMC mineral).
- Stockyard zones made explicitly **grade-band geo-fenced** (tender: "grade range wise geo-fenced ore stockyard").
- Added `expected_grade_pct` / `expected_tonnes` to blasts so mine-plan data feeds the reconciliation engine.
- Calibrated to the deck's page-9 waterfall (crusher 126,240), not image-1's 116,240 — **fix this inconsistency in the slides**.
