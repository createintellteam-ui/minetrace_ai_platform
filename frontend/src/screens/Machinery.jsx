import { useApi, BarCard, Panel, DataTable } from '../components/ui.jsx'

export default function Machinery() {
  const s = useApi('/api/machinery')
  const d = s.data || {}
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Machinery &amp; Equipment</div>
          <div className="module-subtitle">Fleet allocations, operational stats, and IoT telemetries</div>
        </div>
      </div>

      <div className="module-body">
        <BarCard title="Equipment by type" data={d.by_type || []} xKey="type" yKey="count" height={200} />

        <Panel title="At-risk equipment">
          <DataTable rows={d.at_risk || []} columns={[
            { key: 'equipment_id', label: 'Equipment', render: r => <b style={{ fontFamily: 'var(--font-mono)' }}>{r.equipment_id}</b> },
            { key: 'equipment_type', label: 'Type' },
            { key: 'site_id', label: 'Site' },
            { key: 'latest_health', label: 'Health score',
              render: r => <span className={`pill ${r.latest_health < 30 ? 'al' : 'wn'}`}>{r.latest_health}%</span> },
            { key: 'peak_failure_prob', label: 'Failure prob %', render: r => `${r.peak_failure_prob}%` },
            { key: 'at_risk_component', label: 'Component' }
          ]} />
        </Panel>
      </div>
    </>
  )
}
