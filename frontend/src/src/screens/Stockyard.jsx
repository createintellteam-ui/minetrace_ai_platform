import { useApi, Screen, Card, DataTable, fmt } from '../components/ui.jsx'
export default function Stockyard() {
  const s = useApi('/api/stockyard/zones')
  const rows = s.data || []
  return (
    <Screen title="Stockyard management" subtitle="Grade-band geo-fenced zones — occupancy and wrong-zone dumps" state={s}>
      <Card title="Zone status">
        <DataTable rows={rows} columns={[
          { key: 'zone_id', label: 'Zone' }, { key: 'site_id', label: 'Site' },
          { key: 'grade_band', label: 'Band' },
          { key: 'tonnes_in', label: 'Tonnes in', render: r => fmt(r.tonnes_in) },
          { key: 'trips_in', label: 'Trips' },
          { key: 'mismatches', label: 'Wrong-zone dumps',
            render: r => r.mismatches > 0 ? <span className="tag r">{r.mismatches}</span> : r.mismatches },
        ]} />
      </Card>
    </Screen>
  )
}
