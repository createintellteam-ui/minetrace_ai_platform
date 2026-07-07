import { useState } from 'react'
import { useApi, Screen, Kpi, Panel, BarCard, DataTable, AlertCard, Pill, fmt } from '../components/ui.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// ---- Fleet & Zone Map (mini view + expandable full-screen view) ----------
function SiteMapDots({ site, height }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height, borderRadius: 'var(--radius)',
      background: 'var(--surface-2)', border: '1px solid var(--border)', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 8, left: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {site.name}
      </div>
      {site.dots.map((d, i) => (
        <div key={i} title={d.id}
          style={{
            position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
            width: 10, height: 10, borderRadius: '50%',
            background: d.status === 'alert' ? 'var(--fill-danger)'
              : d.status === 'chrome' ? 'var(--fill-warning)' : 'var(--fill-success)',
            border: '2px solid var(--surface)', boxShadow: '0 0 0 1px var(--border)',
            transform: 'translate(-50%, -50%)'
          }} />
      ))}
    </div>
  )
}

function FleetZoneMap({ sites, expanded, onExpand, onClose }) {
  if (!sites || sites.length === 0) {
    return <div className="placeholder">No live site data available.</div>
  }

  if (expanded) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200, background: 'var(--surface)',
        display: 'flex', flexDirection: 'column', padding: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Live Fleet & Zone Map — All Sites</div>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 'var(--radius)', border: '1px solid var(--border-strong)',
            background: 'var(--surface-2)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Command Centre
          </button>
        </div>
        <div style={{
          flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16, overflowY: 'auto'
        }}>
          {sites.map(s => <SiteMapDots key={s.site_id} site={s} height={280} />)}
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {sites.slice(0, 4).map(s => <SiteMapDots key={s.site_id} site={s} height={120} />)}
      </div>
      <button onClick={onExpand} style={{
        marginTop: 10, width: '100%', padding: '8px 0', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer',
        fontSize: 13, fontWeight: 600, color: 'var(--text-accent)'
      }}>
        View full map ({sites.length} sites) →
      </button>
    </>
  )
}

// ---- Live truck grade & tonnage panel -------------------------------------
function LiveGradePanel({ rows }) {
  if (!rows || rows.length === 0) {
    return <div className="placeholder">No recent grade readings.</div>
  }
  return (
    <DataTable rows={rows} columns={[
      { key: 'truck_id', label: 'Truck', render: r => <span className="tid">{r.truck_id}</span> },
      { key: 'mineral_type', label: 'Mineral' },
      { key: 'grade_band', label: 'Band', render: r => <Pill tone={r.grade_band === 'Reject' ? 'al' : 'nt'}>{r.grade_band}</Pill> },
      { key: 'grade_camera_pct', label: 'Camera %' },
      { key: 'grade_eye_estimate_pct', label: 'Eye est. %' },
      { key: 'grade_xrf_pct', label: 'XRF %' },
      { key: 'grade_lims_pct', label: 'LIMS % (true)' },
      { key: 'weight_at_pit_tonnes', label: 'Tonnage (t)', render: r => fmt(r.weight_at_pit_tonnes) },
    ]} />
  )
}

