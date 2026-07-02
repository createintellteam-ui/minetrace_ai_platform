import { useApi, Screen, Kpi, Card, DataTable } from '../components/ui.jsx'
export default function Weighbridge() {
  const s = useApi('/api/weighbridge/discrepancies')
  const d = s.data || {}
  return (
    <Screen title="Weighbridge & reconciliation" subtitle="Pit vs dispatch weight — flagged discrepancies" state={s}>
      <div className="krow">
        <Kpi cls="b" lbl="Total readings" val={d.totals?.total_readings} />
        <Kpi cls="r" lbl="Flagged events" val={d.totals?.flagged} />
      </div>
      <Card title="Trucks with weight discrepancies">
        <DataTable rows={d.flagged || []} columns={[
          { key: 'truck_id', label: 'Truck' },
          { key: 'flagged_events', label: 'Flagged events' },
          { key: 'total_discrepancy_t', label: 'Total discrepancy (t)' },
          { key: 'max_pattern', label: 'Pattern depth',
            render: r => r.max_pattern > 2 ? <span className="tag r">{r.max_pattern}</span> : r.max_pattern },
        ]} />
      </Card>
    </Screen>
  )
}
