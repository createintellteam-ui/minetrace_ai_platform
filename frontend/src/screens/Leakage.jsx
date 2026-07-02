import { useApi, Screen, Kpi, BarCard, fmt } from '../components/ui.jsx'
export default function Leakage() {
  const s = useApi('/api/leakage')
  const d = s.data || {}
  const wf = d.waterfall || {}
  const chart = [
    { stage: 'Pit', mt: wf.pit_mt }, { stage: 'Crusher', mt: wf.crusher_mt },
    { stage: 'Stockyard', mt: wf.stockyard_mt }, { stage: 'Dispatch', mt: wf.dispatch_mt },
  ]
  return (
    <Screen title="Revenue leakage intelligence" subtitle="Stage-wise material loss converted to rupees" state={s}>
      <div className="krow">
        <Kpi cls="r" lbl="Material lost" val={fmt(d.lost_mt) + ' MT'} />
        <Kpi cls="r" lbl="Value lost" val={'₹' + fmt(d.lost_value_inr)} />
        <Kpi cls="a" lbl="Crusher→Stockyard" val={wf.loss_crusher_stockyard_pct + '%'} sub="dominant leak" />
        <Kpi cls="a" lbl="Stockyard→Dispatch" val={wf.loss_stockyard_dispatch_pct + '%'} />
      </div>
      <BarCard title="Reconciliation waterfall (Pit → Dispatch)" data={chart} xKey="stage" yKey="mt"
        note={`Biggest single leak: Crusher→Stockyard at ${wf.loss_crusher_stockyard_pct}%`} height={260} />
    </Screen>
  )
}
