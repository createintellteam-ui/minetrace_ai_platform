import { useState } from 'react'
import { useApi, Panel } from '../components/ui.jsx'

export default function PitGrade() {
  const [activeSite, setActiveSite] = useState('sukinda')
  const { data, err, loading } = useApi('/api/pit/grade')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Pit &amp; Grade HUD...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading grade: {err}</div>
  }

  const samples = data?.sample || []

  // Define site config matching the screenshots and user parameters
  const siteConfig = {
    keonjhar: {
      title: 'Keonjhar — Iron ore process flow (crushing + screening)',
      activePits: '4/4',
      cameraAcc: '94%',
      centerMetricLabel: 'FE GRADE AVERAGE',
      centerMetricVal: '62.4%',
      centerMetricSub: 'High-grade Fe',
      mismatches: '0',
      flow: [
        { title: 'Pit face', desc: 'Camera scan', val: 'Fe 62.4%', icon: '⛏', col: '#818cf8' },
        { title: 'Production WB', desc: 'ROM weight', val: '52.0T recorded', icon: '⚖', col: '#818cf8' },
        { title: 'Primary crusher', desc: 'ROM → 40mm', val: '−3% weight loss', icon: '⚙', col: '#f59e0b' },
        { title: 'Sizing screen', desc: 'Fine/lump split', val: 'Grade steady', icon: '⛃', col: '#8b5cf6' },
        { title: 'Grade yard', desc: 'Fe 62%+ stack', val: 'Dilution checked', icon: '📦', col: '#8b5cf6' },
        { title: 'Dispatch', desc: 'XRF check', val: 'JSW Steel · SAIL', icon: '🚛', col: '#10b981' }
      ],
      chart: [
        { label: 'Pit ROM', val: '3,942T', rawVal: 3942, heightPct: 98, col: '#818cf8' },
        { label: 'Production WB', val: '3,921T', rawVal: 3921, heightPct: 96, col: '#818cf8' },
        { label: 'After crusher', val: '3,823T', rawVal: 3823, heightPct: 88, col: '#f59e0b' },
        { label: 'Stockyard', val: '3,810T', rawVal: 3810, heightPct: 87, col: '#8b5cf6' },
        { label: 'Dispatched', val: '3,795T', rawVal: 3795, heightPct: 86, col: '#10b981' }
      ],
      summaryHtml: (
        <span>
          Weight loss: <span style={{ color: 'var(--text-danger)' }}>−147T (3.7%)</span> · 
          Grade: <span style={{ color: 'var(--text-success)' }}>Fe 62.4% steady</span> · 
          Quality: <span style={{ color: 'var(--text-success)' }}>Lump/Fines check passed</span>
        </span>
      ),
      noteText: 'Statutory limits shown where applicable',
      rightNoteText: 'Standard weight deviation (within 4%)'
    },
    sukinda: {
      title: 'Sukinda — Chrome ore process flow (crusher + DMS beneficiation)',
      activePits: '3/5',
      cameraAcc: '91%',
      centerMetricLabel: 'DMS PLANT GRADE',
      centerMetricVal: '+9.4%',
      centerMetricSub: 'Grade uplift',
      mismatches: '3',
      flow: [
        { title: 'Pit face', desc: 'Camera scan', val: 'Cr2O3 42.8%', icon: '⛏', col: '#818cf8' },
        { title: 'Production WB', desc: 'ROM weight', val: '51.7T recorded', icon: '⚖', col: '#818cf8' },
        { title: 'Primary crusher', desc: 'ROM → 30mm', val: '−5% weight', icon: '⚙', col: '#f59e0b' },
        { title: 'DMS plant', desc: 'Grade: 42→52%', val: '−38% wt loss', icon: '⚗', col: '#ef4444' },
        { title: 'Concentrate yard', desc: 'Cr2O3 52%+', val: 'Grade improved', icon: '📦', col: '#818cf8' },
        { title: 'Dispatch', desc: 'XRF check', val: 'FACOR · IMFA', icon: '🚛', col: '#10b981' }
      ],
      chart: [
        { label: 'Pit ROM', val: '3,200T', rawVal: 3200, heightPct: 95, col: '#818cf8' },
        { label: 'Production WB', val: '3,184T', rawVal: 3184, heightPct: 94, col: '#818cf8' },
        { label: 'After crusher', val: '2,480T', rawVal: 2480, heightPct: 70, col: '#f59e0b' },
        { label: 'After DMS', val: '1,960T', rawVal: 1960, heightPct: 50, col: '#ef4444' },
        { label: 'Dispatched', val: '1,948T', rawVal: 1948, heightPct: 49, col: '#10b981' }
      ],
      summaryHtml: (
        <span>
          Weight loss: <span style={{ color: 'var(--text-danger)', fontWeight: 700 }}>−1,252T (39%)</span> · 
          Grade: <span style={{ color: 'var(--text-success)', fontWeight: 700 }}>Cr2O3 42% → 52%</span> · 
          Revenue per tonne: <span style={{ color: 'var(--text-success)', fontWeight: 700 }}>+₹2,600/T</span>
        </span>
      ),
      noteText: 'Statutory limits shown where applicable',
      rightNoteText: 'LOSS but GRADE GAIN (unique to Cr)'
    },
    koraput: {
      title: 'Koraput — Manganese process flow (crushing + screening)',
      activePits: '2/3',
      cameraAcc: '92%',
      centerMetricLabel: 'MN GRADE AVERAGE',
      centerMetricVal: '38.7%',
      centerMetricSub: 'Medium grade',
      mismatches: '1',
      flow: [
        { title: 'Pit face', desc: 'Camera scan', val: 'Mn 38.7%', icon: '⛏', col: '#818cf8' },
        { title: 'Production WB', desc: 'ROM weight', val: '48.2T recorded', icon: '⚖', col: '#818cf8' },
        { title: 'Primary crusher', desc: 'ROM → 25mm', val: '−4% weight', icon: '⚙', col: '#f59e0b' },
        { title: 'Sizing screen', desc: 'Size classification', val: 'Grade steady', icon: '⛃', col: '#8b5cf6' },
        { title: 'Manganese yard', desc: 'Mn 38%+ stack', val: 'Purity validated', icon: '📦', col: '#8b5cf6' },
        { title: 'Dispatch', desc: 'XRF check', val: 'MOIL · Alloys', icon: '🚛', col: '#10b981' }
      ],
      chart: [
        { label: 'Pit ROM', val: '1,440T', rawVal: 1440, heightPct: 92, col: '#818cf8' },
        { label: 'Production WB', val: '1,428T', rawVal: 1428, heightPct: 91, col: '#818cf8' },
        { label: 'After crusher', val: '1,371T', rawVal: 1371, heightPct: 84, col: '#f59e0b' },
        { label: 'Stockyard', val: '1,365T', rawVal: 1365, heightPct: 83, col: '#8b5cf6' },
        { label: 'Dispatched', val: '1,350T', rawVal: 1350, heightPct: 81, col: '#10b981' }
      ],
      summaryHtml: (
        <span>
          Weight loss: <span style={{ color: 'var(--text-danger)' }}>−90T (6.2%)</span> · 
          Grade: <span style={{ color: 'var(--text-success)' }}>Mn 38.7% steady</span> · 
          Quality: <span style={{ color: 'var(--text-success)' }}>Size classification OK</span>
        </span>
      ),
      noteText: 'Statutory limits shown where applicable',
      rightNoteText: 'Standard mechanical weight losses'
    },
    kodingamali: {
      title: 'Kodingamali — Bauxite process flow (dry screening)',
      activePits: '3/4',
      cameraAcc: '93%',
      centerMetricLabel: 'ALUMINA UPLIFT',
      centerMetricVal: '52.3%',
      centerMetricSub: 'Al2O3 Grade',
      mismatches: '1',
      flow: [
        { title: 'Pit face', desc: 'Camera scan', val: 'Al2O3 52.3%', icon: '⛏', col: '#818cf8' },
        { title: 'Production WB', desc: 'ROM weight', val: '50.1T recorded', icon: '⚖', col: '#818cf8' },
        { title: 'Primary screen', desc: 'Dry sizing', val: '−2% weight loss', icon: '⚙', col: '#f59e0b' },
        { title: 'Bauxite yard', desc: 'Alumina stack', val: 'Moisture check', icon: '📦', col: '#8b5cf6' },
        { title: 'Dispatch', desc: 'XRF check', val: 'NALCO refinery', icon: '🚛', col: '#10b981' }
      ],
      chart: [
        { label: 'Pit ROM', val: '1,200T', rawVal: 1200, heightPct: 90, col: '#818cf8' },
        { label: 'Production WB', val: '1,192T', rawVal: 1192, heightPct: 89, col: '#818cf8' },
        { label: 'After screen', val: '1,168T', rawVal: 1168, heightPct: 85, col: '#f59e0b' },
        { label: 'Stockyard', val: '1,160T', rawVal: 1160, heightPct: 84, col: '#8b5cf6' },
        { label: 'Dispatched', val: '1,152T', rawVal: 1152, heightPct: 83, col: '#10b981' }
      ],
      summaryHtml: (
        <span>
          Weight loss: <span style={{ color: 'var(--text-danger)' }}>−48T (4.0%)</span> · 
          Grade: <span style={{ color: 'var(--text-success)' }}>Al2O3 52.3% steady</span> · 
          Moisture: <span style={{ color: 'var(--text-success)' }}>Moisture content check pass</span>
        </span>
      ),
      noteText: 'Statutory limits shown where applicable',
      rightNoteText: 'Screening shrinkage'
    },
    pokhari: {
      title: 'Pokhari — Limestone process flow (2-stage sizing)',
      activePits: '2/2',
      cameraAcc: '96%',
      centerMetricLabel: 'LIMESTONE PURITY',
      centerMetricVal: '94.1%',
      centerMetricSub: 'CaCO3 Grade',
      mismatches: '0',
      flow: [
        { title: 'Pit face', desc: 'Camera scan', val: 'CaCO3 94.1%', icon: '⛏', col: '#818cf8' },
        { title: 'Production WB', desc: 'ROM weight', val: '55.4T recorded', icon: '⚖', col: '#818cf8' },
        { title: '2-Stage Sizer', desc: 'Lump sorting', val: '−1% weight loss', icon: '⚙', col: '#f59e0b' },
        { title: 'Limestone yard', desc: 'Sizing zones', val: '50/25/fines split', icon: '📦', col: '#8b5cf6' },
        { title: 'Dispatch', desc: 'XRF check', val: 'Cement Plants', icon: '🚛', col: '#10b981' }
      ],
      chart: [
        { label: 'Pit ROM', val: '800T', rawVal: 800, heightPct: 85, col: '#818cf8' },
        { label: 'Production WB', val: '795T', rawVal: 795, heightPct: 84, col: '#818cf8' },
        { label: 'After sizer', val: '787T', rawVal: 787, heightPct: 82, col: '#f59e0b' },
        { label: 'Stockyard', val: '780T', rawVal: 780, heightPct: 81, col: '#8b5cf6' },
        { label: 'Dispatched', val: '775T', rawVal: 775, heightPct: 80, col: '#10b981' }
      ],
      summaryHtml: (
        <span>
          Weight loss: <span style={{ color: 'var(--text-danger)' }}>−25T (3.1%)</span> · 
          Sized sorting active (50mm/25mm lumps) · 
          Grade: <span style={{ color: 'var(--text-success)' }}>CaCO3 94.1% steady</span>
        </span>
      ),
      noteText: 'Statutory limits shown where applicable',
      rightNoteText: 'Size segregation audits'
    }
  }

  const site = siteConfig[activeSite]

  // Filter samples by active mineral type
  const siteSamples = samples.filter(s => {
    if (activeSite === 'sukinda') return s.mineral_type.includes('Chrome')
    if (activeSite === 'koraput') return s.mineral_type.includes('Manganese')
    if (activeSite === 'kodingamali') return s.mineral_type.includes('Bauxite')
    if (activeSite === 'pokhari') return s.mineral_type.includes('Limestone')
    return s.mineral_type.includes('Iron')
  })
  
  const displaySamples = siteSamples.length ? siteSamples : samples.slice(0, 4)

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Pit and grade AI</div>
          <div className="module-subtitle">5-source reconciliation, vision grading and site-specific workflows</div>
        </div>
        <div className="module-tabs" id="ptabs" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <span className={`tab ${activeSite === 'keonjhar' ? 'on' : ''}`} onClick={() => setActiveSite('keonjhar')}>Keonjhar · Fe</span>
          <span className={`tab ${activeSite === 'sukinda' ? 'on' : ''}`} onClick={() => setActiveSite('sukinda')}>Sukinda · Cr</span>
          <span className={`tab ${activeSite === 'koraput' ? 'on' : ''}`} onClick={() => setActiveSite('koraput')}>Koraput · Mn</span>
          <span className={`tab ${activeSite === 'kodingamali' ? 'on' : ''}`} onClick={() => setActiveSite('kodingamali')}>Kodingamali · Al</span>
          <span className={`tab ${activeSite === 'pokhari' ? 'on' : ''}`} onClick={() => setActiveSite('pokhari')}>Pokhari · Li</span>
        </div>
      </div>

      <div className="module-body">
        {/* HERO STATS */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">PITS ACTIVE</span>
            <span className="kc-value">{site.activePits}</span>
            <span className="kc-delta down" style={{ color: 'var(--text-danger)' }}>EX-07 offline</span>
          </div>
          <div className="kc success">
            <span className="kc-label">CAMERA ACCURACY</span>
            <span className="kc-value">{site.cameraAcc}</span>
            <span className="kc-delta neutral">vs LIMS</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">{site.centerMetricLabel}</span>
            <span className="kc-value">{site.centerMetricVal}</span>
            <span className="kc-delta neutral">{site.centerMetricSub}</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">GRADE MISMATCHES</span>
            <span className="kc-value">{site.mismatches}</span>
            <span className="kc-delta down">Today</span>
          </div>
        </div>

        {/* PROCESS FLOW DIAGRAM */}
        <div className="panel">
          <div className="ph">
            <span className="pt">{site.title}</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: 12 }}>
              {site.flow.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div 
                    style={{ 
                      background: 'var(--surface-1)', 
                      border: '0.5px solid var(--border)', 
                      borderRadius: 12, 
                      padding: '16px 20px',
                      minWidth: 160,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.sendPrompt(`Analyze process step ${step.title} for ${activeSite}`)}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6, color: step.col }}>{step.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>{step.desc}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{step.val}</div>
                  </div>
                  {idx < site.flow.length - 1 && (
                    <span style={{ fontSize: 22, color: 'var(--text-muted)', fontWeight: 300 }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CUSTOM VERTICAL BAR CHART */}
        <div className="panel">
          <div className="pbody" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>{site.noteText}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-danger)' }}>{site.rightNoteText}</span>
            </div>
            
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'flex-end', 
                height: 180, 
                borderBottom: '1px solid var(--surface-3)',
                paddingBottom: 10,
                marginTop: 10
              }}
            >
              {site.chart.map((bar, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    flex: 1, 
                    height: '100%', 
                    justifyContent: 'flex-end' 
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: bar.label.includes('Dispatched') ? 'var(--text-success)' : 'var(--text-accent)' }}>
                    {bar.val}
                  </span>
                  <div 
                    style={{ 
                      width: 60, 
                      height: `${bar.heightPct}%`, 
                      background: bar.col, 
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.5s ease',
                      opacity: 0.95
                    }} 
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center', fontWeight: 600 }}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
            <div 
              style={{ 
                background: 'var(--surface-2)', 
                padding: 14, 
                borderRadius: 8, 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                textAlign: 'center' 
              }}
            >
              {site.summaryHtml}
            </div>
          </div>
        </div>

        {/* COMBINED TELEMETRY AND RECONCILIATION SECTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
          {/* Shovel & WB Camera Feeds */}
          <div className="panel">
            <div className="ph"><span className="pt">AI Shovel &amp; WB Camera Telemetry</span></div>
            <div className="pbody" style={{ gap: 10 }}>
              <div className="camera-box">
                <div className="cam-scan" />
                <span className="camera-title">Shovel Bucket Fill Analysis (Pit Face)</span>
                <span className="camera-value" style={{ color: 'var(--text-accent)' }}>
                  {activeSite === 'sukinda' ? 'Cr2O3 51.2%' : activeSite === 'koraput' ? 'Mn 38.7%' : activeSite === 'kodingamali' ? 'Al2O3 52.3%' : activeSite === 'pokhari' ? 'CaCO3 94.1%' : 'Fe 62.4%'}
                </span>
                <span className="camera-conf">Conf: 94.2% · Volumetric Fill validated</span>
              </div>
              <div className="camera-box">
                <div className="cam-scan green" />
                <span className="camera-title">Production WB-1 Camera Scan</span>
                <span className="camera-value" style={{ color: 'var(--text-success)' }}>LOAD DETECTED</span>
                <span className="camera-conf">License matches: OK · Tare verified</span>
              </div>
            </div>
          </div>

          {/* 5-Source Reconciliation Table */}
          <div className="panel">
            <div className="ph"><span className="pt">5-Source Grade Reconciliation (LIMS Assay)</span></div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Truck ID</th>
                      <th>Shovel Camera</th>
                      <th>LIMS Lab</th>
                      <th>XRF Scan</th>
                      <th>Verdict</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySamples.map((row, idx) => {
                      const lims = row.grade_lims_pct || row.lims
                      const cam = row.grade_camera_pct || row.camera
                      const xrf = row.grade_xrf_pct || row.xrf
                      const isMatch = Math.abs(cam - lims) < 1.5
                      return (
                        <tr key={idx} onClick={() => window.sendPrompt(`Investigate grade mismatch for truck ${row.truck_id}`)}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.truck_id}</td>
                          <td style={{ fontSize: 14 }}>{cam}%</td>
                          <td style={{ fontSize: 14 }}>{lims}%</td>
                          <td style={{ fontSize: 14 }}>{xrf}%</td>
                          <td>
                            <span className={`pill ${isMatch ? 'ok' : 'al'}`}>
                              {isMatch ? 'Match' : 'Mismatch'}
                            </span>
                          </td>
                          <td>
                            <span className="pill bl" style={{ fontSize: 13, cursor: 'pointer' }}>
                              {isMatch ? 'Auto-Clear' : 'Audit Lab'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* QUALITY STANDARDS DESCRIPTION */}
        <div className="panel">
          <div className="ph"><span className="pt">Mining Grade Quality Controls</span></div>
          <div className="pbody" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <p>Grade predictions are cross-referenced across **5 key sources**: Shovel Camera vision estimation, Handheld XRF scanner inputs, laboratory LIMS assays, geologically mapped mine plan expectations, and exit scale weight densities. Discrepancy checks run continuously to prevent diluting high-grade stockpiles.</p>
          </div>
        </div>

      </div>
    </>
  )
}
