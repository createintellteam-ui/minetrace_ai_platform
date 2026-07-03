import { useApi, Panel, DataTable, fmt } from '../components/ui.jsx'

export default function Blasting() {
  const s = useApi('/api/blasts')
  const rows = s.data?.blasts || []
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Blasting Operations</div>
          <div className="module-subtitle">Blast records feeding mine-plan reconciliation, ground vibration, and explosives logs</div>
        </div>
      </div>

      <div className="module-body">
        <Panel title="Blast schedule log">
          <DataTable rows={rows} columns={[
            { key: 'blast_id', label: 'Blast ID', render: r => <b style={{ fontFamily: 'var(--font-mono)' }}>{r.blast_id}</b> },
            { key: 'site_id', label: 'Site location' },
            { key: 'pit_id', label: 'Pit block' },
            { key: 'blast_date', label: 'Date scheduled' },
            { key: 'explosives_quantity_kg', label: 'Explosives (kg)', render: r => fmt(r.explosives_quantity_kg) },
            { key: 'expected_grade_pct', label: 'Expected grade', render: r => `${r.expected_grade_pct}%` },
            { key: 'expected_tonnes', label: 'Expected tonnes', render: r => fmt(r.expected_tonnes) }
          ]} />
        </Panel>
      </div>
    </>
  )
}
