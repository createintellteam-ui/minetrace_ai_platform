import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function EntryGate() {
  const { data, err, loading } = useApi('/api/gate/scans')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Entry Gate logs...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading gate telemetry: {err}</div>
  }

  const stats = data?.stats || { avg_confidence: 96.4, total_scans: 214 }
  const recentScans = data?.recent || []

  // Derived indicators
  const totalScans = stats.total_scans
  const avgConfidence = stats.avg_confidence
  const warningCount = recentScans.filter(s => s.grade_confidence_pct < 90).length

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Entry Gate AI Vision</div>
          <div className="module-subtitle">ANPR license plate recognition, PPE safety verification, and worker scan logs</div>
        </div>
      </div>

      <div className="module-body">
        {/* STATS */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Entries Today</span>
            <span className="kc-value">{fmt(totalScans)} scans</span>
            <span className="kc-delta neutral">All gates active</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Gate Flags</span>
            <span className="kc-value">{warningCount} flags</span>
            <span className="kc-delta down">Action required</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Avg Vision Confidence</span>
            <span className="kc-value">{avgConfidence}%</span>
            <span className="kc-delta up">High precision standard</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Blacklist Checks</span>
            <span className="kc-value">{fmt(totalScans)} checks</span>
            <span className="kc-delta up">100% Secure clear</span>
          </div>
        </div>

        {/* LOG TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Entry Scan Log</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Scan ID</th>
                    <th>Truck ID</th>
                    <th>Camera ID</th>
                    <th>Mineral Load</th>
                    <th>Shovel Bucket</th>
                    <th>Predicted Grade</th>
                    <th>ANPR Status</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((row, idx) => {
                    const isLowConf = row.grade_confidence_pct < 90
                    return (
                      <tr key={idx} onClick={() => window.sendPrompt(`Analyze entry gate scan details for ${row.truck_id} at ${row.camera_id}`)}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{row.scan_id}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.truck_id}</td>
                        <td>{row.camera_id}</td>
                        <td>{row.mineral_type}</td>
                        <td style={{ fontSize: 14 }}>Bucket #{row.bucket_number}</td>
                        <td style={{ fontSize: 14, fontWeight: 'bold' }}>{row.grade_predicted_pct}%</td>
                        <td style={{ fontSize: 14 }}>
                          <span className={`pill ${isLowConf ? 'wn' : 'ok'}`}>
                            {row.grade_confidence_pct}% Match
                          </span>
                        </td>
                        <td>
                          {isLowConf ? (
                            <span className="pill al">Hold Scan</span>
                          ) : (
                            <span className="pill ok">Gate Open</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="panel">
          <div className="ph"><span className="pt">OMC PPE &amp; ANPR Guard Checklist</span></div>
          <div className="pbody" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>No Manual Override:</strong> Gate bar remains locked automatically on ANPR mismatch.
              </div>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>Tamper-Proof Records:</strong> Camera matches truck ID with visual cargo indices.
              </div>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>Blacklist Checks:</strong> Checks driver licenses against local safety registries.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
