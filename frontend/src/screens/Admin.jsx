export default function Admin() {
  const roleRows = [
    { role: 'Super admin', access: 'Platform all', modules: 'All 21 modules + billing', users: 'Bizzfincom team' },
    { role: 'OMC/org. admin', access: 'All sites', modules: 'All modules own mines', users: 'Mine CMD' },
    { role: 'Mine manager', access: 'Full site', modules: 'All modules assigned site', users: '5 managers' },
    { role: 'Shift manager', access: 'Operational', modules: 'Command Pit Fleet WB Workers', users: '15/shift' },
    { role: 'Dispatch officer', access: 'Limited', modules: 'Dispatch Stockyard Gate', users: '10 total' },
    { role: 'Safety officer', access: 'Safety only', modules: 'Blasting Env Compliance Workers', users: '22 total' },
    { role: 'Govt. viewer', access: 'Read only', modules: 'Compliance + Production only', users: 'IBM DGMS officials' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Admin &amp; Settings</div>
          <div className="module-subtitle">Role-based access controls, multi-site user provisioning and tamper-proof audit trails</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Active Users</span>
            <span className="kc-value">48 users</span>
            <span className="kc-delta up">All 5 sites active</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Sites Managed</span>
            <span className="kc-value">5 sites</span>
            <span className="kc-delta up">All OMC aligned</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Role Types</span>
            <span className="kc-value">9 roles</span>
            <span className="kc-delta neutral">Configured</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Audit Events Today</span>
            <span className="kc-value" style={{ color: 'var(--text-danger)' }}>2,840 events</span>
            <span className="kc-delta down" style={{ color: 'var(--text-danger)' }}>Tamper-proof ledger</span>
          </div>
        </div>

        {/* ROLE ACCESS TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Role-Based Access Control (RBAC) Settings</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Access Scope</th>
                    <th>Available Modules</th>
                    <th>Assigned Users</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRows.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => window.sendPrompt(`Show audit log of role overrides and settings for ${row.role}`)}
                      style={{ background: row.role.includes('Govt') ? 'var(--bg-accent)' : 'inherit' }}
                    >
                      <td style={{ fontWeight: '500', color: row.role.includes('Govt') ? 'var(--text-accent)' : 'inherit' }}>{row.role}</td>
                      <td>{row.access}</td>
                      <td>{row.modules}</td>
                      <td>{row.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AUDIT COMPLIANCE STATEMENT */}
        <div className="panel">
          <div className="ph"><span className="pt">Regulatory Transparency Commitment</span></div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <p><strong>Government Viewer Role:</strong> By configuring read-only profiles for IBM and DGMS auditors, MineOS establishes an auditable digital footprint of production figures, environmental parameters, and safety metrics, satisfying public project transparency tenders.</p>
          </div>
        </div>

      </div>
    </>
  )
}
