import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApi, Screen, Card } from '../components/ui.jsx'
export default function Predict() {
  const s = useApi('/api/predict/forecast')
  const d = s.data || {}
  const merged = [...(d.history || []).map(h => ({ day: String(h.day).slice(5), mined_mt: h.mined_mt })),
                  ...(d.forecast || []).map(f => ({ day: f.day, forecast_mt: f.mined_mt }))]
  return (
    <Screen title="Predictive analytics" subtitle="Production trend with a short forward forecast" state={s}>
      <Card title="Mined tonnage — history + forecast">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" fontSize={10} /><YAxis fontSize={11} /><Tooltip />
            <Line type="monotone" dataKey="mined_mt" stroke="var(--fill-accent)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="forecast_mt" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={true} />
          </LineChart>
        </ResponsiveContainer>
        <div className="ms" style={{ marginTop: 8 }}>Dashed line = naive forecast. Swap for Prophet/XGBoost later.</div>
      </Card>
    </Screen>
  )
}
