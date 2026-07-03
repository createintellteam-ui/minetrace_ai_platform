export default function Finance() {
  const revenues = [
    { name: 'Iron ore (Fe) · Keonjhar', amt: '₹2.84 Cr', pct: 71, color: '#3B8BD4' },
    { name: 'Chrome (Cr) · Sukinda', amt: '₹1.12 Cr', pct: 28, color: '#7F77DD' },
    { name: 'Manganese (Mn) · Koraput', amt: '₹0.64 Cr', pct: 16, color: '#BA7517' },
    { name: 'Bauxite (Al) · Kodingamali', amt: '₹0.14 Cr', pct: 4, color: '#D85A30' },
    { name: 'Limestone (Li) · Pokhari', amt: '₹0.06 Cr', pct: 2, color: '#639922' },
  ]

  const customerRows = [
    { client: 'SAIL Bhilai', min: 'Fe ore 62%', amt: '₹84.2L', date: 'Jul 15', status: 'Paid', tone: 'ok' },
    { client: 'FACOR Nagpur', min: 'Cr ore 51%', amt: '₹42.1L', date: 'Jul 20', status: 'Due soon', tone: 'nt' },
    { client: 'JSW Steel', min: 'Fe 65%', amt: '₹1.12Cr', date: 'Jul 5', status: 'OVERDUE', tone: 'al' },
    { client: 'NALCO', min: 'Bauxite', amt: '₹8.4L', date: 'Jul 25', status: 'On track', tone: 'ok' },
  ]

  return (
    <>
      <div className="module-header">
        <div className="module-header-info">
          <div className="module-title">Finance &amp; Royalty</div>
          <div className="module-subtitle">Royalty liabilities, invoice payments, and mineral revenue breakdowns</div>
        </div>
      </div>

      <div className="module-body">
        {/* STAT ROW */}
        <div className="kc-grid">
          <div className="kc success">
            <span className="kc-label">Revenue This Month</span>
            <span className="kc-value">₹6.8 Cr</span>
            <span className="kc-delta up">All 5 minerals</span>
          </div>
          <div className="kc danger">
            <span className="kc-label">Royalty Outstanding</span>
            <span className="kc-value">₹84.2 L</span>
            <span className="kc-delta down">Due in 8 days</span>
          </div>
          <div className="kc accent">
            <span className="kc-label">Cost Per Tonne</span>
            <span className="kc-value">₹487 / T</span>
            <span className="kc-delta neutral">Avg mining cost</span>
          </div>
          <div className="kc warning">
            <span className="kc-label">Profit Margin</span>
            <span className="kc-value">21.4%</span>
            <span className="kc-delta down">−2% vs last month</span>
          </div>
        </div>

        {/* SPLIT LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: 8 }}>
          
          {/* Mineral revenue split */}
          <div className="panel">
            <div className="ph"><span className="pt">Revenue Contribution by Mineral</span></div>
            <div className="pbody" style={{ gap: 8 }}>
              {revenues.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                    <span style={{ fontWeight: '500' }}>{item.name}</span>
                    <span style={{ fontWeight: '600' }}>{item.amt} ({item.pct}%)</span>
                  </div>
                  <div className="mineral-progress-bg" style={{ height: 5 }}>
                    <div className="mineral-progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer accounts table */}
          <div className="panel">
            <div className="ph"><span className="pt">Customer Payments Ledger</span></div>
            <div className="pbody">
              <div className="tbl-container">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Order Spec</th>
                      <th>Invoice Amt</th>
                      <th>Due Date</th>
                      <th>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerRows.map((row, idx) => (
                      <tr key={idx} onClick={() => window.sendPrompt(`Show payment detail and outstanding royalty invoice for ${row.client}`)}>
                        <td style={{ fontWeight: '500' }}>{row.client}</td>
                        <td>{row.min}</td>
                        <td style={{ fontWeight: '600' }}>{row.amt}</td>
                        <td>{row.date}</td>
                        <td><span className={`pill ${row.tone}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
