import { useApi, BarCard, Panel, DataTable, fmt } from '../components/ui.jsx'

export default function Finance() {
  const s = useApi('/api/finance')
  const rawRows = s.data?.by_mineral || []
  
  // Format values in ₹ Lakhs for better dashboard readability
  const rows = rawRows.map(r => ({
    ...r,
    revenue_lakhs: Math.round(r.revenue_inr / 100000),
    royalty_lakhs: Math.round(r.royalty_inr / 100000),
  }))

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Finance and Royalty</div>
          <div className="module-subtitle">Sales revenue, dispatch tonnes, and royalty dues paid to the Govt. of Odisha</div>
        </div>
      </div>

      <div className="module-body">
        <BarCard title="Revenue by mineral (₹ Lakhs)" data={rows} xKey="mineral_type" yKey="revenue_lakhs" height={220} />

        <Panel title="Mineral financial summary">
          <DataTable rows={rows} columns={[
            { key: 'mineral_type', label: 'Mineral type' },
            { key: 'dispatched_mt', label: 'Dispatched tonnes', render: r => `${fmt(r.dispatched_mt)} MT` },
            { key: 'revenue_lakhs', label: 'Gross Revenue (₹)', render: r => `₹${fmt(r.revenue_lakhs)} Lakhs` },
            { key: 'royalty_lakhs', label: 'Royalty paid (₹)', render: r => `₹${fmt(r.royalty_lakhs)} Lakhs` }
          ]} />
        </Panel>
      </div>
    </>
  )
}
