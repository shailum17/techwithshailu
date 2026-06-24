'use client';

import { useState } from 'react';

type Tab = 'jobs' | 'tools';

interface Job  { _id: string; title: string; company: string; location: string; type: string; is_featured: boolean; }
interface Tool { _id: string; name: string; category: string; url: string; is_free: boolean; is_featured: boolean; }

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [tab,      setTab]      = useState<Tab>('jobs');
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [tools,    setTools]    = useState<Tool[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');

  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: '', type: 'Internship',
    salary: '', batch_year: '', apply_link: '', deadline: '',
    description: '', is_featured: false, tags: '',
  });
  const [toolForm, setToolForm] = useState({
    name: '', description: '', category: 'Coding', url: '',
    icon_url: '', is_free: true, is_featured: false,
  });

  async function fetchData(key: string) {
    setLoading(true);
    const [jr, tr] = await Promise.all([fetch('/api/jobs'), fetch('/api/tools')]);
    setJobs(await jr.json());
    setTools(await tr.json());
    setLoading(false);
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthed(true);
    fetchData(adminKey);
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...jobForm,
      batch_year: jobForm.batch_year ? Number(jobForm.batch_year) : undefined,
      tags: jobForm.tags ? jobForm.tags.split(',').map(t => t.trim()) : [],
    };
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(body),
    });
    setMsg(res.ok ? 'Job added successfully.' : 'Failed. Check admin key.');
    if (res.ok) {
      setJobForm({ title: '', company: '', location: '', type: 'Internship', salary: '', batch_year: '', apply_link: '', deadline: '', description: '', is_featured: false, tags: '' });
      fetchData(adminKey);
    }
    setLoading(false);
  }

  async function createTool(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(toolForm),
    });
    setMsg(res.ok ? 'Tool added successfully.' : 'Failed. Check admin key.');
    if (res.ok) {
      setToolForm({ name: '', description: '', category: 'Coding', url: '', icon_url: '', is_free: true, is_featured: false });
      fetchData(adminKey);
    }
    setLoading(false);
  }

  async function deleteItem(type: 'jobs' | 'tools', id: string) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/${type}/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    fetchData(adminKey);
  }

  const inputClass = `w-full bg-surface-tertiary border border-surface-border rounded-lg px-3 py-2
                      text-ink placeholder-ink-faint text-sm focus:outline-none focus:border-lime/50`;

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center pt-16">
        <div className="bg-white border border-surface-border rounded-2xl p-8 w-full max-w-sm shadow-card">
          <h1 className="font-poppins font-bold text-xl text-ink mb-2">Admin Panel</h1>
          <p className="text-ink-muted text-sm mb-6">Enter your admin key to continue.</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)}
              placeholder="Admin secret key" className={inputClass} required />
            <button type="submit" className="btn-lime w-full py-3">Access Panel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-surface-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-poppins font-bold text-2xl text-ink">Admin Panel</h1>
          <button onClick={() => setAuthed(false)}
            className="text-sm text-ink-muted hover:text-ink transition-colors">
            Logout
          </button>
        </div>

        {msg && (
          <div className="bg-lime-light border border-lime/30 text-lime rounded-xl p-3 mb-6 text-sm text-center">
            {msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['jobs', 'tools'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-lime text-white' : 'bg-white border border-surface-border text-ink-muted hover:text-ink'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Jobs tab */}
        {tab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card">
              <h2 className="font-poppins font-semibold text-ink mb-4">Add New Job</h2>
              <form onSubmit={createJob} className="space-y-3">
                {[
                  { key: 'title',      label: 'Job Title',                required: true },
                  { key: 'company',    label: 'Company',                  required: true },
                  { key: 'location',   label: 'Location',                 required: true },
                  { key: 'salary',     label: 'Salary (e.g. ₹18–24 LPA)' },
                  { key: 'batch_year', label: 'Batch Year', type: 'number' },
                  { key: 'apply_link', label: 'Apply Link (URL)',          required: true },
                  { key: 'deadline',   label: 'Deadline', type: 'date' },
                  { key: 'tags',       label: 'Tags (comma separated)' },
                ].map(({ key, label, required, type }) => (
                  <input key={key} type={type || 'text'} placeholder={label}
                    required={required}
                    value={(jobForm as Record<string, string | boolean>)[key] as string}
                    onChange={e => setJobForm({ ...jobForm, [key]: e.target.value })}
                    className={inputClass} />
                ))}
                <select value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}
                  className={inputClass}>
                  <option>Internship</option><option>Job</option><option>Full-time</option>
                </select>
                <textarea placeholder="Job description (HTML allowed)" required rows={4}
                  value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  className={`${inputClass} resize-none`} />
                <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                  <input type="checkbox" checked={jobForm.is_featured}
                    onChange={e => setJobForm({ ...jobForm, is_featured: e.target.checked })}
                    className="accent-lime" />
                  Featured on homepage
                </label>
                <button type="submit" disabled={loading} className="btn-lime w-full py-2.5 text-sm">
                  {loading ? 'Adding...' : 'Add Job'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-poppins font-semibold text-ink mb-4">All Jobs ({jobs.length})</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {jobs.map(job => (
                  <div key={job._id} className="bg-white border border-surface-border rounded-xl p-4
                                                 flex items-start justify-between gap-3 shadow-card">
                    <div>
                      <p className="text-ink text-sm font-medium">{job.title}</p>
                      <p className="text-ink-muted text-xs">{job.company} · {job.location}</p>
                      {job.is_featured && <span className="tag-lime text-xs mt-1 inline-block">Featured</span>}
                    </div>
                    <button onClick={() => deleteItem('jobs', job._id)}
                      className="text-red-500 hover:text-red-600 text-xs flex-shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
                {jobs.length === 0 && <p className="text-ink-muted text-sm">No jobs yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Tools tab */}
        {tab === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card">
              <h2 className="font-poppins font-semibold text-ink mb-4">Add New AI Tool</h2>
              <form onSubmit={createTool} className="space-y-3">
                {[
                  { key: 'name', label: 'Tool Name', required: true },
                  { key: 'url',  label: 'Tool URL',  required: true },
                  { key: 'icon_url', label: 'Icon URL (optional)' },
                ].map(({ key, label, required }) => (
                  <input key={key} type="text" placeholder={label} required={required}
                    value={(toolForm as Record<string, string | boolean>)[key] as string}
                    onChange={e => setToolForm({ ...toolForm, [key]: e.target.value })}
                    className={inputClass} />
                ))}
                <textarea placeholder="One-line description" required rows={2}
                  value={toolForm.description}
                  onChange={e => setToolForm({ ...toolForm, description: e.target.value })}
                  className={`${inputClass} resize-none`} />
                <select value={toolForm.category} onChange={e => setToolForm({ ...toolForm, category: e.target.value })}
                  className={inputClass}>
                  {['Coding','Writing','Image','Productivity','Research'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-4">
                  {[
                    { label: 'Free tool', key: 'is_free', val: toolForm.is_free },
                    { label: 'Featured',  key: 'is_featured', val: toolForm.is_featured },
                  ].map(({ label, key, val }) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                      <input type="checkbox" checked={val as boolean}
                        onChange={e => setToolForm({ ...toolForm, [key]: e.target.checked })}
                        className="accent-lime" />
                      {label}
                    </label>
                  ))}
                </div>
                <button type="submit" disabled={loading} className="btn-lime w-full py-2.5 text-sm">
                  {loading ? 'Adding...' : 'Add Tool'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-poppins font-semibold text-ink mb-4">All Tools ({tools.length})</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tools.map(tool => (
                  <div key={tool._id} className="bg-white border border-surface-border rounded-xl p-4
                                                  flex items-start justify-between gap-3 shadow-card">
                    <div>
                      <p className="text-ink text-sm font-medium">{tool.name}</p>
                      <p className="text-ink-muted text-xs">{tool.category} · {tool.is_free ? 'Free' : 'Paid'}</p>
                      {tool.is_featured && <span className="tag-lime text-xs mt-1 inline-block">Featured</span>}
                    </div>
                    <button onClick={() => deleteItem('tools', tool._id)}
                      className="text-red-500 hover:text-red-600 text-xs flex-shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
                {tools.length === 0 && <p className="text-ink-muted text-sm">No tools yet.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
