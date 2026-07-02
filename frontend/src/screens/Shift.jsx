import { useApi, Screen, BarCard, Card, DataTable } from '../components/ui.jsx'
export default function Shift() {
  const s = useApi('/api/shifts/summary')
  const rows = (s.data || []).map(r => ({ ...r, label: `${r.site_id} ${r.shift_type}` }))
  return (
    <Screen title="Shift intelligence" subtitle="Score and equipment utilisation by site and shift" state={s}>
      <BarCard title="Utilisation by site × shift" data={rows} xKey="label" yKey="avg_utilisation" height={240} />
      <Card title="Shift scores" style={{ marginTop: 12 }}>
        <DataTable rows={rows} columns={[
          { key: 'site_id', label: 'Site' }, { key: 'shift_type', label: 'Shift' },
          { key: 'avg_score', label: 'Avg score' }, { key: 'avg_utilisation', label: 'Utilisation %' }]} />
      </Card>
    </Screen>
  )
}
