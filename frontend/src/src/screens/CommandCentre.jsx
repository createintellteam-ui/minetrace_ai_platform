import { useApi, Screen, Kpi, Panel, BarCard, DataTable, AlertCard, Pill, fmt } from '../components/ui.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function CommandCentre() {
  const k = useApi('/api/dashboard/kpis')
  const t = useApi('/api/dashboard/trend')
  const w = useApi('/api/reconciliation/waterfall')
  const a = useApi('/api/anomalies/trucks?limit=5')
  const state = { err: k.err || t.err || w.err || a.err, loading: !k.data || !t.data || !w.data || !a.data }
  const kpis = k.data || {}, wf = w.data || {}, trend = t.data || [], anom = a.data || []

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
