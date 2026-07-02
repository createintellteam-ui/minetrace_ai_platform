import { useApi, Screen, BarCard, Card, DataTable } from '../components/ui.jsx'
export default function Machinery() {
  const s = useApi('/api/machinery')
  const d = s.data || {}
  return (
    <Screen title="Machinery & equipment" subtitle="Fleet composition and at-risk assets" state={s}>
      <BarCard title="Equipment by type" data={d.by_type || []} xKey="type" yKey="count" height={200} />
      <Card title="At-risk equipment" style={{ marginTop: 12 }}>
        <DataTable rows={d.at_risk || []} columns={[
          { key: 'equipment_id', label: 'Equipment' }, { key: 'equipment_type', label: 'Type' },
          { key: 'site_id', label: 'Site' },
          { key: 'latest_health', label: 'Health',
            render: r => <span className={`tag ${r.latest_health < 30 ? 'r' : ''}`}>{r.latest_health}</span> },
          { key: 'peak_failure_prob', label: 'Failure prob %' },
          { key: 'at_risk_component', label: 'Component' }]} />
      </Card>
    </Screen>
  )
}
