import { useState } from "react";
import { CAT_COLORS } from "../constants";

const PAGE_SIZE = 10;

/* ── Pagination (identical logic to ProjectsPage) ── */
function Pagination({ page, total, pageSize, onChange }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                style={{
                    width: 36, height: 36, border: "1.5px solid #E8EAED", borderRadius: 10,
                    background: page === 1 ? "#F4F5F7" : "#fff", color: page === 1 ? "#C4C9D4" : "#374151",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
                    fontFamily: "'Poppins',sans-serif",
                }}
                className={page !== 1 ? "pg-btn" : ""}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
                const isDot = !isNear && (p === page - 2 || p === page + 2);
                if (!isNear && !isDot) return null;
                if (isDot) return <span key={p} style={{ fontSize: 13, color: "#9CA3AF", padding: "0 2px" }}>…</span>;
                return (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        style={{
                            width: 36, height: 36,
                            border: p === page ? "1.5px solid #111218" : "1.5px solid #E8EAED",
                            borderRadius: 10, background: p === page ? "#111218" : "#fff",
                            color: p === page ? "#fff" : "#374151",
                            fontFamily: "'Poppins',sans-serif", fontSize: 13,
                            fontWeight: p === page ? 700 : 500, cursor: "pointer", transition: "all .15s",
                        }}
                        className={p !== page ? "pg-btn" : ""}
                    >{p}</button>
                );
            })}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                style={{
                    width: 36, height: 36, border: "1.5px solid #E8EAED", borderRadius: 10,
                    background: page === totalPages ? "#F4F5F7" : "#fff",
                    color: page === totalPages ? "#C4C9D4" : "#374151",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
                    fontFamily: "'Poppins',sans-serif",
                }}
                className={page !== totalPages ? "pg-btn" : ""}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <span style={{ marginLeft: 8, fontSize: 12, color: "#9CA3AF", fontFamily: "'Poppins',sans-serif" }}>
                Page {page} of {totalPages}
            </span>
        </div>
    );
}

export default function IdeasPage({ ideas, onVote, onEdit, onAdd }) {
    const [currentPage, setCurrentPage] = useState(1);

    // Sort newest first (by createdAt string or id fallback)
    const sorted = [...ideas].sort((a, b) => {
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
        <div style={{ padding: "28px 28px 64px" }}>
            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Ideas</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5, lineHeight: 1.55 }}>
                        Capture wild ideas before they disappear
                        {ideas.length > 0 && (
                            <span style={{ marginLeft: 8, fontSize: 12, background: "#F1F5F9", color: "#475569", fontWeight: 700, borderRadius: 20, padding: "1px 9px" }}>
                                {ideas.length} total
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* ── Grid ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>

                {/* ── Add Idea card — always first on page 1 ── */}
                {currentPage === 1 && (
                    <button
                        onClick={onAdd}
                        className="add-idea-card"
                        style={{
                            background: "#111218", border: "none", borderRadius: 18,
                            padding: "20px 22px", display: "flex", alignItems: "center",
                            justifyContent: "center", flexDirection: "column", gap: 10,
                            cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                            transition: "all .18s", minHeight: 160, width: "100%",
                        }}
                    >
                        <div style={{
                            width: 42, height: 42, borderRadius: 12,
                            background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.18)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                        }}>
                            💡
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>New Idea</div>
                            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)", fontWeight: 400 }}>Capture a thought</div>
                        </div>
                    </button>
                )}

                {/* ── Idea cards ── */}
                {paginated.length === 0 && currentPage === 1 ? (
                    <div style={{
                        gridColumn: "1 / -1", textAlign: "center", padding: "60px 0",
                        color: "#9CA3AF", fontSize: 13.5, fontFamily: "'Poppins',sans-serif",
                    }}>
                        No ideas yet — add your first one!
                    </div>
                ) : (
                    paginated.map((idea) => {
                        const cat = CAT_COLORS[idea.cat] || CAT_COLORS.other;
                        return (
                            <div
                                key={idea.id}
                                onClick={() => onEdit(idea)}
                                className="idea-hover"
                                style={{
                                    background: "#fff", border: "1px solid #E8EAED", borderRadius: 18,
                                    padding: "22px 20px", cursor: "pointer",
                                    display: "flex", flexDirection: "column", gap: 12,
                                    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                                    transition: "transform .18s, box-shadow .2s",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, lineHeight: 1.38, color: "#111218", flex: 1 }}>{idea.title}</span>
                                    <span style={{
                                        fontSize: "9.5px", fontWeight: 700, padding: "3px 9px", borderRadius: 4,
                                        textTransform: "uppercase", letterSpacing: ".07em", flexShrink: 0,
                                        background: cat.bg, color: cat.fg,
                                    }}>{idea.cat}</span>
                                </div>
                                <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, flex: 1 }}>{idea.desc || "No description yet."}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #F0F1F3" }}>
                                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{idea.createdAt}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onVote(idea.id); }}
                                        className="vote-hover"
                                        style={{
                                            display: "flex", alignItems: "center", gap: 5, padding: "5px 13px",
                                            borderRadius: 99, border: `1.5px solid ${idea.voted ? "#475569" : "#E8EAED"}`,
                                            background: idea.voted ? "#F1F5F9" : "transparent",
                                            fontSize: 12, fontWeight: 600,
                                            color: idea.voted ? "#475569" : "#6B7280",
                                            cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .15s",
                                        }}
                                    >👍 {idea.votes}</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── Pagination — only when > PAGE_SIZE ideas ── */}
            {ideas.length > PAGE_SIZE && (
                <Pagination
                    page={currentPage}
                    total={ideas.length}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                />
            )}

            <style>{`
                .idea-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08) !important; }
                .add-idea-card:hover { background: #1e2330 !important; }
                .pg-btn:hover { background: #F4F5F7 !important; border-color: #CBD5E1 !important; }
            `}</style>
        </div>
    );
}
