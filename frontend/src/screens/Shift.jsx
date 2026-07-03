export default function Shift() {
  const supervisors = [
    { name: 'Anil Kumar', role: 'Morning Shift', count: '42 shifts', inc: '0 incidents', score: '87/100', color: 'var(--text-success)' },
    { name: 'Manoj Pradhan', role: 'Night Shift', count: '38 shifts', inc: '2 incidents', score: '71/100', color: 'var(--text-warning)' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Shift Intelligence</div>
          <div className="module-subtitle">Shift scorecards, supervisor analytics, and AI handover briefings</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Morning Score</span>
            <span className="kc-value">87 / 100</span>
            <span className="kc-delta up">Best today</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Afternoon Score</span>
            <span className="kc-value">74 / 100</span>
            <span className="kc-delta down">Below average</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Night Score</span>
            <span className="kc-value">71 / 100</span>
            <span className="kc-delta down">Lowest score</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Handover Duration</span>
            <span className="kc-value">14 min</span>
            <span className="kc-delta up">On target</span>
          </div>
        </div>

        {/* SHIFT PERFORMANCE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          
          <div className="panel" style={{ borderColor: 'var(--border-strong)' }}>
            <div className="ph"><span className="pt">Morning Shift scorecard</span></div>
            <div className="pbody" style={{ alignItems: 'center', padding: 15, gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--text-success)' }}>87</div>
              <span className="pill ok" style={{ fontSize: 9 }}>Best Equipment Utilisation</span>
              <p style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 4 }}>06:00 – 14:00 · Keonjhar crusher running at 100% target</p>
            </div>
          </div>

          <div className="panel" style={{ borderColor: 'var(--border-strong)' }}>
            <div className="ph"><span className="pt">Night Shift scorecard</span></div>
            <div className="pbody" style={{ alignItems: 'center', padding: 15, gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--text-danger)' }}>71</div>
              <span className="pill al" style={{ fontSize: 9 }}>Lowest Equipment Utilisation</span>
              <p style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 4 }}>22:00 – 06:00 · Jajpur dispatch delay due to fog/fatigue</p>
            </div>
          </div>

        </div>

        {/* AI ROOT CAUSE */}
        <div className="panel" style={{ borderColor: 'var(--border-accent)' }}>
          <div className="ph" style={{ background: 'var(--bg-accent)' }}>
            <span className="pt" style={{ color: 'var(--text-accent)' }}>AI Shift Handover Briefing</span>
          </div>
          <div className="pbody" style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--text-primary)' }}>
            "Night shift at Sukinda produces 18% less per hour than morning, primarily 02:00-04:00. Cost: ₹31L/month. Root cause: 2 fewer operational dumpers on average. Solution: redistribute 2 trucks from Keonjhar during low-demand window."
          </div>
        </div>

        {/* SUPERVISOR PERFORMANCE LIST */}
        <div className="panel">
          <div className="ph"><span className="pt">Shift Supervisor Registry</span></div>
          <div className="pbody" style={{ gap: 4 }}>
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Supervisor</th>
                    <th>Assigned Shift</th>
                    <th>Shifts Led</th>
                    <th>Incidents</th>
                    <th>Efficiency Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisors.map((row, i) => (
                    <tr key={i} onClick={() => window.sendPrompt(`Show supervisor analytics for ${row.name}`)}>
                      <td style={{ fontWeight: '500' }}>{row.name}</td>
                      <td>{row.role}</td>
                      <td>{row.count}</td>
                      <td>{row.inc}</td>
                      <td style={{ fontWeight: 'bold', color: row.color }}>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
