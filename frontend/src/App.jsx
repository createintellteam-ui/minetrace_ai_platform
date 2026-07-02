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

// Apply saved theme before first render (default: light). No flash.
if (typeof document !== 'undefined') {
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'
}

const SCREENS = {
  cmd: CommandCentre, gate: EntryGate, pit: PitGrade, fleet: Fleet,
  weigh: Weighbridge, yard: Stockyard, dispatch: Dispatch,
  workers: Workers, mach: Machinery,
  ai: AIAdvisor, predict: Predict, anomaly: Anomaly, leak: Leakage,
  shift: Shift, maint: Maint,
  iot: Sensors, blast: Blasting, env: Environment,
  finance: Finance, comply: Compliance, docs: Documents, admin: Admin,
}

const NAV = [
  { section: 'Operations', items: [
    { id: 'cmd', label: 'Command centre' },
    { id: 'gate', label: 'Entry gate AI', badge: 'LIVE' },
    { id: 'pit', label: 'Pit & grade AI', badge: '3' },
    { id: 'fleet', label: 'Fleet tracking', badge: '1' },
    { id: 'weigh', label: 'Weighbridge' },
    { id: 'yard', label: 'Stockyard', badge: '2' },
    { id: 'dispatch', label: 'Dispatch & challan' },
  ]},
  { section: 'People & assets', items: [
    { id: 'workers', label: 'Workers & staff' },
    { id: 'mach', label: 'Machinery' },
  ]},
  { section: 'Intelligence', items: [
    { id: 'ai', label: 'AI advisor' },
    { id: 'predict', label: 'Predictive analytics' },
    { id: 'anomaly', label: 'Anomaly detection', badge: '7' },
    { id: 'leak', label: 'Revenue leakage' },
    { id: 'shift', label: 'Shift intelligence' },
    { id: 'maint', label: 'Predictive maint.' },
  ]},
  { section: 'Safety & environment', items: [
    { id: 'iot', label: 'Sensors & IoT' },
    { id: 'blast', label: 'Blasting', badge: '38m' },
    { id: 'env', label: 'Environment', badge: '2' },
  ]},
  { section: 'Business', items: [
    { id: 'finance', label: 'Finance & royalty' },
    { id: 'comply', label: 'Compliance', badge: '2' },
    { id: 'docs', label: 'Documents' },
    { id: 'admin', label: 'Admin & settings' },
  ]},
]

const ICONS = {
  cmd: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V18ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18" />
    </svg>
  ),
  gate: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  pit: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  ),
  fleet: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-9-9h12a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 16.5v-9A1.5 1.5 0 0 1 6 6.75Z" />
    </svg>
  ),
  weigh: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18 4 4m-4-4L8 7m4 13.25l4-4m-4 4-4-4" />
    </svg>
  ),
  yard: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>
  ),
  dispatch: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  ),
  workers: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  mach: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.831a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.83c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  ai: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8 14.187 8.813 9.096 9.813 14.187 14.904 15 9.813 15.904ZM18.25 5.25L17.5 9l-.75-3.75L13 4.5l3.75-.75.75-3.75.75 3.75 3.75.75-3.75.75ZM14.25 18l-.5 2.5-.5-2.5-2.5-.5 2.5-.5.5-2.5.5 2.5 2.5.5-2.5.5Z" />
    </svg>
  ),
  predict: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
  anomaly: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  leak: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  shift: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  maint: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.653 2.653 0 1 0 21 17.25l-5.83-5.83m0 0a2.95 2.95 0 1 1-4.17-4.17 2.95 2.95 0 0 1 4.17 4.17Zm0 0l-5.83 5.83m0 0l-3.75-3.75M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9Z" />
    </svg>
  ),
  iot: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856a9 9 0 0 1 13.788 0m-16.608-3.18a12.75 12.75 0 0 1 19.425 0M12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
  ),
  blast: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  ),
  env: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5M3 16.5a9 9 0 0 0 18 0M3 16.5c0-4.97 4.03-9 9-9s9 4.03 9 9m-9-9a9 9 0 0 0 9-9" />
    </svg>
  ),
  finance: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h13.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  comply: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25 3.75-5.25M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.75 3.75 0 0 1 21 12Z" />
    </svg>
  ),
  docs: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0A2.25 2.25 0 0 0 4.5 15h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0v.158c0 .873.342 1.71.95 2.317l.732.732c.607.607 1.444.95 2.317.95h11.238c.873 0 1.71-.343 2.317-.95l.732-.732c.608-.607.95-1.444.95-2.317V12.75M8.25 14.25h7.5" />
    </svg>
  ),
  admin: (className) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    (typeof document !== 'undefined' && document.documentElement.dataset.theme) || 'light')
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
    setTheme(next)
  }
  return (
    <button className="themebtn" onClick={toggle} title="Toggle light / dark">
      {theme === 'dark' ? '\u2600' : '\u263E'}
    </button>
  )
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const d = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <span className="clk">{d} · {t}</span>
}

export default function App() {
  const [active, setActive] = useState('cmd')
  const Screen = SCREENS[active] || CommandCentre
  return (
    <div className="shell">
      <nav className="nav">
        <div className="brand"><span className="bdot" /> MineTrace AI</div>
        {NAV.map(sec => (
          <div key={sec.section}>
            <div className="ns">{sec.section}</div>
            {sec.items.map(it => {
              const Icon = ICONS[it.id]
              return (
                <div key={it.id} className={`ni ${active === it.id ? 'on' : ''}`}
                     onClick={() => setActive(it.id)}>
                  <div className="ni-label-container">
                    {Icon ? Icon("ni-icon") : null}
                    <span>{it.label}</span>
                  </div>
                  {it.badge && <span className={`nb ${it.badge === 'LIVE' ? 'w' : 'r'}`}>{it.badge}</span>}
                </div>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="appmain">
        <div className="topbar">
          <div className="mpill"><span className="ldot" /> All sites · live</div>
          <div className="tbr">
            <ThemeToggle />
            <Clock />
            <div className="av">MT</div>
          </div>
        </div>
        <main className="content"><Screen /></main>
      </div>
    </div>
  )
}
