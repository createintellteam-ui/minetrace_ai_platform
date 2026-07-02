import { useApi, Screen, Card, DataTable } from '../components/ui.jsx'
export default function Blasting() {
  const s = useApi('/api/blasts')
  const rows = s.data?.blasts || []
  return (
    <Screen title="Blasting management" subtitle="Blast records feeding mine-plan reconciliation" state={s}>
      <Card title="Blast log">
        <DataTable rows={rows} columns={[
          { key: 'blast_id', label: 'Blast ID' }, { key: 'site_id', label: 'Site' },
          { key: 'pit_id', label: 'Pit' }, { key: 'blast_date', label: 'Date' },
          { key: 'explosives_quantity_kg', label: 'Explosives (kg)' },
          { key: 'expected_grade_pct', label: 'Expected grade %' },
          { key: 'expected_tonnes', label: 'Expected tonnes' }]} />
      </Card>
    </Screen>
  )
}
