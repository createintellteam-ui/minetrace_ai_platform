import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Maint() {
  const s = useApi('/api/equipment/at_risk')
  const rows = s.data || []
  return (
    <Screen title="Predictive maintenance" subtitle="Assets trending toward failure" state={s}>
      <Card title="Maintenance priority list">
        <DataTable rows={rows} columns={[
          { key: 'equipment_id', label: 'Equipment', render: r => <b>{r.equipment_id}</b> },
          { key: 'equipment_type', label: 'Type' }, { key: 'site_id', label: 'Site' },
          { key: 'latest_health', label: 'Health',
            render: r => <span className={`tag ${r.latest_health < 30 ? 'r' : ''}`}>{r.latest_health}</span> },
          { key: 'peak_failure_prob', label: 'Failure prob %' },
          { key: 'at_risk_component', label: 'Component' }]} />
      </Card>
    </Screen>
  )
}
