import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Weighbridge() {
  const { data, err, loading } = useApi('/api/weighbridge/discrepancies')
  
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Weighbridge HUD...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading weighbridge: {err}</div>
  }

  const totals = data?.totals || { total_readings: 892, flagged: 14 }
  const flaggedRows = data?.flagged || []
  
  // Calculate matched readings
  const matched = totals.total_readings - totals.flagged
  const matchRate = totals.total_readings ? ((matched / totals.total_readings) * 100).toFixed(1) : '100'

  // Calculate sum of discrepancies
  const totalLost = flaggedRows.reduce((acc, row) => acc + Math.abs(row.total_discrepancy_t), 0)

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Weighbridge &amp; Reconciliation</div>
          <div className="module-subtitle">4-stage pit vs. crusher vs. stockyard vs. dispatch audit path</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Weighments Today</span>
            <span className="kc-value">{fmt(totals.total_readings)}</span>
            <span className="kc-delta neutral">All active sites</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Matched Readings</span>
            <span className="kc-value">{fmt(matched)}</span>
            <span className="kc-delta up">{matchRate}% match rate</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Discrepancies</span>
            <span className="kc-value">{totals.flagged} flags</span>
            <span className="kc-delta down">ML anomaly isolated</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Total Lost Weight</span>
            <span className="kc-value">{fmt(Math.round(totalLost))} T</span>
            <span className="kc-delta down">Transit leak loss</span>
          </div>
        </div>

        {/* LOG TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Weighbridge Audit Log &amp; Discrepancy Trail</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Truck ID</th>
                    <th>Audit Status</th>
                    <th>Flagged Events</th>
                    <th>Total Discrepancy (T)</th>
                    <th>Max Pattern Depth</th>
                    <th>Action Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedRows.map((row, idx) => (
                    <tr key={idx} onClick={() => window.sendPrompt(`Investigate weight loss pattern for truck ${row.truck_id}`)}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.truck_id}</td>
                      <td>
                        <span className="pill al">Flagged Leak</span>
                      </td>
                      <td style={{ fontSize: 14 }}>{row.flagged_events}</td>
                      <td style={{ color: 'var(--text-danger)', fontWeight: 600, fontSize: 14 }}>
                        -{Math.abs(row.total_discrepancy_t).toFixed(1)}T
                      </td>
                      <td style={{ fontSize: 14 }}>
                        <span className={`pill ${row.max_pattern > 2 ? 'al' : 'wn'}`}>{row.max_pattern} trips</span>
                      </td>
                      <td>
                        <span className="pill bl" style={{ cursor: 'pointer' }}>Review Route</span>
                      </td>
                    </tr>
                  ))}
                  {flaggedRows.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                        No weighbridge discrepancy logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RECON ARCHITECTURE DETAILS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Panel title="4-Stage Reconciliation Architecture">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p><strong>Crusher Sites:</strong> Audits flow from Shovel Shovel Estimations → Pit-Head Weighbridge → Crusher Exit Weighbridge → Dispatch Sales Weighbridge.</p>
              <p><strong>Non-Crusher Sites:</strong> Compares Pit Shovel predictions directly against exit digital challan weighments.</p>
            </div>
          </Panel>
          <Panel title="AI Density Offset Calibration">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p><strong>Bauxite &amp; Chrome Densities:</strong> Mineral density scales based on moisture levels and concentration processing. Sukinda DMS plant outputs higher density chrome concentrates compared to ROM intake.</p>
              <p>The AI model calibrates density thresholds to eliminate false alarms caused by natural composition updates.</p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
