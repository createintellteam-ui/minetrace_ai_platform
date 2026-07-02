import { useApi, Screen, Kpi, BarCard, Card, DataTable } from '../components/ui.jsx'
export default function Workers() {
  const s = useApi('/api/workers')
  const d = s.data || {}
  return (
    <Screen title="Workers & staff" subtitle="Headcount by department and expiring safety certificates" state={s}>
      <div className="krow">
        <Kpi cls="b" lbl="Total workers" val={d.total} />
        <Kpi cls="r" lbl="Certs expiring soon" val={(d.expiring_certs || []).length} />
      </div>
      <BarCard title="Headcount by department" data={d.by_dept || []} xKey="department" yKey="headcount" />
      <Card title="Safety certificates expiring" style={{ marginTop: 12 }}>
        <DataTable rows={d.expiring_certs || []} columns={[
          { key: 'worker_id', label: 'ID' }, { key: 'name', label: 'Name' },
          { key: 'department', label: 'Department' }, { key: 'safety_cert_expiry', label: 'Expires' }]} />
      </Card>
    </Screen>
  )
}
