export default function Weighbridge() {
  const wbRows = [
    { truck: 'OD09AB4421', site: 'Keonjhar', pit: '52.0T', crush: '50.4T', disp: '48.2T', diff: '−3.8T', diffTone: 'al', pattern: '5th time', patTone: 'al', status: 'Flagged', statusTone: 'al' },
    { truck: 'OD22MN3301', site: 'Koraput', pit: '44.1T', crush: 'N/A', disp: '44.0T', diff: '−0.1T', diffTone: 'ok', pattern: 'None', patTone: 'nt', status: 'Clear', statusTone: 'ok' },
    { truck: 'OD31AL7701', site: 'Keonjhar', pit: '50.0T', crush: '48.6T', disp: '47.9T', diff: '−2.1T', diffTone: 'al', pattern: '2nd time', patTone: 'wn', status: 'Flagged', statusTone: 'al' },
    { truck: 'OD44CR0091', site: 'Sukinda', pit: '51.7T', crush: '49.1T (ROM)', disp: '51.5T (Conc)', diff: '−0.2T', diffTone: 'ok', pattern: 'None', patTone: 'nt', status: 'Clear', statusTone: 'ok' },
  ];

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Weighbridge &amp; Reconciliation</div>
          <div className="module-subtitle">Pit vs. Crusher vs. Dispatch weight audits and anomaly pattern alerts</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc accent">
            <span className="kc-label">Weighments Today</span>
            <span className="kc-value">892</span>
            <span className="kc-delta neutral">All 5 sites</span>
          </div>
          <div className="kc success">
            <span className="kc-label">Matched Readings</span>
            <span className="kc-value">878</span>
            <span className="kc-delta up">98.4% match rate</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Discrepancies</span>
            <span className="kc-value">14 flags</span>
            <span className="kc-delta down">Under investigation</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Total Lost Weight</span>
            <span className="kc-value">24.2 T</span>
            <span className="kc-delta down">Flagged leakage</span>
          </div>
        </div>

        {/* LOG TABLE */}
        <div className="panel">
          <div className="ph">
            <span className="pt">Weighbridge Logs &amp; Audit Trail</span>
          </div>
          <div className="pbody">
            <div className="tbl-container">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Truck</th>
                    <th>Site</th>
                    <th>Pit Wt.</th>
                    <th>Crusher Wt.</th>
                    <th>Dispatch Wt.</th>
                    <th>Total Diff.</th>
                    <th>Pattern Flag</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wbRows.map((row, idx) => (
                    <tr key={idx} onClick={() => window.sendPrompt(`Investigate weight loss pattern for truck ${row.truck}`)}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{row.truck}</td>
                      <td>{row.site}</td>
                      <td>{row.pit}</td>
                      <td>{row.crush}</td>
                      <td>{row.disp}</td>
                      <td style={{ color: row.diffTone === 'al' ? 'var(--text-danger)' : 'var(--text-success)' }}>
                        {row.diff}
                      </td>
                      <td>
                        <span className={`pill ${row.patTone}`}>{row.pattern}</span>
                      </td>
                      <td>
                        <span className={`pill ${row.statusTone}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* NOTIFICATION BOX FOR MANDAR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="panel">
            <div className="ph"><span className="pt">Reconciliation Architectures</span></div>
            <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
              <p><strong>Crusher Active Sites (Keonjhar, Sukinda, Pokhari):</strong> Runs a 4-stage audit path: ROM Pit face → Crusher intake WB → Crusher output WB → Finished Stockyard → Sales gate Dispatch WB.</p>
              <p style={{ marginTop: 4 }}><strong>Non-Crusher Sites (Koraput, Kodingamali):</strong> Direct 2-stage verification: Pit face shovel estimation → Exit sales gate weighbridge.</p>
            </div>
          </div>
          <div className="panel">
            <div className="ph"><span className="pt">AI Material Density Calibration</span></div>
            <div className="pbody" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
              <p><strong>Chrome Density Offset:</strong> In Sukinda, finished chrome concentrate shows higher comparative dispatch density than raw ROM ore. Our AI engine scales density baselines to avoid false weighbridge alarms.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
