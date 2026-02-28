import { useState, useEffect } from "react";
import { fetchProjects, createProject } from "../lib/api";
import { Btn, Input, FG } from "../components/ui";

export default function ProjectHome({ user, onSelectProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [createError, setCreateError] = useState("");
    const [newName, setNewName] = useState("");

    const loadProjects = async () => {
        setLoading(true);
        console.log("Current user ID:", user?.id);
        const { data, error } = await fetchProjects();
        if (error) {
            console.error("fetchProjects error:", error);
        } else {
            console.log("Fetched projects:", data);
            if (data) setProjects(data);
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
            console.error("createProject error:", error);
            setCreateError(error.message || "Failed to create project. Check console.");
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

    return (
        <div style={{
            minHeight: "100vh", background: "linear-gradient(145deg,#EFF6FF 0%,#F4F5F7 55%,#F0FDF4 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
            <div style={{ width: 480, background: "#fff", border: "1px solid #E8EAED", borderRadius: 28, padding: 40, boxShadow: "0 28px 72px rgba(0,0,0,.13)" }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <img src="/logo.png" alt="Frixa" style={{ height: 40, width: "auto", objectFit: "contain", marginBottom: 16 }} />
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, color: "#111218", marginBottom: 8 }}>Choose Workspace</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280" }}>Select an existing project or create a new one to start collaborating.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {projects.length === 0 ? (
                        <p style={{ textAlign: "center", padding: "20px 0", color: "#9CA3AF", fontSize: 13, fontStyle: "italic", background: "#F9FAFB", borderRadius: 16, border: "1.5px dashed #E8EAED" }}>
                            No projects found. Create your first one below!
                        </p>
                    ) : (
                        projects.map(p => (
                            <div
                                key={p.id}
                                onClick={() => onSelectProject(p)}
                                style={{
                                    padding: "16px 20px", background: "#F4F5F7", border: "1.5px solid #E8EAED", borderRadius: 16,
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                                    transition: "all .15s"
                                }}
                                className="project-card-hover"
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111218" }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{p.owner_id === user.id ? "Owner" : "Member"}</div>
                                </div>
                                <span style={{ color: "#C4C9D4" }}>→</span>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ height: 1, background: "#E8EAED", margin: "0 -40px 32px" }} />

                {creating ? (
                    <div style={{ animation: "fadeUp .22s ease-out" }}>
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
                            boxShadow: "0 4px 18px rgba(17,18,24,.15)"
                        }}
                    >
                        + Create New Project
                    </button>
                )}
            </div>
            <style>{`
                .project-card-hover:hover {
                    background: #fff !important;
                    border-color: #2563EB !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(37,99,235,.1);
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
