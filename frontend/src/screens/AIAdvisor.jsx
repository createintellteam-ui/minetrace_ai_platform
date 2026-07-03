import { useState } from 'react'

export default function AIAdvisor({ messages = [], setMessages }) {
  const [inp, setInp] = useState('')

  const handleSend = () => {
    if (inp.trim()) {
      window.sendPrompt(inp.trim())
      setInp('')
    }
  }

  const chips = [
    'Total production today',
    'Crusher losses today',
    'Contamination risk',
    'Weight loss patterns',
    'IBM return data',
    'Failure prediction',
    'Royalty liability',
    'Blast checklist',
    'EC dust compliance',
    'Revenue recovery plan',
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">AI Advisor</div>
          <div className="module-subtitle">LLM-powered question answering across all 21 modules and 5 sites</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Queries Today</span>
            <span className="kc-value">284 queries</span>
            <span className="kc-delta neutral">OMC user active</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Avg Response</span>
            <span className="kc-value">1.8 sec</span>
            <span className="kc-delta up">Sub-2s standard</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Anomalies Flagged</span>
            <span className="kc-value">7 issues</span>
            <span className="kc-delta down">Actions required</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">RAG Documents</span>
            <span className="kc-value">1,240 docs</span>
            <span className="kc-delta neutral">SAP/LIMS/LMS sync</span>
          </div>
        </div>

        {/* LATEST INSIGHT PANEL */}
        <div className="panel" style={{ borderColor: 'var(--border-warning)' }}>
          <div className="ph" style={{ background: 'var(--bg-warning)', borderBottom: '0.5px solid var(--border-warning)' }}>
            <span className="pt" style={{ color: 'var(--text-warning)' }}>Latest Critical Mining Intelligence Insights</span>
          </div>
          <div className="pbody" style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--text-primary)' }}>
            "Critical at Sukinda: EX-07 offline reducing chrome output to 78%. OD17 wrong-zone entry risks grade contamination. Keonjhar: OD09 has 5 consecutive weight losses — driver Raju Kumar pattern flagged. DZ-01 at 67% failure probability — fix costs ₹45K vs ₹4.04L if ignored. IBM return due in 6 days."
          </div>
        </div>

        {/* CHIP SUGGESTIONS */}
        <div className="panel">
          <div className="ph"><span className="pt">Quick Suggested Queries</span></div>
          <div className="pbody">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {chips.map((chip, idx) => (
                <span 
                  key={idx} 
                  className="quick-chip" 
                  onClick={() => window.sendPrompt(chip)}
                  style={{ fontSize: 9, padding: '3px 8px' }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CHIP DIALOG CONVERSATION VIEW */}
        <div className="panel" style={{ flex: 1, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div className="ph"><span className="pt">MineOS Copilot Dialogue Terminal</span></div>
          <div className="pbody" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div className="chat-container">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  <span className="chat-role">{m.role}</span>
                  <span className="chat-text">{m.text}</span>
                </div>
              ))}
            </div>

            <div className="ai-input-row" style={{ marginTop: 10 }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ask anything about any site, mineral, module or operation..."
                value={inp}
                onChange={e => setInp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, fontSize: 10, padding: 6 }}
                id="aiq"
              />
              <button className="btn" onClick={handleSend} style={{ padding: '6px 16px' }}>Send Query</button>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
