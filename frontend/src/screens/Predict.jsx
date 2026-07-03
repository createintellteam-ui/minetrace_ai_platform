export default function Predict() {
  const prodForecast = [
    { day: 'Mon', val: 92, tone: 'ok' },
    { day: 'Tue', val: 88, tone: 'ok' },
    { day: 'Wed', val: 71, tone: 'wn' },
    { day: 'Thu', val: 74, tone: 'wn' },
    { day: 'Fri', val: 94, tone: 'ok' },
    { day: 'Sat', val: 96, tone: 'ok' },
    { day: 'Sun', val: 80, tone: 'ok' },
  ]

  const gradeTrend = [
    { label: 'S1', val: 90, col: 'var(--fill-success)' },
    { label: 'S2', val: 88, col: 'var(--fill-success)' },
    { label: 'S3', val: 85, col: 'var(--fill-success)' },
    { label: 'S4', val: 82, col: 'var(--fill-warning)' },
    { label: 'S5', val: 80, col: 'var(--fill-warning)' },
    { label: 'S6', val: 79, col: 'var(--fill-warning)' },
    { label: 'S7', val: 77, col: 'var(--fill-danger)' },
    { label: 'S8', val: 75, col: 'var(--fill-danger)' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Predictive Analytics</div>
          <div className="module-subtitle">Prophet ML forecasting, grade trends, and what-if simulation models</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Fe 30-Day Forecast</span>
            <span className="kc-value">142,000 T</span>
            <span className="kc-delta up">+3% target</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Chrome Shortfall</span>
            <span className="kc-value">840 T</span>
            <span className="kc-delta down">EX-07 impact</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Fe Grade Trend</span>
            <span className="kc-value">62.1% Fe</span>
            <span className="kc-delta down">−0.3% this week</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Revenue Forecast</span>
            <span className="kc-value">₹6.8 Cr</span>
            <span className="kc-delta up">All 5 minerals</span>
          </div>
        </div>

        {/* WARNING BOX */}
        <div style={{ padding: 8, background: 'var(--bg-warning)', border: '0.5px solid var(--border-warning)', borderRadius: 6, color: 'var(--text-warning)', fontSize: 10, fontWeight: '500' }}>
          ⚠ <strong>AI Alert:</strong> Fe% declining 0.2%/shift. Likely cause: deeper bench, lower grade seam. Recommend blast hole sampling at Pit A3 bench 4.
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          
          {/* Production Forecast Chart */}
          <div className="panel">
            <div className="ph"><span className="pt">Production Forecast (7-Day Outlook)</span></div>
            <div className="pbody">
              <div className="waterfall-chart" style={{ height: 80 }}>
                {prodForecast.map((bar, i) => (
                  <div key={i} className="waterfall-bar-wrapper">
                    <div 
                      className="waterfall-bar" 
                      style={{ 
                        height: `${bar.val}%`, 
                        background: bar.tone === 'ok' ? 'var(--fill-success)' : 'var(--fill-warning)' 
                      }} 
                    />
                    <span className="waterfall-label">{bar.day}</span>
                    <span className="waterfall-val">{bar.val}%</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Jul 3-4 dip: EX-07 repair + monsoon probability 64%
              </div>
            </div>
          </div>

          {/* Grade Trend Chart */}
          <div className="panel">
            <div className="ph"><span className="pt">Fe Grade Decline Trend (8 shifts)</span></div>
            <div className="pbody">
              <div className="waterfall-chart" style={{ height: 80 }}>
                {gradeTrend.map((bar, i) => (
                  <div key={i} className="waterfall-bar-wrapper">
                    <div 
                      className="waterfall-bar" 
                      style={{ height: `${bar.val}%`, background: bar.col }} 
                    />
                    <span className="waterfall-label">{bar.label}</span>
                    <span className="waterfall-val">{((bar.val / 100) * 10 + 58).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text-secondary)', marginTop: 4 }}>
                <span>6 days ago · 63.4%</span>
                <span>Today · 62.1% (amber)</span>
              </div>
            </div>
          </div>

        </div>

        {/* WHAT-IF SCENARIOS */}
        <div className="panel">
          <div className="ph">
            <span className="pt">What-If Scenario Simulation: "EX-07 offline 3 more days at Sukinda"</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              <div style={{ padding: 6, background: 'var(--bg-danger)', borderRadius: 4, textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: 'var(--text-danger)', textTransform: 'uppercase' }}>Chrome Loss</div>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text-danger)', marginTop: 2 }}>840T</div>
              </div>
              <div style={{ padding: 6, background: 'var(--bg-warning)', borderRadius: 4, textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: 'var(--text-warning)', textTransform: 'uppercase' }}>Revenue Impact</div>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text-warning)', marginTop: 2 }}>₹33.6L</div>
              </div>
              <div style={{ padding: 6, background: 'var(--bg-accent)', borderRadius: 4, textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: 'var(--text-accent)', textTransform: 'uppercase' }}>Recovery Option</div>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text-accent)', marginTop: 2 }}>+3 Trucks</div>
              </div>
              <div style={{ padding: 6, background: 'var(--bg-success)', borderRadius: 4, textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: 'var(--text-success)', textTransform: 'uppercase' }}>Recovery Possible</div>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text-success)', marginTop: 2 }}>61%</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
