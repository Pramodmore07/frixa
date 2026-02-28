import { useState, useEffect, useCallback } from "react";
import { fetchActivity } from "../lib/api";

export default function ActivityFeed({ project, onClose }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = useCallback(async () => {
        setLoading(true);
        const { data, error } = await fetchActivity(project.id);
        if (!error && data) setLogs(data);
        setLoading(false);
    }, [project.id]);

    useEffect(() => {
        const init = async () => {
            if (project) {
                await Promise.resolve();
                loadLogs();
            }
        };
        init();
    }, [project, loadLogs]);

    const formatAction = (log) => {
        const who = log.users?.email?.split("@")[0] || "Someone";
        const details = log.details || {};
        switch (log.action) {
            case "task_created": return `✨ ${who} created task "${details.title}"`;
            case "task_updated": return `📝 ${who} updated "${details.title}"`;
            case "task_patched": return `🛠 ${who} modified a task`;
            case "tasks_reordered": return `↕️ ${who} reordered tasks in ${details.status}`;
            case "task_archived": return `📦 ${who} archived a task`;
            case "task_restored": return `🔄 ${who} restored a task`;
            case "idea_created": return `💡 ${who} added a new idea`;
            case "idea_voted": return `👍 ${who} voted on "${details.title}"`;
            default: return `⚡ ${who} performed an action`;
        }
    };

    const timeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div style={{
            position: "fixed", top: 80, right: 28, bottom: 28, width: 320, zIndex: 150,
            background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)",
            border: "1px solid #E8EAED", borderRadius: 24, padding: "24px 20px",
            boxShadow: "0 12px 40px rgba(0,0,0,.08)", display: "flex", flexDirection: "column",
            animation: "slideIn .4s cubic-bezier(.22,1,.36,1)"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111218", margin: 0 }}>Recent Activity</h3>
                <button onClick={onClose} style={{ border: "none", background: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {loading ? (
                    <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 40 }}>Loading activity...</p>
                ) : logs.length === 0 ? (
                    <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 40 }}>No activity logged yet.</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.4, fontWeight: 500 }}>
                                {formatAction(log)}
                            </div>
                            <div style={{ fontSize: 10.5, color: "#9CA3AF" }}>{timeAgo(log.created_at)}</div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(30px) scale(0.98); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
