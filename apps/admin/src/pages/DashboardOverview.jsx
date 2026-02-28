import React, { useState, useEffect } from "react";
import { fetchAdminStats, fetchAllTasks } from "../lib/adminApi";
import { supabase } from "../lib/supabase";

const Spinner = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <div style={{ width: 28, height: 28, border: "2.5px solid #E8EAED", borderTop: "2.5px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
);

const StatCard = ({ label, value, icon, bg }) => (
    <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", padding: "24px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.04)"; }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", padding: "3px 8px", borderRadius: 6 }}>Live</span>
        </div>
        <div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 800, color: "#111218", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#6B7280", marginTop: 4 }}>{label}</div>
        </div>
    </div>
);

const ACTION_LABELS = {
    task_created:  { label: "Task Created",   color: "#16A34A", bg: "#F0FDF4" },
    task_updated:  { label: "Task Updated",   color: "#2563EB", bg: "#EFF6FF" },
    task_deleted:  { label: "Task Deleted",   color: "#DC2626", bg: "#FEF2F2" },
    task_archived: { label: "Task Archived",  color: "#D97706", bg: "#FFFBEB" },
    task_restored: { label: "Task Restored",  color: "#7C3AED", bg: "#F5F3FF" },
    idea_created:  { label: "Idea Added",     color: "#D97706", bg: "#FFFBEB" },
    stage_saved:   { label: "Stage Saved",    color: "#6B7280", bg: "#F3F4F6" },
    focus_done:    { label: "Focus Done",     color: "#059669", bg: "#ECFDF5" },
};

export default function DashboardOverview() {
    const [stats, setStats] = useState({ projects: 0, tasks: 0, ideas: 0, users: 0 });
    const [recentTasks, setRecentTasks] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, t, { data: act }] = await Promise.all([
                    fetchAdminStats(),
                    fetchAllTasks(),
                    supabase.from("activity_log").select("*, projects(name)").order("created_at", { ascending: false }).limit(8),
                ]);
                setStats(s);
                setRecentTasks(t.data || []);
                setRecentActivity(act || []);
            } catch (err) {
                console.error("DashboardOverview load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Spinner />;

    const statCards = [
        { label: "Total Projects",   value: stats.projects, icon: "📁", bg: "#EFF6FF" },
        { label: "Total Tasks",      value: stats.tasks,    icon: "✅", bg: "#F0FDF4" },
        { label: "Ideas",            value: stats.ideas,    icon: "💡", bg: "#FFFBEB" },
        { label: "Registered Users", value: stats.users,    icon: "👤", bg: "#F5F3FF" },
    ];

    return (
        <div style={{ animation: "fadeUp .4s ease-out" }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", color: "#111218" }}>
                    Platform <span style={{ fontWeight: 400, color: "#9CA3AF" }}>Overview</span>
                </h1>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>Real-time metrics across all projects and users</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {statCards.map(c => <StatCard key={c.label} {...c} />)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Recent Tasks */}
                <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700 }}>Recent Tasks</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", background: "#F4F5F7", padding: "3px 10px", borderRadius: 6 }}>Latest 20</span>
                    </div>
                    {recentTasks.length === 0
                        ? <div style={{ padding: "48px 24px", textAlign: "center", color: "#C4C9D4" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📋</div><div style={{ fontSize: 13, fontWeight: 600 }}>No tasks yet</div></div>
                        : recentTasks.map(task => {
                            const priColor = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" }[task.priority] || "#D1D5DB";
                            return (
                                <div key={task.id} className="row-hover" style={{ padding: "12px 24px", borderBottom: "1px solid #F4F5F7", display: "flex", alignItems: "center", gap: 12, transition: "background .1s" }}>
                                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: priColor, flexShrink: 0, display: "inline-block" }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{task.projects?.name || "—"} · {new Date(task.created_at).toLocaleDateString()}</div>
                                    </div>
                                    {task.archived && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: "#F3F4F6", color: "#9CA3AF" }}>Archived</span>}
                                </div>
                            );
                        })}
                </div>

                {/* Activity Log */}
                <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8EAED", overflow: "hidden" }}>
                    <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F1F3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700 }}>Activity Log</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", background: "#F4F5F7", padding: "3px 10px", borderRadius: 6 }}>Latest 8</span>
                    </div>
                    {recentActivity.length === 0
                        ? <div style={{ padding: "48px 24px", textAlign: "center", color: "#C4C9D4" }}><div style={{ fontSize: 32, marginBottom: 8 }}>📓</div><div style={{ fontSize: 13, fontWeight: 600 }}>No activity yet</div></div>
                        : recentActivity.map(a => {
                            const meta = ACTION_LABELS[a.action] || { label: a.action, color: "#6B7280", bg: "#F3F4F6" };
                            return (
                                <div key={a.id} className="row-hover" style={{ padding: "12px 24px", borderBottom: "1px solid #F4F5F7", display: "flex", alignItems: "center", gap: 12, transition: "background .1s" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: meta.bg, color: meta.color, whiteSpace: "nowrap", flexShrink: 0 }}>{meta.label}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.projects?.name || "Unknown Project"}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{new Date(a.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
