import { useApi, Screen, Card } from '../components/ui.jsx'
export default function Compliance() {
  const s = useApi('/api/compliance')
  const d = s.data || {}
  const items = Object.entries(d)
  return (
    <Screen title="Compliance & regulatory" subtitle="IBM returns, royalty, DGMS and certificate deadlines" state={s}>
      <div className="grid2">
        {items.map(([key, val]) => (
          <Card key={key} title={key.replace(/_/g, ' ')}>
            <table><tbody>
              {Object.entries(val).map(([k, v]) => (
                <tr key={k}><td style={{ color: 'var(--text-muted)' }}>{k.replace(/_/g, ' ')}</td>
                  <td><b>{String(v)}</b></td></tr>
              ))}
            </tbody></table>
          </Card>
        ))}
      </div>
    </Screen>
  )
}
