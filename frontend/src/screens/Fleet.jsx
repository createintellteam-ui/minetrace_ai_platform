import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Fleet() {
  const { data: fleetData, err: fleetErr, loading: fleetLoading } = useApi('/api/fleet/summary')
  const { data: anomalyData, err: anomalyErr, loading: anomalyLoading } = useApi('/api/anomalies/trucks?limit=10')

  if (fleetLoading || anomalyLoading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading Fleet HUD...</div>
  }

  if (fleetErr || anomalyErr) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading fleet telemetry.</div>
  }

  const trucksList = fleetData?.per_truck || []
  const anomalies = anomalyData || []

  // Derived KPI metrics
  const activeCount = trucksList.length
  const totalTrips = trucksList.reduce((acc, t) => acc + t.trips, 0)
  const averageCycle = Math.round(trucksList.reduce((acc, t) => acc + t.avg_cycle_min, 0) / (activeCount || 1))
  const routeDeviations = anomalies.filter(a => a.zone_mismatches > 0).length

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Fleet Tracking</div>
          <div className="module-subtitle">Dynamic vehicle routing, fuel checks, and GPS geofence monitoring</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Active Fleet</span>
            <span className="kc-value">{activeCount} / 45</span>
            <span className="kc-delta up">{Math.round((activeCount / 45) * 100)}% Utilisation</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Trips Completed</span>
            <span className="kc-value">{fmt(totalTrips)} trips</span>
            <span className="kc-delta neutral">Across all active mines</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Route Deviations</span>
            <span className="kc-value">{routeDeviations} flags</span>
            <span className="kc-delta down">Instant alerts fired</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Avg Cycle Time</span>
            <span className="kc-value">{averageCycle} min</span>
            <span className="kc-delta neutral">Within nominal variance</span>
          </div>
        </div>

        {/* FLEET AUDIT TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Dynamic Routing Telemetry &amp; Shovel Cycle Audits</span>
            <button className="btn" onClick={() => window.sendPrompt('Optimise fleet routing across all 5 sites for next 2 hours')}>
              Optimise Routing
            </button>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Truck ID</th>
                    <th>Shovel Trips</th>
                    <th>Avg Cycle Time</th>
                    <th>Total Mined (T)</th>
                    <th>Status</th>
                    <th>Prognosis</th>
                  </tr>
                </thead>
                <tbody>
                  {trucksList.map((row, idx) => {
                    const isAnomalous = anomalies.some(a => a.truck_id === row.truck_id)
                    const isZoneAnomaly = anomalies.some(a => a.truck_id === row.truck_id && a.zone_mismatches > 0)
                    return (
                      <tr key={idx} onClick={() => window.sendPrompt(`Show detailed telemetry status for truck ${row.truck_id}`)}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.truck_id}</td>
                        <td style={{ fontSize: 14 }}>{row.trips} trips</td>
                        <td style={{ fontSize: 14 }}>{row.avg_cycle_min} min</td>
                        <td style={{ fontSize: 14 }}>{fmt(row.mined_mt)} T</td>
                        <td>
                          {isZoneAnomaly ? (
                            <span className="pill al">Zone Mismatch</span>
                          ) : isAnomalous ? (
                            <span className="pill wn">Loss Pattern</span>
                          ) : (
                            <span className="pill ok">On Route</span>
                          )}
                        </td>
                        <td>
                          {row.truck_id === 'OD09AB4421' ? (
                            <span className="pill al" style={{ fontSize: 13 }}>Audit Hold</span>
                          ) : (
                            <span className="pill ok">Nominal</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* GPS GEOFENCING AND PREVENTION DESCRIPTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Panel title="GPS-Based Dynamic Geofencing">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              <p>GPS boundaries are dynamically calculated around active blasting fields. Shovels transmit geo-fenced signals. In Sukinda (Cr) and Keonjhar (Fe), terminal gate loops lock automatically on mismatches to eliminate ore dilution.</p>
            </div>
          </Panel>
          <Panel title="Fuel Level Telemetry Prediction">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              <p>IoT fuel sensor anomalies predict consumption slippage. Diverging lines indicate leakage, helping supervisors prevent fuel theft or identify mechanical blockages in underperforming excavators.</p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
