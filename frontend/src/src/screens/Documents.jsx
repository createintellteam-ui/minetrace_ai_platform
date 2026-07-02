import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Documents() {
  const s = useApi('/api/documents')
  const rows = s.data?.challans || []
  return (
    <Screen title="Documents" subtitle="Generated dispatch challans (auditable trail)" state={s}>
      <Card title="Recent challans">
        <DataTable rows={rows} columns={[
          { key: 'challan_number', label: 'Challan' }, { key: 'truck_id', label: 'Truck' },
          { key: 'customer_id', label: 'Customer' }, { key: 'mineral_type', label: 'Mineral' },
          { key: 'tonnes', label: 'Tonnes' }, { key: 'dispatch_time', label: 'Dispatched' }]} />
      </Card>
    </Screen>
  )
}
