import { useState } from 'react'

export default function PitGrade() {
  const [activeSite, setActiveSite] = useState('keonjhar')

  const reconRows = [
    { truck: 'OD09AB4421', camera: '62.1%', eye: '63.0%', lims: '62.4%', wb: '52.0T', xrf: '62.8%', verdict: 'Match', tone: 'ok', action: 'Auto-Clear' },
    { truck: 'OD31AL7701', camera: '58.4%', eye: '62.0%', lims: '62.1%', wb: '50.0T', xrf: '59.2%', verdict: 'Mismatch', tone: 'wn', action: 'Retest Lab' },
    { truck: 'OD17YX9021', camera: '42.1%', eye: '45.0%', lims: '42.6%', wb: '52.1T', xrf: '51.5%', verdict: 'Match', tone: 'ok', action: 'Auto-Clear' },
    { truck: 'MH44LS2210', camera: '94.2%', eye: '95.0%', lims: '94.1%', wb: '48.2T', xrf: '94.0%', verdict: 'Match', tone: 'ok', action: 'Auto-Clear' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Pit &amp; Grade AI</div>
          <div className="module-subtitle">5-source reconciliation, vision grading and site-specific workflow audits</div>
        </div>
        <div className="module-tabs" id="ptabs">
          <span className={`tab ${activeSite === 'keonjhar' ? 'on' : ''}`} onClick={() => setActiveSite('keonjhar')}>Keonjhar · Fe</span>
          <span className={`tab ${activeSite === 'sukinda' ? 'on' : ''}`} onClick={() => setActiveSite('sukinda')}>Sukinda · Cr</span>
          <span className={`tab ${activeSite === 'koraput' ? 'on' : ''}`} onClick={() => setActiveSite('koraput')}>Koraput · Mn</span>
          <span className={`tab ${activeSite === 'kodingamali' ? 'on' : ''}`} onClick={() => setActiveSite('kodingamali')}>Kodingamali · Al</span>
          <span className={`tab ${activeSite === 'pokhari' ? 'on' : ''}`} onClick={() => setActiveSite('pokhari')}>Pokhari · Li</span>
        </div>
      </div>

      <div className="module-body">
        
        {/* KEONJHAR Fe TAB */}
        {activeSite === 'keonjhar' && (
          <div id="pfe">
            {/* Stats */}
            <div className="kc-grid" style={{ marginBottom: 8 }}>
              <div className="kc accent">
                <span className="kc-label">Pits Active</span>
                <span className="kc-value">4/4</span>
                <span className="kc-delta neutral">All operations live</span>
              </div>
              <div className="kc success">
                <span className="kc-label">AI Grade Accuracy</span>
                <span className="kc-value">94%</span>
                <span className="kc-delta up">vs LIMS Lab</span>
              </div>
              <div className="kc warning">
                <span className="kc-label">Crusher Output</span>
                <span className="kc-value">1,240 T/hr</span>
                <span className="kc-delta up">Jaw running</span>
              </div>
              <div className="kc danger">
                <span className="kc-label">Grade Mismatches</span>
                <span className="kc-value">2 today</span>
                <span className="kc-delta down">Awaiting lab review</span>
              </div>
            </div>

            {/* Process Flow */}
            <div className="panel">
              <div className="ph">
                <span className="pt">Operational Flow (Iron Ore Crusher Flow)</span>
              </div>
              <div className="pbody">
                <div className="flow-container">
                  <div className="fstep" onClick={() => window.sendPrompt('Show Pit Face Fe stats')}>
                    <span className="fstep-label">Pit Face</span>
                    <span className="fstep-sub">Loaded ROM</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep" onClick={() => window.sendPrompt('Show Weighbridge Fe stats')}>
                    <span className="fstep-label">Production WB</span>
                    <span className="fstep-sub">Gross Weight</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep crush" title="−3% weight loss · Lump+fines split" onClick={() => window.sendPrompt('Show Keonjhar Crusher metrics')}>
                    <span className="fstep-label">CRUSHER*</span>
                    <span className="fstep-sub">-3% weight loss</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep" onClick={() => window.sendPrompt('Show Stockyard Fe zones')}>
                    <span className="fstep-label">Stockyard</span>
                    <span className="fstep-sub">Fe 62%+ bands</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep" onClick={() => window.sendPrompt('Show Fe Dispatch')}>
                    <span className="fstep-label">Dispatch</span>
                    <span className="fstep-sub">Challan Out</span>
                  </div>
                </div>

                {/* Waterfall */}
                <div className="waterfall-container">
                  <div className="waterfall-chart">
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '100%', background: '#3B8BD4' }} />
                      <span className="waterfall-label">Pit ROM</span>
                      <span className="waterfall-val">3,960T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '99%', background: '#3B8BD4' }} />
                      <span className="waterfall-label">Prod. WB</span>
                      <span className="waterfall-val">3,942T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '96%', background: 'orange' }} />
                      <span className="waterfall-label">Crusher Out</span>
                      <span className="waterfall-val">3,823T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '95%', background: 'teal' }} />
                      <span className="waterfall-label">Stockyard</span>
                      <span className="waterfall-val">3,810T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '94%', background: 'green' }} />
                      <span className="waterfall-label">Dispatched</span>
                      <span className="waterfall-val">3,795T</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                    <strong>Crusher loss: −119T (3%) · Total: −165T (4.2%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Screen AI & Recon */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 8 }}>
              {/* Left Camera Panel */}
              <div className="panel">
                <div className="ph"><span className="pt">AI Shovel &amp; WB Cameras</span></div>
                <div className="pbody" style={{ gap: 6 }}>
                  <div className="camera-box">
                    <span className="camera-title">Shovel Bucket Fill Analysis (Pit 2)</span>
                    <span className="camera-value" style={{ color: '#3B8BD4' }}>Fe 62.4%</span>
                    <span className="camera-conf">Conf: 94% · 8.8T est.</span>
                    <div className="cam-scan" />
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', textAlign: 'center' }}>AI Vision at Weighbridge — top view</div>
                  <div className="camera-box">
                    <span className="camera-title">WB-1 Load Validation Scan</span>
                    <span className="camera-value" style={{ color: '#639922' }}>LOAD VALIDATED</span>
                    <span className="camera-conf">Fe ore confirmed · 52.0T linked</span>
                    <div className="cam-scan green" />
                  </div>
                </div>
              </div>

              {/* Right Recon Panel */}
              <div className="panel">
                <div className="ph"><span className="pt">5-Source Grade Reconciliation</span></div>
                <div className="pbody" style={{ gap: 4 }}>
                  <div style={{ background: 'var(--bg-success)', padding: 4, borderRadius: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--text-success)', fontSize: 9, marginBottom: 4 }}>
                    XRF Check Result: Fe 62.8% Pass
                  </div>
                  <table className="tbl" style={{ fontSize: 9 }}>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Fe% Value</th>
                        <th>Verdict</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Camera AI</td><td>62.1%</td><td style={{ color: 'var(--text-success)' }}>✓ match</td></tr>
                      <tr><td>Eye est.</td><td>63.0%</td><td style={{ color: 'var(--text-success)' }}>✓ match</td></tr>
                      <tr><td>LIMS Lab</td><td>62.4%</td><td style={{ color: 'var(--text-success)' }}>✓ match</td></tr>
                      <tr><td>XRF Quick</td><td>62.8%</td><td style={{ color: 'var(--text-success)' }}>✓ match</td></tr>
                      <tr><td>Mine Plan</td><td>62-64%</td><td style={{ color: 'var(--text-success)' }}>✓ match</td></tr>
                    </tbody>
                  </table>
                  <div style={{ textAlign: 'center', marginTop: 4 }}>
                    <span className="pill ok">All 5 sources match — dispatch cleared</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUKINDA Cr TAB */}
        {activeSite === 'sukinda' && (
          <div id="pcr">
            {/* Stats */}
            <div className="kc-grid" style={{ marginBottom: 8 }}>
              <div className="kc pro">
                <span className="kc-label">Pits Active</span>
                <span className="kc-value" style={{ color: 'var(--text-danger)' }}>3/5</span>
                <span className="kc-delta down" style={{ color: 'var(--text-danger)' }}>EX-07 Offline</span>
              </div>
              <div className="kc success">
                <span className="kc-label">DMS Grade Uplift</span>
                <span className="kc-value">+9.4%</span>
                <span className="kc-delta up">42% → 52% Cr</span>
              </div>
              <div className="kc accent">
                <span className="kc-label">Water Recycle</span>
                <span className="kc-value">98.2%</span>
                <span className="kc-delta up">DMS plant recirc</span>
              </div>
              <div className="kc danger">
                <span className="kc-label">Contamination Risk</span>
                <span className="kc-value">1 entry</span>
                <span className="kc-delta down">OD17 mismatch</span>
              </div>
            </div>

            {/* Process Flow */}
            <div className="panel">
              <div className="ph">
                <span className="pt">Operational Flow (Chrome Beneficiation Plant)</span>
              </div>
              <div className="pbody">
                <div className="flow-container">
                  <div className="fstep">
                    <span className="fstep-label">Pit Face</span>
                    <span className="fstep-sub">Loaded ROM</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep">
                    <span className="fstep-label">Prod WB</span>
                    <span className="fstep-sub">Weigh-in</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep crush" title="Crusher loss">
                    <span className="fstep-label">CRUSHER*</span>
                    <span className="fstep-sub">Ore Sizing</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep crush" title="42%→52% Cr · −38% wt loss">
                    <span className="fstep-label">DMS PLANT*</span>
                    <span className="fstep-sub">Uplift 42%→52%</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep">
                    <span className="fstep-label">Conc. yard</span>
                    <span className="fstep-sub">Fine Stock</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep">
                    <span className="fstep-label">Dispatch</span>
                    <span className="fstep-sub">Challan Out</span>
                  </div>
                </div>

                {/* Waterfall */}
                <div className="waterfall-container">
                  <div className="waterfall-chart">
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '100%', background: '#7F77DD' }} />
                      <span className="waterfall-label">Pit ROM</span>
                      <span className="waterfall-val">3,200T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '99%', background: '#7F77DD' }} />
                      <span className="waterfall-label">Prod. WB</span>
                      <span className="waterfall-val">3,184T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '77%', background: 'orange' }} />
                      <span className="waterfall-label">Crusher Out</span>
                      <span className="waterfall-val">2,480T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '61%', background: 'red' }} />
                      <span className="waterfall-label">DMS Out</span>
                      <span className="waterfall-val">1,960T</span>
                    </div>
                    <div className="waterfall-bar-wrapper">
                      <div className="waterfall-bar" style={{ height: '60%', background: 'green' }} />
                      <span className="waterfall-label">Dispatched</span>
                      <span className="waterfall-val">1,948T</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                    <strong>Weight loss: −39% (gangue removed) · Grade GAIN: Cr2O3 42%→52% · +₹2,600/T value uplift</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ph"><span className="pt">Chrome Reconciliation Engine</span></div>
              <div className="pbody">
                <p style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                  Unlike iron ore, Chrome undergoes substantial weight reduction inside the DMS (Dense Media Separation) plant.
                  Our algorithms reconcile low ROM weight checks against highly dense finished chrome fines to audit and verify no material is diverted illegally.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KORAPUT Mn TAB */}
        {activeSite === 'koraput' && (
          <div id="pmn">
            <div className="panel">
              <div className="ph"><span className="pt">Koraput Manganese Process Flow</span></div>
              <div className="pbody">
                <div className="flow-container">
                  <div className="fstep"><span className="fstep-label">Pit Face</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Prod WB</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep" style={{ borderStyle: 'dashed', opacity: 0.75 }}>
                    <span className="fstep-label">Light Crusher</span>
                    <span className="fstep-sub">(Optional)</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Stockyard</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Dispatch</span></div>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 8, padding: 6, background: 'var(--surface-0)', borderRadius: 4 }}>
                  <strong>Lowest loss rate: −1.4% total.</strong> Light crusher active optionally based on ore hardness index.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KODINGAMALI Al TAB */}
        {activeSite === 'kodingamali' && (
          <div id="pal">
            <div className="panel">
              <div className="ph"><span className="pt">Kodingamali Bauxite Process Flow (No Crusher)</span></div>
              <div className="pbody">
                <div className="flow-container">
                  <div className="fstep"><span className="fstep-label">Pit Face</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Prod WB</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep" style={{ borderColor: 'var(--fill-accent)' }}>
                    <span className="fstep-label">Wash Screen</span>
                    <span className="fstep-sub">Clay Removal</span>
                  </div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Stockyard</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Dispatch</span></div>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-success)', marginTop: 8, padding: 6, background: 'var(--bg-success)', borderRadius: 4, border: '0.5px solid var(--fill-success)' }}>
                  <strong>Bauxite is soft earthy ore — no crusher required.</strong> Wash screen removes clay and improves Al2O3% purity. Simplest flow: under 1% total loss pit to dispatch.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POKHARI Li TAB */}
        {activeSite === 'pokhari' && (
          <div id="pli">
            <div className="panel">
              <div className="ph"><span className="pt">Pokhari Limestone Flow (Multi-Stage Crusher)</span></div>
              <div className="pbody">
                <div className="flow-container">
                  <div className="fstep"><span className="fstep-label">Pit Face</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Prod WB</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep crush"><span className="fstep-label">Primary Crusher</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep crush"><span className="fstep-label">Sec. Crusher</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Vib. Screen</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Stockyard</span></div>
                  <span className="fstep-arrow">→</span>
                  <div className="fstep"><span className="fstep-label">Dispatch</span></div>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-accent)', marginTop: 8, padding: 6, background: 'var(--bg-accent)', borderRadius: 4, border: '0.5px solid var(--fill-accent)' }}>
                  <strong>Limestone stockyard zones are defined by PARTICLE SIZE</strong> (50-75mm / 25-50mm / fines below 10mm) rather than grade percentage. Cement customers require fines; steel plants require 50mm lumps.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECON LOG TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Recent Grade Verification Logs (OMC Reconciliation Engine)</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Truck</th>
                    <th>Camera AI</th>
                    <th>Eye Est.</th>
                    <th>LIMS Lab</th>
                    <th>Weighbridge</th>
                    <th>XRF Grade</th>
                    <th>Verdict</th>
                    <th>Action Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {reconRows.map((row, i) => (
                    <tr key={i} onClick={() => window.sendPrompt(`Investigate grade discrepancies for truck ${row.truck}`)}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{row.truck}</td>
                      <td>{row.camera}</td>
                      <td>{row.eye}</td>
                      <td>{row.lims}</td>
                      <td>{row.wb}</td>
                      <td>{row.xrf}</td>
                      <td><span className={`pill ${row.tone}`}>{row.verdict}</span></td>
                      <td>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
