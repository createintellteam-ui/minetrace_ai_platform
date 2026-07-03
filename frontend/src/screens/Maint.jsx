export default function Maint() {
  const machineryList = [
    { name: 'EX-07 (Hitachi Shovel)', health: 12, rating: 'red', desc: 'Offline', pill: 'Critical', tone: 'al' },
    { name: 'CR-K01 (Jaw Crusher)', health: 82, rating: 'green', desc: 'Active Fe', pill: 'Monitor', tone: 'bl' },
    { name: 'DMS-S01 (Chrome Plant)', health: 88, rating: 'green', desc: 'Beneficiation operational', pill: 'Healthy', tone: 'ok' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Predictive Maintenance</div>
          <div className="module-subtitle">Failure prognosis, telemetry readings, and cost-of-delay auditing</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Critical Risk</span>
            <span className="kc-value">1 asset</span>
            <span className="kc-delta down">EX-07 offline</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">At Risk</span>
            <span className="kc-value">3 assets</span>
            <span className="kc-delta down">DZ-01, CV-02, CR-K01</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Saved This Month</span>
            <span className="kc-value">₹8.2 L</span>
            <span className="kc-delta up">Early interventions</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Avg Fleet Health</span>
            <span className="kc-value">74 / 100</span>
            <span className="kc-delta down">Needs attention</span>
          </div>
        </div>

        {/* DZ-01 DEEP ANALYSIS CARD */}
        <div className="panel" style={{ borderColor: 'var(--border-warning)' }}>
          <div className="ph" style={{ background: 'var(--bg-warning)' }}>
            <span className="pt" style={{ color: 'var(--text-warning)' }}>Asset Anomaly Deep Dive — DZ-01</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--border)', paddingBottom: 8 }}>
              <div className="health-ring amber">44</div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 11 }}>Caterpillar D9T Dozer · Keonjhar · 4,820h</strong>
                <div style={{ fontSize: 10, color: 'var(--text-danger)', fontWeight: 'bold', marginTop: 2 }}>
                  ⚠ Failure window forecast: 72–96 hours from now
                </div>
              </div>
            </div>

            {/* Sensor readings list */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '8px 0' }}>
              <div style={{ padding: 4, background: 'var(--bg-danger)', borderRadius: 4, textAlign: 'center' }}>
                <span style={{ fontSize: 8, color: 'var(--text-danger)', textTransform: 'uppercase' }}>Engine Oil Pressure</span>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-danger)', marginTop: 2 }}>−18% (red)</div>
              </div>
              <div style={{ padding: 4, background: 'var(--bg-warning)', borderRadius: 4, textAlign: 'center' }}>
                <span style={{ fontSize: 8, color: 'var(--text-warning)', textTransform: 'uppercase' }}>Vibration levels</span>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-warning)', marginTop: 2 }}>+23% (amber)</div>
              </div>
              <div style={{ padding: 4, background: 'var(--bg-warning)', borderRadius: 4, textAlign: 'center' }}>
                <span style={{ fontSize: 8, color: 'var(--text-warning)', textTransform: 'uppercase' }}>Fuel consumption</span>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-warning)', marginTop: 2 }}>+11% (amber)</div>
              </div>
            </div>

            {/* Cost Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
              <div style={{ padding: 6, background: 'var(--bg-success)', borderRadius: 4, border: '0.5px solid var(--fill-success)', textAlign: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-success)', fontWeight: '500' }}>FIX TODAY COST</span>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-success)', marginTop: 2 }}>₹45,000</div>
              </div>
              <div style={{ padding: 6, background: 'var(--bg-danger)', borderRadius: 4, border: '0.5px solid var(--fill-danger)', textAlign: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--text-danger)', fontWeight: '500' }}>IF IGNORED BREAKDOWN COST</span>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-danger)', marginTop: 2 }}>₹4.04 Lakhs</div>
              </div>
            </div>
          </div>
        </div>

        {/* FLEET HEALTH LIST */}
        <div className="panel">
          <div className="ph"><span className="pt">Fleet &amp; Crusher Health Registry</span></div>
          <div className="pbody" style={{ gap: 4 }}>
            {machineryList.map((item, idx) => (
              <div 
                key={idx} 
                className="anomaly-item" 
                style={{ borderLeft: `3.5px solid var(--fill-${item.rating === 'red' ? 'danger' : 'success'})` }}
                onClick={() => window.sendPrompt(`Show detailed sensor diagnostics for ${item.name}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className={`health-ring ${item.rating === 'red' ? 'red' : 'green'}`}>{item.health}</div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                </div>
                <span className={`pill ${item.tone}`}>{item.pill}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
