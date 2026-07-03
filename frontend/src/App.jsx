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
import Admin from './screens/Admin.jsx'

// Check and apply theme preference
if (typeof document !== 'undefined') {
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'
}

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
  admin: Admin,
}

// Navigation sections grouped by dashboard
const DASHBOARD_1_NAV = [
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
    section: 'People',
    items: [
      { id: 'workers', label: 'Workers and Staff', icon: 'workers' },
      { id: 'mach', label: 'Machinery & Equipment', icon: 'mach', badge: '1', badgeType: 'r' },
    ]
  }
]

const DASHBOARD_2_NAV = [
  {
    section: 'Intelligence',
    items: [
      { id: 'ai', label: 'AI Advisor', icon: 'ai' },
      { id: 'predict', label: 'Predictive Analytics', icon: 'predict' },
      { id: 'anomaly', label: 'Anomaly Detection', icon: 'anomaly', badge: '2', badgeType: 'r' },
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
    section: 'Business',
    items: [
      { id: 'finance', label: 'Finance and Royalty', icon: 'finance' },
      { id: 'comply', label: 'Compliance & Regs', icon: 'comply', badge: '2', badgeType: 'r' },
      { id: 'admin', label: 'Admin and Settings', icon: 'admin' },
    ]
  }
]

// Simple SVG Icons map
const ICON_COMPONENTS = {
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
  admin: <svg className="ni-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
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
  const [activeDashboard, setActiveDashboard] = useState(1);
  const [activeModule, setActiveModule] = useState('cmd');
  const [aiInputValue, setAiInputValue] = useState('');
  const [theme, setTheme] = useState('light');
  
  // Custom dialog log for the AI advisor drill-down simulator
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'MineOS AI Advisor ready. Ask anything about live data across Keonjhar (Fe), Sukinda (Cr), Koraput (Mn), Kodingamali (Al), and Pokhari (Li).'
    }
  ]);

  // Hook global prompt sender
  useEffect(() => {
    window.sendPrompt = (text) => {
      // Intercept dashboard toggle prompts
      if (text.includes('Show Dashboard 2')) {
        setActiveDashboard(2);
        setActiveModule('ai');
        return;
      }
      if (text.includes('Show Dashboard 1')) {
        setActiveDashboard(1);
        setActiveModule('cmd');
        return;
      }

      // Record User Message
      setMessages(prev => [...prev, { role: 'user', text }]);
      setActiveModule('ai'); // Always switch to AI Advisor module to show the drilldown details!
      
      // Simulate clever AI intelligence based on the prompt
      let response = "Analyzing query. Here are the live mine insights:\n";
      const q = text.toLowerCase();
      
      if (q.includes('keonjhar') && (q.includes('production') || q.includes('grade') || q.includes('iron'))) {
        response = `[OMC DRILL-DOWN] Keonjhar (Fe) Iron Ore Operations:
        • ROM Production: 3,840T (91% of target)
        • Lab Grade (LIMS): 62.4% Fe Fe (High Grade)
        • AI Camera Accuracy: 94% vs LIMS grade checks
        • Crusher Output: Jaw crusher active at 1,240 T/hr
        • Weight reconciliation: -3% loss (-119T) reported at crusher discharge. Contamination risk: Low.`;
      } else if (q.includes('sukinda') || q.includes('chrome') || q.includes('dms')) {
        response = `[OMC DRILL-DOWN] Sukinda (Cr) Chrome Ore Operations:
        • ROM Production: 1,960T (78% of target)
        • DMS Grade Uplift: ROM 42% Cr₂O₃ concentrates successfully to 52% Cr₂O₃ grade.
        • Gangue Removal Loss: -38% weight reduction expected, value increased by +₹2,600/T.
        • Offline Asset alert: EX-07 Hitachi shovel is offline due to hydraulic cylinder fail (Health score: 12/100).`;
      } else if (q.includes('optimise') || q.includes('route') || q.includes('routing')) {
        response = `[OMC DYNAMIC ROUTING ENGINE] Optimizing routing across 5 sites:
        • Keonjhar: Queue at Weighbridge-1 heavy. Redirecting 4 dumpers to Weighbridge-2.
        • Sukinda: EX-07 offline. Re-routing spare dumpers OD12 and OD14 to stockpile haulage.
        • Geofence correction: Rerouting OD17 chrome truck back to correct Zone D, preventing Fe contamination at Stockyard Zone C.`;
      } else if (q.includes('dz-01') || q.includes('pressure') || q.includes('maintenance')) {
        response = `[PREDICTIVE MAINTENANCE REPORT] DZ-01 (Caterpillar D9T Crawler - Keonjhar):
        • Prognosis: Fuel rate anomalies and engine oil pressure drop (-18%). Failure predicted in 72-96 hrs.
        • Sensor data: Oil Temp 102°C, Vibration +23% over baseline.
        • Financial recommendation: Repair now (cost: ₹45,000) vs Ignore failure (breakdown loss: ₹4.04 Lakhs).`;
      } else if (q.includes('weight loss') || q.includes('od09') || q.includes('raju')) {
        response = `[ANOMALY SYSTEM ALERT] Driver Raju Kumar (OD09AB4421 - Keonjhar):
        • Pattern Flagged: 5 consecutive weight losses between Pit A3 and stockyard.
        • Tonnage lost: Average 3.8T loss per trip during 10:00–11:30 shift window.
        • Audit Status: OTP release required from mine manager. Manager override logged to system.`;
      } else if (q.includes('blast') || q.includes('checklist')) {
        response = `[OMC SAFETY CHECKS] Keonjhar Pit A3 Blast countdown:
        • Checklist status: 4/6 completed.
        • Clear: Workers evacuated (GPS checked), Security cordon established (300m), Village alert.
        • Pending: Shot firer physical check, explosives weight verification logs.`;
      } else if (q.includes('royalty') || q.includes('ibm') || q.includes('compliance')) {
        response = `[REGULATORY FILING TASK] OMC Compliance Status:
        • IBM Monthly Production Return: Due in 6 days (15 July 2026).
        • Royalty payment: Outstanding amount ₹84.2 Lakhs due in 8 days to Govt. of Odisha.
        • Digital Challans: 312 challans verified by sales weighbridge exit gate ANPR.`;
      } else if (q.includes('leakage') || q.includes('dilution') || q.includes('contamination')) {
        response = `[REVENUE INTELLIGENCE] Monthly Revenue Leakage analysis:
        • Total leakage: ₹1.84 Crores.
        • Key source: Grade dilution (46% - ₹84.2L) at Stockyard Zone C due to wrong-zone dumping.
        • Transit loss: ₹62.4L weight losses. Recoverable value: ₹62.6L.`;
      } else {
        response = `[AI OS RESPONSE] Received prompt: "${text}".
        Query verified across MineOS RAG indexes.
        Site-wide telemetry is active. All 5 minerals (Fe, Cr, Mn, Al, CaCO3) comply with SPCB environmental sensors. PM2.5 at 142µg/m³ (limit 150) at Keonjhar.`;
      }
      
      // Delay response slightly to feel natural
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      }, 750);
    };
  }, []);

  // Update theme helper
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  const handleAsk = () => {
    if (aiInputValue.trim()) {
      window.sendPrompt(aiInputValue.trim());
      setAiInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  // Nav list based on active dashboard
  const currentNav = activeDashboard === 1 ? DASHBOARD_1_NAV : DASHBOARD_2_NAV;

  return (
    <div className={`shell ${activeDashboard === 1 ? 'd1' : 'd2'}`}>
      
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-logo">
            <span className="brand-dot" />
            <span>MineOS</span>
          </div>
          <div className="company-pill">
            <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M5 21V7m14 14V7m-7 14v-8" />
            </svg>
            <span>OMC · Bharat Multi-Mineral</span>
          </div>
          <div className="live-indicator">
            <span className="live-dot" />
            <span>Live · 5 sites</span>
          </div>
        </div>

        <div className="topbar-right">
          {/* Dashboard Navigation Pill */}
          {activeDashboard === 1 ? (
            <div 
              className="dashboard-toggle-pill"
              onClick={() => window.sendPrompt('Show Dashboard 2 with Intelligence, Safety and Business modules')}
            >
              Operations and People → Intelligence and Business ↗
            </div>
          ) : (
            <div 
              className="dashboard-toggle-pill"
              onClick={() => window.sendPrompt('Show Dashboard 1 with Operations and People modules')}
            >
              ← Operations and People
            </div>
          )}

          {/* Theme switcher */}
          <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? (
              <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* IoT health status plug icon */}
          <button className="icon-button" title="IoT Network Health">
            <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
            </svg>
          </button>

          {/* Notification bell */}
          <div className="bell-icon-wrapper">
            <button className="icon-button" title="Notifications">
              <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <span className="bell-pip" />
          </div>

          <Clock />
          
          <div className="avatar-circle">OM</div>
        </div>
      </header>

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="sidebar">
        {currentNav.map((sec, idx) => (
          <div key={idx} className="nav-section">
            <div className="section-label">{sec.section}</div>
            {sec.items.map((it) => (
              <div
                key={it.id}
                className={`ni ${activeModule === it.id ? 'on' : ''}`}
                onClick={() => setActiveModule(it.id)}
              >
                <div className="ni-label-container">
                  {ICON_COMPONENTS[it.icon] || null}
                  <span>{it.label}</span>
                </div>
                {it.badge && (
                  <span className={`nb ${it.badgeType === 'r' ? 'r' : 'w'}`}>
                    {it.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </aside>

      {/* MIDDLE CONTENT AREA */}
      <main className="main-content">
        {Object.entries(SCREENS).map(([id, Component]) => (
          <div key={id} className={`module-container ${activeModule === id ? 'on' : ''}`}>
            <Component messages={messages} setMessages={setMessages} />
          </div>
        ))}
      </main>

      {/* RIGHT COLUMN (Operations dashboard 1 only) */}
      {activeDashboard === 1 && (
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
                { name: 'All 5 leases', sub: 'Valid to 2031', days: 'Valid', urgency: 'green', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
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
                      <span className="radar-sub">{item.sub}</span>
                    </div>
                  </div>
                  <span className={`radar-days ${item.urgency}`}>{item.days}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="ai-advisor-panel">
            <div className="ai-advisor-header">
              <span className="live-dot" />
              <span>AI Advisor · All 5 sites</span>
            </div>
            
            <div className="ai-insight-box">
              <strong>Priority actions now:</strong>
              <div style={{ marginTop: 3 }}>1. OD09 — 5 consecutive weight losses</div>
              <div>2. DZ-01 — 67% failure (repair: ₹45K)</div>
              <div>3. IBM return — due in 6 days</div>
              <div>4. Blast — Pit A3 check (4/6 ready)</div>
            </div>

            <div className="ai-quick-chips">
              {[
                { label: 'All sites production', prompt: 'Show production details for all 5 sites' },
                { label: 'Crusher losses', prompt: 'Analyze crusher weight losses and gangue removal' },
                { label: 'IBM return', prompt: 'Compile return data for IBM monthly production return' },
                { label: 'Grade risk', prompt: 'Report grade contamination and wrong zone alerts' },
                { label: 'Recovery plan', prompt: 'Show revenue recovery plan for night shift gaps' }
              ].map((chip, idx) => (
                <span 
                  key={idx} 
                  className="quick-chip"
                  onClick={() => window.sendPrompt(chip.prompt)}
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
              />
              <button className="ai-send-btn" onClick={handleAsk}>Send</button>
            </div>
          </div>
        </aside>
      )}

    </div>
  )
}
