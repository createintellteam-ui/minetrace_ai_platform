export default function Environment() {
  const ecConditions = [
    { code: 'EC 7(b)', title: 'Dust at crusher · Sukinda', desc: 'PM2.5 142 — approaching 150 limit', status: 'At risk', tone: 'wn' },
    { code: 'EC 12(c)', title: 'Blasting hours 10:00-17:00', desc: '62 blasts this month — all within window', status: 'Compliant', tone: 'ok' },
    { code: 'EC 14', title: 'Green belt plantation', desc: '8,200 of 12,000 saplings planted', status: '68% done', tone: 'wn' },
    { code: 'EC 9', title: 'Topsoil conservation', desc: '42,000m³ stockpiled for restoration', status: 'Compliant', tone: 'ok' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Environment Monitoring</div>
          <div className="module-subtitle">EC condition tracker, SPCB sensors, green belt plantation and restoration compliance</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc warning">
            <span className="kc-label">EC Conditions Met</span>
            <span className="kc-value">17/19 met</span>
            <span className="kc-delta down">2 at risk</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Dust Exceedances</span>
            <span className="kc-value">3 flags</span>
            <span className="kc-delta down">This quarter</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Plantation Progress</span>
            <span className="kc-value">68% completed</span>
            <span className="kc-delta up">12K saplings target</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">SPCB Return Due</span>
            <span className="kc-value">12 days left</span>
            <span className="kc-delta down">Prepare filing</span>
          </div>
        </div>

        {/* SENSOR GRID */}
        <div className="panel">
          <div className="ph"><span className="pt">State Pollution Control Board (SPCB) Live Feeds</span></div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              
              <div className="kc warning">
                <span className="kc-label">PM2.5 (Crusher)</span>
                <span className="kc-value" style={{ color: 'var(--text-warning)' }}>142 µg/m³</span>
                <span className="kc-delta down">Limit 150 · Near limit</span>
              </div>
              
              <div className="kc success">
                <span className="kc-label">PM10 (Haul road)</span>
                <span className="kc-value" style={{ color: 'var(--text-success)' }}>88 µg/m³</span>
                <span className="kc-delta up">Limit 100 · Safe</span>
              </div>

              <div className="kc success">
                <span className="kc-label">Noise Level</span>
                <span className="kc-value" style={{ color: 'var(--text-success)' }}>62 dB</span>
                <span className="kc-delta up">Limit 75 · Safe</span>
              </div>

              <div className="kc success">
                <span className="kc-label">Discharge pH</span>
                <span className="kc-value" style={{ color: 'var(--text-success)' }}>6.8 pH</span>
                <span className="kc-delta up">Range 6.5-8.5 · Normal</span>
              </div>

            </div>
          </div>
        </div>

        {/* EC CONDITION TRACKER */}
        <div className="panel">
          <div className="ph"><span className="pt">Environmental Clearance (EC) Condition Tracker</span></div>
          <div className="pbody" style={{ gap: 4 }}>
            {ecConditions.map((ec, idx) => (
              <div 
                key={idx} 
                className="anomaly-item" 
                style={{ borderLeft: ec.tone === 'ok' ? '3.5px solid var(--fill-success)' : '3.5px solid var(--fill-warning)', padding: '5px 8px' }}
                onClick={() => window.sendPrompt(`Show detailed compliance logs for ${ec.code}`)}
              >
                <div className="anomaly-left">
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <strong style={{ fontSize: 9, color: ec.tone === 'ok' ? 'var(--text-success)' : 'var(--text-warning)' }}>{ec.code}</strong>
                    <span style={{ fontSize: 10, fontWeight: 'bold' }}>{ec.title}</span>
                  </div>
                  <span className="anomaly-desc" style={{ marginTop: 2 }}>{ec.desc}</span>
                </div>
                <span className={`pill ${ec.tone}`}>{ec.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
