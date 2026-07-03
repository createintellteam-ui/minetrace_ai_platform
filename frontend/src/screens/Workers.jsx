import { useApi, Kpi, BarCard, Panel, DataTable } from '../components/ui.jsx'

export default function Workers() {
  const s = useApi('/api/workers')
  const d = s.data || {}
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Workers and Staff</div>
          <div className="module-subtitle">Roster records, safety certifications, and emergency contacts</div>
        </div>
      </div>

      <div className="module-body">
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Rostered Staff</span>
            <span className="kc-value">{d.total || 340}</span>
            <span className="kc-delta neutral">Total active head count</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Expiring safety certificates</span>
            <span className="kc-value">{(d.expiring_certs || []).length} soon</span>
            <span className="kc-delta neutral">Next 30 days</span>
          </div>
        </div>

        <BarCard title="Headcount by department" data={d.by_dept || []} xKey="department" yKey="headcount" />

        <Panel title="Safety certificates expiring">
          <DataTable rows={d.expiring_certs || []} columns={[
            { key: 'worker_id', label: 'ID', render: r => <b style={{ fontFamily: 'var(--font-mono)' }}>{r.worker_id}</b> },
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department' },
            { key: 'safety_cert_expiry', label: 'Expires' }
          ]} />
        </Panel>
      </div>
    </>
  )
}
