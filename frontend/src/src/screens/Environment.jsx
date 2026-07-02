import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Environment() {
  const s = useApi('/api/environment')
  const rows = s.data?.exceedances || []
  return (
    <Screen title="Environment monitoring" subtitle="EC-limit exceedances by site and parameter" state={s}>
      <Card title="Exceedances">
        {rows.length === 0
          ? <div className="placeholder">No exceedances recorded in this window.</div>
          : <DataTable rows={rows} columns={[
              { key: 'site_id', label: 'Site' }, { key: 'sensor_type', label: 'Parameter' },
              { key: 'peak_value', label: 'Peak' }, { key: 'ec_limit', label: 'Limit' },
              { key: 'exceedances', label: 'Events', render: r => <span className="tag r">{r.exceedances}</span> }]} />}
      </Card>
    </Screen>
  )
}
