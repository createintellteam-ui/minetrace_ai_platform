export default function Stockyard() {
  const zones = [
    { code: 'Zone A', site: 'Keonjhar Fe', desc: 'Fe 65%+ · High grade', stock: '24,800T', pct: '62%', color: '#3B8BD4', border: 'accent' },
    { code: 'Zone B', site: 'Keonjhar Fe', desc: 'Fe 60-65% · Medium', stock: '18,400T', pct: '46%', color: '#639922', border: 'success' },
    { code: 'Zone C', site: 'Keonjhar Fe', desc: 'Fe below 60% — ALERT', stock: '9,200T', pct: '23%', color: '#E24B4A', border: 'danger', note: 'OD17 contamination from chrome ore' },
    { code: 'Zone D', site: 'Sukinda Cr', desc: 'Cr2O3 52%+ · High grade', stock: '14,600T', pct: '73%', color: '#7F77DD', border: 'pro' },
    { code: 'Zone E', site: 'Koraput Mn', desc: 'Mn 35%+ · Medium-High', stock: '11,200T', pct: '56%', color: '#BA7517', border: 'warning' },
    { code: 'Zones F/G', site: 'Kodingamali Al', desc: 'Al2O3 grade zones', stock: '8,400T', pct: '42%', color: '#D85A30', border: 'accent' },
    { code: 'Zones H/I/J', site: 'Pokhari Li', desc: 'SIZE zones (not grade) · 50/25/fines mm', stock: '5,600T', pct: '28%', color: '#639922', border: 'success', note: 'Limestone sorted by lump sizes' },
  ];

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Stockyard Management</div>
          <div className="module-subtitle">Geofenced stockpiles, grade tracking, contamination controls, and volumetric calculations</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Total Stock</span>
            <span className="kc-value">142,000 T</span>
            <span className="kc-delta neutral">All 5 sites combined</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Wrong-Zone Entries</span>
            <span className="kc-value">1 active</span>
            <span className="kc-delta down">Sukinda OD17 flagged</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Zones Health</span>
            <span className="kc-value">14/16 OK</span>
            <span className="kc-delta down">2 warnings active</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Avg Utilisation</span>
            <span className="kc-value">64%</span>
            <span className="kc-delta up">Capacity headroom OK</span>
          </div>
        </div>

        {/* ZONE GRID */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Geofenced Ore Stockyards (Grade &amp; Size Bands)</span>
          </div>
          <div className="pbody">
            <div className="grid-3">
              {zones.map((zone, idx) => (
                <div 
                  key={idx} 
                  className={`kc ${zone.border}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.sendPrompt(`Analyze stockpile volume and contamination risk for ${zone.code} at ${zone.site}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="kc-label" style={{ color: zone.color }}>{zone.code}</span>
                    <span style={{ fontSize: 8, background: 'var(--surface-2)', padding: '1px 4px', borderRadius: 4 }}>{zone.site}</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 'bold', margin: '2px 0' }}>{zone.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginTop: 4 }}>
                    <span>Stock: {zone.stock}</span>
                    <span>Cap: {zone.pct}</span>
                  </div>
                  <div className="mineral-progress-bg" style={{ marginTop: 2 }}>
                    <div className="mineral-progress-fill" style={{ width: zone.pct, background: zone.color }} />
                  </div>
                  {zone.note && (
                    <div style={{ fontSize: 7, color: zone.color, fontWeight: '600', marginTop: 4, background: 'var(--surface-0)', padding: 3, borderRadius: 2 }}>
                      ⚠ {zone.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMPLIANCE OVERVIEW */}
        <div className="panel">
          <div className="ph">
            <span className="pt">OMC Warehouse Controls</span>
          </div>
          <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            <p><strong>Grade geofencing:</strong> stockyards are geofenced dynamically using high-precision GPS. Shovel operators receive direct dashboard alerts if cargo is unloaded in a matching grade mismatch zone.</p>
            <p style={{ marginTop: 4 }}><strong>Limestone sizing distinction:</strong> At the Pokhari site, stockyard allocation is configured by particle lump sizes (e.g. 50-75mm for blast furnaces vs fines below 10mm for cement mills) rather than chemical iron grade percentages.</p>
          </div>
        </div>

      </div>
    </>
  )
}
