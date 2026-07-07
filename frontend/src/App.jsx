import { useState, useEffect } from 'react'
import CommandCentre from './screens/CommandCentre.jsx'
import EntryGate from './screens/EntryGate.jsx'
import PitGrade from './screens/PitGrade.jsx'
import Fleet from './screens/Fleet.jsx'
import Weighbridge from './screens/Weighbridge.jsx'
import Stockyard from './screens/Stockyard.jsx'
import Dispatch from './screens/Dispatch.jsx'
import Workers from './screens/Workers.jsx'
import Machinery from './screens/Machinery.jsx'
import AIAdvisor from './screens/AIAdvisor.jsx'
import Predict from './screens/Predict.jsx'
import Anomaly from './screens/Anomaly.jsx'
import Leakage from './screens/Leakage.jsx'
import Shift from './screens/Shift.jsx'
import Maint from './screens/Maint.jsx'
import Sensors from './screens/Sensors.jsx'
import Blasting from './screens/Blasting.jsx'
import Environment from './screens/Environment.jsx'
import Finance from './screens/Finance.jsx'
import Compliance from './screens/Compliance.jsx'
import Documents from './screens/Documents.jsx'
import Admin from './screens/Admin.jsx'

// Dynamic Screen Switcher mapping all 23 modules individually
const SCREENS = {
  cmd: CommandCentre,
  gate: EntryGate,
  pit: PitGrade,
  fleet: Fleet,
  weigh: Weighbridge,
  yard: Stockyard,
  dispatch: Dispatch,
  workers: Workers,
  mach: Machinery,
  ai: AIAdvisor,
  predict: Predict,
  anomaly: Anomaly,
  leak: Leakage,
  shift: Shift,
  maint: Maint,
  iot: Sensors,
  blast: Blasting,
  env: Environment,
  finance: Finance,
  comply: Compliance,
  docs: Documents,
  admin: Admin,
}

// 23 Standalone Navigation Items grouped under clean categories
const SIDEBAR_NAV = [
  {
    section: 'Operations',
    items: [
      { id: 'cmd', label: 'Command Centre', icon: 'cmd' },
      { id: 'gate', label: 'Entry Gate AI Vision', icon: 'gate', badge: 'LIVE', badgeType: 'w' },
      { id: 'pit', label: 'Pit and Grade AI', icon: 'pit', badge: '3', badgeType: 'w' },
      { id: 'fleet', label: 'Fleet Tracking', icon: 'fleet', badge: '1', badgeType: 'r' },
      { id: 'weigh', label: 'Weighbridge & Recon', icon: 'weigh' },
      { id: 'yard', label: 'Stockyard Management', icon: 'yard', badge: '2', badgeType: 'w' },
      { id: 'dispatch', label: 'Dispatch and Challan', icon: 'dispatch' },
    ]
  },
  {
    section: 'People & Assets',
    items: [
      { id: 'workers', label: 'Workers and Staff', icon: 'workers' },
      { id: 'mach', label: 'Machinery & Equipment', icon: 'mach', badge: '1', badgeType: 'r' },
    ]
  },
  {
    section: 'Intelligence',
    items: [
      { id: 'ai', label: 'AI Advisor', icon: 'ai' },
      { id: 'predict', label: 'Predictive Analytics', icon: 'predict' },
      { id: 'anomaly', label: 'Anomaly Detection', icon: 'anomaly', badge: '7', badgeType: 'r' },
      { id: 'leak', label: 'Revenue Leakage', icon: 'leak' },
      { id: 'shift', label: 'Shift Intelligence', icon: 'shift' },
      { id: 'maint', label: 'Predictive Maint.', icon: 'maint', badge: '3', badgeType: 'w' },
    ]
  },
  {
    section: 'Safety & Environment',
    items: [
      { id: 'iot', label: 'Sensors and IoT', icon: 'iot' },
      { id: 'blast', label: 'Blasting Management', icon: 'blast', badge: '38m', badgeType: 'w' },
      { id: 'env', label: 'Environment Monitor', icon: 'env', badge: '2', badgeType: 'w' },
    ]
  },
  {
    section: 'Business & Settings',
    items: [
      { id: 'finance', label: 'Finance and Royalty', icon: 'finance' },
      { id: 'comply', label: 'Compliance & Regs', icon: 'comply', badge: '2', badgeType: 'r' },
      { id: 'docs', label: 'Documents', icon: 'reports' },
      { id: 'admin', label: 'Admin and Settings', icon: 'settings' },
    ]
  }
]

// Lucide SVG Icons Map
const ICON_COMPONENTS = {
  dashboard: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  cmd: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V18ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18" /></svg>,
  gate: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  pit: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18M12 3l4 4M12 3L8 7M12 21l4-4M12 21l-4-4" /></svg>,
  fleet: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-9-9h12a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 16.5v-9A1.5 1.5 0 0 1 6 6.75Z" /></svg>,
  weigh: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 18h18M12 3v18" /></svg>,
  yard: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4V4zm4 0v16m8-16v16" /></svg>,
  dispatch: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>,
  workers: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  mach: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  ai: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  predict: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18" /></svg>,
  anomaly: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>,
  leak: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  shift: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  maint: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91Z" /></svg>,
  iot: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /></svg>,
  blast: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M2 12h20" /></svg>,
  env: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12M12 6a6 6 0 0 1 6 6" /></svg>,
  finance: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 10v4M8 12h8" /></svg>,
  comply: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>,
  reports: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  settings: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
}

