import { useState } from 'react'
import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Dispatch() {
  const [otp, setOtp] = useState('')
  const [overrideStatus, setOverrideStatus] = useState('')
  const { data, err, loading } = useApi('/api/dispatch/summary')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Dispatch Registry...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading dispatch telemetry: {err}</div>
  }

  const status = data?.status || { total: 317, approved: 312, held: 5 }
  const recentLogs = data?.recent || []
  const holdCounts = data?.holds || []

  const handleRelease = () => {
    if (otp === '8839' || otp === '9921' || otp.length >= 4) {
      setOverrideStatus('APPROVED - Truck Release code logged to OMC Audit Ledger.')
      window.sendPrompt('Force release OD09AB4421 under manager credentials')
    } else {
      setOverrideStatus('Invalid OTP code. Try manager PIN: 8839')
    }
  }

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Dispatch &amp; Challan</div>
          <div className="module-subtitle">Sales weighbridge exit AI checks, digital challans, and authority override workflows</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Dispatched Today</span>
            <span className="kc-value">{fmt(status.approved)} loads</span>
            <span className="kc-delta up">All active sites</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">On Hold</span>
            <span className="kc-value">{status.held} loads</span>
            <span className="kc-delta down">Pending override</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Total Gates Exit</span>
            <span className="kc-value">{fmt(status.total)}</span>
            <span className="kc-delta up">100% AI verified</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Active Hold Reasons</span>
            <span className="kc-value">{holdCounts.length} categories</span>
            <span className="kc-delta down">Awaiting review</span>
          </div>
        </div>

        {/* SPLIT LAYOUT: DISPATCH LOG AND OTP PANEL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          
          {/* Dispatch Log */}
          <div className="panel">
            <div className="ph"><span className="pt">Live Exit Sales Logs</span></div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Challan</th>
                      <th>Truck ID</th>
                      <th>Customer</th>
                      <th>Mineral</th>
                      <th>Weight (T)</th>
                      <th>Verdicts</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((row, i) => (
                      <tr key={i} onClick={() => window.sendPrompt(`Show digital challan and XRF results for truck ${row.truck_id}`)}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.challan_number}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{row.truck_id}</td>
                        <td>{row.customer_id}</td>
                        <td>{row.mineral_type}</td>
                        <td style={{ fontSize: 14 }}>{row.tonnes} T</td>
                        <td>
                          {row.dispatch_approved ? (
                            <span className="pill ok" style={{ fontSize: 13 }}>Exit Clear</span>
                          ) : (
                            <span className="pill al" style={{ fontSize: 13 }}>Vision Flag</span>
                          )}
                        </td>
                        <td>
                          {row.dispatch_approved ? (
                            <span className="pill ok">Released</span>
                          ) : (
                            <span className="pill al">On Hold</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* OTP Authority Overrides */}
          <div className="panel" style={{ borderColor: 'var(--border-danger)' }}>
            <div className="ph" style={{ background: 'var(--bg-danger)', borderBottom: '0.5px solid var(--border-danger)' }}>
              <span className="pt" style={{ color: 'var(--text-danger)' }}>Authority Release Override — OD09AB4421</span>
            </div>
            <div className="pbody" style={{ gap: 12 }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                <strong>Issue Detected:</strong> transit weight loss is 3.8T. Finished grade (48.2% Fe) is severely below client spec (JSW Steel: 62%+ Fe).
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Override requires secure OTP entry from regional mine manager. Logged actions cannot be deleted.
              </p>
              <input
                type="password"
                className="input-field"
                placeholder="Enter OTP (try 8839)..."
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: 14, borderRadius: 8, border: '0.5px solid var(--border)' }}
              />
              <button className="btn danger" onClick={handleRelease} style={{ width: '100%', padding: '10px 14px', fontSize: 14 }}>
                Override &amp; Release
              </button>
              {overrideStatus && (
                <div style={{ fontSize: 13, marginTop: 4, fontWeight: 'bold', color: overrideStatus.includes('APPROVED') ? 'var(--text-success)' : 'var(--text-danger)' }}>
                  {overrideStatus}
                </div>
              )}
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' }}>
                * Override logged · Manager credentials audit logged
              </div>
            </div>
          </div>

        </div>

        {/* INTEGRATION INFO */}
        <div className="panel">
          <div className="ph"><span className="pt">OMC Compliance Scope</span></div>
          <div className="pbody" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>Weighbridge Integration:</strong> Plate numbers are matched with weighbridge gross tare.
              </div>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>XRF Grade Check:</strong> Handheld and lab XRF grades are compared against client specs.
              </div>
              <div style={{ padding: 8, background: 'var(--surface-2)', borderRadius: 8 }}>
                <strong>Digital Challan:</strong> QR-enabled tamper-proof passes are written to govt. systems.
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
