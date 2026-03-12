import { useState } from "react";
import { MONTHS } from "../constants";
import { NOTE_COLORS } from "../components/modals/NoteModal";

function DeleteConfirmModal({ item, onConfirm, onCancel }) {
    const [typed, setTyped] = useState("");
    const ready = typed === "DELETE";

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(10,12,18,.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,.22)", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 16px" }}>🗑</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#111218" }}>Permanently delete?</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
                    <strong style={{ color: "#111218" }}>"{item.title}"</strong> will be deleted forever. This cannot be undone.
                </p>
                <div style={{ textAlign: "left", marginBottom: 20 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 7, letterSpacing: ".02em" }}>
                        Type <strong style={{ fontFamily: "monospace", color: "#EF4444", background: "#FEF2F2", padding: "1px 5px", borderRadius: 4 }}>DELETE</strong> to confirm
                    </label>
                    <input
                        autoFocus
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
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

export default function ArchivePage({ tasks, stages = [], onRestore, onDelete, notes = [], onRestoreNote, onDeleteNote }) {
    const [tab, setTab] = useState("tasks");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const archived = tasks.filter((t) => t.archived);
    const getStageLabel = (id) => stages.find((s) => s.id === id)?.label ?? id;

    const handleDelete = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === "task") onDelete(deleteTarget.item.id);
        else onDeleteNote(deleteTarget.item.id);
        setDeleteTarget(null);
    };

    const tabBtn = (key, label, count) => (
        <button
            onClick={() => setTab(key)}
            style={{
                padding: "8px 20px", border: "none", borderRadius: 10,
                fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all .15s",
                background: tab === key ? "#111218" : "transparent",
                color: tab === key ? "#fff" : "#6B7280",
            }}
        >
            {label}
            <span style={{
                marginLeft: 6, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "1px 7px",
                background: tab === key ? "rgba(255,255,255,.18)" : "#F1F5F9",
                color: tab === key ? "#fff" : "#475569",
            }}>{count}</span>
        </button>
    );

    return (
        <div className="archive-wrap" style={{ padding: "28px 28px 64px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Archive</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5 }}>Archived tasks &amp; notes</p>
                </div>
                <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: "10px 18px", textAlign: "center", minWidth: 72 }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 700, color: "#475569" }}>{archived.length + notes.length}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginTop: 3 }}>Total</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "#F4F5F7", borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 24 }}>
                {tabBtn("tasks", "Tasks", archived.length)}
                {tabBtn("notes", "Notes", notes.length)}
            </div>

            {/* TASKS TAB */}
            {tab === "tasks" && (
                archived.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "72px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                        <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
                        <p style={{ fontSize: 15, lineHeight: 1.75 }}>No archived tasks.<br />Completed tasks will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 800 }}>
                        {archived.map((t) => {
                            const dl = t.date ? new Date(t.date) : null;
                            const dlS = dl ? `${MONTHS[dl.getMonth()]} ${dl.getDate()}, ${dl.getFullYear()}` : "No deadline";
                            return (
                                <div key={t.id} className="row-hover archive-row"
                                    style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,.04)", transition: "box-shadow .15s", flexWrap: "wrap" }}
                                >
                                    <div style={{ width: 22, height: 22, flexShrink: 0, background: "#475569", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>✓</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#6B7280", textDecoration: "line-through", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{t.title}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                                            {t.archived ? "Archived" : `Stage: ${getStageLabel(t.status)}`} · {dlS}
                                            {t.tags?.length ? " · " + t.tags.join(" ") : ""}
                                        </div>
                                    </div>
                                    <button onClick={() => onRestore(t.id)} className="restore-hover"
                                        style={{ padding: "5px 13px", border: "1.5px solid #E8EAED", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}>
                                        ↩ Restore
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget({ item: t, type: "task" })}
                                        title="Delete permanently"
                                        style={{ padding: "5px 10px", border: "1.5px solid #FEE2E2", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    >🗑</button>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* NOTES TAB */}
            {tab === "notes" && (
                notes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "72px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                        <div style={{ fontSize: 44, marginBottom: 14 }}>📝</div>
                        <p style={{ fontSize: 15, lineHeight: 1.75 }}>No archived notes.<br />Archive notes from the Notes page.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 800 }}>
                        {notes.map((n) => {
                            const c = NOTE_COLORS.find((x) => x.id === n.color) ?? NOTE_COLORS[0];
                            return (
                                <div key={n.id} className="archive-row"
                                    style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}
                                >
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{n.title}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                                            {n.content ? n.content.slice(0, 60) + (n.content.length > 60 ? "…" : "") : "No content"} · {n.createdAt}
                                        </div>
                                    </div>
                                    <button onClick={() => onRestoreNote(n.id)} className="restore-hover"
                                        style={{ padding: "5px 13px", border: "1.5px solid #E8EAED", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}>
                                        ↩ Restore
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget({ item: n, type: "note" })}
                                        title="Delete permanently"
                                        style={{ padding: "5px 10px", border: "1.5px solid #FEE2E2", borderRadius: 8, background: "transparent", fontSize: 12, fontWeight: 600, color: "#EF4444", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", transition: "all .15s" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    >🗑</button>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    item={deleteTarget.item}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <style>{`
                @media (max-width: 768px) {
                    .archive-wrap { padding: 20px 16px 64px !important; }
                    .archive-row { gap: 10px !important; }
                }
                @media (max-width: 560px) {
                    .archive-row .restore-hover,
                    .archive-row button[title="Delete permanently"] { font-size: 11px !important; padding: 4px 8px !important; }
                }
            `}</style>
        </div>
    );
}