function Clock() {
  const [timeStr, setTimeStr] = useState('')
  useEffect(() => {
    const updateTime = () => {
      const n = new Date();
      const d = n.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const t = n.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setTimeStr(`${d} · ${t}`);
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="clock" id="clk">{timeStr}</span>
}

export default function App() {
  const [activeModule, setActiveModule] = useState('cmd')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiInputValue, setAiInputValue] = useState('')
  const [theme, setTheme] = useState('light')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMine, setActiveMine] = useState('ALL')
  const [showNotifications, setShowNotifications] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'MineOS AI Intelligence Advisor ready. Ask anything about production, geofencing discrepancies, or equipment prognoses.'
    }
  ])

  useEffect(() => {
    window.sendPrompt = (text) => {
      setMessages(prev => [...prev, { role: 'user', text }])
      setActiveModule('ai')
      
      // Call the real backend AI endpoint
      fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            text: data.answer || 'No response received.',
            model: data.model || null,
            stub: data.stub || false
          }])
        })
        .catch(err => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            text: `Connection error: ${err.message}. Make sure the backend is running on port 8000.` 
          }])
        })
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  const handleAsk = () => {
    if (aiInputValue.trim()) {
      window.sendPrompt(aiInputValue.trim())
      setAiInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAsk()
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const CurrentScreen = SCREENS[activeModule] || CommandCentre

  return (
    <div className="shell d1" style={{ gridTemplateColumns: sidebarCollapsed ? '56px 1fr 300px' : '240px 1fr 300px' }}>
      {/* TOP NAVBAR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-logo">
            <span className="brand-dot" />
            <span>MineOS</span>
          </div>

          {/* Mine Selector Dropdown */}
          <div className="company-pill" style={{ position: 'relative', cursor: 'pointer' }}>
            <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M5 21V7m14 14V7m-7 14v-8" />
            </svg>
            <select 
              value={activeMine} 
              onChange={e => {
                setActiveMine(e.target.value)
                window.sendPrompt(`Display stats for ${e.target.value === 'ALL' ? 'all 5 sites' : e.target.value}`)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                marginLeft: 4
              }}
            >
              <option value="ALL">All Mines (Fe/Cr/Mn/Al/Li)</option>
              <option value="KEONJHAR">Keonjhar (Iron Ore)</option>
              <option value="SUKINDA">Sukinda (Chrome Ore)</option>
              <option value="KORAPUT">Koraput (Manganese)</option>
              <option value="KODINGAMALI">Kodingamali (Bauxite)</option>
              <option value="POKHARI">Pokhari (Limestone)</option>
            </select>
          </div>

          <div className="live-indicator">
            <span className="live-dot" />
            <span>Live · Telemetry Connected</span>
          </div>
        </div>

        {/* Global Search & System Controls */}
        <div className="topbar-right">
          {/* Global Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search platform modules..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: 200,
                fontSize: 14,
                padding: '4px 8px 4px 28px',
                borderRadius: 8,
                border: '0.5px solid var(--border)',
                background: 'var(--surface-0)'
              }}
            />
            <svg style={{ width: 12, height: 12, position: 'absolute', left: 8, color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          {/* Theme switcher */}
          <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? (
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Notification bell and drawer */}
          <div className="bell-icon-wrapper" style={{ position: 'relative' }}>
            <button className="icon-button" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
              <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <span className="bell-pip" />
            
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: 40,
                right: 0,
                width: 280,
                background: 'var(--surface-1)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 100,
                padding: 12
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, borderBottom: '0.5px solid var(--border)', paddingBottom: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Unread Notifications</span>
                  <span className="pill al" style={{ fontSize: 13, padding: '1px 6px' }}>3 New</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, borderBottom: '0.5px solid var(--border)', paddingBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-danger)' }}>Weight loss alert</span>
                    <p style={{ color: 'var(--text-secondary)' }}>OD09 reported -3.8T loss at Keonjhar</p>
                  </div>
                  <div style={{ fontSize: 13, borderBottom: '0.5px solid var(--border)', paddingBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-warning)' }}>Wrong Zone Entry</span>
                    <p style={{ color: 'var(--text-secondary)' }}>OD17 entered Zone C (Cr contamination)</p>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-accent)' }}>Compliance compilation</span>
                    <p style={{ color: 'var(--text-secondary)' }}>IBM production returns due in 6 days</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Clock />
          <div className="avatar-circle">OM</div>
        </div>
      </header>

      {/* LEFT PERSISTENT SIDEBAR — with collapse toggle */}
      <aside className="sidebar" style={{
        maxHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: sidebarCollapsed ? 56 : 240,
        minWidth: sidebarCollapsed ? 56 : 240,
        transition: 'width 0.25s ease, min-width 0.25s ease',
        position: 'relative'
      }}>
        {/* Collapse toggle button */}
        <div
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute', top: 14, right: -1, zIndex: 50,
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--surface-2)', border: '1.5px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ width: 12, height: 12, transition: 'transform 0.25s ease',
              transform: sidebarCollapsed ? 'rotate(180deg)' : 'none' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        {SIDEBAR_NAV.map((sec, secIdx) => {
          // Filter section items based on search query
          const filteredItems = sec.items.filter(it => 
            it.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
          if (filteredItems.length === 0) return null

          return (
            <div key={secIdx} className="nav-section">
              {!sidebarCollapsed && <div className="section-label">{sec.section}</div>}
              {filteredItems.map((it) => (
                <div
                  key={it.id}
                  className={`ni ${activeModule === it.id ? 'on' : ''}`}
                  onClick={() => setActiveModule(it.id)}
                  style={sidebarCollapsed ? { padding: '10px 0', justifyContent: 'center' } : undefined}
                >
                  <div className="ni-label-container" style={sidebarCollapsed ? { justifyContent: 'center', gap: 0 } : undefined}>
                    <span style={sidebarCollapsed ? { width: 20, height: 20 } : undefined}>
                      {ICON_COMPONENTS[it.icon] || null}
                    </span>
                    {!sidebarCollapsed && <span>{it.label}</span>}
                  </div>
                  {!sidebarCollapsed && it.badge && (
                    <span className={`nb ${it.badgeType === 'r' ? 'r' : 'w'}`}>
                      {it.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </aside>

      {/* MAIN SCREEN INTERACTION ZONE */}
      <main className="main-content">
        <div className="module-container on">
          <CurrentScreen messages={messages} setMessages={setMessages} />
        </div>
      </main>

      {/* RIGHT PANEL: AI INTEL ADVISOR DRAWER */}
      <aside className="right-sidebar">
        <div>
          <div className="right-section-title">Compliance Radar</div>
          <div className="radar-list">
            {[
              { name: 'IBM return', sub: '6 days remaining', days: '6d', urgency: 'red', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
              { name: 'Royalty ₹84.2L', sub: 'Odisha Govt', days: '8d', urgency: 'red', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
              { name: '8 truck certs', sub: 'Fitness expiring', days: '11d', urgency: 'amber', icon: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v10h1' },
              { name: '14 worker certs', sub: 'Safety refresh', days: '30d', urgency: 'amber', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
              { name: 'EC monitoring', sub: 'Submitted Jun 30', days: 'Done', urgency: 'green', icon: 'M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="radar-item"
                onClick={() => window.sendPrompt(`Show compliance status for ${item.name}`)}
              >
                <div className="radar-item-left">
                  <div className={`radar-icon-box ${item.urgency}`}>
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div className="radar-info">
                    <span className="radar-name">{item.name}</span>
                    <span className="radar-sub" style={{ fontSize: 13 }}>{item.sub}</span>
                  </div>
                </div>
                <span className={`radar-days ${item.urgency}`} style={{ fontSize: 13 }}>{item.days}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Advisor Panel */}
        <div className="ai-advisor-panel" style={{ marginTop: 'auto' }}>
          <div className="ai-advisor-header">
            <span className="live-dot" />
            <span>AI Advisor · Active</span>
          </div>
          
          <div className="ai-insight-box">
            <strong>System Alerts:</strong>
            <div style={{ marginTop: 4, fontSize: 14 }}>1. OD09 — -3.8T weight loss at crusher</div>
            <div style={{ fontSize: 14 }}>2. DZ-01 — Crawler fail prognosis (67%)</div>
            <div style={{ fontSize: 14 }}>3. Sukinda — Chrome dilution risk</div>
          </div>

          <div className="ai-quick-chips">
            {[
              { label: 'All production', prompt: 'Show production details for all 5 sites' },
              { label: 'Crusher losses', prompt: 'Analyze crusher weight losses and recovery' },
              { label: 'Failure predict', prompt: 'Show machinery maintenance and failure predictions' },
              { label: 'Wrong-zone alert', prompt: 'Report wrong zone safety alerts' }
            ].map((chip, idx) => (
              <span 
                key={idx} 
                className="quick-chip"
                onClick={() => window.sendPrompt(chip.prompt)}
                style={{ fontSize: 13 }}
              >
                {chip.label}
              </span>
            ))}
          </div>

          <div className="ai-input-row">
            <input
              type="text"
              className="input-field ai-input"
              placeholder="Ask operations..."
              value={aiInputValue}
              onChange={e => setAiInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              id="aiq2"
              style={{ fontSize: 14 }}
            />
            <button className="ai-send-btn" onClick={handleAsk} style={{ fontSize: 14 }}>Send</button>
          </div>
        </div>
      </aside>
    </div>
  )
}

