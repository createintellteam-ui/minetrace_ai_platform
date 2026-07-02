import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
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

export function Kpi({ cls = '', lbl, val, sub }) {
  return (
    <div className={`kc ${cls}`}>
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
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <Tooltip formatter={v => fmt(v)} />
          <Bar dataKey={yKey} fill="var(--fill-accent)" radius={[3, 3, 0, 0]} />
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
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <YAxis fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="var(--fill-accent)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

export { post }
