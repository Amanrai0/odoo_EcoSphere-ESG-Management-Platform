import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = 'http://localhost:8000/api/v1';

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [issues, setIssues] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState('');
  const load = async () => {
    try {
      const [dashboardData, issueData, policyData] = await Promise.all(['dashboard/', 'compliance-issues/', 'policies/'].map(async (path) => {
        const result = await fetch(`${API}/${path}`, { credentials: 'include' });
        if (!result.ok) throw new Error('Sign in through Django admin first.');
        return result.json();
      }));
      setDashboard(dashboardData); setIssues(issueData); setPolicies(policyData); setError('');
    } catch (loadError) { setError(loadError.message); }
  };
  useEffect(() => { load(); }, []);
  const acknowledge = async (id) => { await fetch(`${API}/policies/${id}/acknowledge/`, { method: 'POST', credentials: 'include', headers: { 'X-CSRFToken': cookie('csrftoken') } }); load(); };
  const resolve = async (id) => { await fetch(`${API}/compliance-issues/${id}/`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRFToken': cookie('csrftoken') }, body: JSON.stringify({ status: 'resolved' }) }); load(); };
  return <main><header><div><p className="eyebrow">ECOSPHERE / GOVERNANCE</p><h1>Compliance Command Center</h1></div><button onClick={load}>Refresh data</button></header>{error && <div className="notice">{error} Open <a href="http://localhost:8000/admin/">Django admin</a> and sign in, then return here.</div>}{dashboard && <><section className="metrics"><Metric label="Governance score" value={`${dashboard.governance_score}%`} accent="green"/><Metric label="Open issues" value={dashboard.open_issues} accent="amber"/><Metric label="Overdue issues" value={dashboard.overdue_issues} accent="red"/></section><section className="grid"><article><h2>Department performance</h2>{dashboard.departments.map((department) => <div className="department" key={department.id}><span>{department.name}</span><strong>{department.score}%</strong><div><i style={{ width: `${department.score}%` }}/></div></div>)}</article><article><h2>Policy acknowledgements</h2>{policies.map((policy) => <div className="policy" key={policy.id}><div><strong>{policy.title}</strong><small>v{policy.version} · {policy.status}</small></div>{policy.acknowledged ? <span className="tag success">Acknowledged</span> : policy.status === 'active' ? <button onClick={() => acknowledge(policy.id)}>Acknowledge</button> : <span className="tag">{policy.status}</span>}</div>)}</article></section><section className="panel"><h2>Compliance issues</h2><table><thead><tr><th>Issue</th><th>Department</th><th>Owner</th><th>Due</th><th>Status</th><th /></tr></thead><tbody>{issues.map((issue) => <tr key={issue.id}><td><b className={`severity ${issue.severity}`}>{issue.severity}</b>{issue.description}</td><td>{issue.department}</td><td>{issue.owner}</td><td>{issue.due_date}</td><td><span className={`tag ${issue.status}`}>{issue.status}</span></td><td>{issue.status !== 'resolved' && <button className="secondary" onClick={() => resolve(issue.id)}>Resolve</button>}</td></tr>)}</tbody></table></section></>}</main>;
}
function Metric({ label, value, accent }) { return <article className={`metric ${accent}`}><span>{label}</span><strong>{value}</strong></article>; }
function cookie(name) { return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1] || ''; }
createRoot(document.getElementById('root')).render(<App />);