export default function CommandCentre() {
  const [mapExpanded, setMapExpanded] = useState(false)

  const k = useApi('/api/dashboard/kpis')
  const t = useApi('/api/dashboard/trend')
  const w = useApi('/api/reconciliation/waterfall')
  const a = useApi('/api/anomalies/trucks?limit=5')
  const cc = useApi('/api/command_centre')
  const g = useApi('/api/pit/grade')
  const fin = useApi('/api/finance')

  const state = { err: k.err || t.err || w.err || a.err, loading: !k.data || !t.data || !w.data || !a.data }
  const kpis = k.data || {}, wf = w.data || {}, trend = t.data || [], anom = a.data || []
  const cmdData = cc.data || {}
  const gradeSample = g.data?.sample || []
  const financeByMineral = fin.data?.by_mineral || []
  const totalRevenueL = financeByMineral.reduce((s, m) => s + (m.revenue_inr || 0), 0) / 100000

  const wfChart = [
    { stage: 'Pit', mt: wf.pit_mt }, { stage: 'Crusher', mt: wf.crusher_mt },
    { stage: 'Stockyard', mt: wf.stockyard_mt }, { stage: 'Dispatch', mt: wf.dispatch_mt },
  ]

  return (
    <Screen title="Command centre" subtitle="Executive HUD · live pit-to-dispatch view" state={state}>
      <div className="astrip">
        <AlertCard tone="d" title="Revenue leak">Crusher→Stockyard loss {wf.loss_crusher_stockyard_pct}% — dominant systemic failure point.</AlertCard>
        <AlertCard tone="w" title="Fleet">{kpis.zone_mismatches} wrong-zone dump{kpis.zone_mismatches === 1 ? '' : 's'} flagged this period.</AlertCard>
        <AlertCard tone="i" title="Dispatch">{kpis.on_time_dispatch_pct}% on-time across {fmt(kpis.total_trips)} trips.</AlertCard>
        <AlertCard tone="d" title="Maintenance">EX-07 hydraulic seal at 95% failure probability.</AlertCard>
      </div>

      <div className="krow">
        <Kpi cls="b" lbl="Total mined" val={fmt(kpis.total_mined_mt) + ' MT'} sub={`${fmt(kpis.total_trips)} trips`} />
        <Kpi cls="g" lbl="Total dispatched" val={fmt(kpis.total_dispatched_mt) + ' MT'} sub={`${kpis.on_time_dispatch_pct}% on-time`} />
        <Kpi cls="b" lbl="ROM grade (Fe)" val={kpis.rom_grade_avg_fe_pct + '%'} sub="avg LIMS assay" />
        <Kpi cls={kpis.zone_mismatches ? 'r' : 'g'} lbl="Zone mismatches" val={kpis.zone_mismatches} sub={`fleet util ${kpis.fleet_utilisation_pct}%`} />
        <Kpi cls="g" lbl="Est. revenue" val={'₹' + fmt(Math.round(totalRevenueL)) + ' L'} sub={`${financeByMineral.length} minerals dispatched`} />
        <Kpi cls="b" lbl="Workers on site" val={cmdData.kpis?.workers_on_site ?? '—'} sub={`of ${cmdData.kpis?.workers_total ?? '—'} total`} />
      </div>

      <div className="grid2">
        <BarCard title="Reconciliation waterfall (Pit → Dispatch)" data={wfChart} xKey="stage" yKey="mt"
          note={`Crusher→Stockyard loss ${wf.loss_crusher_stockyard_pct}% — dominant leak`} />
        <Panel title="Production trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" fontSize={10} tick={{ fill: 'var(--text-muted)' }} tickFormatter={d => String(d).slice(5)} />
              <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="mined_mt" stroke="var(--fill-accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid2">
        <Panel title="Live fleet & zone map">
          <FleetZoneMap
            sites={cmdData.site_map}
            expanded={false}
            onExpand={() => setMapExpanded(true)}
          />
        </Panel>
        <Panel title="Live truck grade & tonnage (camera / eye / XRF vs LIMS)">
          <LiveGradePanel rows={gradeSample} />
        </Panel>
      </div>

      {mapExpanded && (
        <FleetZoneMap
          sites={cmdData.site_map}
          expanded={true}
          onClose={() => setMapExpanded(false)}
        />
      )}

      <Panel title="Top truck anomalies">
        <DataTable rows={anom} columns={[
          { key: 'truck_id', label: 'Truck', render: r => <span className="tid">{r.truck_id}</span> },
          { key: 'trips', label: 'Trips' },
          { key: 'total_loss_t', label: 'Total loss (t)' },
          { key: 'zone_mismatches', label: 'Zone mismatches' },
          { key: 'holds', label: 'Holds', render: r => r.holds > 0 ? <Pill tone="al">{r.holds}</Pill> : r.holds },
        ]} />
      </Panel>
    </Screen>
  )
}
