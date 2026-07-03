export default function Leakage() {
  const bars = [
    { label: 'Weight loss in transit', pct: 34, val: '₹62.4L', color: 'var(--fill-danger)' },
    { label: 'Grade dilution', pct: 46, val: '₹84.2L', color: 'var(--fill-danger)' },
    { label: 'Wrong zone routing', pct: 11, val: '₹21.1L', color: 'var(--fill-warning)' },
    { label: 'Reconciliation gap', pct: 9, val: '₹16.3L', color: 'var(--fill-warning)' },
  ]

  const items = [
    {
      type: 'route',
      title: 'Pit B3 → Weighbridge 2 route',
      desc: 'Driver Raju Kumar · 5 consecutive losses',
      cost: '₹18.2L',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-danger)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )
    },
    {
      type: 'stack',
      title: 'Stockyard Zone C contamination',
      desc: '3 chrome trucks in iron zone · Grade drop 0.8%',
      cost: '₹24.1L',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-danger)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    },
    {
      type: 'moon',
      title: 'Night shift Pit A1-A2 underproduction',
      desc: 'Consistent 2.1% gap every Thu-Fri',
      cost: '₹20.3L',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-warning)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    }
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Revenue Leakage Intelligence</div>
          <div className="module-subtitle">Monetising transit weight loss, grade dilutions, and process discrepancies in rupees</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Total Leakage</span>
            <span className="kc-value" style={{ color: 'var(--text-danger)' }}>₹1.84 Cr</span>
            <span className="kc-delta down" style={{ color: 'var(--text-danger)' }}>This month total</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Top Leakage Source</span>
            <span className="kc-value">46%</span>
            <span className="kc-delta down">Grade dilution</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Recoverable Value</span>
            <span className="kc-value">₹62.6 L</span>
            <span className="kc-delta up">Top 3 leaks fixable</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Flagged Events</span>
            <span className="kc-value">23 events</span>
            <span className="kc-delta neutral">High-severity alerts</span>
          </div>
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
          
          {/* Horizontal chart */}
          <div className="panel">
            <div className="ph"><span className="pt">Leakage Sources Breakdown</span></div>
            <div className="pbody" style={{ gap: 8 }}>
              {bars.map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                    <span style={{ fontWeight: '500' }}>{bar.label} ({bar.pct}%)</span>
                    <span style={{ fontWeight: '600' }}>{bar.val}</span>
                  </div>
                  <div className="mineral-progress-bg" style={{ height: 6 }}>
                    <div className="mineral-progress-fill" style={{ width: `${bar.pct}%`, background: bar.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 audit cases */}
          <div className="panel">
            <div className="ph">
              <span className="pt">Top 3 Leakage Sources</span>
              <button className="btn" onClick={() => window.sendPrompt('Show revenue recovery plan for top leakage sources')}>
                Action Plan
              </button>
            </div>
            <div className="pbody" style={{ gap: 6 }}>
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="anomaly-item" 
                  style={{ borderLeft: '3.5px solid var(--fill-danger)', padding: '4px 8px' }}
                  onClick={() => window.sendPrompt(`Analyze leakage risk and recovery options for ${item.title}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.icon}
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: 8, color: 'var(--text-secondary)' }}>{item.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--text-danger)' }}>{item.cost}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
