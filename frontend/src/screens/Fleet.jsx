export default function Fleet() {
  const routingRows = [
    { vehicle: 'OD09AB4421', site: 'Keonjhar', mineral: 'Fe ore 48T', route: 'Pit A3 → WB-1 → Crusher → Zone A', eta: 'ETA 14 min', status: 'On route', tone: 'ok' },
    { vehicle: 'OD17YX9021', site: 'Sukinda', mineral: 'Chrome 52T', route: 'WRONG: Zone Fe → CORRECT: DMS plant', eta: 'Halted (red)', status: 'Reroute', tone: 'al' },
    { vehicle: 'OD22MN3301', site: 'Koraput', mineral: 'Mn 44T', route: 'Pit C2 → WB-3 → Zone Mn-H', eta: 'ETA 21 min', status: 'On route', tone: 'ok' },
    { vehicle: 'MH44LS2210', site: 'Pokhari', mineral: 'Limestone', route: 'Pit E2 → WB-5 → P.crusher → S.crusher → Zone 50mm', eta: 'ETA 28 min', status: 'On route', tone: 'ok' },
  ];

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Fleet Tracking</div>
          <div className="module-subtitle">Dynamic vehicle routing, GPS geofencing, and wrong-zone alerts</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Active Trucks</span>
            <span className="kc-value">52/62</span>
            <span className="kc-delta up">84% utilisation</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Trips Today</span>
            <span className="kc-value">428 trips</span>
            <span className="kc-delta neutral">All 5 sites</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Route Deviations</span>
            <span className="kc-value">2 active</span>
            <span className="kc-delta down">Instant alerts fired</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Avg Cycle Time</span>
            <span className="kc-value">36 min</span>
            <span className="kc-delta down">+2 min vs target</span>
          </div>
        </div>

        {/* DYNAMIC ROUTING TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Dynamic Routing Engine</span>
            <button className="btn" onClick={() => window.sendPrompt('Optimise fleet routing across all 5 sites for next 2 hours')}>
              Optimise Routing
            </button>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Site</th>
                    <th>Mineral Load</th>
                    <th>AI Assigned Route</th>
                    <th>ETA WB</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {routingRows.map((row, idx) => (
                    <tr key={idx} onClick={() => window.sendPrompt(`Show current dispatch details for vehicle ${row.vehicle}`)}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{row.vehicle}</td>
                      <td>{row.site}</td>
                      <td>{row.mineral}</td>
                      <td style={{ fontWeight: row.tone === 'al' ? 'bold' : 'normal', color: row.tone === 'al' ? 'var(--text-danger)' : 'inherit' }}>
                        {row.route}
                      </td>
                      <td>{row.eta}</td>
                      <td><span className={`pill ${row.tone}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* OMC REQUIREMENTS COVERAGE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">GPS Geofencing and Fleet Optimisation Coverage</span>
          </div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <p><strong>GPS-based Geofencing:</strong> Fences are dynamically adjusted around active blasting boundaries. Vehicles entering restricted areas are flagged instantly.</p>
            <p style={{ marginTop: 4 }}><strong>Wrong Zone Prevention:</strong> When a chrome truck enters an iron stockpile lane (e.g. OD17), the terminal gate lock is engaged automatically to prevent expensive ore dilution.</p>
          </div>
        </div>

      </div>
    </>
  )
}
