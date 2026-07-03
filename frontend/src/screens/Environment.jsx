import { useApi, Panel, DataTable } from '../components/ui.jsx'

export default function Environment() {
  const s = useApi('/api/environment')
  const rows = s.data?.exceedances || []
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Environment Monitor</div>
          <div className="module-subtitle">EC-limit exceedances, dust sensors, and SPCB environmental parameters</div>
        </div>
      </div>

      <div className="module-body">
        <Panel title="Sensor Exceedance Logs">
          {rows.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No environmental limit exceedances recorded in this window.
            </div>
          ) : (
            <DataTable rows={rows} columns={[
              { key: 'site_id', label: 'Site location' },
              { key: 'sensor_type', label: 'Parameter' },
              { key: 'peak_value', label: 'Peak telemetry value' },
              { key: 'ec_limit', label: 'Statutory Limit' },
              { key: 'exceedances', label: 'Alarms triggered', render: r => <span className="pill al">{r.exceedances} alerts</span> }
            ]} />
          )}
        </Panel>
      </div>
    </>
  )
}
