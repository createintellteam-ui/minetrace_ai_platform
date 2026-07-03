export default function Machinery() {
  const machineryItems = [
    { id: 'EX-07', model: 'Hitachi EX1200', site: 'Sukinda', desc: 'Hydraulic failure · Health: 12/100', val: 12, pill: 'Offline', tone: 'al', color: 'var(--fill-danger)', iconColor: 'var(--text-danger)', prompt: 'Show breakdown and repair status for EX-07 at Sukinda' },
    { id: 'DZ-01', model: 'Caterpillar D9T', site: 'Keonjhar', desc: 'Oil pressure −18% · 4,820h · Fail in 72-96hr', val: 44, pill: 'At risk', tone: 'wn', color: 'var(--fill-warning)', iconColor: 'var(--text-warning)', prompt: 'DZ-01 maintenance report' },
    { id: 'CR-K01', model: 'Jaw crusher', site: 'Keonjhar', desc: '1,240T/hr · Fe ore · Health: 82/100', val: 82, pill: 'Active', tone: 'bl', color: 'var(--fill-accent)', iconColor: 'var(--text-accent)', prompt: 'Keonjhar crusher status' },
    { id: 'DMS-S01', model: 'Sukinda Chrome plant', site: 'Sukinda', desc: 'Cr2O3 42%→52% · Uptime 96% · Health: 88/100', val: 88, pill: 'Active', tone: 'pr', color: 'var(--fill-pro)', iconColor: 'var(--text-pro)', prompt: 'Sukinda DMS beneficiation plant health' },
    { id: 'CR-P01/P02', model: '2-stage crusher', site: 'Pokhari', desc: 'Primary jaw + secondary cone · Health: 79/100', val: 79, pill: 'Active', tone: 'ok', color: 'var(--fill-success)', iconColor: 'var(--text-success)', prompt: 'Pokhari crusher status' },
    { id: 'EX-03', model: 'Komatsu PC1250', site: 'Keonjhar', desc: 'Pit 2 · 3,410h · Health: 91/100', val: 91, pill: 'Active', tone: 'ok', color: 'var(--fill-success)', iconColor: 'var(--text-success)', prompt: 'Komatsu excavator status' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Machinery &amp; Equipment</div>
          <div className="module-subtitle">Heavy assets registry, predictive health bars, and active breakdown monitors</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Equipment Online</span>
            <span className="kc-value">34/38</span>
            <span className="kc-delta up">89% active</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Breakdowns</span>
            <span className="kc-value">1 active</span>
            <span className="kc-delta down">EX-07 Sukinda (red)</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Maintenance Due</span>
            <span className="kc-value">4 units</span>
            <span className="kc-delta down">Scheduled this week</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Crusher Units</span>
            <span className="kc-value">3/3</span>
            <span className="kc-delta up">All systems online</span>
          </div>
        </div>

        {/* MACHINERY REGISTRY */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Heavy Machinery &amp; Beneficiation Registry</span>
          </div>
          <div className="pbody" style={{ gap: 6 }}>
            {machineryItems.map((item, idx) => (
              <div 
                key={idx} 
                className="anomaly-item" 
                style={{ borderLeft: `3.5px solid ${item.color}`, padding: '6px 10px' }}
                onClick={() => window.sendPrompt(item.prompt)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  {/* Custom gear icon */}
                  <svg style={{ width: 14, height: 14, color: item.iconColor, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <strong style={{ fontSize: 10, color: 'var(--text-primary)' }}>{item.id}</strong>
                      <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{item.model} · {item.site}</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                  </div>

                  <div style={{ width: 100, display: 'flex', alignItems: 'center', gap: 6, marginRight: 10 }}>
                    <div className="mineral-progress-bg" style={{ margin: 0 }}>
                      <div className="mineral-progress-fill" style={{ width: `${item.val}%`, background: item.color }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: '600' }}>{item.val}%</span>
                  </div>

                  <span className={`pill ${item.tone}`}>{item.pill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL NOTE */}
        <div className="panel">
          <div className="ph"><span className="pt">Predictive Maintenance Feed Note</span></div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <p>Crusher plants (CR-K01, CR-P01) and wet processing mills (DMS-S01) write mechanical data points directly to our predictive analytics engine. Machine health monitors calculate risk curves to schedule maintenance during planned blast shift gaps, preventing expensive un-scheduled breakdowns.</p>
          </div>
        </div>

      </div>
    </>
  )
}
