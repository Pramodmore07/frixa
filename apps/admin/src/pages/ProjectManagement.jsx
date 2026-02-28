import React, { useState, useEffect } from "react";
import { fetchAllProjects } from "../lib/adminApi";
import { supabase } from "../lib/supabase";

const Spinner = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <div style={{ width: 28, height: 28, border: "2.5px solid #E8EAED", borderTop: "2.5px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
);

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = async () => {
        setLoading(true);
        const res = await fetchAllProjects();
        setProjects(res.data || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openDetail = async (p) => {
        setSelected(p);
        setDetailLoading(true);
        const [{ data: tasks }, { data: ideas }, { data: members }] = await Promise.all([
            supabase.from("tasks").select("*").eq("project_id", p.id).order("created_at", { ascending: false }),
            supabase.from("ideas").select("*").eq("project_id", p.id),
            supabase.from("project_members").select("*, profiles(email, role)").eq("project_id", p.id),
        ]);
        setDetail({ tasks: tasks || [], ideas: ideas || [], members: members || [] });
        setDetailLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) { showToast("Failed to delete: " + error.message, "error"); }
        else { showToast("Project deleted successfully"); setDeleteConfirm(null); setSelected(null); setDetail(null); load(); }
    };

    const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <Spinner />;

    return (
        <div style={{ animation: "fadeUp .4s ease-out" }}>
            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${toast.type === "error" ? "rgba(220,38,38,.25)" : "rgba(5,150,105,.25)"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "'Inter',sans-serif", fontSize: 13, color: toast.type === "error" ? "#B91C1C" : "#065F46", fontWeight: 500, animation: "fadeUp .25s ease both" }}>
                    <span style={{ fontSize: 16 }}>{toast.type === "error" ? "⚠" : "✓"}</span>{toast.msg}
                </div>
            )}

            {/* Delete confirm */}
            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(10,12,18,.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.18)", animation: "scaleIn .25s ease" }}>
                        <div style={{ fontSize: 40, marginBottom: 14 }}>🗑️</div>
                        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Delete "{deleteConfirm.name}"?</h3>
                        <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 24 }}>This will permanently delete the project and all its tasks, ideas, and activity. This cannot be undone.</p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <button onClick={() => setDeleteConfirm(null)} className="ghost-btn" style={{ padding: "10px 22px", border: "1.5px solid #E8EAED", borderRadius: 10, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer", transition: "all .15s" }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} className="danger-btn" style={{ padding: "10px 22px", border: "none", borderRadius: 10, background: "#EF4444", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", transition: "background .15s" }}>Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px" }}>Projects <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Directory</span></h1>
                    <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{projects.length} project{projects.length !== 1 ? "s" : ""} on the platform</p>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
                    style={{ padding: "10px 16px", border: "1.5px solid #E8EAED", borderRadius: 11, background: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "#111218", outline: "none", width: 220, transition: "border-color .15s" }}
                    onFocus={e => e.target.style.borderColor = "#111218"} onBlur={e => e.target.style.borderColor = "#E8EAED"}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
                        <thead>
                            <tr style={{ background: "#F8F9FA" }}>
                                {["#", "Project Name", "Owner ID", "Created", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", borderBottom: "1px solid #F0F1F3" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: "60px 24px", textAlign: "center", color: "#C4C9D4", fontSize: 13 }}>No projects found</td></tr>
                            )}
                            {filtered.map((p, i) => (
                                <tr key={p.id} className="row-hover"
                                    style={{ borderBottom: "1px solid #F4F5F7", cursor: "pointer", transition: "background .1s", background: selected?.id === p.id ? "#F0F7FF" : "transparent" }}
                                    onClick={() => openDetail(p)}>
                                    <td style={{ padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#C4C9D4" }}>{i + 1}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111218" }}>{p.name}</div>
                                        <div style={{ fontSize: 10.5, color: "#9CA3AF", fontFamily: "monospace", marginTop: 2 }}>{p.id.slice(0, 18)}…</div>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>{p.owner_id?.slice(0, 14)}…</div>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{new Date(p.created_at).toLocaleDateString()}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{new Date(p.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <button onClick={e => { e.stopPropagation(); setDeleteConfirm(p); }}
                                            style={{ padding: "5px 12px", border: "1.5px solid #FEE2E2", borderRadius: 8, background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .15s" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#DC2626"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail panel */}
                {selected && (
                    <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)", animation: "scaleIn .2s ease", alignSelf: "start" }}>
                        <div style={{ padding: "18px 20px", borderBottom: "1px solid #F0F1F3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{selected.name}</div>
                            <button onClick={() => { setSelected(null); setDetail(null); }} style={{ width: 28, height: 28, border: "none", background: "#F3F4F6", borderRadius: 7, cursor: "pointer", fontSize: 14, color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        </div>
                        {detailLoading ? <Spinner /> : detail && (
                            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                                {/* Stats row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                    {[{ label: "Tasks", value: detail.tasks.length, bg: "#EFF6FF" }, { label: "Ideas", value: detail.ideas.length, bg: "#FFFBEB" }, { label: "Members", value: detail.members.length, bg: "#F5F3FF" }].map(s => (
                                        <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px", textAlign: "center" }}>
                                            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 800, color: "#111218" }}>{s.value}</div>
                                            <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Members */}
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Members</div>
                                    {detail.members.length === 0
                                        ? <div style={{ fontSize: 12, color: "#C4C9D4", fontStyle: "italic" }}>No members</div>
                                        : detail.members.map(m => (
                                            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #F4F5F7" }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#111218", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{(m.profiles?.email || "?")[0].toUpperCase()}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.profiles?.email || m.user_id}</div>
                                                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{m.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Recent tasks */}
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Recent Tasks</div>
                                    {detail.tasks.slice(0, 5).map(t => {
                                        const priColor = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" }[t.priority] || "#D1D5DB";
                                        return (
                                            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #F4F5F7" }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: priColor, flexShrink: 0 }} />
                                                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                                                {t.archived && <span style={{ fontSize: 10, color: "#9CA3AF" }}>archived</span>}
                                            </div>
                                        );
                                    })}
                                    {detail.tasks.length === 0 && <div style={{ fontSize: 12, color: "#C4C9D4", fontStyle: "italic" }}>No tasks</div>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
