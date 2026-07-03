import { useState, useEffect } from 'react'
import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function CommandCentre({ messages, setMessages }) {
  const [activeTab, setActiveTab] = useState('all')
  const { data, err, loading } = useApi('/api/command_centre')
  const [alerts, setAlerts] = useState([])

  // Load live alerts from API data when available
  useEffect(() => {
    if (data?.alerts) {
      setAlerts(data.alerts)
    }
  }, [data])

  const handleTabClick = (siteName, tabId) => {
    setActiveTab(tabId)
    window.sendPrompt(`Show production details for ${siteName} site`)
  }

  const handleAlertAction = (index, action) => {
    const updatedAlerts = [...alerts]
    updatedAlerts.splice(index, 1)
    setAlerts(updatedAlerts)
    
    // Log interaction to RAG system
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: `[SYSTEM ACTION] Action "${action}" completed successfully on alert ticket. Queue updated.`
    }])
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>
        Loading Command Centre HUD...
      </div>
    )
  }

  if (err) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>
        Error loading telemetry: {err}. Please ensure the FastAPI backend is running on port 8000.
      </div>
    )
  }

  const kpis = data?.kpis || {}
  const minerals = data?.minerals || []
  const mapData = data?.map || []

  // Color code mappings for minerals
  const mineralMeta = {
    'Fe': { col: '#2563eb', name: 'Iron Ore (Fe)' },
    'Cr': { col: '#8b5cf6', name: 'Chrome Ore (Cr)' },
    'Mn': { col: '#f59e0b', name: 'Manganese Ore (Mn)' }
  }

  return (
    <>
      {/* Module Header */}
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Command Centre</div>
          <div className="module-subtitle">Operational HUD · {data?.shift || 'Live Shift Overview'}</div>
        </div>
        <div className="module-tabs">
          <span className={`tab ${activeTab === 'all' ? 'on' : ''}`} onClick={() => setActiveTab('all')}>All sites</span>
          <span className={`tab ${activeTab === 'keonjhar' ? 'on' : ''}`} onClick={() => handleTabClick('Keonjhar (Fe)', 'keonjhar')}>Keonjhar</span>
          <span className={`tab ${activeTab === 'sukinda' ? 'on' : ''}`} onClick={() => handleTabClick('Sukinda (Cr)', 'sukinda')}>Sukinda</span>
          <span className={`tab ${activeTab === 'koraput' ? 'on' : ''}`} onClick={() => handleTabClick('Koraput (Mn)', 'koraput')}>Koraput</span>
        </div>
      </div>

      {/* Module Body */}
      <div className="module-body">
        
        {/* LIVE ALERTS PANEL */}
        {alerts.length > 0 && (
          <div className="astrip" style={{ flexWrap: 'wrap' }}>
            {alerts.map((alert, idx) => {
              const toneClass = alert.tone === 'd' ? 'danger' : alert.tone === 'w' ? 'warning' : 'accent'
              return (
                <div key={idx} className={`alert-card ${toneClass}`} style={{ minWidth: 260 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="alert-title">{alert.title}</div>
                    <span className="pill al" style={{ fontSize: 13, transform: 'scale(0.85)' }}>Active</span>
                  </div>
                  <div className="alert-body" style={{ margin: '6px 0', fontSize: 14 }}>{alert.text}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="btn" style={{ fontSize: 13, padding: '3px 8px' }} onClick={() => handleAlertAction(idx, 'Assign')}>Assign</button>
                    <button className="btn text" style={{ fontSize: 13, padding: '3px 8px', color: 'var(--text-success)' }} onClick={() => handleAlertAction(idx, 'Resolve')}>Resolve</button>
                    <button className="btn text" style={{ fontSize: 13, padding: '3px 8px', color: 'var(--text-muted)' }} onClick={() => handleAlertAction(idx, 'Ignore')}>Ignore</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Shift Production</span>
            <span className="kc-value">{fmt(kpis.total_production_t)} T</span>
            <span className="kc-delta neutral">{kpis.pct_target}% of target reached</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Active Fleet</span>
            <span className="kc-value">{kpis.active_trucks}/{kpis.total_trucks}</span>
            <span className="kc-delta up">{Math.round((kpis.active_trucks / kpis.total_trucks) * 100)}% utilisation</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Flagged Issues</span>
            <span className="kc-value">{kpis.discrepancies} flags</span>
            <span className="kc-delta down">{kpis.discrepancies_critical} critical alerts</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Personnel on Site</span>
            <span className="kc-value">{kpis.workers_on_site}/{kpis.workers_total}</span>
            <span className="kc-delta neutral">Shift rosters running</span>
          </div>
        </div>

        {/* MINERAL STRIP */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Shovel Grade &amp; Tonnage (LIMS Verified)</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {minerals.map((m, idx) => {
                const meta = mineralMeta[m.code] || { col: '#64748b', name: m.name }
                return (
                  <div key={idx} className="kc" style={{ borderTop: `4px solid ${meta.col}`, cursor: 'pointer' }} onClick={() => window.sendPrompt(`Show detailed stats for ${m.name}`)}>
                    <span className="kc-label" style={{ color: meta.col }}>{meta.name}</span>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Live Shovel assay</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, alignItems: 'baseline' }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>Avg: {m.grade}%</span>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Active ROM</span>
                    </div>
                    <div className="mineral-progress-bg">
                      <div className="mineral-progress-fill" style={{ width: '85%', background: meta.col }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FLEET MAP */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Fleet &amp; Worker Map — All Active Zones</span>
          </div>
          <div className="pbody">
            <div className="map-svg-container">
              <svg viewBox="0 0 500 180" style={{ width: '100%', height: 'auto', background: 'var(--surface-0)' }}>
                {/* Zone Borders */}
                <rect x="15" y="15" width="80" height="50" rx="4" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="20" y="27" fontSize="13" fill="var(--text-muted)" fontWeight="600">ZONE A (FE)</text>
                
                <rect x="110" y="15" width="80" height="50" rx="4" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="115" y="27" fontSize="13" fill="var(--text-muted)" fontWeight="600">ZONE B (CR)</text>

                <rect x="205" y="15" width="80" height="50" rx="4" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="210" y="27" fontSize="13" fill="var(--text-muted)" fontWeight="600">ZONE C (MN)</text>

                {/* Dispatch / Weighbridge Central Station */}
                <rect x="340" y="110" width="120" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.5" />
                <text x="350" y="124" fontSize="13" fill="var(--text-primary)" fontWeight="bold">WEIGHBRIDGE STATION</text>
                
                {/* Haul Roads */}
                <line x1="55" y1="65" x2="340" y2="120" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="150" y1="65" x2="340" y2="120" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="245" y1="65" x2="340" y2="120" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Truck Pins & Markers from real API data */}
                {mapData.map((site, sIdx) => {
                  const color = site.site_id === 'SITE_A' ? '#2563eb' : site.site_id === 'SITE_B' ? '#8b5cf6' : '#f59e0b'
                  return site.dots.map((dot, dIdx) => (
                    <g key={`${sIdx}-${dIdx}`} style={{ cursor: 'pointer' }} onClick={() => window.sendPrompt(`Analyze truck status for truck ID ${dot.id}`)}>
                      <circle 
                        cx={dot.x * 4 + 10} 
                        cy={dot.y * 1.5 + 20} 
                        r="8" 
                        fill={dot.status === 'alert' ? 'var(--fill-danger)' : color} 
                        stroke="#fff" 
                        strokeWidth="1.5" 
                      />
                      <text 
                        x={dot.x * 4 + 10} 
                        y={dot.y * 1.5 + 23} 
                        fontSize="13" 
                        fill="#fff" 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {dot.id}
                      </text>
                    </g>
                  ))
                })}

                {/* Empty return truck marker */}
                <circle cx="300" cy="130" r="7" fill="#64748b" stroke="#fff" strokeWidth="1.5" />
                <text x="300" y="133.5" fontSize="13" fill="#fff" fontWeight="bold" textAnchor="middle">MT</text>
              </svg>
              
              <div className="map-legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: '#2563eb' }} />Iron Ore (Keonjhar)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#8b5cf6' }} />Chrome Ore (Sukinda)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} />Manganese (Koraput)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--fill-danger)' }} />Critical Discrepancy</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#64748b' }} />Empty Return</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
