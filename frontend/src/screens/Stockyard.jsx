import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Stockyard({ showInventoryOnly = false }) {
  const { data, err, loading } = useApi('/api/stockyard/zones')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Stockyard HUD...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading stockyard telemetry: {err}</div>
  }

  const zoneRows = data || []
  
  // Calculate aggregate metrics
  const totalStock = zoneRows.reduce((acc, z) => acc + z.tonnes_in, 0)
  const totalCapacity = zoneRows.reduce((acc, z) => acc + z.capacity_tonnes, 0)
  const avgUtil = totalCapacity ? Math.round((totalStock / totalCapacity) * 100) : 0
  const wrongEntries = zoneRows.reduce((acc, z) => acc + z.mismatches, 0)

  // Color mapping based on mineral code
  const colorMap = {
    'Fe': { col: '#2563eb', border: 'accent', name: 'Iron Ore (Fe)' },
    'Cr': { col: '#8b5cf6', border: 'pro', name: 'Chrome Ore (Cr)' },
    'Mn': { col: '#f59e0b', border: 'warning', name: 'Manganese Ore (Mn)' },
    'Al': { col: '#ef4444', border: 'danger', name: 'Bauxite (Al)' },
    'CaCO3': { col: '#10b981', border: 'success', name: 'Limestone (Ca)' }
  }

  if (showInventoryOnly) {
    return (
      <>
        <div className="module-header">
          <div className="module-header-info">
            <div className="module-title">Inventory Management</div>
            <div className="module-subtitle">Grade-wise stockpiles, mineral volume indices, and warehouse reserves</div>
          </div>
        </div>

        <div className="module-body">
          {/* STATS */}
          <div className="kc-grid">
            <div className="kc accent">
              <span className="kc-label">Stockpile Reserves</span>
              <span className="kc-value">{fmt(totalStock)} T</span>
              <span className="kc-delta neutral">Total stockpiled ROM + concentrates</span>
            </div>
            <div className="kc success">
              <span className="kc-label">Active Stockpiles</span>
              <span className="kc-value">{zoneRows.length} zones</span>
              <span className="kc-delta up">All sectors active</span>
            </div>
            <div className="kc warning">
              <span className="kc-label">Total Capacity</span>
              <span className="kc-value">{fmt(totalCapacity)} T</span>
              <span className="kc-delta neutral">{avgUtil}% warehouse load</span>
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="panel">
            <div className="ph">
              <span className="pt">Warehouse stockpile registers</span>
            </div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Zone ID</th>
                      <th>Mine site</th>
                      <th>Mineral type</th>
                      <th>Grade band / Size</th>
                      <th>Mined weight in (T)</th>
                      <th>Capacity utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zoneRows.map((row, idx) => {
                      const meta = colorMap[row.mineral_code] || { col: '#64748b', name: row.mineral_code }
                      const pct = Math.round((row.tonnes_in / row.capacity_tonnes) * 100)
                      return (
                        <tr key={idx} onClick={() => window.sendPrompt(`Display inventory history for zone ${row.zone_id}`)}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.zone_id}</td>
                          <td>{row.site_id}</td>
                          <td style={{ color: meta.col, fontWeight: 600 }}>{meta.name}</td>
                          <td>{row.grade_band}</td>
                          <td style={{ fontSize: 14 }}>{fmt(row.tonnes_in)} T</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ minWidth: 40, fontSize: 13 }}>{pct}%</span>
                              <div className="mineral-progress-bg" style={{ flex: 1, margin: 0 }}>
                                <div className="mineral-progress-fill" style={{ width: `${pct}%`, background: meta.col }} />
                              </div>
                            </div>
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
      </>
    )
  }

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Stockyard Management</div>
          <div className="module-subtitle">GPS geofenced stockpiles, contamination warnings, and size band allocations</div>
        </div>
      </div>

      <div className="module-body">
        {/* STATS */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Total Stock Weight</span>
            <span className="kc-value">{fmt(totalStock)} T</span>
            <span className="kc-delta neutral">Headroom OK</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Wrong-Zone Dumps</span>
            <span className="kc-value">{wrongEntries} dumps</span>
            <span className="kc-delta down">Audit alarm active</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Capacity Utilisation</span>
            <span className="kc-value">{avgUtil}%</span>
            <span className="kc-delta neutral">Of {fmt(totalCapacity)} T limit</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Sector Security</span>
            <span className="kc-value">All clear</span>
            <span className="kc-delta up">Geofences locked</span>
          </div>
        </div>

        {/* ZONE GRID */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Geofenced Ore Stockyards (Grade &amp; Sizing Blocks)</span>
          </div>
          <div className="pbody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {zoneRows.map((zone, idx) => {
                const meta = colorMap[zone.mineral_code] || { col: '#64748b', border: 'accent', name: zone.mineral_code }
                const pct = Math.round((zone.tonnes_in / zone.capacity_tonnes) * 100)
                return (
                  <div 
                    key={idx} 
                    className={`kc ${meta.border}`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.sendPrompt(`Analyze stockpile volume and contamination risk for ${zone.zone_id} at ${zone.site_id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="kc-label" style={{ color: meta.col, fontSize: 13 }}>{zone.zone_id}</span>
                      <span style={{ fontSize: 13, background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{zone.site_id}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', margin: '4px 0', color: 'var(--text-primary)' }}>
                      {meta.name} · {zone.grade_band}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4, color: 'var(--text-secondary)' }}>
                      <span>Stock: {fmt(zone.tonnes_in)}T</span>
                      <span>Util: {pct}%</span>
                    </div>
                    <div className="mineral-progress-bg" style={{ marginTop: 6 }}>
                      <div className="mineral-progress-fill" style={{ width: `${pct}%`, background: meta.col }} />
                    </div>
                    {zone.mismatches > 0 && (
                      <div style={{ fontSize: 13, color: 'var(--text-danger)', fontWeight: '600', marginTop: 8, background: 'var(--bg-danger)', padding: 6, borderRadius: 4 }}>
                        ⚠ {zone.mismatches} wrong-zone entry flagged! High contamination risk.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Panel title="OMC Stockyard Audits">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p><strong>Wrong-Zone Prevention:</strong> High-precision geofences automatically block exit gates if a truck enters a grade-dilution stockpile zone (e.g. Chrome dumped in Iron zone). This prevents dilution of high-grade Fe piles.</p>
            </div>
          </Panel>
          <Panel title="Volumetric Particle Sizing distinction">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p><strong>Limestone sorted by sizes:</strong> At Pokhari, sorting is configured strictly by particle dimensions (50mm lump vs 25mm lump vs fine fractions) rather than chemical grades, to suit specific blast furnace contracts.</p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
