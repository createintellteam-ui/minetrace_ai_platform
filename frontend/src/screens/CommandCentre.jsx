import { useState } from 'react'
import { useApi } from '../components/ui.jsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const DOT_COLORS = {
  loaded: 'var(--fill-accent)', dispatched: 'var(--fill-success)',
  chrome: 'var(--fill-pro)', empty: 'var(--text-muted)',
  alert: 'var(--fill-danger)', worker: '#f59e0b',
}

export default function CommandCentre() {
  const { data, err, loading } = useApi('/api/command_centre')
  const [shift, setShift] = useState('Morning')

  if (err) return <div className="mb"><div className="placeholder">API error: {err}<br />Is the backend running on :8000?</div></div>
  if (loading) return <div className="mb"><div className="loading">Loading command centre…</div></div>

  const k = data.kpis
  return (
    <div className="cc-wrap">
      <div className="cc-main">
        <div className="mh">
          <div>
            <div className="mt">Command centre</div>
            <div className="ms">{data.shift}</div>
          </div>
          <div className="shift-tabs">
            {['Morning', 'Afternoon', 'Night'].map(s => (
              <span key={s} className={`shift-tab ${shift === s ? 'on' : ''}`}
                    onClick={() => setShift(s)}>{s}</span>
            ))}
          </div>
        </div>

        <div className="mb">
          {/* alert strip */}
          <div className="astrip">
            {data.alerts.map((a, i) => (
              <div key={i} className={`ac ${a.tone}`}>
                <div className="at">{a.title}</div>
                <div className="am">{a.text}</div>
              </div>
            ))}
          </div>

          {/* KPI cards */}
          <div className="krow">
            <Kpi cls="b" lbl="Total production" val={<>{fmt(k.total_production_t)}<span className="unit">T</span></>} sub={`${k.pct_target}% of shift target`} />
            <Kpi cls="g" lbl="Active trucks" val={<>{k.active_trucks}<span className="unit">/{k.total_trucks}</span></>} sub="fleet utilisation" />
            <Kpi cls="r" lbl="Discrepancies" val={<>{k.discrepancies}<span className="unit">flags</span></>} sub={`${k.discrepancies_critical} critical today`} />
            <Kpi cls="a" lbl="Workers on site" val={<>{k.workers_on_site}<span className="unit">/{k.workers_total}</span></>} sub="all 3 sites" />
          </div>

          {/* minerals row */}
          <div className="min-row">
            {data.minerals.map(m => (
              <div key={m.code} className="min-tile">
                <div className="min-code">{m.code}</div>
                <div className="min-name">{m.name}</div>
                <div className="min-grade">{m.grade}%</div>
              </div>
            ))}
          </div>

          {/* fleet + worker map */}
          <div className="panel">
            <div className="ph"><span className="pt">Live fleet &amp; worker map — all sites</span></div>
            <div className="pbody">
              <div className="map-grid">
                {data.map.map(site => (
                  <div key={site.site_id} className="map-site">
                    <div className="map-site-label">{site.name}</div>
                    {site.dots.map((d, i) => (
                      <span key={i} className="map-dot" title={d.id}
                            style={{ left: d.x + '%', top: d.y + '%', background: DOT_COLORS[d.status] }}>
                        <span className="map-dot-id">{d.id}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="map-legend">
                {Object.entries({ Loaded: 'loaded', Dispatched: 'dispatched', Chrome: 'chrome', Empty: 'empty', Alert: 'alert', Worker: 'worker' }).map(([lbl, st]) => (
                  <span key={st} className="legend-item"><span className="legend-dot" style={{ background: DOT_COLORS[st] }} />{lbl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right rail */}
      <aside className="cc-rail">
        <div className="rail-panel">
          <div className="rail-title">Compliance radar</div>
          {data.compliance_radar.map((r, i) => (
            <div key={i} className="radar-row">
              <div>
                <div className="radar-label">{r.label}</div>
                <div className="radar-sub">{r.sub}</div>
              </div>
              <span className="radar-tag">{r.tag}</span>
            </div>
          ))}
        </div>
        <div className="rail-panel">
          <div className="rail-title">AI advisor</div>
          <div className="ai-lead">Actions needed now:</div>
          <ol className="ai-list">
            {data.ai_actions.map((a, i) => <li key={i}>{a}</li>)}
          </ol>
        </div>
      </aside>
    </div>
  )
}

function Kpi({ cls, lbl, val, sub }) {
  return (
    <div className={`kc ${cls}`}>
      <div className="lbl">{lbl}</div>
      <div className="val">{val}</div>
      <div className="sub">{sub}</div>
    </div>
  )
}
const fmt = n => Number(n).toLocaleString('en-IN')
