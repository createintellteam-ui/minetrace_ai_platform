import { useApi, Screen, BarCard, Card, DataTable, fmt } from '../components/ui.jsx'
export default function Finance() {
  const s = useApi('/api/finance')
  const rows = s.data?.by_mineral || []
  return (
    <Screen title="Finance & royalty" subtitle="Revenue and royalty by mineral (dispatched, approved loads)" state={s}>
      <BarCard title="Revenue by mineral (₹)" data={rows} xKey="mineral_type" yKey="revenue_inr" height={220} />
      <Card title="Financial breakdown" style={{ marginTop: 12 }}>
        <DataTable rows={rows} columns={[
          { key: 'mineral_type', label: 'Mineral' },
          { key: 'dispatched_mt', label: 'Dispatched (MT)', render: r => fmt(r.dispatched_mt) },
          { key: 'revenue_inr', label: 'Revenue (₹)', render: r => '₹' + fmt(r.revenue_inr) },
          { key: 'royalty_inr', label: 'Royalty (₹)', render: r => '₹' + fmt(r.royalty_inr) }]} />
      </Card>
    </Screen>
  )
}
