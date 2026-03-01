import { useState, useEffect } from "react";
import { fetchProjects, createProject } from "../lib/api";
import { Btn, Input, FG } from "../components/ui";

const RECENT_LIMIT = 5;

export default function ProjectHome({ user, onSelectProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [createError, setCreateError] = useState("");
    const [newName, setNewName] = useState("");
    const [showAll, setShowAll] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        const { data, error } = await fetchProjects();
        if (!error && data) {
            // Sort newest first
            const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setProjects(sorted);
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await Promise.resolve();
            loadProjects();
        };
        init();
    }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        setCreateError("");
        const { data, error } = await createProject(newName.trim(), user.id);
        setSaving(false);
        if (error) {
            setCreateError(error.message || "Failed to create project.");
        } else if (data) {
            onSelectProject(data);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, border: "3px solid #E8EAED", borderTop: "3px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const displayed = showAll ? projects : projects.slice(0, RECENT_LIMIT);
    const hasMore = projects.length > RECENT_LIMIT;

    return (
        <div style={{
            minHeight: "100vh", background: "linear-gradient(145deg,#F4F5F7 0%,#FAFAFA 55%,#F1F5F9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
            <div style={{ width: 480, background: "#fff", border: "1px solid #E8EAED", borderRadius: 28, padding: 40, boxShadow: "0 28px 72px rgba(0,0,0,.13)" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <img src="/logo.png" alt="Frixa" style={{ height: 40, width: "auto", objectFit: "contain", marginBottom: 16 }} />
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, color: "#111218", marginBottom: 8 }}>Choose Workspace</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280" }}>Select an existing project or create a new one to start collaborating.</p>
                </div>

                {/* Section label */}
                {projects.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif" }}>
                            Recent Projects
                        </span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'Poppins',sans-serif" }}>
                            {projects.length} total
                        </span>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {projects.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px 0", color: "#9CA3AF", fontSize: 13, fontStyle: "italic", background: "#F9FAFB", borderRadius: 16, border: "1.5px dashed #E8EAED" }}>
                            No projects found. Create your first one below!
                        </p>
                    ) : (
                        displayed.map(p => (
                            <div
                                key={p.id}
                                onClick={() => onSelectProject(p)}
                                style={{
                                    padding: "14px 18px", background: "#F4F5F7", border: "1.5px solid #E8EAED", borderRadius: 14,
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                                    transition: "all .15s"
                                }}
                                className="project-card-hover"
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "#fff", border: "1.5px solid #E8EAED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9CA3AF" }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                        <div style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 1 }}>
                                            {p.owner_id === user.id ? "Owner" : "Member"} · {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#C4C9D4", flexShrink: 0 }}>
                                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ))
                    )}
                </div>

                {/* See all / Collapse toggle */}
                {hasMore && (
                    <button
                        onClick={() => setShowAll(v => !v)}
                        style={{
                            width: "100%", padding: "9px 0", border: "1.5px solid #E8EAED",
                            borderRadius: 12, background: "transparent", fontFamily: "'Poppins',sans-serif",
                            fontSize: 12.5, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                            marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            transition: "all .15s",
                        }}
                        className="see-all-btn"
                    >
                        {showAll ? (
                            <>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 8L6 4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Show less
                            </>
                        ) : (
                            <>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                See all {projects.length} projects
                            </>
                        )}
                    </button>
                )}

                <div style={{ height: 1, background: "#E8EAED", margin: `0 -40px ${hasMore ? "20" : "32"}px` }} />

                {creating ? (
                    <div style={{ animation: "fadeUp .22s ease-out", marginTop: hasMore ? 0 : 8 }}>
                        <FG label="Project Name">
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter project name..."
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />
                        </FG>
                        {createError && (
                            <p style={{ fontSize: 12.5, color: "#DC2626", fontWeight: 500, marginTop: 8 }}>{createError}</p>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                            <Btn onClick={handleCreate} disabled={saving} style={{ flex: 1 }}>
                                {saving ? "Creating…" : "Create Project"}
                            </Btn>
                            <button
                                onClick={() => { setCreating(false); setCreateError(""); setNewName(""); }}
                                style={{ padding: "0 16px", background: "transparent", border: "none", color: "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                            >Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setCreating(true)}
                        style={{
                            width: "100%", padding: "14px", background: "#111218", color: "#fff", border: "none", borderRadius: 14,
                            fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
                            boxShadow: "0 4px 18px rgba(17,18,24,.15)", marginTop: hasMore ? 0 : 8,
                        }}
                    >
                        + Create New Project
                    </button>
                )}
            </div>
            <style>{`
                .project-card-hover:hover {
                    background: #fff !important;
                    border-color: #475569 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(71,85,105,.1);
                }
                .see-all-btn:hover { background: #F4F5F7 !important; color: #374151 !important; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
