import { useApi, Screen, Kpi, Panel, DataTable, Pill } from '../components/ui.jsx'

export default function Admin() {
  const s = useApi('/api/workers')
  const d = s.data || {}
  // derive a small "users & roles" view from worker departments
  const roles = (d.by_dept || []).slice(0, 8).map(r => ({
    role: r.department,
    users: r.headcount,
    access: r.department === 'Management' ? 'Full' : r.department === 'Compliance and legal' ? 'Reports + audit' : 'Operational',
  }))
  return (
    <Screen title="Admin & settings" subtitle="Users, roles and platform configuration" state={s}>
      <div className="krow">
        <Kpi cls="b" lbl="Total users" val={d.total} />
        <Kpi cls="g" lbl="Roles" val={(d.by_dept || []).length} />
        <Kpi cls="a" lbl="Data profile" val="month" sub="30-day window" />
        <Kpi cls="p" lbl="Sites" val={3} sub="Keonjhar · Sukinda · Bonai" />
      </div>
      <div className="grid2">
        <Panel title="Users & roles">
          <DataTable rows={roles} columns={[
            { key: 'role', label: 'Role / department' },
            { key: 'users', label: 'Users' },
            { key: 'access', label: 'Access level',
              render: r => <Pill tone={r.access === 'Full' ? 'bl' : 'nt'}>{r.access}</Pill> },
          ]} />
        </Panel>
        <Panel title="Platform settings">
          <table className="tbl"><tbody>
            {[
              ['Theme', 'Fireblaze light'],
              ['Data source', 'DuckDB (local file)'],
              ['API base', 'http://localhost:8000'],
              ['AI advisor', 'Demo mode (connect Groq)'],
              ['Auth provider', 'Not configured'],
              ['Version', 'MineTrace AI 0.2'],
            ].map(([k, v]) => (
              <tr key={k}><td style={{ color: 'var(--text-muted)' }}>{k}</td><td className="tid">{v}</td></tr>
            ))}
          </tbody></table>
        </Panel>
      </div>
    </Screen>
  )
}
