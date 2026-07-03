export default function Sensors() {
  const integrations = [
    { name: 'Pit cameras (22 cameras · RGB + Multispectral)', desc: 'Grade AI active across all 5 minerals', status: 'Online', tone: 'ok' },
    { name: 'ANPR + face verification (10 gate cameras)', desc: '214 entries today', status: 'Online', tone: 'ok' },
    { name: 'GPS trackers (62 vehicles · Teltonika FMB920)', desc: '58 of 62 online · 4G/LTE', status: '58 online', tone: 'wn' },
    { name: 'Weighbridge systems (10 units)', desc: 'Production + crusher + dispatch WBs · Modbus/RS232', status: 'Online', tone: 'ok' },
    { name: 'XRF analysers (dispatch points)', desc: 'Olympus Vanta · All 5 minerals calibrated', status: 'Online', tone: 'ok' },
    { name: 'LMS — Logistics management system', desc: 'Syncing every 5 min · Last: 2 min ago', status: 'Connected', tone: 'ok' },
    { name: 'LIMS — Lab information management', desc: 'Grade results auto-imported · All 5 minerals', status: 'Connected', tone: 'ok' },
    { name: 'SAP — Enterprise resource planning', desc: 'Dispatch + royalty sync daily · Last: 02:00', status: 'Connected', tone: 'ok' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Sensors and IoT</div>
          <div className="module-subtitle">Integration gateways and live sync status for LMS, LIMS, SAP, GPS and cameras</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Devices Online</span>
            <span className="kc-value">64/71</span>
            <span className="kc-delta up">90% network status</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Offline Devices</span>
            <span className="kc-value">7 devices</span>
            <span className="kc-delta down">Attention required</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Data Points / Min</span>
            <span className="kc-value">7,840 / min</span>
            <span className="kc-delta up">All 5 sites live telemetry</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Integrations</span>
            <span className="kc-value">6/6 APIs</span>
            <span className="kc-delta up">All connected</span>
          </div>
        </div>

        {/* INTEGRATION LIST */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Live IoT &amp; Software Integration Syncs</span>
          </div>
          <div className="pbody" style={{ gap: 4 }}>
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Integration Channel / Hardware</th>
                    <th>Live Data Stream &amp; Frequency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {integrations.map((item, i) => (
                    <tr key={i} onClick={() => window.sendPrompt(`Show API sync logs for ${item.name}`)}>
                      <td style={{ fontWeight: '500' }}>{item.name}</td>
                      <td>{item.desc}</td>
                      <td><span className={`pill ${item.tone}`}>{item.status}</span></td>
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
