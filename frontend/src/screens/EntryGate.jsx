export default function EntryGate() {
  const logRows = [
    { time: '07:42', site: 'Keonjhar', vehicle: 'OD09AB4421', person: 'Raju Kumar', type: 'Truck', anpr: 'ANPR Match', face: 'Face 97.4%', cond: 'Clear', status: 'In', tone: 'ok' },
    { time: '08:14', site: 'Sukinda', vehicle: 'Unknown', person: 'No match', type: 'Person', anpr: 'N/A', face: 'FAILED', cond: '—', status: 'Blocked', tone: 'al' },
    { time: '08:31', site: 'Koraput', vehicle: 'OD22MN3301', person: 'Suresh M.', type: 'Truck', anpr: 'Match', face: '94.1%', cond: 'Clear', status: 'In', tone: 'ok' },
    { time: '09:18', site: 'Keonjhar', vehicle: 'OD31AL7701', person: 'Deepak R.', type: 'Truck', anpr: 'Match', face: '96.8%', cond: 'Tyre flag', status: 'Hold', tone: 'wn' },
    { time: '09:44', site: 'Pokhari', vehicle: 'MH44LS2210', person: 'Vendor team', type: 'Contractor', anpr: 'Match', face: '91.2%', cond: 'Clear', status: 'Pass', tone: 'pr' },
  ];

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Entry Gate AI Vision</div>
          <div className="module-subtitle">ANPR, face verification, worker ID, and truck condition scans</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Entries Today</span>
            <span className="kc-value">214</span>
            <span className="kc-delta neutral">All 5 sites</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Alerts</span>
            <span className="kc-value">4 flags</span>
            <span className="kc-delta down">Action needed</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Pending at Gates</span>
            <span className="kc-value">3 trucks</span>
            <span className="kc-delta neutral">Awaiting scan</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Blacklist Checks</span>
            <span className="kc-value">214</span>
            <span className="kc-delta up">All clear</span>
          </div>
        </div>

        {/* LOG TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Entry &amp; Scan Log</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Site</th>
                    <th>Vehicle</th>
                    <th>Person</th>
                    <th>Type</th>
                    <th>ANPR Status</th>
                    <th>Face ID</th>
                    <th>Condition Scan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logRows.map((row, idx) => (
                    <tr key={idx} onClick={() => window.sendPrompt(`Analyze entry gate scan details for ${row.vehicle} ${row.person} at ${row.site}`)}>
                      <td>{row.time}</td>
                      <td>{row.site}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{row.vehicle}</td>
                      <td>{row.person}</td>
                      <td>{row.type}</td>
                      <td>{row.anpr}</td>
                      <td>{row.face}</td>
                      <td>{row.cond}</td>
                      <td><span className={`pill ${row.tone}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* OMC COVERAGE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">OMC Project Coverage &amp; Gates Compliance</span>
          </div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <div style={{ padding: 6, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>No Manual Override</strong>
                <p style={{ marginTop: 2 }}>Reduces manual intervention at gates by automatically triggering locks on scan mismatch.</p>
              </div>
              <div style={{ padding: 6, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>Tamper-Proof Records</strong>
                <p style={{ marginTop: 2 }}>Face ID + ANPR camera matching creates immutable logs written once to digital records.</p>
              </div>
              <div style={{ padding: 6, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>Security Guard Rails</strong>
                <p style={{ marginTop: 2 }}>Real-time database query checks national blacklist entries for high security compliance.</p>
              </div>
              <div style={{ padding: 6, background: 'var(--surface-0)', borderRadius: 4 }}>
                <strong>Condition Auditing</strong>
                <p style={{ marginTop: 2 }}>Thermal and vision scans examine vehicle tyres, emissions, and indicators before entry.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
