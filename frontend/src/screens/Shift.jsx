import { useApi, BarCard, Panel, DataTable } from '../components/ui.jsx'

export default function Shift() {
  const s = useApi('/api/shifts/summary')
  const rows = (s.data || []).map(r => ({ ...r, label: `${r.site_id} ${r.shift_type}` }))
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Shift Intelligence</div>
          <div className="module-subtitle">Shift scorecards and machinery utilisation rates across all sites</div>
        </div>
      </div>

      <div className="module-body">
        <BarCard title="Utilisation by site &amp; shift" data={rows} xKey="label" yKey="avg_utilisation" height={240} />

        <Panel title="Shift scores">
          <DataTable rows={rows} columns={[
            { key: 'site_id', label: 'Site location' },
            { key: 'shift_type', label: 'Shift type' },
            { key: 'avg_score', label: 'Average score', render: r => `${r.avg_score}%` },
            { key: 'avg_utilisation', label: 'Utilisation', render: r => `${r.avg_utilisation}%` }
          ]} />
        </Panel>
      </div>
    </>
  )
}
