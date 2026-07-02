import { useApi, Screen, BarCard, Card, DataTable, fmt } from '../components/ui.jsx'
export default function Fleet() {
  const s = useApi('/api/fleet/summary')
  const rows = s.data?.per_truck || []
  return (
    <Screen title="Fleet tracking" subtitle="Trips, cycle time and tonnage per truck" state={s}>
      <BarCard title="Trips per truck (top 20)" data={rows} xKey="truck_id" yKey="trips" height={240} />
      <Card title="Fleet detail" style={{ marginTop: 12 }}>
        <DataTable rows={rows} columns={[
          { key: 'truck_id', label: 'Truck' }, { key: 'trips', label: 'Trips' },
          { key: 'avg_cycle_min', label: 'Avg cycle (min)' },
          { key: 'mined_mt', label: 'Mined (MT)', render: r => fmt(r.mined_mt) },
        ]} />
      </Card>
    </Screen>
  )
}
