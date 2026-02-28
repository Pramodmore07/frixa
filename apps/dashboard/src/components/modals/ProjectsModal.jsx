import { useState, useEffect } from "react";
import { Modal } from "../ui";
import { fetchProjects, deleteProject } from "../../lib/api";

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
        }}
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div style={{
                background: "#fff", borderRadius: 20, padding: 28, width: 400,
                boxShadow: "0 28px 72px rgba(0,0,0,.18)",
                animation: "scaleIn .2s cubic-bezier(.22,1,.36,1)",
                border: "1px solid #E8EAED",
            }}>
                {/* Warning icon */}
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
                    This will permanently delete the project and all its tasks, ideas, and stages. This action cannot be undone.
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
                            width: "100%", padding: "10px 13px", border: `1.5px solid ${input === "DELETE" ? "#DC2626" : "#E8EAED"}`,
                            borderRadius: 10, fontSize: 14, fontFamily: "'Poppins',sans-serif",
                            fontWeight: 600, color: "#111218", background: "#F8F9FA",
                            outline: "none", boxSizing: "border-box", letterSpacing: "1px",
                            transition: "border-color .2s",
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: "10px 0", border: "1.5px solid #E8EAED", borderRadius: 10,
                            background: "transparent", fontFamily: "'Poppins',sans-serif",
                            fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                        }}
                    >Cancel</button>
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
        </div>
    );
}

export default function ProjectsModal({ currentProject, onSwitch, onClose }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingProject, setDeletingProject] = useState(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const { data } = await fetchProjects();
        if (data) setProjects(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (projectId) => {
        await deleteProject(projectId);
        setDeletingProject(null);
        await load();
    };

    const handleSwitch = (p) => {
        onSwitch(p);
        onClose();
    };

    return (
        <>
            <Modal onClose={onClose} title="All Projects">
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                        <div style={{ width: 28, height: 28, border: "2.5px solid #E8EAED", borderTop: "2.5px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    </div>
                ) : projects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: "#9CA3AF", fontSize: 13.5 }}>No projects found.</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                        {projects.map((p) => {
                            const isActive = p.id === currentProject?.id;
                            return (
                                <div
                                    key={p.id}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "12px 14px", borderRadius: 14,
                                        border: `1.5px solid ${isActive ? "#DBEAFE" : "#F0F1F3"}`,
                                        background: isActive ? "#F0F6FF" : "#FAFAFA",
                                        transition: "border-color .15s, background .15s",
                                    }}
                                >
                                    {/* Dot */}
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: isActive ? "#2563EB" : "#D1D5DB", flexShrink: 0 }} />

                                    {/* Name + meta */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: isActive ? 700 : 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {p.name}
                                        </div>
                                        {p.created_at && (
                                            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                                                Created {new Date(p.created_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Active badge */}
                                    {isActive && (
                                        <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", background: "#DBEAFE", borderRadius: 6, padding: "2px 8px", flexShrink: 0 }}>Active</span>
                                    )}

                                    {/* Switch button */}
                                    {!isActive && (
                                        <button
                                            onClick={() => handleSwitch(p)}
                                            style={{
                                                padding: "5px 14px", border: "1.5px solid #E8EAED", borderRadius: 8,
                                                background: "#fff", fontFamily: "'Poppins',sans-serif",
                                                fontSize: 12, fontWeight: 600, color: "#374151",
                                                cursor: "pointer", flexShrink: 0, transition: "all .15s",
                                            }}
                                            className="proj-switch-btn"
                                        >Switch</button>
                                    )}

                                    {/* Delete button */}
                                    <button
                                        onClick={() => setDeletingProject(p)}
                                        title="Delete project"
                                        style={{
                                            width: 30, height: 30, border: "1.5px solid rgba(220,38,38,.2)", borderRadius: 8,
                                            background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0, transition: "all .15s",
                                        }}
                                        className="proj-del-btn"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M2 3.5h9M5 3.5V2.5h3v1M5.5 5.5v4M7.5 5.5v4M3 3.5l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* New project inline form */}
                <div style={{ borderTop: "1px solid #F0F1F3", paddingTop: 14 }}>
                    {creatingNew ? (
                        <div>
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        if (!newName.trim()) return;
                                        setSaving(true);
                                        const { createProject } = await import("../../lib/api");
                                        const { data } = await createProject(newName.trim());
                                        setSaving(false);
                                        if (data) { setNewName(""); setCreatingNew(false); load(); }
                                    }
                                    if (e.key === "Escape") { setCreatingNew(false); setNewName(""); }
                                }}
                                placeholder="Project name…"
                                style={{
                                    width: "100%", padding: "10px 13px", border: "1.5px solid #DBEAFE",
                                    borderRadius: 10, fontSize: 13, fontFamily: "'Poppins',sans-serif",
                                    fontWeight: 500, color: "#111218", background: "#F8FAFF",
                                    outline: "none", boxSizing: "border-box", marginBottom: 8,
                                }}
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                                <button
                                    onClick={async () => {
                                        if (!newName.trim()) return;
                                        setSaving(true);
                                        const { createProject } = await import("../../lib/api");
                                        const { data } = await createProject(newName.trim());
                                        setSaving(false);
                                        if (data) { setNewName(""); setCreatingNew(false); load(); }
                                    }}
                                    disabled={saving || !newName.trim()}
                                    style={{ flex: 1, padding: "9px 0", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif" }}
                                >{saving ? "Creating…" : "Create"}</button>
                                <button
                                    onClick={() => { setCreatingNew(false); setNewName(""); }}
                                    style={{ padding: "9px 14px", background: "#F4F5F7", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
                                >Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setCreatingNew(true)}
                            style={{
                                width: "100%", padding: "10px 14px", border: "1.5px dashed #D1D5DB",
                                borderRadius: 12, background: "transparent", fontFamily: "'Poppins',sans-serif",
                                fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 8, transition: "all .15s",
                            }}
                            className="proj-new-btn"
                        >
                            <span style={{ fontSize: 18, lineHeight: 1, color: "#9CA3AF" }}>+</span> New Project
                        </button>
                    )}
                </div>
            </Modal>

            {deletingProject && (
                <DeleteConfirm
                    project={deletingProject}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingProject(null)}
                />
            )}

            <style>{`
                .proj-switch-btn:hover { background: #F4F5F7 !important; border-color: #D1D5DB !important; }
                .proj-del-btn:hover { background: #FEE2E2 !important; border-color: rgba(220,38,38,.4) !important; }
                .proj-new-btn:hover { background: #F9FAFB !important; border-color: #9CA3AF !important; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}
