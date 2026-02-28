import { useState } from "react";
import { MONTHS } from "../constants";

function DeleteConfirmModal({ task, onConfirm, onCancel }) {
    const [typed, setTyped] = useState("");
    const ready = typed === "DELETE";

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(10,12,18,.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,.22)", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px" }}>🗑</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#111218" }}>Permanently delete task?</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
                    <strong style={{ color: "#111218" }}>"{task.title}"</strong> will be deleted forever. This cannot be undone.
                </p>

                <div style={{ textAlign: "left", marginBottom: 20 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 7, letterSpacing: ".02em" }}>
                        Type <strong style={{ fontFamily: "monospace", color: "#EF4444", background: "#FEF2F2", padding: "1px 5px", borderRadius: 4 }}>DELETE</strong> to confirm
                    </label>
                    <input
                        autoFocus
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        placeholder="DELETE"
                        style={{
                            width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
                            border: `2px solid ${ready ? "#EF4444" : "#E8EAED"}`,
                            fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700,
                            color: ready ? "#EF4444" : "#111218",
                            outline: "none", textAlign: "center", letterSpacing: 2,
                            background: ready ? "#FEF2F2" : "#fff",
                            transition: "border-color .15s, background .15s",
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter" && ready) onConfirm(); if (e.key === "Escape") onCancel(); }}
                    />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onCancel}
                        style={{ flex: 1, padding: "11px", border: "1.5px solid #E8EAED", borderRadius: 10, background: "transparent", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={!ready}
                        style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", background: ready ? "#EF4444" : "#F3F4F6", color: ready ? "#fff" : "#C4C9D4", transition: "all .15s", boxShadow: ready ? "0 4px 14px rgba(239,68,68,.3)" : "none" }}>
                        🗑 Delete Forever
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ArchivePage({ tasks, stages = [], onRestore, onDelete }) {
    const [deleteTarget, setDeleteTarget] = useState(null); // task object
    const archived = tasks.filter((t) => t.archived);
    const getStageLabel = (id) => stages.find((s) => s.id === id)?.label ?? id;

    const handleDelete = () => {
        if (deleteTarget) { onDelete(deleteTarget.id); setDeleteTarget(null); }
    };

    return (
        <div style={{ padding: "28px 28px 64px" }}>
            {/* header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Archive</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5 }}>Completed &amp; shelved tasks</p>
                </div>
                <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: "10px 18px", textAlign: "center", minWidth: 72 }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, color: "#8B5CF6" }}>{archived.length}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 3 }}>Archived</div>
                </div>
            </div>

            {archived.length === 0 ? (
                <div style={{ textAlign: "center", padding: "72px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
                    <p style={{ fontSize: 15, lineHeight: 1.75 }}>Nothing archived yet.<br />Completed tasks will appear here.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 800 }}>
                    {archived.map((t) => {
                        const dl = t.date ? new Date(t.date) : null;
                        const dlS = dl ? `${MONTHS[dl.getMonth()]} ${dl.getDate()}, ${dl.getFullYear()}` : "No deadline";
                        return (
                            <div key={t.id} className="row-hover"
                                style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)", transition: "box-shadow .15s" }}
                            >
                                <div style={{ width: 22, height: 22, flexShrink: 0, background: "#8B5CF6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>✓</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#6B7280", textDecoration: "line-through", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{t.title}</div>
                                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                                        {t.archived ? "Archived" : `Stage: ${getStageLabel(t.status)}`} · {dlS}
                                        {t.tags?.length ? " · " + t.tags.join(" ") : ""}
                                    </div>
                                </div>

                                {/* restore */}
                                <button onClick={() => onRestore(t.id)} className="restore-hover"
                                    style={{ padding: "5px 13px", border: "1.5px solid #E8EAED", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}>
                                    ↩ Restore
                                </button>

                                {/* delete */}
                                <button
                                    onClick={() => setDeleteTarget(t)}
                                    title="Delete permanently"
                                    style={{ padding: "5px 10px", border: "1.5px solid #FEE2E2", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >🗑</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    task={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
