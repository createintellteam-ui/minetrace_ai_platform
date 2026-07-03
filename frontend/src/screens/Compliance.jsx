export default function Compliance() {
  const complianceItems = [
    { name: 'IBM monthly return', countdown: '6d left', tone: 'danger', desc: 'Fe · Cr · Mn · Al2O3 · CaCO3 · Due 15 Jul 2026', pill: 'Critical', pillTone: 'al' },
    { name: 'Royalty payment', countdown: '8d left', tone: 'danger', desc: '₹84.2L outstanding · Govt. of Odisha', pill: 'Critical', pillTone: 'al' },
    { name: 'Vehicle fitness certs', countdown: '11d left', tone: 'warning', desc: '8 trucks · Expires Jul 18-25', pill: 'Upcoming', pillTone: 'wn' },
    { name: 'DGMS quarterly return', countdown: '25d left', tone: 'warning', desc: 'Q2 2026 · All 5 sites · Due Aug 1', pill: 'Upcoming', pillTone: 'wn' },
    { name: 'EC monitoring', countdown: 'Submitted', tone: 'success', desc: 'Submitted Jun 30 · All conditions met', pill: 'Compliant', pillTone: 'ok' },
    { name: 'Mining leases', countdown: 'Valid to 2031', tone: 'success', desc: 'All 5 sites validated', pill: 'Valid', pillTone: 'ok' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Compliance &amp; Regulatory</div>
          <div className="module-subtitle">IBM, DGMS, SPCB, and Odisha govt. clearance deadlines and auto-generation gateways</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Critical Deadlines</span>
            <span className="kc-value">2 filings</span>
            <span className="kc-delta down">Within 7 days</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Upcoming Deadlines</span>
            <span className="kc-value">6 filings</span>
            <span className="kc-delta down">Within 30 days</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Filed This Year</span>
            <span className="kc-value">34 filed</span>
            <span className="kc-delta up">100% on time</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Mining Leases</span>
            <span className="kc-value">Valid to 2031</span>
            <span className="kc-delta up">All 5 sites safe</span>
          </div>
        </div>

        {/* REGULATORY COMPLIANCE CHECKLIST */}
        <div className="panel">
          <div className="ph">
            <span className="pt">State &amp; National Compliance Deadlines</span>
            <button className="btn" onClick={() => window.sendPrompt('Auto-generate returns for IBM monthly production return in OMC format')}>
              Auto-Generate Returns
            </button>
          </div>
          <div className="pbody" style={{ gap: 5 }}>
            {complianceItems.map((item, idx) => (
              <div 
                key={idx} 
                className="anomaly-item" 
                style={{ borderLeft: `3.5px solid var(--fill-${item.tone})`, padding: '5px 8px' }}
                onClick={() => window.sendPrompt(`Show detailed compliance checklist and files for ${item.name}`)}
              >
                <div className="anomaly-left">
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <strong style={{ fontSize: 10, color: `var(--text-${item.tone})` }}>{item.name} ({item.countdown})</strong>
                    <span className={`pill ${item.pillTone}`}>{item.pill}</span>
                  </div>
                  <span className="anomaly-desc" style={{ marginTop: 2 }}>{item.desc}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 'bold', color: `var(--text-${item.tone})` }}>{item.countdown}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
