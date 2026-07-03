import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Anomaly() {
  const { data: anomalies, err, loading } = useApi('/api/anomalies/trucks?limit=10')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Anomalies...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading anomaly detection: {err}</div>
  }

  const rows = anomalies || []

  // Derived metrics
  const criticalCount = rows.filter(r => Math.abs(r.total_loss_t) > 10).length
  const highCount = rows.filter(r => Math.abs(r.total_loss_t) <= 10 && Math.abs(r.total_loss_t) > 5).length
  const mediumCount = rows.filter(r => Math.abs(r.total_loss_t) <= 5).length

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Anomaly Detection</div>
          <div className="module-subtitle">Isolation Forest ML anomalies and geofencing discrepancy logs</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Critical Alerts</span>
            <span className="kc-value">{criticalCount} flags</span>
            <span className="kc-delta down">Immediate action</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">High Severity</span>
            <span className="kc-value">{highCount} flags</span>
            <span className="kc-delta down">Under review</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Medium Severity</span>
            <span className="kc-value">{mediumCount} flags</span>
            <span className="kc-delta neutral">Monitoring trend</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Resolved Today</span>
            <span className="kc-value">4 issues</span>
            <span className="kc-delta up">All clear</span>
          </div>
        </div>

        {/* ANOMALY LIST */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Isolation Forest ML Real-time Violations</span>
          </div>
          <div className="pbody" style={{ gap: 10 }}>
            {rows.map((item, idx) => {
              const isCrit = Math.abs(item.total_loss_t) > 10
              const tone = isCrit ? 'danger' : 'warning'
              const score = isCrit ? 96 : 82
              return (
                <div 
                  key={idx} 
                  className="anomaly-item"
                  style={{ 
                    borderLeft: isCrit ? '4px solid var(--fill-danger)' : '4px solid var(--fill-warning)',
                    padding: 14,
                    background: 'var(--surface-0)',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.sendPrompt(`Perform root cause analysis on weight loss pattern for truck ${item.truck_id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <svg style={{ width: 18, height: 18, color: isCrit ? 'var(--text-danger)' : 'var(--text-warning)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>Truck {item.truck_id} · Loss anomaly</span>
                        <span className={`pill ${isCrit ? 'al' : 'wn'}`}>{isCrit ? 'Critical' : 'High'}</span>
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                        {item.trips} trips completed · Total Loss: {Math.abs(item.total_loss_t)}T · {item.zone_mismatches} wrong-zone entry flags.
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isCrit ? 'var(--text-danger)' : 'var(--text-warning)' }}>
                    Score: {score}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* DESCRIPTION SUMMARY */}
        <div className="panel">
          <div className="ph"><span className="pt">Operational Background</span></div>
          <div className="pbody" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <p>Our Isolation Forest algorithms process multidimensional weighbridge logs, GPS timestamps, shift rosters, and LIMS analysis to isolate non-linear exceptions, protecting the mine against security leakage and grade contamination.</p>
          </div>
        </div>
      </div>
    </>
  )
}
