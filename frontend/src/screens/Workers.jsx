export default function Workers() {
  const staffRows = [
    { name: 'Rajan P.', dept: 'Pit ops', site: 'Keonjhar', checkin: '06:12', loc: 'Pit A3', perf: 87, perfTone: 'success', cert: 'Valid', certTone: 'ok', status: 'On site', statusTone: 'ok' },
    { name: 'Arun D.', dept: 'Safety', site: 'Koraput', checkin: '—', loc: 'Off site', perf: 79, perfTone: 'accent', cert: 'EXPIRED', certTone: 'al', status: 'Leave', statusTone: 'wn' },
    { name: 'Priya S.', dept: 'Weighbridge', site: 'Keonjhar', checkin: '06:08', loc: 'WB-1', perf: 91, perfTone: 'success', cert: 'Valid', certTone: 'ok', status: 'On site', statusTone: 'ok' },
    { name: 'Vikram S.', dept: 'Blasting', site: 'Keonjhar', checkin: '06:30', loc: 'Pit A3', perf: 88, perfTone: 'success', cert: 'Shot firer', certTone: 'bl', status: 'On site', statusTone: 'ok' },
  ]

  const departments = [
    { name: 'Pit operations', count: 84 },
    { name: 'Fleet/dispatch', count: 56 },
    { name: 'Safety', count: 22 },
    { name: 'Weighbridge', count: 12 },
    { name: 'Compliance', count: 14 },
    { name: 'Management', count: 24 },
    { name: 'Maintenance', count: 32 },
    { name: 'Security', count: 18 },
    { name: 'Laboratory', count: 12 },
    { name: 'Administration', count: 66 },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Workers &amp; Staff</div>
          <div className="module-subtitle">Shift attendance logs, safety cert expirations, and productivity tracking</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">On Site Now</span>
            <span className="kc-value">284/340</span>
            <span className="kc-delta neutral">All 5 sites</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Attendance Rate</span>
            <span className="kc-value">96%</span>
            <span className="kc-delta up">Above target</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Certs Expiring</span>
            <span className="kc-value">14 certs</span>
            <span className="kc-delta down">Under 30 days left</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Avg Performance</span>
            <span className="kc-value">78 / 100</span>
            <span className="kc-delta down">Monitor shift gaps</span>
          </div>
        </div>

        {/* LOG AND DEPARTMENTS LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
          
          {/* Staff list */}
          <div className="panel">
            <div className="ph"><span className="pt">Shift Staff Directory</span></div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dept</th>
                      <th>Site</th>
                      <th>Check-in</th>
                      <th>Location</th>
                      <th>Performance</th>
                      <th>Safety Cert</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffRows.map((row, idx) => (
                      <tr key={idx} onClick={() => window.sendPrompt(`Show work profile and performance metrics for ${row.name}`)}>
                        <td style={{ fontWeight: '500' }}>{row.name}</td>
                        <td>{row.dept}</td>
                        <td>{row.site}</td>
                        <td>{row.checkin}</td>
                        <td>{row.loc}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div className="mineral-progress-bg" style={{ width: 50, margin: 0 }}>
                              <div className="mineral-progress-fill" style={{ width: `${row.perf}%`, background: `var(--fill-${row.perfTone})` }} />
                            </div>
                            <span>{row.perf}</span>
                          </div>
                        </td>
                        <td><span className={`pill ${row.certTone}`}>{row.cert}</span></td>
                        <td><span className={`pill ${row.statusTone}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Department stats */}
          <div className="panel">
            <div className="ph"><span className="pt">Staffing by Department</span></div>
            <div className="pbody" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {departments.map((dept, i) => (
                <div key={i} className="dept-row" style={{ padding: '3px 0' }}>
                  <span className="dept-name">{dept.name}</span>
                  <span className="dept-count" style={{ fontWeight: '600' }}>{dept.count} staff</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
