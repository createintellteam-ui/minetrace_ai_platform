export default function Anomaly() {
  const anomalies = [
    {
      id: 'ANOM-01',
      title: 'Repeated weight loss — OD09AB4421 · Keonjhar',
      desc: '5 trips · avg 3.4T loss · same route 10-11:30 window · 17T unaccounted this week',
      score: 96,
      pill: 'Critical',
      tone: 'danger',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-danger)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      prompt: 'Perform root cause analysis on OD09 weight loss pattern'
    },
    {
      id: 'ANOM-02',
      title: 'Wrong zone entry — OD17 · Sukinda',
      desc: 'Chrome ore in Fe iron zone — Cr2O3 contamination risk. Grade integrity of Zone C.',
      score: 99,
      pill: 'Critical',
      tone: 'danger',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-danger)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      prompt: 'Perform root cause analysis on OD17 wrong zone contamination'
    },
    {
      id: 'ANOM-03',
      title: 'Fe% declining trend — Pit A3 · Keonjhar',
      desc: 'Fe declining 0.16%/shift over 8 shifts. Drops below 62% in ~5 shifts.',
      score: 88,
      pill: 'High',
      tone: 'warning',
      icon: (
        <svg style={{ width: 14, height: 14, color: 'var(--text-warning)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      ),
      prompt: 'Perform root cause analysis on Pit A3 Fe grade decline'
    }
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Anomaly Detection</div>
          <div className="module-subtitle">Isolation Forest ML and pattern-based operational auditing models</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc danger">
            <span className="kc-label">Critical</span>
            <span className="kc-value">2 anomalies</span>
            <span className="kc-delta down">Action required</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">High Severity</span>
            <span className="kc-value">3 alerts</span>
            <span className="kc-delta down">Reviewing today</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Medium Severity</span>
            <span className="kc-value">2 flags</span>
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
          <div className="pbody" style={{ gap: 6 }}>
            {anomalies.map((item, idx) => (
              <div 
                key={idx} 
                className="anomaly-item"
                style={{ borderLeft: item.tone === 'danger' ? '3.5px solid var(--fill-danger)' : '3.5px solid var(--fill-warning)' }}
                onClick={() => window.sendPrompt(item.prompt)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.icon}
                  <div className="anomaly-left">
                    <div className="anomaly-title-row">
                      <span className="anomaly-title">{item.title}</span>
                      <span className={`pill ${item.tone === 'danger' ? 'al' : 'wn'}`}>{item.pill}</span>
                    </div>
                    <span className="anomaly-desc">{item.desc}</span>
                  </div>
                </div>
                <div className="anomaly-score" style={{ color: item.tone === 'danger' ? 'var(--text-danger)' : 'var(--text-warning)' }}>
                  {item.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION SUMMARY */}
        <div className="panel">
          <div className="ph"><span className="pt">Operational Background</span></div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <p>Our Isolation Forest algorithms process multidimensional weighbridge logs, GPS timestamps, shift supervisors, and LIMS analysis to detect non-linear exceptions, protecting the mine against security leakage and grade contamination.</p>
          </div>
        </div>

      </div>
    </>
  )
}
