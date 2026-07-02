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
            {sec.items.map(it => (
              <div key={it.id} className={`ni ${active === it.id ? 'on' : ''}`}
                   onClick={() => setActive(it.id)}>
                <span>{it.label}</span>
                {it.badge && <span className={`nb ${it.badge === 'LIVE' ? 'w' : 'r'}`}>{it.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="appmain">
        <div className="topbar">
          <div className="mpill"><span className="ldot" /> All sites · live</div>
          <div className="tbr">
            <Clock />
            <div className="av">MT</div>
          </div>
        </div>
        <main className="content"><Screen /></main>
      </div>
    </div>
  )
}
