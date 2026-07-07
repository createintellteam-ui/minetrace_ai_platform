import { useState, useEffect, useRef } from 'react'

const MODELS = [
  // Verified working July 2026. Backend auto-retries if a model is unavailable.
  { id: 'openrouter/free', label: '🔄 Free Router (auto-pick)', desc: 'Auto-selects best available — recommended' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: '🟣 NVIDIA Nemotron 120B', desc: '1M context · strong reasoning · working ✓' },
  { id: 'google/gemma-4-31b-it:free', label: '🟢 Google Gemma 4 31B', desc: 'High quality score · working ✓' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: '🟠 Meta LLaMA 3.3 70B', desc: 'Solid all-rounder · may vary' },
  { id: 'openai/gpt-oss-120b:free', label: '🔵 OpenAI GPT-OSS 120B', desc: 'Strong general purpose · may vary' },
  { id: 'deepseek/deepseek-r1:free', label: '🔷 DeepSeek R1', desc: 'Good reasoning · may vary' },
  { id: 'qwen/qwen3-30b-a3b:free', label: '🟡 Qwen3 30B', desc: 'Fast · reliable free tier' },
]

export default function AIAdvisor({ messages = [], setMessages }) {
  const [inp, setInp] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openrouter/free')
  const [showModelPicker, setShowModelPicker] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }, [messages])

  // Override sendPrompt to include selected model
  useEffect(() => {
    const originalSend = window.sendPrompt
    window.sendPromptWithModel = (text) => {
      setMessages(prev => [...prev, { role: 'user', text }])

      fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, model: selectedModel }),
      })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            text: data.answer || 'No response received.',
            model: data.model || selectedModel,
            stub: data.stub || false
          }])
        })
        .catch(err => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            text: `Connection error: ${err.message}. Make sure the backend is running.`
          }])
        })
    }
    return () => { delete window.sendPromptWithModel }
  }, [selectedModel, setMessages])

  const handleSend = () => {
    if (inp.trim()) {
      window.sendPromptWithModel(inp.trim())
      setInp('')
      inputRef.current?.focus()
    }
  }

  const handleChipClick = (prompt) => {
    window.sendPromptWithModel(prompt)
  }

  const currentModelInfo = MODELS.find(m => m.id === selectedModel) || MODELS[0]

  const chips = [
    { label: '📊 Production today', prompt: 'Show production details for all 5 sites' },
    { label: '⚠️ Crusher losses', prompt: 'Analyze crusher weight losses and recovery' },
    { label: '🔧 Failure prediction', prompt: 'Show machinery maintenance and failure predictions' },
    { label: '🚛 Truck OD09 anomaly', prompt: 'Investigate weight loss pattern for truck OD09AB4421' },
    { label: '🔴 Wrong-zone alerts', prompt: 'Report wrong zone safety alerts' },
    { label: '💰 Revenue leakage', prompt: 'Show revenue recovery plan for top leakage sources' },
    { label: '📋 IBM return status', prompt: 'Show IBM monthly return compliance status' },
    { label: '💎 Grade accuracy', prompt: 'Compare grade measurement accuracy across camera, eye, XRF and LIMS' },
  ]

  const hasConversation = messages.length > 1

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--fill-success)', boxShadow: '0 0 8px var(--fill-success)', display: 'inline-block' }} />
            AI Advisor
          </div>
          <div className="module-subtitle">Ask anything about production, fleet, grades, compliance or equipment across all 5 sites</div>
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 160px)',
        padding: '0 20px 20px',
      }}>

        {/* Model selector bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
              <path d="M12 6a6 6 0 0 1 6 6" />
            </svg>
            Model:
          </div>

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowModelPicker(!showModelPicker)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 8,
                border: '1px solid var(--border-strong)',
                background: 'var(--surface-1)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                color: 'var(--text-primary)',
                minWidth: 240,
              }}
            >
              <span>{currentModelInfo.label}</span>
              <svg style={{ width: 12, height: 12, marginLeft: 'auto', color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {showModelPicker && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4,
                width: 360, background: 'var(--surface-0)',
                border: '1px solid var(--border-strong)',
                borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                zIndex: 100, overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select AI Model (all free, no credit card)
                </div>
                {MODELS.map(m => (
                  <div key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                    style={{
                      padding: '10px 14px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: selectedModel === m.id ? 'var(--bg-accent)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={e => { if (selectedModel !== m.id) e.currentTarget.style.background = 'var(--surface-1)' }}
                    onMouseLeave={e => { if (selectedModel !== m.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.desc}</div>
                    </div>
                    {selectedModel === m.id && (
                      <svg style={{ width: 16, height: 16, color: 'var(--fill-accent)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat messages area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 0',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>

          {!hasConversation && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⛏️</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>MineOS AI Intelligence Advisor</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, maxWidth: 420 }}>
                  I can query live production data, detect anomalies, analyze grade contamination, predict equipment failures, and check compliance status across all 5 mine sites.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 520, width: '100%' }}>
                {chips.map((chip, idx) => (
                  <div key={idx} onClick={() => handleChipClick(chip.prompt)}
                    style={{
                      padding: '12px 14px', borderRadius: 10,
                      border: '1px solid var(--border)', background: 'var(--surface-1)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      color: 'var(--text-secondary)', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fill-accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    {chip.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasConversation && messages.map((m, i) => {
            if (i === 0) return null
            const isUser = m.role === 'user'
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '100%',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: 4,
                  color: isUser ? 'var(--text-accent)' : 'var(--fill-success)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {isUser ? (
                    <><svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> Operator</>
                  ) : (
                    <><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fill-success)', display: 'inline-block' }} /> MineOS AI</>
                  )}
                </div>
                <div style={{
                  maxWidth: isUser ? '70%' : '85%', padding: '12px 16px',
                  borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isUser ? 'var(--fill-accent)' : 'var(--surface-1)',
                  color: isUser ? '#fff' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.6,
                  border: isUser ? 'none' : '1px solid var(--border)',
                  whiteSpace: 'pre-wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {m.text}
                </div>
                {/* Show model used for AI responses */}
                {!isUser && m.model && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, fontStyle: 'italic' }}>
                    via {m.model}
                  </div>
                )}
              </div>
            )
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{
                padding: '10px 16px', borderRadius: '14px 14px 14px 4px',
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                display: 'flex', gap: 4, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)',
                    animation: `typingDot 1.4s infinite ease-in-out ${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {hasConversation && !isTyping && messages[messages.length - 1]?.role === 'assistant' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {chips.slice(0, 4).map((chip, idx) => (
                <span key={idx} onClick={() => handleChipClick(chip.prompt)}
                  className="quick-chip"
                  style={{ fontSize: 12, padding: '5px 10px', cursor: 'pointer' }}>
                  {chip.label}
                </span>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          display: 'flex', gap: 10, padding: '12px 0 0',
          borderTop: '1px solid var(--border)',
        }}>
          <input ref={inputRef} type="text"
            placeholder="Ask about production, trucks, grades, compliance, equipment..."
            value={inp} onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1, padding: '12px 16px', fontSize: 14,
              borderRadius: 12, border: '1.5px solid var(--border)',
              background: 'var(--surface-1)', color: 'var(--text-primary)',
              outline: 'none', transition: 'border-color 0.15s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--fill-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div onClick={handleSend}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: inp.trim() ? 'var(--fill-accent)' : 'var(--surface-2)',
              color: inp.trim() ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 14,
              cursor: inp.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s ease',
            }}>
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Send
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
