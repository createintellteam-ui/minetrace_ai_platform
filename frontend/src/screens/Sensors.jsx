import { useApi, Panel, fmt } from '../components/ui.jsx'

export default function Sensors() {
  const { data, err, loading } = useApi('/api/sensors')

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontSize: 16, color: 'var(--text-muted)' }}>Loading IoT Telemetry...</div>
  }

  if (err) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-danger)', fontSize: 16 }}>Error loading sensors: {err}</div>
  }

  const sensorList = data?.by_type || []

  const integrations = [
    { name: 'Pit cameras (22 cameras · RGB + Multispectral)', desc: 'Grade AI active across all 5 minerals', status: 'Online', tone: 'ok' },
    { name: 'ANPR + face verification (10 gate cameras)', desc: 'Scan verification active', status: 'Online', tone: 'ok' },
    { name: 'GPS trackers (62 vehicles · Teltonika FMB920)', desc: '58 of 62 online · 4G/LTE', status: '58 online', tone: 'wn' },
    { name: 'Weighbridge systems (10 units)', desc: 'Production + crusher + dispatch WBs · Modbus/RS232', status: 'Online', tone: 'ok' },
    { name: 'XRF analysers (dispatch points)', desc: 'Olympus Vanta · All 5 minerals calibrated', status: 'Online', tone: 'ok' },
    { name: 'LIMS — Lab information management', desc: 'Grade assays synced every 5 min', status: 'Connected', tone: 'ok' },
  ]

  // Derived calculations
  const totalExceedances = sensorList.reduce((acc, s) => acc + s.exceedances, 0)
  const deviceCount = 64 + sensorList.length

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Sensors and IoT</div>
          <div className="module-subtitle">Integration gateways and live sync status for LMS, LIMS, SAP, GPS, and cameras</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Devices Online</span>
            <span className="kc-value">{deviceCount} / 75</span>
            <span className="kc-delta up">94% network status</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Exceedance Alarms</span>
            <span className="kc-value">{totalExceedances} flags</span>
            <span className="kc-delta down">Environmental flags</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Data Points / Min</span>
            <span className="kc-value">8,940 / min</span>
            <span className="kc-delta up">All active telemetry</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Integrations</span>
            <span className="kc-value">8/8 APIs</span>
            <span className="kc-delta up">All connected</span>
          </div>
        </div>

        {/* Live Environmental Sensor Values */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          
          <Panel title="Environmental Air / Dust Sensors (SPCB Connected)">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Sensor Type</th>
                    <th>Site location</th>
                    <th>Avg Telemetry</th>
                    <th>Statutory Limit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorList.map((row, idx) => (
                    <tr key={idx} onClick={() => window.sendPrompt(`Display environmental history for sensor ${row.sensor_type} at ${row.site_id}`)}>
                      <td style={{ fontWeight: 600 }}>{row.sensor_type}</td>
                      <td>{row.site_id}</td>
                      <td style={{ fontSize: 14 }}>{row.avg_value}</td>
                      <td style={{ fontSize: 14 }}>{row.ec_limit}</td>
                      <td>
                        <span className={`pill ${row.exceedances > 0 ? 'al' : 'ok'}`}>
                          {row.exceedances > 0 ? 'Exceedance' : 'Nominal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Software Integrations */}
          <Panel title="Live Software and Hardware Integration Syncs">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Integration Channel</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {integrations.map((item, i) => (
                    <tr key={i} onClick={() => window.sendPrompt(`Show API sync logs for ${item.name}`)}>
                      <td>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
                      </td>
                      <td><span className={`pill ${item.tone}`}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

        </div>
      </div>
    </>
  )
}
