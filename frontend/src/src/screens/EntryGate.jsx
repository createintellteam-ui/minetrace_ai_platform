import { useApi, Screen, Kpi, Card, DataTable, fmt } from '../components/ui.jsx'
export default function EntryGate() {
  const s = useApi('/api/gate/scans')
  const d = s.data || {}
  return (
    <Screen title="Entry gate AI vision" subtitle="RGB + multispectral bucket scans at loading points" state={s}>
      <div className="krow">
        <Kpi cls="b" lbl="Avg confidence" val={(d.stats?.avg_confidence ?? '—') + '%'} />
        <Kpi cls="g" lbl="Avg RGB score" val={d.stats?.avg_rgb} />
        <Kpi cls="g" lbl="Avg multispectral" val={d.stats?.avg_multispectral} />
        <Kpi cls="b" lbl="Total scans" val={fmt(d.stats?.total_scans)} />
      </div>
      <Card title="Recent bucket scans">
        <DataTable rows={d.recent || []} columns={[
          { key: 'truck_id', label: 'Truck' },
          { key: 'camera_id', label: 'Camera' },
          { key: 'mineral_type', label: 'Mineral' },
          { key: 'bucket_number', label: 'Bucket' },
          { key: 'grade_predicted_pct', label: 'Predicted %' },
          { key: 'grade_confidence_pct', label: 'Confidence %' },
        ]} />
      </Card>
    </Screen>
  )
}
