import { useApi, Panel, DataTable } from '../components/ui.jsx'

export default function Maint() {
  const s = useApi('/api/equipment/at_risk')
  const rows = s.data || []
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Predictive Maintenance</div>
          <div className="module-subtitle">Prognosis algorithms, failure thresholds, and automated service rosters</div>
        </div>
      </div>

      <div className="module-body">
        <Panel title="Maintenance priority queue">
          <DataTable rows={rows} columns={[
            { key: 'equipment_id', label: 'Equipment', render: r => <b style={{ fontFamily: 'var(--font-mono)' }}>{r.equipment_id}</b> },
            { key: 'equipment_type', label: 'Type' },
            { key: 'site_id', label: 'Site' },
            { key: 'latest_health', label: 'Health index',
              render: r => <span className={`pill ${r.latest_health < 30 ? 'al' : 'wn'}`}>{r.latest_health}%</span> },
            { key: 'peak_failure_prob', label: 'Failure probability', render: r => `${r.peak_failure_prob}%` },
            { key: 'at_risk_component', label: 'Component under stress' }
          ]} />
        </Panel>
      </div>
    </>
  )
}
