import { CAT_COLORS } from "../constants";

export default function IdeasPage({ ideas, onVote, onEdit, onAdd }) {
    return (
        <div style={{ padding: "28px 28px 64px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26, gap: 20, flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Ideas</h1>
                    <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5, lineHeight: 1.55 }}>Capture wild ideas before they disappear</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
                {ideas.map((idea) => {
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
                                <span style={{ fontSize: "9.5px", fontWeight: 700, padding: "3px 9px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".07em", flexShrink: 0, background: cat.bg, color: cat.fg }}>{idea.cat}</span>
                            </div>
                            <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, flex: 1 }}>{idea.desc || "No description yet."}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #F0F1F3" }}>
                                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{idea.createdAt}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onVote(idea.id); }}
                                    className="vote-hover"
                                    style={{
                                        display: "flex", alignItems: "center", gap: 5, padding: "5px 13px",
                                        borderRadius: 99, border: `1.5px solid ${idea.voted ? "#2563EB" : "#E8EAED"}`,
                                        background: idea.voted ? "#EFF6FF" : "transparent",
                                        fontSize: 12, fontWeight: 600,
                                        color: idea.voted ? "#2563EB" : "#6B7280",
                                        cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .15s",
                                    }}
                                >👍 {idea.votes}</button>
                            </div>
                        </div>
                    );
                })}

                {/* add card */}
                <button
                    onClick={onAdd}
                    className="add-idea-hover"
                    style={{
                        background: "transparent", border: "2px dashed #D1D5DB", borderRadius: 18,
                        padding: "40px 20px", display: "flex", alignItems: "center", justifyContent: "center",
                        flexDirection: "column", gap: 9, color: "#9CA3AF", fontSize: 13, fontWeight: 500,
                        cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all .18s",
                    }}
                >
                    <span style={{ fontSize: 28 }}>💡</span>
                    Add new idea
                </button>
            </div>
        </div>
    );
}
