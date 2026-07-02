import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApi, Screen, Kpi, Card, DataTable } from '../components/ui.jsx'
export default function PitGrade() {
  const s = useApi('/api/pit/grade')
  const d = s.data || {}
  const acc = d.accuracy || {}
  return (
    <Screen title="Pit management & grade AI" subtitle="Four-way grade reconciliation: AI camera vs eye vs XRF vs LIMS lab" state={s}>
      <div className="krow">
        <Kpi cls="g" lbl="XRF error (MAE)" val={acc.xrf_mae} sub="most accurate" />
        <Kpi cls="b" lbl="AI camera error" val={acc.camera_mae} sub="vs LIMS truth" />
        <Kpi cls="r" lbl="Eye estimate error" val={acc.eye_mae} sub="least accurate" />
        <Kpi cls="b" lbl="Samples" val={acc.n} />
      </div>
      <Card title="Grade by method, per mineral (vs LIMS ground truth)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={d.by_mineral || []} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mineral_type" fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
            <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
            <Bar dataKey="lims" name="LIMS (truth)" fill="var(--fill-success)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="xrf" name="XRF" fill="var(--fill-accent)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="camera" name="AI camera" fill="var(--fill-pro)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="eye" name="Eye" fill="var(--fill-danger)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Recent trips — grade comparison" style={{ marginTop: 12 }}>
        <DataTable rows={d.sample || []} columns={[
          { key: 'trip_id', label: 'Trip' }, { key: 'mineral_type', label: 'Mineral' },
          { key: 'grade_band', label: 'Band' },
          { key: 'grade_camera_pct', label: 'Camera' }, { key: 'grade_eye_estimate_pct', label: 'Eye' },
          { key: 'grade_xrf_pct', label: 'XRF' }, { key: 'grade_lims_pct', label: 'LIMS' },
        ]} />
      </Card>
    </Screen>
  )
}
