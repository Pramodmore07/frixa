import { useState, useEffect, useCallback } from "react";
import { fetchProjects, createProject, deleteProject } from "../lib/api";

/* ── Delete confirmation inline overlay ── */
function DeleteConfirm({ project, onConfirm, onCancel }) {
    const [input, setInput] = useState("");
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await onConfirm(project.id);
        setDeleting(false);
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(10,12,18,.52)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div style={{
                background: "#fff", borderRadius: 20, padding: 28, width: 400,
                boxShadow: "0 28px 72px rgba(0,0,0,.18)",
                animation: "scaleIn .2s cubic-bezier(.22,1,.36,1)",
                border: "1px solid #E8EAED",
            }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", border: "1.5px solid rgba(220,38,38,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2.5L17.5 16.5H2.5L10 2.5Z" stroke="#DC2626" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M10 8v4M10 13.5v.5" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, color: "#111218", marginBottom: 6 }}>
                    Delete "{project.name}"?
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 20 }}>
                    This permanently deletes the project along with all its tasks, ideas, and stages. This cannot be undone.
                </p>
                <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                        Type <span style={{ fontFamily: "monospace", background: "#F4F5F7", padding: "1px 6px", borderRadius: 5, color: "#DC2626", fontWeight: 700 }}>DELETE</span> to confirm
                    </label>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && input === "DELETE") handleDelete(); if (e.key === "Escape") onCancel(); }}
                        placeholder="Type DELETE"
                        style={{
                            width: "100%", padding: "10px 13px",
                            border: `1.5px solid ${input === "DELETE" ? "#DC2626" : "#E8EAED"}`,
                            borderRadius: 10, fontSize: 14, fontFamily: "'Poppins',sans-serif",
                            fontWeight: 600, color: "#111218", background: "#F8F9FA",
                            outline: "none", boxSizing: "border-box", letterSpacing: "1px",
                            transition: "border-color .2s",
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", border: "1.5px solid #E8EAED", borderRadius: 10, background: "transparent", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={input !== "DELETE" || deleting}
                        style={{
                            flex: 1, padding: "10px 0", border: "none", borderRadius: 10,
                            background: input === "DELETE" ? "#DC2626" : "#F4F5F7",
                            fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700,
                            color: input === "DELETE" ? "#fff" : "#9CA3AF",
                            cursor: input === "DELETE" && !deleting ? "pointer" : "not-allowed",
                            transition: "background .2s, color .2s",
                        }}
                    >{deleting ? "Deleting…" : "Delete Project"}</button>
                </div>
            </div>
            <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }`}</style>
        </div>
    );
}

/* ── Main Projects Page ── */
export default function ProjectsPage({ currentProject, user, onSwitch, onCreateProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingProject, setDeletingProject] = useState(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);
    const [createError, setCreateError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await fetchProjects();
        if (data) setProjects(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (projectId) => {
        await deleteProject(projectId);
        setDeletingProject(null);
        load();
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        setCreateError("");
        const { data, error } = await createProject(newName.trim(), user.id);
        setSaving(false);
        if (error) {
            setCreateError(error.message || "Failed to create project.");
        } else if (data) {
            setNewName("");
            setCreatingNew(false);
            load();
            if (onCreateProject) onCreateProject(data);
        }
    };

    return (
        <div style={{ padding: "28px 28px 64px" }}>
            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Projects</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5, lineHeight: 1.55 }}>All workspaces connected to your account</p>
                </div>
                <button
                    onClick={() => { setCreatingNew(true); setCreateError(""); }}
                    style={{
                        padding: "10px 20px", background: "#111218", color: "#fff",
                        border: "none", borderRadius: 10, fontFamily: "'Poppins',sans-serif",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(0,0,0,.12)", display: "flex", alignItems: "center", gap: 7,
                        transition: "opacity .15s",
                    }}
                    className="btn-hover-ink"
                >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Project
                </button>
            </div>

            {/* ── New project form ── */}
            {creatingNew && (
                <div style={{
                    background: "#fff", border: "1.5px solid #DBEAFE", borderRadius: 18,
                    padding: "20px 22px", marginBottom: 20,
                    boxShadow: "0 4px 24px rgba(37,99,235,.08)",
                    animation: "fadeUp .2s cubic-bezier(.22,1,.36,1)",
                }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111218", marginBottom: 12, fontFamily: "'Poppins',sans-serif" }}>Create New Project</div>
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setCreatingNew(false); setNewName(""); } }}
                        placeholder="Project name…"
                        style={{
                            width: "100%", padding: "11px 14px", border: "1.5px solid #E8EAED",
                            borderRadius: 10, fontSize: 14, fontFamily: "'Poppins',sans-serif",
                            fontWeight: 500, color: "#111218", background: "#F8F9FA",
                            outline: "none", boxSizing: "border-box", marginBottom: 10,
                            transition: "border-color .2s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#E8EAED"; }}
                    />
                    {createError && (
                        <div style={{ fontSize: 12.5, color: "#DC2626", fontWeight: 500, marginBottom: 10 }}>{createError}</div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={handleCreate}
                            disabled={saving || !newName.trim()}
                            style={{
                                padding: "9px 22px", background: saving || !newName.trim() ? "#9CA3AF" : "#111218",
                                color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Poppins',sans-serif",
                                fontSize: 13, fontWeight: 700, cursor: saving || !newName.trim() ? "not-allowed" : "pointer",
                            }}
                        >{saving ? "Creating…" : "Create"}</button>
                        <button
                            onClick={() => { setCreatingNew(false); setNewName(""); setCreateError(""); }}
                            style={{ padding: "9px 18px", background: "transparent", border: "1.5px solid #E8EAED", borderRadius: 10, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}
                        >Cancel</button>
                    </div>
                </div>
            )}

            {/* ── Project list ── */}
            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12, flexDirection: "column" }}>
                    <div style={{ width: 32, height: 32, border: "2.5px solid #E8EAED", borderTop: "2.5px solid #111218", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>Loading projects…</span>
                </div>
            ) : projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 600, color: "#111218", marginBottom: 6 }}>No projects yet</div>
                    <p style={{ fontSize: 13.5, color: "#6B7280" }}>Create your first project to get started.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                    {projects.map((p) => {
                        const isActive = p.id === currentProject?.id;
                        const isOwner = p.owner_id === user?.id;
                        const memberCount = p.project_members?.length ?? 0;

                        return (
                            <div
                                key={p.id}
                                className="proj-card"
                                style={{
                                    background: "#fff",
                                    border: `1.5px solid ${isActive ? "#DBEAFE" : "#E8EAED"}`,
                                    borderRadius: 18,
                                    padding: "20px 22px",
                                    boxShadow: isActive ? "0 4px 20px rgba(37,99,235,.08)" : "0 1px 3px rgba(0,0,0,.04)",
                                    display: "flex", flexDirection: "column", gap: 14,
                                    transition: "border-color .15s, box-shadow .15s, transform .18s",
                                    position: "relative",
                                }}
                            >
                                {/* Top row */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 11, background: isActive ? "#EFF6FF" : "#F4F5F7", border: `1.5px solid ${isActive ? "#DBEAFE" : "#E8EAED"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: isActive ? "#2563EB" : "#9CA3AF" }} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {p.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                                                {isOwner ? "Owner" : "Member"} · Created {new Date(p.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", background: "#DBEAFE", borderRadius: 6, padding: "3px 8px", flexShrink: 0 }}>Active</span>
                                    )}
                                </div>

                                {/* Meta row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <circle cx="5" cy="4.5" r="2.5" stroke="#9CA3AF" strokeWidth="1.2" />
                                            <path d="M1.5 11c0-1.933 1.567-3.5 3.5-3.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                                            <path d="M9.5 8v4M7.5 10h4" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                        <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
                                    </div>
                                </div>

                                {/* Action row */}
                                <div style={{ display: "flex", gap: 8, paddingTop: 4, borderTop: "1px solid #F0F1F3" }}>
                                    {!isActive ? (
                                        <button
                                            onClick={() => onSwitch(p)}
                                            style={{
                                                flex: 1, padding: "8px 0", background: "#111218", color: "#fff",
                                                border: "none", borderRadius: 9, fontFamily: "'Poppins',sans-serif",
                                                fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "opacity .15s",
                                            }}
                                            className="btn-hover-ink"
                                        >Switch to this project</button>
                                    ) : (
                                        <div style={{ flex: 1, padding: "8px 0", textAlign: "center", fontSize: 12.5, fontWeight: 600, color: "#2563EB" }}>
                                            Currently active
                                        </div>
                                    )}
                                    {isOwner && (
                                        <button
                                            onClick={() => setDeletingProject(p)}
                                            title="Delete project"
                                            style={{
                                                width: 34, height: 34, border: "1.5px solid rgba(220,38,38,.2)", borderRadius: 9,
                                                background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0, transition: "all .15s",
                                            }}
                                            className="del-btn-hover"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 3.5h10M5.5 3.5v-1h3v1M5.5 6v5M8.5 6v5M3 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add new card */}
                    <button
                        onClick={() => { setCreatingNew(true); setCreateError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="add-proj-hover"
                        style={{
                            background: "transparent", border: "2px dashed #D1D5DB", borderRadius: 18,
                            padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center",
                            flexDirection: "column", gap: 9, color: "#9CA3AF", fontSize: 13, fontWeight: 500,
                            cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .18s",
                            minHeight: 160,
                        }}
                    >
                        <span style={{ fontSize: 28 }}>📁</span>
                        New project
                    </button>
                </div>
            )}

            {/* ── Delete confirm overlay ── */}
            {deletingProject && (
                <DeleteConfirm
                    project={deletingProject}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingProject(null)}
                />
            )}

            <style>{`
                .proj-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08) !important; }
                .del-btn-hover:hover { background: #FEE2E2 !important; border-color: rgba(220,38,38,.4) !important; }
                .add-proj-hover:hover { background: #F9FAFB !important; border-color: #9CA3AF !important; color: #6B7280 !important; }
                .btn-hover-ink:hover { opacity: .85; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </div>
    );
}
