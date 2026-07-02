import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { get, post } from '../lib/api.js'

export const fmt = n => (n === null || n === undefined ? '—' : Number(n).toLocaleString('en-IN'))

export function useApi(path) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    let live = true
    get(path).then(d => live && setData(d)).catch(e => live && setErr(String(e)))
    return () => { live = false }
  }, [path])
  return { data, err, loading: !data && !err }
}

export function Screen({ title, subtitle, state, children }) {
  return (
    <>
      <div className="mh">
        <div>
          <div className="mt">{title}</div>
          <div className="ms">{subtitle}</div>
        </div>
      </div>
      <div className="mb">
        {state?.err
          ? <div className="placeholder">API error: {state.err}<br />Is the backend running on :8000?</div>
          : state?.loading
            ? <div className="loading">Loading…</div>
            : children}
      </div>
    </>
  )
}

function getKpiIcon(lbl) {
  const l = String(lbl).toLowerCase();
  if (l.includes('mined') || l.includes('samples') || l.includes('readings') || l.includes('workers')) {
    return (
      <svg className="kpi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  }
  if (l.includes('dispatch') || l.includes('approved')) {
    return (
      <svg className="kpi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    );
  }
  if (l.includes('grade') || l.includes('camera') || l.includes('confidence') || l.includes('rgb') || l.includes('multispectral')) {
    return (
      <svg className="kpi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8 14.187 8.813 9.096 9.813 14.187 14.904 15 9.813 15.904ZM18.25 5.25L17.5 9l-.75-3.75L13 4.5l3.75-.75.75-3.75.75 3.75 3.75.75-3.75.75ZM14.25 18l-.5 2.5-.5-2.5-2.5-.5 2.5-.5.5-2.5.5 2.5 2.5.5-2.5.5Z" />
      </svg>
    );
  }
  if (l.includes('mismatch') || l.includes('flagged') || l.includes('held') || l.includes('expiring') || l.includes('lost') || l.includes('error') || l.includes('value')) {
    return (
      <svg className="kpi-icon" style={{ color: 'var(--text-danger)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    );
  }
  return (
    <svg className="kpi-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

export function Kpi({ cls = '', lbl, val, sub }) {
  return (
    <div className={`kc ${cls}`}>
      {getKpiIcon(lbl)}
      <div className="lbl">{lbl}</div>
      <div className="val">{val}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}

// Panel with header bar (matches mockup .panel/.ph/.pt)
export function Panel({ title, action, children, style }) {
  return (
    <div className="panel" style={style}>
      {title && (
        <div className="ph">
          <span className="pt">{title}</span>
          {action && <span className="pa">{action}</span>}
        </div>
      )}
      <div className="pbody">{children}</div>
    </div>
  )
}
export const Card = Panel  // alias so existing screens keep working

// Alert strip cards (mockup .astrip/.ac)
export function AlertCard({ tone = 'i', title, children }) {
  return (
    <div className={`ac ${tone}`}>
      <div className="at">{title}</div>
      <div className="am">{children}</div>
    </div>
  )
}

export function Pill({ tone = 'nt', children }) {
  return <span className={`pill ${tone}`}>{children}</span>
}

// columns: [{ key, label, render?(row) }]
export function DataTable({ columns, rows }) {
  return (
    <table className="tbl">
      <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {columns.map(c => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function BarCard({ title, data, xKey, yKey, note, height = 220 }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fill-accent)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="var(--fill-accent)" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <Tooltip formatter={v => fmt(v)} />
          <Bar dataKey={yKey} fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {note && <div className="ms" style={{ marginTop: 8 }}>{note}</div>}
    </Panel>
  )
}

export function LineCard({ title, data, xKey, yKey, height = 220 }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fill-accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--fill-accent)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <Tooltip formatter={v => fmt(v)} />
          <Area type="monotone" dataKey={yKey} stroke="var(--fill-accent)" strokeWidth={2} fill="url(#lineAreaGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  )
}

export { post }
