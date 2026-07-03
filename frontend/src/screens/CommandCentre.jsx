import { useState } from 'react'

export default function CommandCentre() {
  const [activeTab, setActiveTab] = useState('all')

  const handleTabClick = (siteName, tabId) => {
    setActiveTab(tabId)
    window.sendPrompt(`Show production details for ${siteName} site`)
  }

  return (
    <>
      {/* Module Header */}
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Command Centre</div>
          <div className="module-subtitle">Overview of all 5 sites at a glance</div>
        </div>
        <div className="module-tabs">
          <span className={`tab ${activeTab === 'all' ? 'on' : ''}`} onClick={() => setActiveTab('all')}>All sites</span>
          <span className={`tab ${activeTab === 'keonjhar' ? 'on' : ''}`} onClick={() => handleTabClick('Keonjhar', 'keonjhar')}>Keonjhar</span>
          <span className={`tab ${activeTab === 'sukinda' ? 'on' : ''}`} onClick={() => handleTabClick('Sukinda', 'sukinda')}>Sukinda</span>
          <span className={`tab ${activeTab === 'koraput' ? 'on' : ''}`} onClick={() => handleTabClick('Koraput', 'koraput')}>Koraput</span>
          <span className={`tab ${activeTab === 'kodingamali' ? 'on' : ''}`} onClick={() => handleTabClick('Kodingamali', 'kodingamali')}>Kodingamali</span>
          <span className={`tab ${activeTab === 'pokhari' ? 'on' : ''}`} onClick={() => handleTabClick('Pokhari', 'pokhari')}>Pokhari</span>
        </div>
      </div>

      {/* Module Body */}
      <div className="module-body">
        
        {/* ALERT STRIP */}
        <div className="astrip">
          <div className="alert-card danger" onClick={() => window.sendPrompt('Show weight loss details for OD09 in Keonjhar')}>
            <div className="alert-title">Weight loss · Keonjhar</div>
            <div className="alert-body">OD09 3.8T 5th trip</div>
          </div>
          <div className="alert-card danger" onClick={() => window.sendPrompt('Analyze wrong zone entry for truck OD17 in Sukinda')}>
            <div className="alert-title">Wrong zone · Sukinda</div>
            <div className="alert-body">OD17 chrome in Fe zone</div>
          </div>
          <div className="alert-card warning" onClick={() => window.sendPrompt('Show blast checklist for Keonjhar Pit A3')}>
            <div className="alert-title">Blast 38 min · Keonjhar</div>
            <div className="alert-body">Pit A3 checklist 4/6</div>
          </div>
          <div className="alert-card warning" onClick={() => window.sendPrompt('Show dust compliance levels at Sukinda')}>
            <div className="alert-title">Dust alert · Sukinda</div>
            <div className="alert-body">PM2.5 142 limit 150</div>
          </div>
        </div>

        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Total Production</span>
            <span className="kc-value">9,240 T</span>
            <span className="kc-delta neutral">All 5 sites · 88% target</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Active Fleet</span>
            <span className="kc-value">52/62</span>
            <span className="kc-delta up">84% utilisation</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Active Alerts</span>
            <span className="kc-value">6 flags</span>
            <span className="kc-delta down">2 critical</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Workers On Site</span>
            <span className="kc-value">284/340</span>
            <span className="kc-delta neutral">All 5 sites</span>
          </div>
        </div>

        {/* MINERAL STRIP */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Grade &amp; Quantity by Mineral</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {[
                { min: 'Fe (Iron)', site: 'Keonjhar', grade: '62.4%', qty: '3,840T', target: '91%', col: '#3B8BD4' },
                { min: 'Cr (Chrome)', site: 'Sukinda', grade: '51.2%', qty: '1,960T', target: '78%', col: '#7F77DD' },
                { min: 'Mn (Manganese)', site: 'Koraput', grade: '38.7%', qty: '1,440T', target: '88%', col: '#BA7517' },
                { min: 'Al (Bauxite)', site: 'Kodingamali', grade: '52.3%', qty: '1,200T', target: '92%', col: '#D85A30' },
                { min: 'Li (Limestone)', site: 'Pokhari', grade: '94.1%', qty: '800T', target: '89%', col: '#639922' },
              ].map((m, idx) => (
                <div key={idx} className="kc" style={{ borderTop: `2px solid ${m.col}`, cursor: 'pointer' }} onClick={() => window.sendPrompt(`Show detailed stats for ${m.min}`)}>
                  <span className="kc-label" style={{ color: m.col }}>{m.min}</span>
                  <div style={{ fontSize: 8, color: 'var(--text-secondary)' }}>{m.site}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.grade}</span>
                    <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-secondary)' }}>{m.qty}</span>
                  </div>
                  <div className="mineral-progress-bg">
                    <div className="mineral-progress-fill" style={{ width: m.target, background: m.col }} />
                  </div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>Target: {m.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SITE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {[
            { name: 'Keonjhar Fe', dist: 'Keonjhar Dist.', qty: '3,840T', target: '91%', pills: [['Crusher Active', 'bl'], ['Normal', 'ok']], query: 'Keonjhar Fe mine operations' },
            { name: 'Sukinda Cr', dist: 'Jajpur Dist.', qty: '1,960T', target: '78%', pills: [['DMS Active', 'pr'], ['EX-07 Down', 'al']], query: 'Sukinda Cr mine operations' },
            { name: 'Koraput Mn', dist: 'Koraput Dist.', qty: '1,440T', target: '88%', pills: [['Lt. Crush', 'wn'], ['Normal', 'ok']], query: 'Koraput Mn mine operations' },
            { name: 'Kodingamali Al', dist: 'Rayagada Dist.', qty: '1,200T', target: '92%', pills: [['No Crush', 'nt'], ['Normal', 'ok']], query: 'Kodingamali Al mine operations' },
            { name: 'Pokhari Li', dist: 'Sundargarh Dist.', qty: '800T', target: '89%', pills: [['2-Stage Crush', 'bl']], query: 'Pokhari Li mine operations' },
          ].map((site, i) => (
            <div key={i} className="panel" style={{ cursor: 'pointer' }} onClick={() => window.sendPrompt(`Show detailed site stats for ${site.query}`)}>
              <div className="ph" style={{ padding: '4px 8px' }}>
                <span className="pt" style={{ fontSize: 10 }}>{site.name}</span>
              </div>
              <div className="pbody" style={{ padding: 6, gap: 4 }}>
                <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{site.dist}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{site.qty}</span>
                  <span style={{ fontSize: 8, color: 'var(--text-success)' }}>{site.target}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
                  {site.pills.map((p, pIdx) => (
                    <span key={pIdx} className={`pill ${p[1]}`}>{p[0]}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FLEET MAP */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live Fleet &amp; Worker Map — All 5 Sites</span>
          </div>
          <div className="pbody">
            <div className="map-svg-container">
              <svg viewBox="0 0 500 180" style={{ width: '100%', height: 'auto', background: 'var(--surface-0)' }}>
                {/* Zone Borders */}
                {/* Keonjhar Fe */}
                <rect x="15" y="15" width="80" height="50" rx="4" fill="none" stroke="#3B8BD4" strokeWidth="1" strokeDasharray="3 2" />
                <text x="20" y="27" fontSize="7" fill="var(--text-muted)" fontWeight="600">ZONE A (FE)</text>
                
                {/* Sukinda Cr */}
                <rect x="110" y="15" width="80" height="50" rx="4" fill="none" stroke="#7F77DD" strokeWidth="1" strokeDasharray="3 2" />
                <text x="115" y="27" fontSize="7" fill="var(--text-muted)" fontWeight="600">ZONE B (CR)</text>

                {/* Koraput Mn */}
                <rect x="205" y="15" width="80" height="50" rx="4" fill="none" stroke="#BA7517" strokeWidth="1" strokeDasharray="3 2" />
                <text x="210" y="27" fontSize="7" fill="var(--text-muted)" fontWeight="600">ZONE C (MN)</text>

                {/* Kodingamali Al */}
                <rect x="300" y="15" width="80" height="50" rx="4" fill="none" stroke="#D85A30" strokeWidth="1" strokeDasharray="3 2" />
                <text x="305" y="27" fontSize="7" fill="var(--text-muted)" fontWeight="600">ZONE D (AL)</text>

                {/* Pokhari Li */}
                <rect x="395" y="15" width="80" height="50" rx="4" fill="none" stroke="#639922" strokeWidth="1" strokeDasharray="3 2" />
                <text x="400" y="27" fontSize="7" fill="var(--text-muted)" fontWeight="600">ZONE E (LI)</text>

                {/* Dispatch / Weighbridge Central Station */}
                <rect x="210" y="110" width="80" height="40" rx="4" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1" />
                <text x="215" y="122" fontSize="7" fill="var(--text-primary)" fontWeight="bold">DISPATCH / WB</text>
                
                {/* Haul Roads */}
                <line x1="55" y1="65" x2="210" y2="120" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="150" y1="65" x2="230" y2="110" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="245" y1="65" x2="245" y2="110" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="340" y1="65" x2="260" y2="110" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="435" y1="65" x2="280" y2="120" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Truck Pins & Markers */}
                {/* Fe (blue) */}
                <circle cx="35" cy="45" r="7" fill="#3B8BD4" stroke="#fff" strokeWidth="1" className="truck-pin" onClick={() => window.sendPrompt('Show truck status for OD09 Fe ore')} />
                <text x="35" y="47.5" fontSize="6" fill="#fff" fontWeight="bold" textAnchor="middle">FE</text>

                {/* Cr (purple) */}
                <circle cx="130" cy="45" r="7" fill="#7F77DD" stroke="#fff" strokeWidth="1" className="truck-pin" onClick={() => window.sendPrompt('Show truck status for OD12 Cr ore')} />
                <text x="130" y="47.5" fontSize="6" fill="#fff" fontWeight="bold" textAnchor="middle">CR</text>

                {/* Mn (brown) */}
                <circle cx="230" cy="45" r="7" fill="#BA7517" stroke="#fff" strokeWidth="1" className="truck-pin" onClick={() => window.sendPrompt('Show truck status for OD22 Mn ore')} />
                <text x="230" y="47.5" fontSize="6" fill="#fff" fontWeight="bold" textAnchor="middle">MN</text>

                {/* Al (orange) */}
                <circle cx="330" cy="45" r="7" fill="#D85A30" stroke="#fff" strokeWidth="1" className="truck-pin" onClick={() => window.sendPrompt('Show truck status for OD31 Al ore')} />
                <text x="330" y="47.5" fontSize="6" fill="#fff" fontWeight="bold" textAnchor="middle">AL</text>

                {/* Li (green) */}
                <circle cx="420" cy="45" r="7" fill="#639922" stroke="#fff" strokeWidth="1" className="truck-pin" onClick={() => window.sendPrompt('Show truck status for MH44 Li stone')} />
                <text x="420" y="47.5" fontSize="6" fill="#fff" fontWeight="bold" textAnchor="middle">LI</text>

                {/* Alert Pin (red blinking) */}
                <circle cx="75" cy="40" r="7" fill="#E24B4A" stroke="#fff" strokeWidth="1" className="truck-pin alert" onClick={() => window.sendPrompt('Analyze weight loss pattern for OD09')} />
                <text x="75" y="42.5" fontSize="5" fill="#fff" fontWeight="bold" textAnchor="middle">ERR</text>

                <circle cx="165" cy="35" r="7" fill="#E24B4A" stroke="#fff" strokeWidth="1" className="truck-pin alert" onClick={() => window.sendPrompt('Analyze wrong zone contamination risk for OD17')} />
                <text x="165" y="37.5" fontSize="5" fill="#fff" fontWeight="bold" textAnchor="middle">ZONE</text>

                {/* Empty truck (grey) */}
                <circle cx="230" cy="138" r="6" fill="#9ca3af" stroke="#fff" strokeWidth="1" />
                <text x="230" y="140" fontSize="5" fill="#fff" fontWeight="bold" textAnchor="middle">MT</text>
              </svg>
              
              <div className="map-legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: '#3B8BD4' }} />Iron (Fe)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#7F77DD' }} />Chrome (Cr)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#BA7517' }} />Manganese (Mn)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#D85A30' }} />Bauxite (Al)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#639922' }} />Limestone (CaCO3)</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#E24B4A' }} />Critical Alert</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: '#9ca3af' }} />Empty Return</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
