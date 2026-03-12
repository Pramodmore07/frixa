import { useState, useEffect } from "react";
import { NOTE_COLORS } from "../components/modals/NoteModal";

const PAGE_SIZE = 12;

function Pagination({ page, total, pageSize, onChange }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
            <button onClick={() => onChange(page - 1)} disabled={page === 1}
                style={{ width: 36, height: 36, border: "1.5px solid #E8EAED", borderRadius: 10, background: page === 1 ? "#F4F5F7" : "#fff", color: page === 1 ? "#C4C9D4" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", fontFamily: "'Poppins',sans-serif" }}
                className={page !== 1 ? "pg-btn" : ""}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
                const isDot = !isNear && (p === page - 2 || p === page + 2);
                if (!isNear && !isDot) return null;
                if (isDot) return <span key={p} style={{ fontSize: 13, color: "#9CA3AF", padding: "0 2px" }}>…</span>;
                return (
                    <button key={p} onClick={() => onChange(p)}
                        style={{ width: 36, height: 36, border: p === page ? "1.5px solid #111218" : "1.5px solid #E8EAED", borderRadius: 10, background: p === page ? "#111218" : "#fff", color: p === page ? "#fff" : "#374151", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: p === page ? 700 : 500, cursor: "pointer", transition: "all .15s" }}
                        className={p !== page ? "pg-btn" : ""}>{p}</button>
                );
            })}
            <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
                style={{ width: 36, height: 36, border: "1.5px solid #E8EAED", borderRadius: 10, background: page === totalPages ? "#F4F5F7" : "#fff", color: page === totalPages ? "#C4C9D4" : "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", fontFamily: "'Poppins',sans-serif" }}
                className={page !== totalPages ? "pg-btn" : ""}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span style={{ marginLeft: 8, fontSize: 12, color: "#9CA3AF", fontFamily: "'Poppins',sans-serif" }}>
                Page {page} of {totalPages}
            </span>
        </div>
    );
}

export default function NotesPage({ notes, onEdit, onAdd }) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 if current page would be empty after data changes (e.g. project switch)
    useEffect(() => {
        if (currentPage > 1 && (currentPage - 1) * PAGE_SIZE >= notes.length) setCurrentPage(1);
    }, [notes.length, currentPage]);

    const sorted = [...notes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        const da = a.createdAt ? new Date(a.createdAt) : 0;
        const db = b.createdAt ? new Date(b.createdAt) : 0;
        return db - da;
    });

    const handlePageChange = (p) => {
        setCurrentPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="notes-wrap" style={{ padding: "28px 28px 64px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Notes</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5, lineHeight: 1.55 }}>
                        Quick thoughts, references & reminders
                        {notes.length > 0 && (
                            <span style={{ marginLeft: 8, fontSize: 12, background: "#F1F5F9", color: "#475569", fontWeight: 700, borderRadius: 20, padding: "1px 9px" }}>
                                {notes.length} total
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>

                {/* Add Note card — always first on page 1 */}
                {currentPage === 1 && (
                    <button
                        onClick={onAdd}
                        className="add-note-card"
                        style={{
                            background: "#111218", border: "none", borderRadius: 18,
                            padding: "20px 22px", display: "flex", alignItems: "center",
                            justifyContent: "center", flexDirection: "column", gap: 10,
                            cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                            transition: "all .18s", minHeight: 150, width: "100%",
                        }}
                    >
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                            📝
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>New Note</div>
                            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", fontWeight: 400 }}>Capture a thought</div>
                        </div>
                    </button>
                )}

                {/* Note cards */}
                {paginated.length === 0 && currentPage === 1 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#9CA3AF", fontSize: 13.5, fontFamily: "'Poppins',sans-serif" }}>
                        No notes yet — add your first one!
                    </div>
                ) : (
                    paginated.map((note) => {
                        const c = NOTE_COLORS.find((x) => x.id === note.color) ?? NOTE_COLORS[0];
                        return (
                            <div
                                key={note.id}
                                onClick={() => onEdit(note)}
                                className="note-hover"
                                style={{
                                    background: c.bg,
                                    border: `1.5px solid ${c.border}`,
                                    borderRadius: 18, padding: "20px 18px",
                                    cursor: "pointer", display: "flex", flexDirection: "column", gap: 10,
                                    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                                    transition: "transform .18s, box-shadow .2s",
                                    minHeight: 150, position: "relative",
                                }}
                            >
                                {/* Pin indicator */}
                                {note.pinned && (
                                    <div style={{ position: "absolute", top: 14, right: 14, fontSize: 13 }} title="Pinned">📌</div>
                                )}

                                {/* Color dot + title */}
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingRight: note.pinned ? 22 : 0 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0, marginTop: 5 }} />
                                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, color: "#111218", flex: 1 }}>{note.title}</span>
                                </div>

                                {/* Content preview */}
                                {note.content && (
                                    <p style={{
                                        fontSize: 12.5, color: "#6B7280", lineHeight: 1.65, flex: 1,
                                        display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden",
                                    }}>{note.content}</p>
                                )}

                                {/* Footer */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
                                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{note.createdAt}</span>
                                    <span style={{ fontSize: 10.5, fontWeight: 700, color: c.dot, background: c.dot + "14", border: `1px solid ${c.border}`, borderRadius: 20, padding: "1px 8px" }}>
                                        {c.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {notes.length > PAGE_SIZE && (
                <Pagination page={currentPage} total={notes.length} pageSize={PAGE_SIZE} onChange={handlePageChange} />
            )}

            <style>{`
                .note-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08) !important; }
                .add-note-card:hover { background: #1e2330 !important; }
                .pg-btn:hover { background: #F4F5F7 !important; border-color: #CBD5E1 !important; }
                @media (max-width: 768px) {
                    .notes-wrap { padding: 20px 16px 64px !important; }
                }
            `}</style>
        </div>
    );
}
