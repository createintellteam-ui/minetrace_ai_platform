export default function Blasting() {
  const checklist = [
    { text: 'Workers evacuated — GPS confirmed', done: true, pill: 'Done', tone: 'ok' },
    { text: 'Trucks parked — fleet hold active', done: true, pill: 'Done', tone: 'ok' },
    { text: 'Security cordon — 300m perimeter', done: true, pill: 'Done', tone: 'ok' },
    { text: 'Village notification — 2 villages', done: true, pill: 'Done', tone: 'ok' },
    { text: 'Shot firer on-site confirmation', done: false, pill: 'Pending', tone: 'wn' },
    { text: 'Explosives quantity logged', done: false, pill: 'Pending', tone: 'wn' },
  ]

  const history = [
    { loc: 'Pit A2 yesterday 13:10', details: '42 holes · 680kg · Vibration 4.2mm/s', status: 'No incidents', tone: 'ok' },
    { loc: 'Pit C1 two days ago 12:45', details: '38 holes · 1 misfire detected and cleared', status: 'Misfire Cleared', tone: 'wn' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Blasting Management</div>
          <div className="module-subtitle">Pre-blast checklist auditing, countdown timers and DGMS safety reports</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Next Blast</span>
            <span className="kc-value">38 min</span>
            <span className="kc-delta down">Keonjhar Pit A3</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Checklist Status</span>
            <span className="kc-value">4/6 Ready</span>
            <span className="kc-delta down">2 items pending</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Blasts This Month</span>
            <span className="kc-value">62 blasts</span>
            <span className="kc-delta up">0 misfires reported</span>
          </div>
          <div className="kc pro">
            <span className="kc-label">Shot Firers Active</span>
            <span className="kc-value">5/5 Certified</span>
            <span className="kc-delta up">DGMS qualified</span>
          </div>
        </div>

        {/* SPLIT LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
          
          {/* Pre blast checklist */}
          <div className="panel">
            <div className="ph"><span className="pt">Pre-Blast Verification Checklist</span></div>
            <div className="pbody" style={{ gap: 5 }}>
              {checklist.map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: 5, 
                    background: 'var(--surface-0)', 
                    borderRadius: 4,
                    color: item.done ? 'var(--text-success)' : 'var(--text-warning)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input 
                      type="checkbox" 
                      checked={item.done} 
                      readOnly 
                      style={{ accentColor: item.done ? 'var(--fill-success)' : 'var(--fill-warning)' }}
                    />
                    <span style={{ fontSize: 9.5 }}>{item.text}</span>
                  </div>
                  <span className={`pill ${item.tone}`}>{item.pill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent blasts logs */}
          <div className="panel">
            <div className="ph"><span className="pt">Recent Blasts &amp; Seismograph Logs</span></div>
            <div className="pbody" style={{ gap: 6 }}>
              {history.map((row, i) => (
                <div key={i} className="anomaly-item" style={{ borderLeft: `3.5px solid var(--fill-${row.tone === 'ok' ? 'success' : 'warning'})` }}>
                  <div className="anomaly-left">
                    <span className="anomaly-title" style={{ fontWeight: '500' }}>{row.loc}</span>
                    <span className="anomaly-desc">{row.details}</span>
                  </div>
                  <span className={`pill ${row.tone}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
