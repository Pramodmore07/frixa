import React, { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectManagement from './pages/ProjectManagement';
import { supabase } from './lib/supabase';

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
    <div style={{ width: 28, height: 28, border: "2.5px solid #E8EAED", borderTop: "2.5px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

const TH = ({ children }) => <th style={{ padding: "11px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", borderBottom: "1px solid #F0F1F3", background: "#F8F9FA", whiteSpace: "nowrap" }}>{children}</th>;

/* ══════════════════════════════ TASKS PANEL ══════════════════════════════ */
function TasksPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase.from("tasks").select("*, projects(name)").order("created_at", { ascending: false })
      .then(({ data }) => { setTasks(data || []); setLoading(false); });
  }, []);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "archived") return matchSearch && t.archived;
    if (filter === "active") return matchSearch && !t.archived;
    return matchSearch;
  });

  return (
    <div style={{ animation: "fadeUp .4s ease-out" }}>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>All <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Tasks</span></h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{tasks.length} tasks across all projects</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {["all", "active", "archived"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", border: "1.5px solid #E8EAED", borderRadius: 10, background: filter === f ? "#111218" : "#fff", color: filter === f ? "#fff" : "#6B7280", fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all .15s", textTransform: "capitalize" }}>{f}</button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            style={{ padding: "9px 14px", border: "1.5px solid #E8EAED", borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: "none", width: 200, transition: "border-color .15s" }}
            onFocus={e => e.target.style.borderColor = "#111218"} onBlur={e => e.target.style.borderColor = "#E8EAED"} />
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
            <thead><tr><TH>#</TH><TH>Title</TH><TH>Project</TH><TH>Priority</TH><TH>Status</TH><TH>Created</TH></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: "60px", textAlign: "center", color: "#C4C9D4" }}>No tasks found</td></tr>}
              {filtered.map((t, i) => {
                const pri = { high: { bg: "#FEF2F2", fg: "#DC2626" }, medium: { bg: "#FFFBEB", fg: "#D97706" }, low: { bg: "#F0FDF4", fg: "#16A34A" } }[t.priority] || null;
                return (
                  <tr key={t.id} className="row-hover" style={{ borderBottom: "1px solid #F4F5F7", transition: "background .1s" }}>
                    <td style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#C4C9D4" }}>{i + 1}</td>
                    <td style={{ padding: "12px 20px", maxWidth: 260 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>}
                    </td>
                    <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{t.projects?.name || "—"}</span></td>
                    <td style={{ padding: "12px 20px" }}>{pri ? <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: pri.bg, color: pri.fg, textTransform: "uppercase", letterSpacing: ".05em" }}>{t.priority}</span> : <span style={{ color: "#E5E7EB" }}>—</span>}</td>
                    <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: t.archived ? "#F3F4F6" : "#F0FDF4", color: t.archived ? "#9CA3AF" : "#16A34A" }}>{t.archived ? "Archived" : "Active"}</span></td>
                    <td style={{ padding: "12px 20px", fontSize: 12.5, color: "#6B7280", fontWeight: 500 }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ USERS PANEL ══════════════════════════════ */
function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = () => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", u.id);
    if (error) showToast("Failed: " + error.message, "error");
    else { showToast(`${u.email} is now ${newRole}`); load(); }
  };

  const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "fadeUp .4s ease-out" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${toast.type === "error" ? "rgba(220,38,38,.25)" : "rgba(5,150,105,.25)"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "'Inter',sans-serif", fontSize: 13, color: toast.type === "error" ? "#B91C1C" : "#065F46", fontWeight: 500, animation: "fadeUp .25s ease both" }}>
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>{toast.msg}
        </div>
      )}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>Users <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Management</span></h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email..."
          style={{ padding: "9px 14px", border: "1.5px solid #E8EAED", borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: "none", width: 220, transition: "border-color .15s" }}
          onFocus={e => e.target.style.borderColor = "#111218"} onBlur={e => e.target.style.borderColor = "#E8EAED"} />
      </div>
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
            <thead><tr><TH>#</TH><TH>User</TH><TH>Role</TH><TH>Joined</TH><TH>Actions</TH></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "#C4C9D4" }}>No users found</td></tr>}
              {filtered.map((u, i) => (
                <tr key={u.id} className="row-hover" style={{ borderBottom: "1px solid #F4F5F7", transition: "background .1s" }}>
                  <td style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#C4C9D4" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#111218", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{u.email?.[0]?.toUpperCase() ?? "?"}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218" }}>{u.email}</div>
                        <div style={{ fontSize: 10.5, color: "#9CA3AF", fontFamily: "monospace" }}>{u.id.slice(0, 20)}…</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".05em", background: u.role === "admin" ? "#111218" : "#F0FDF4", color: u.role === "admin" ? "#fff" : "#16A34A" }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => toggleRole(u)}
                      style={{ padding: "5px 12px", border: "1.5px solid #E8EAED", borderRadius: 8, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#111218"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#111218"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "#E8EAED"; }}>
                      Make {u.role === "admin" ? "User" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ IDEAS PANEL ══════════════════════════════ */
function IdeasPanel() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("ideas").select("*, projects(name)").order("votes", { ascending: false })
      .then(({ data }) => { setIdeas(data || []); setLoading(false); });
  }, []);

  const CAT_STYLE = { feature: { bg: "#EFF6FF", fg: "#2563EB" }, bug: { bg: "#FEF2F2", fg: "#DC2626" }, improvement: { bg: "#F0FDF4", fg: "#16A34A" }, other: { bg: "#F3F4F6", fg: "#6B7280" } };
  const filtered = ideas.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "fadeUp .4s ease-out" }}>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>Ideas <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Bank</span></h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{ideas.length} ideas across all projects</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ideas..."
          style={{ padding: "9px 14px", border: "1.5px solid #E8EAED", borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: "none", width: 220, transition: "border-color .15s" }}
          onFocus={e => e.target.style.borderColor = "#111218"} onBlur={e => e.target.style.borderColor = "#E8EAED"} />
      </div>
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
            <thead><tr><TH>#</TH><TH>Title</TH><TH>Project</TH><TH>Category</TH><TH>Votes</TH><TH>Created</TH></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ padding: "60px", textAlign: "center", color: "#C4C9D4" }}>No ideas found</td></tr>}
              {filtered.map((idea, i) => {
                const cat = CAT_STYLE[idea.category] || CAT_STYLE.other;
                return (
                  <tr key={idea.id} className="row-hover" style={{ borderBottom: "1px solid #F4F5F7", transition: "background .1s" }}>
                    <td style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#C4C9D4" }}>{i + 1}</td>
                    <td style={{ padding: "12px 20px", maxWidth: 280 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea.title}</div>
                      {idea.description && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea.description}</div>}
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{idea.projects?.name || "—"}</td>
                    <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: cat.bg, color: cat.fg, textTransform: "capitalize" }}>{idea.category || "other"}</span></td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: idea.votes > 0 ? "#2563EB" : "#9CA3AF" }}>▲ {idea.votes || 0}</span>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: 12.5, color: "#6B7280", fontWeight: 500 }}>{new Date(idea.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ ACTIVITY PANEL ══════════════════════════ */
function ActivityPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("activity_log").select("*, projects(name)").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  const ACTION_LABELS = {
    task_created:  { label: "Task Created",  color: "#16A34A", bg: "#F0FDF4" },
    task_updated:  { label: "Task Updated",  color: "#2563EB", bg: "#EFF6FF" },
    task_deleted:  { label: "Task Deleted",  color: "#DC2626", bg: "#FEF2F2" },
    task_archived: { label: "Task Archived", color: "#D97706", bg: "#FFFBEB" },
    task_restored: { label: "Task Restored", color: "#7C3AED", bg: "#F5F3FF" },
    idea_created:  { label: "Idea Added",    color: "#D97706", bg: "#FFFBEB" },
    stage_saved:   { label: "Stage Saved",   color: "#6B7280", bg: "#F3F4F6" },
    focus_done:    { label: "Focus Done",    color: "#059669", bg: "#ECFDF5" },
  };

  return (
    <div style={{ animation: "fadeUp .4s ease-out" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>Activity <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Log</span></h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>Full audit trail across all projects · Last 100 events</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
        {loading ? <Spinner /> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
            <thead><tr><TH>#</TH><TH>Action</TH><TH>Project</TH><TH>Details</TH><TH>Timestamp</TH></tr></thead>
            <tbody>
              {logs.length === 0 && <tr><td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "#C4C9D4" }}>No activity yet</td></tr>}
              {logs.map((a, i) => {
                const meta = ACTION_LABELS[a.action] || { label: a.action, color: "#6B7280", bg: "#F3F4F6" };
                return (
                  <tr key={a.id} className="row-hover" style={{ borderBottom: "1px solid #F4F5F7", transition: "background .1s" }}>
                    <td style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#C4C9D4" }}>{i + 1}</td>
                    <td style={{ padding: "12px 20px" }}><span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                    <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#374151" }}>{a.projects?.name || "—"}</td>
                    <td style={{ padding: "12px 20px", maxWidth: 200 }}>
                      <div style={{ fontSize: 11.5, color: "#9CA3AF", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{JSON.stringify(a.details)}</div>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{new Date(a.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{new Date(a.created_at).toLocaleTimeString()}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ SETTINGS PANEL ══════════════════════════ */
function SettingsPanel() {
  const [adminEmail, setAdminEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAdminEmail(data?.user?.email || ""));
  }, []);

  const changePassword = async () => {
    if (!pwForm.next || pwForm.next !== pwForm.confirm) { showToast("Passwords do not match", "error"); return; }
    if (pwForm.next.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwLoading(false);
    if (error) showToast("Failed: " + error.message, "error");
    else { showToast("Password updated successfully"); setPwForm({ current: "", next: "", confirm: "" }); }
  };

  const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0F1F3" }}>
      <div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{ width: 42, height: 24, borderRadius: 99, border: "none", background: value ? "#111218" : "#E5E7EB", position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.2)", transition: "left .2s", display: "block" }} />
      </button>
    </div>
  );

  const [toggles, setToggles] = useState({ registrations: true, guestMode: true, activityLog: true });
  const setToggle = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ animation: "fadeUp .4s ease-out" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${toast.type === "error" ? "rgba(220,38,38,.25)" : "rgba(5,150,105,.25)"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "'Inter',sans-serif", fontSize: 13, color: toast.type === "error" ? "#B91C1C" : "#065F46", fontWeight: 500, animation: "fadeUp .25s ease both" }}>
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>{toast.msg}
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>System <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Settings</span></h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>Platform configuration and admin preferences</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Platform Toggles */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", padding: "24px 28px" }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Platform Controls</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Toggle platform-wide features</div>
          <Toggle label="User Registrations" desc="Allow new users to sign up" value={toggles.registrations} onChange={() => setToggle("registrations")} />
          <Toggle label="Guest Mode" desc="Allow dashboard access without login" value={toggles.guestMode} onChange={() => setToggle("guestMode")} />
          <Toggle label="Activity Logging" desc="Record all user actions in activity log" value={toggles.activityLog} onChange={() => setToggle("activityLog")} />
        </div>

        {/* Admin Account */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", padding: "24px 28px" }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Admin Account</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Manage your admin credentials</div>
          <div style={{ padding: "12px 16px", background: "#F8F9FA", borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#111218", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800 }}>{adminEmail?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111218" }}>{adminEmail}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Administrator · Verified</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[["New Password", "next", "password"], ["Confirm Password", "confirm", "password"]].map(([label, key, type]) => (
              <div key={key}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{label}</div>
                <input type={type} value={pwForm[key]} onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))} placeholder="••••••••"
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E8EAED", borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: "none", transition: "border-color .15s" }}
                  onFocus={e => e.target.style.borderColor = "#111218"} onBlur={e => e.target.style.borderColor = "#E8EAED"} />
              </div>
            ))}
            <button onClick={changePassword} disabled={pwLoading} className="btn-hover"
              style={{ marginTop: 4, padding: "10px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, cursor: pwLoading ? "not-allowed" : "pointer", opacity: pwLoading ? 0.7 : 1, transition: "opacity .15s" }}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>

        {/* System Info */}
        <div style={{ background: "#111218", borderRadius: 18, padding: "24px 28px", color: "#fff" }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>System Info</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>Platform diagnostics</div>
          {[
            ["Platform", "Frixa v2.0"],
            ["Database", "Supabase PostgreSQL"],
            ["Auth", "Supabase Auth"],
            ["Frontend", "React 19 + Vite"],
            ["Status", "● Online"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#6B7280" }}>{k}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: k === "Status" ? "#22C55E" : "#fff" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #FEE2E2", padding: "24px 28px" }}>
          <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4, color: "#DC2626" }}>Danger Zone</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Irreversible platform actions</div>
          {[
            { label: "Export All Data", desc: "Download a full JSON export of all platform data", btn: "Export", color: "#374151", border: "#E8EAED" },
            { label: "Clear Activity Log", desc: "Permanently delete all activity log entries", btn: "Clear Log", color: "#DC2626", border: "#FEE2E2" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0F1F3" }}>
              <div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{item.desc}</div>
              </div>
              <button style={{ padding: "7px 16px", border: `1.5px solid ${item.border}`, borderRadius: 9, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 700, color: item.color, cursor: "pointer", transition: "all .15s", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = item.color; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = item.color; }}>
                {item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ MAIN APP ════════════════════════════════ */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const checkRole = async (session) => {
      setIsVerifying(true);
      if (!session) { setIsLoggedIn(false); setIsVerifying(false); return; }
      const failsafe = setTimeout(() => { setIsVerifying(false); }, 10000);
      try {
        const { data, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        if (error || data?.role !== "admin") {
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          if (data?.role !== "admin") alert("Access Denied: Administrative privileges required.");
        } else {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        clearTimeout(failsafe);
        setIsVerifying(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => checkRole(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => checkRole(session));
    return () => subscription.unsubscribe();
  }, []);

  if (isVerifying) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F5F7", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E2E4E8", borderTop: "3px solid #111218", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontWeight: 700, color: "#111218", fontSize: 14 }}>Verifying Authorization…</p>
        <style>{`@keyframes spin { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsVerifying(true)} />;

  const PANELS = { overview: <DashboardOverview />, projects: <ProjectManagement />, tasks: <TasksPanel />, users: <UsersPanel />, ideas: <IdeasPanel />, activity: <ActivityPanel />, settings: <SettingsPanel /> };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={async () => { await supabase.auth.signOut(); setIsLoggedIn(false); }}>
      {PANELS[activeTab] || <DashboardOverview />}
    </AdminLayout>
  );
}

export default App;
