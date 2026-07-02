import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Anomaly() {
  const s = useApi('/api/anomalies/trucks?limit=10')
  const rows = s.data || []
  return (
    <Screen title="Anomaly detection" subtitle="Trucks ranked by unexplained loss, wrong-zone dumps and holds" state={s}>
      <Card title="Flagged trucks">
        <DataTable rows={rows} columns={[
          { key: 'truck_id', label: 'Truck', render: r => <b>{r.truck_id}</b> },
          { key: 'trips', label: 'Trips' },
          { key: 'total_loss_t', label: 'Total loss (t)',
            render: r => r.total_loss_t > 40 ? <span className="tag r">{r.total_loss_t}</span> : r.total_loss_t },
          { key: 'zone_mismatches', label: 'Zone mismatches' },
          { key: 'holds', label: 'Holds' }]} />
      </Card>
    </Screen>
  )
}
