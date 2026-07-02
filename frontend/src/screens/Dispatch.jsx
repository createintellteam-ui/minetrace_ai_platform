import { useApi, Screen, Kpi, Card, DataTable, fmt } from '../components/ui.jsx'
export default function Dispatch() {
  const s = useApi('/api/dispatch/summary')
  const d = s.data || {}
  return (
    <Screen title="Dispatch & challan" subtitle="Approval, hold/release workflow and challans" state={s}>
      <div className="krow">
        <Kpi cls="b" lbl="Total dispatches" val={fmt(d.status?.total)} />
        <Kpi cls="g" lbl="Approved" val={fmt(d.status?.approved)} />
        <Kpi cls="r" lbl="Held" val={fmt(d.status?.held)} />
      </div>
      <div className="grid2">
        <Card title="Hold reasons">
          <DataTable rows={d.holds || []} columns={[
            { key: 'hold_reason', label: 'Reason' }, { key: 'count', label: 'Count' }]} />
        </Card>
        <Card title="Recent challans">
          <DataTable rows={d.recent || []} columns={[
            { key: 'challan_number', label: 'Challan' }, { key: 'truck_id', label: 'Truck' },
            { key: 'tonnes', label: 'Tonnes' },
            { key: 'dispatch_approved', label: 'Status',
              render: r => r.dispatch_approved ? <span className="tag g">OK</span> : <span className="tag r">HOLD</span> },
          ]} />
        </Card>
      </div>
    </Screen>
  )
}
