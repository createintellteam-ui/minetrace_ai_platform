import { useApi, Panel } from '../components/ui.jsx'

export default function Compliance() {
  const s = useApi('/api/compliance')
  const d = s.data || {}
  const items = Object.entries(d)
  
  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Compliance &amp; Regs</div>
          <div className="module-subtitle">IBM monthly returns, royalty payouts, vehicle fitness certifications, and worker safety logs</div>
        </div>
      </div>

      <div className="module-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {items.map(([key, val]) => (
            <Panel key={key} title={key.replace(/_/g, ' ').toUpperCase()}>
              <div className="tbl-container">
                <table className="tbl">
                  <tbody>
                    {Object.entries(val).map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                          {k.replace(/_/g, ' ')}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {typeof v === 'number' && k.includes('amount') ? `₹${(v / 100000).toFixed(1)} Lakhs` : String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </>
  )
}
