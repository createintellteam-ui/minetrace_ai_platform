import { useState } from 'react'

export default function Dispatch() {
  const [otp, setOtp] = useState('')
  const [overrideStatus, setOverrideStatus] = useState('')

  const dispatchRows = [
    { truck: 'OD22MN3301', site: 'Koraput', cust: 'MOIL', order: 'Mn 38%+', actual: 'Mn 38.9%', actTone: 'ok', xrf: 'XRF Pass', cam: 'Exit Clear', status: 'Released', tone: 'ok' },
    { truck: 'OD09AB4421', site: 'Keonjhar', cust: 'JSW Steel', order: 'Fe 62%+', actual: 'Fe 48.2%', actTone: 'al', xrf: 'XRF Fail', cam: 'Exit Flag', status: 'On hold', tone: 'al' },
    { truck: 'OD44CR0091', site: 'Sukinda', cust: 'FACOR', order: 'Cr 50%+', actual: 'Cr 51.5%', actTone: 'ok', xrf: 'XRF Pass', cam: 'Exit Clear', status: 'Released', tone: 'ok' },
    { truck: 'OD61AL8801', site: 'Kodingamali', cust: 'NALCO', order: 'Al2O3 50%+', actual: 'Al2O3 48.2%', actTone: 'wn', xrf: 'XRF Retest', cam: 'Exit Flag', status: 'On hold', tone: 'wn' },
  ]

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
            <span className="kc-value">312 loads</span>
            <span className="kc-delta up">All 5 sites active</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">On Hold</span>
            <span className="kc-value">5 loads</span>
            <span className="kc-delta down">Pending review</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Exit Gate Scans</span>
            <span className="kc-value">312</span>
            <span className="kc-delta up">100% AI verified</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Grade Order Flags</span>
            <span className="kc-value">3 flags</span>
            <span className="kc-delta down">Dilution warning</span>
          </div>
        </div>

        {/* SPLIT LAYOUT: DISPATCH LOG AND OTP PANEL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
          
          {/* Dispatch Log */}
          <div className="panel">
            <div className="ph"><span className="pt">Live Exit Sales Logs</span></div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Truck</th>
                      <th>Site</th>
                      <th>Customer</th>
                      <th>Order Spec</th>
                      <th>Actual Grade</th>
                      <th>XRF Lab</th>
                      <th>Exit Vision</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchRows.map((row, i) => (
                      <tr key={i} onClick={() => window.sendPrompt(`Show digital challan and XRF results for truck ${row.truck}`)}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{row.truck}</td>
                        <td>{row.site}</td>
                        <td>{row.cust}</td>
                        <td>{row.order}</td>
                        <td style={{ fontWeight: 'bold', color: row.actTone === 'al' ? 'var(--text-danger)' : row.actTone === 'wn' ? 'var(--text-warning)' : 'var(--text-success)' }}>
                          {row.actual}
                        </td>
                        <td>
                          <span style={{ color: row.xrf.includes('Fail') ? 'var(--text-danger)' : 'inherit' }}>{row.xrf}</span>
                        </td>
                        <td>
                          <span style={{ color: row.cam.includes('Flag') ? 'var(--text-danger)' : 'inherit' }}>{row.cam}</span>
                        </td>
                        <td><span className={`pill ${row.tone}`}>{row.status}</span></td>
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
            <div className="pbody" style={{ gap: 6 }}>
              <p style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                <strong>Issue Detected:</strong> transit weight loss is 3.8T. Finished grade (48.2% Fe) is severely below client spec (JSW Steel: 62%+ Fe).
              </p>
              <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                Override requires secure OTP entry from regional mine manager. Logged actions cannot be deleted.
              </p>
              <input
                type="password"
                className="input-field"
                placeholder="Enter OTP (try 8839)..."
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: '100%' }}
              />
              <button className="btn danger" onClick={handleRelease} style={{ width: '100%' }}>
                Override &amp; Release
              </button>
              {overrideStatus && (
                <div style={{ fontSize: 8, marginTop: 4, fontWeight: 'bold', color: overrideStatus.includes('APPROVED') ? 'var(--text-success)' : 'var(--text-danger)' }}>
                  {overrideStatus}
                </div>
              )}
              <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' }}>
                * Override logged · Manager name required · Audit trail created
              </div>
            </div>
          </div>

        </div>

        {/* INTEGRATION INFO */}
        <div className="panel">
          <div className="ph"><span className="pt">OMC Compliance Scope</span></div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              <div style={{ padding: 4, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>Weighbridge Integration:</strong> Plate numbers are matched with weighbridge gross tare.
              </div>
              <div style={{ padding: 4, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>XRF Grade Check:</strong> Handheld and lab XRF grades are compared against client specs.
              </div>
              <div style={{ padding: 4, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>Digital Challan:</strong> QR-enabled tamper-proof passes are written to govt. systems.
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
