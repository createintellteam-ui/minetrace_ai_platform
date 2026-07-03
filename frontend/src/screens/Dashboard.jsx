import { useApi, Kpi, Panel, fmt } from '../components/ui.jsx'
import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

export default function Dashboard() {
  const kpiApi = useApi('/api/command_centre')
  const trendApi = useApi('/api/dashboard/trend')
  const financeApi = useApi('/api/finance')
  const leakApi = useApi('/api/leakage')
  const sensorApi = useApi('/api/sensors')

  const kpis = kpiApi.data?.kpis || {}
  const activeTrend = trendApi.data || []
  const finance = financeApi.data?.by_mineral || []
  const leakData = leakApi.data || {}
  const sensors = sensorApi.data?.by_type || []

  // Derived Values
  const totalProduction = kpis.total_production_t || 9240
  const activeFleet = kpis.active_trucks || 52
  const fleetUtil = Math.round((activeFleet / (kpis.total_trucks || 62)) * 100)
  const workersOnSite = kpis.workers_on_site || 284
  const alertsCount = kpis.discrepancies || 6
  const transportLoss = kpiApi.data?.kpis?.discrepancies_critical || 2
  
  // Custom Sparkline Data generator
  const getSparkData = (val) => [
    { v: val * 0.9 }, { v: val * 0.95 }, { v: val * 1.05 }, { v: val * 0.98 }, { v: val }
  ]

  // Render a tiny SVG sparkline
  const Sparkline = ({ val, color = '#2563eb' }) => {
    const data = getSparkData(val)
    return (
      <svg style={{ width: 80, height: 20 }} viewBox="0 0 100 30">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((d, i) => `${(i * 100) / 4},${30 - (d.v / val) * 20}`).join(' ')}
        />
      </svg>
    )
  }

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Dashboard</div>
          <div className="module-subtitle">Executive Command HUD · Real-time operational intelligence across 5 sites</div>
        </div>
      </div>

      <div className="module-body">
        {/* HERO KPI GRID */}
        <div className="kc-grid">
          {/* Card 1: Production Today */}
          <div className="kc accent">
            <div className="kc-label">Production Today</div>
            <div className="kc-value">{fmt(totalProduction)} T</div>
            <div className="kc-delta">
              <span className="kc-delta up">+{kpis.pct_target || 88}%</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>target</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={totalProduction} color="var(--fill-accent)" />
              </div>
            </div>
          </div>

          {/* Card 2: Fleet Utilisation */}
          <div className="kc success">
            <div className="kc-label">Fleet Utilisation</div>
            <div className="kc-value">{fleetUtil}%</div>
            <div className="kc-delta">
              <span className="kc-delta up">{activeFleet} active</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>/ {kpis.total_trucks || 62} total</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={fleetUtil} color="var(--fill-success)" />
              </div>
            </div>
          </div>

          {/* Card 3: Workers */}
          <div className="kc accent">
            <div className="kc-label">Workers On Site</div>
            <div className="kc-value">{workersOnSite}</div>
            <div className="kc-delta">
              <span className="kc-delta neutral">{Math.round((workersOnSite / (kpis.workers_total || 340)) * 100)}% rostered</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={workersOnSite} color="var(--fill-accent)" />
              </div>
            </div>
          </div>

          {/* Card 4: Alerts */}
          <div className="kc danger">
            <div className="kc-label">Active Alerts</div>
            <div className="kc-value">{alertsCount} flags</div>
            <div className="kc-delta">
              <span className="kc-delta down">{kpis.discrepancies_critical || 2} critical</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={alertsCount} color="var(--fill-danger)" />
              </div>
            </div>
          </div>

          {/* Card 5: Revenue */}
          <div className="kc success">
            <div className="kc-label">Estimated Revenue</div>
            <div className="kc-value">₹84.2 L</div>
            <div className="kc-delta">
              <span className="kc-delta up">+4.2%</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>vs forecast</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={84.2} color="var(--fill-success)" />
              </div>
            </div>
          </div>

          {/* Card 6: Ore Quality */}
          <div className="kc accent">
            <div className="kc-label">Ore Quality (Fe Avg)</div>
            <div className="kc-value">62.4%</div>
            <div className="kc-delta">
              <span className="kc-delta up">High Grade</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={62.4} color="var(--fill-accent)" />
              </div>
            </div>
          </div>

          {/* Card 7: Recovery % */}
          <div className="kc pro">
            <div className="kc-label">Recovery Rate</div>
            <div className="kc-value">81.4%</div>
            <div className="kc-delta">
              <span className="kc-delta neutral">DMS Plant active</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={81.4} color="var(--fill-pro)" />
              </div>
            </div>
          </div>

          {/* Card 8: Energy Consumption */}
          <div className="kc warning">
            <div className="kc-label">Power Load</div>
            <div className="kc-value">12.4 MW</div>
            <div className="kc-delta">
              <span className="kc-delta down">+2.1% peak</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={12.4} color="var(--fill-warning)" />
              </div>
            </div>
          </div>

          {/* Card 9: Fuel Consumption */}
          <div className="kc warning">
            <div className="kc-label">Fuel Level</div>
            <div className="kc-value">14.8 kL</div>
            <div className="kc-delta">
              <span className="kc-delta neutral">8,240 L used</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={14.8} color="var(--fill-warning)" />
              </div>
            </div>
          </div>

          {/* Card 10: Downtime */}
          <div className="kc danger">
            <div className="kc-label">Planned Downtime</div>
            <div className="kc-value">3.2 Hrs</div>
            <div className="kc-delta">
              <span className="kc-delta down">EX-07 offline</span>
              <div style={{ marginLeft: 'auto' }}>
                <Sparkline val={3.2} color="var(--fill-danger)" />
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS CONTAINER */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          {/* Chart 1: Production trend */}
          <Panel title="Production Trend (ROM Mined Tonnes)">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={activeTrend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="prodTrendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--fill-accent)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--fill-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={14} tick={{ fill: 'var(--text-muted)' }} tickFormatter={d => String(d).slice(5)} />
                <YAxis fontSize={14} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip formatter={v => fmt(v) + ' T'} />
                <Area type="monotone" dataKey="mined_mt" stroke="var(--fill-accent)" strokeWidth={3} fill="url(#prodTrendColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          {/* Chart 2: Revenue and Royalty by Mineral */}
          <Panel title="Revenue and Royalty (₹ Lakhs by Mineral)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={finance} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mineral_type" fontSize={14} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={14} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip formatter={v => '₹' + fmt(v) + ' L'} />
                <Bar dataKey="royalty_paid_lakhs" name="Royalty" fill="var(--fill-accent)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="sales_value_lakhs" name="Sales Revenue" fill="var(--fill-success)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* BOTTOM METRICS AND ENVIRONMENTAL DATA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Panel title="Environmental Compliance Monitoring">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sensors.slice(0, 3).map((s, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{s.sensor_type}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.site_id} · limit {s.ec_limit}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: s.exceedances > 0 ? 'var(--text-danger)' : 'var(--text-success)' }}>
                      {s.avg_value}
                    </div>
                    {s.exceedances > 0 && <span className="pill al" style={{ fontSize: 13, padding: '2px 6px' }}>Exceedance</span>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Revenue Leakage Analysis">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Total Mined:</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(leakData.waterfall?.pit_mt || 128540)} T</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Total Dispatched:</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{fmt(leakData.waterfall?.dispatch_mt || 94320)} T</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid var(--border)', paddingTop: 10 }}>
                <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Total Transit Loss:</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-danger)' }}>{fmt(leakData.lost_mt || 34220)} T</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Unaccounted Leak Loss:</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-danger)' }}>₹{fmt(Math.round((leakData.lost_value_inr || 113610400) / 100000))} L</span>
              </div>
            </div>
          </Panel>

          <Panel title="Operational Status Indicators">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, height: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--surface-2)', borderRadius: 'var(--radius)', flex: 1, minWidth: '40%' }}>
                <span className="live-dot" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Keonjhar Fe</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Crusher active</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--surface-2)', borderRadius: 'var(--radius)', flex: 1, minWidth: '40%' }}>
                <span className="live-dot" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Sukinda Cr</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>DMS plant live</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--surface-2)', borderRadius: 'var(--radius)', flex: 1, minWidth: '40%' }}>
                <span className="live-dot" style={{ backgroundColor: 'var(--fill-warning)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Koraput Mn</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Lt. Crush load</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--surface-2)', borderRadius: 'var(--radius)', flex: 1, minWidth: '40%' }}>
                <span className="live-dot" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Kodingamali Al</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Normal dispatch</div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
