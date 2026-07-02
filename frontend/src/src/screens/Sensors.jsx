import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Sensors() {
  const s = useApi('/api/sensors')
  const rows = s.data?.by_type || []
  return (
    <Screen title="Sensors & IoT integration" subtitle="Edge/OT sensor readings by site and type" state={s}>
      <Card title="Sensor summary">
        <DataTable rows={rows} columns={[
          { key: 'sensor_type', label: 'Sensor' }, { key: 'site_id', label: 'Site' },
          { key: 'avg_value', label: 'Avg value' }, { key: 'ec_limit', label: 'Limit' },
          { key: 'exceedances', label: 'Exceedances',
            render: r => r.exceedances > 0 ? <span className="tag r">{r.exceedances}</span> : 0 }]} />
      </Card>
    </Screen>
  )
}
