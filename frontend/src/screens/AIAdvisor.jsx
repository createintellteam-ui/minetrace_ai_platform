import { useState } from 'react'
import { Screen } from '../components/ui.jsx'
import { post } from '../lib/api.js'
const SUGGESTIONS = [
  'Why did pit yield drop vs crusher output?',
  'Which truck is losing the most material?',
  'Which stockyard zone has wrong-zone dumps?',
]
export default function AIAdvisor() {
  const [q, setQ] = useState('')
  const [log, setLog] = useState([])
  const [busy, setBusy] = useState(false)
  async function ask(text) {
    const question = (text ?? q).trim(); if (!question) return
    setBusy(true); setQ('')
    setLog(l => [...l, { role: 'user', text: question }])
    try {
      const r = await post('/api/ai/ask', { question })
      setLog(l => [...l, { role: 'ai', text: r.answer, stub: r.stub }])
    } catch (e) {
      setLog(l => [...l, { role: 'ai', text: 'Error: ' + e }])
    } finally { setBusy(false) }
  }
  return (
    <Screen title="AI advisor" subtitle="Natural-language questions over the mine data (demo mode)" state={{}}>
      <div className="card" style={{ minHeight: 320, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
          {log.length === 0 && (
            <div className="placeholder" style={{ padding: 20 }}>
              Ask about production, losses, grade or anomalies. Try:
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {SUGGESTIONS.map(sug => (
                  <button key={sug} onClick={() => ask(sug)}
                    style={{ fontSize: 12, padding: '6px 10px', border: '1px solid var(--border-strong)',
                      borderRadius: 6, background: 'var(--surface-0)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
          {log.map((m, i) => (
            <div key={i} style={{ margin: '8px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 10, maxWidth: '75%',
                background: m.role === 'user' ? 'var(--bg-accent)' : 'var(--surface-2)',
                color: 'var(--text-primary)', fontSize: 13 }}>
                {m.text}{m.stub && <span className="ms" style={{ display: 'block', marginTop: 4 }}>demo mode</span>}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask a question…"
            style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--border-strong)',
              borderRadius: 8, fontSize: 13 }} />
          <button onClick={() => ask()} disabled={busy}
            style={{ padding: '9px 18px', border: 'none', borderRadius: 8,
              background: 'var(--fill-accent)', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
            {busy ? '…' : 'Ask'}
          </button>
        </div>
      </div>
    </Screen>
  )
}
