import { useApi, Panel, fmt } from '../components/ui.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Predict() {
  const { data, err, loading } = useApi('/api/predict/forecast')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Analytics Forecast...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading forecasts: {err}</div>
  }

  const history = data?.history || []
  const forecast = data?.forecast || []

  // Combine history and forecast for Recharts
  const chartData = [
    ...history.map(h => ({ name: h.day.slice(5), type: 'Historic', mined: h.mined_mt })),
    ...forecast.map(f => ({ name: f.day, type: 'Projected', mined: f.mined_mt }))
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Predictive Analytics</div>
          <div className="module-subtitle">Prophet ML forecasting, grade decline alerts, and what-if simulation models</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Fe 30-Day Forecast</span>
            <span className="kc-value">142,000 T</span>
            <span className="kc-delta up">+3% target</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Chrome Shortfall</span>
            <span className="kc-value">840 T</span>
            <span className="kc-delta down">EX-07 impact</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Fe Grade Trend</span>
            <span className="kc-value">62.1% Fe</span>
            <span className="kc-delta down">−0.3% this week</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Revenue Forecast</span>
            <span className="kc-value">₹6.8 Cr</span>
            <span className="kc-delta up">All 5 minerals</span>
          </div>
        </div>

        {/* WARNING BOX */}
        <div style={{ padding: 12, background: 'var(--bg-warning)', border: '0.5px solid var(--border-warning)', borderRadius: 'var(--radius)', color: 'var(--text-warning)', fontSize: 14, fontWeight: '500' }}>
          ⚠ <strong>AI Alert:</strong> Fe% declining 0.2%/shift. Likely cause: deeper bench, lower grade seam. Recommend blast hole sampling at Pit A3 bench 4.
        </div>

        {/* Prophet ML Forecast Chart */}
        <Panel title="Prophet ML Production Forecast (Historical vs. 3-Day Outlook)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={13} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={13} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip formatter={(v, n, p) => [`${fmt(v)} T`, `${p.payload.type} Production`]} />
              <Line type="monotone" dataKey="mined" stroke="var(--fill-accent)" strokeWidth={3} dot={true} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* WHAT-IF SCENARIOS */}
        <div className="panel">
          <div className="ph">
            <span className="pt">What-If Scenario Simulation: "EX-07 offline 3 more days at Sukinda"</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div style={{ padding: 10, background: 'var(--bg-danger)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-danger)', textTransform: 'uppercase', fontWeight: 600 }}>Chrome Loss</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-danger)', marginTop: 4 }}>840T</div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-warning)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-warning)', textTransform: 'uppercase', fontWeight: 600 }}>Revenue Impact</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-warning)', marginTop: 4 }}>₹33.6L</div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-accent)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-accent)', textTransform: 'uppercase', fontWeight: 600 }}>Recovery Option</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-accent)', marginTop: 4 }}>+3 Trucks</div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-success)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-success)', textTransform: 'uppercase', fontWeight: 600 }}>Recovery Possible</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-success)', marginTop: 4 }}>61%</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
