import { useState } from "react";
import TaskCard from "./TaskCard";

export default function MobileKanbanView({ stages, tasks, onEdit, onAdd, onMove, onDuplicate }) {
    const [activeIdx, setActiveIdx] = useState(0);

    const activeStage = stages[activeIdx];
    const stageTasks = tasks
        .filter((t) => t.status === activeStage?.id)
        .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

    return (
        <div>
            {/* ── Stage tab strip ── */}
            <div style={{ overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}
                className="mk-tab-strip">
                <div style={{ display: "flex", gap: 8, width: "max-content", padding: "2px 0" }}>
                    {stages.map((stage, i) => {
                        const count = tasks.filter((t) => t.status === stage.id).length;
                        const isActive = i === activeIdx;
                        return (
                            <button
                                key={stage.id}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "8px 14px", borderRadius: 12,
                                    border: isActive ? "none" : "1.5px solid #E8EAED",
                                    background: isActive ? "#111218" : "#fff",
                                    color: isActive ? "#fff" : "#6B7280",
                                    fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600,
                                    cursor: "pointer", whiteSpace: "nowrap",
                                    transition: "all .18s",
                                    boxShadow: isActive ? "0 2px 8px rgba(17,18,24,.18)" : "0 1px 3px rgba(0,0,0,.04)",
                                }}
                            >
                                <span style={{
                                    width: 7, height: 7, borderRadius: "50%",
                                    background: isActive ? "rgba(255,255,255,.7)" : stage.dot,
                                    flexShrink: 0,
                                    boxShadow: isActive ? "none" : `0 0 0 2.5px ${stage.dot}22`,
                                }} />
                                {stage.label}
                                <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    background: isActive ? "rgba(255,255,255,.15)" : stage.dot + "18",
                                    color: isActive ? "#fff" : stage.dot,
                                    border: isActive ? "1px solid rgba(255,255,255,.2)" : `1px solid ${stage.dot}30`,
                                    borderRadius: 99, padding: "1px 7px",
                                    minWidth: 18, textAlign: "center",
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Active stage column ── */}
            <div style={{
                background: "#FAFAFA", border: "1.5px solid #EBEBED",
                borderRadius: 18, padding: "14px 14px 10px",
                minHeight: 220,
                boxShadow: "0 1px 2px rgba(0,0,0,.03)",
            }}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: activeStage?.dot, flexShrink: 0,
                            boxShadow: `0 0 0 3px ${activeStage?.dot}22`,
                        }} />
                        <span style={{
                            fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: ".08em", color: "#6B7280",
                        }}>{activeStage?.label}</span>
                        <span style={{
                            fontSize: 10.5, fontWeight: 700,
                            background: stageTasks.length > 0 ? activeStage?.dot + "18" : "#F0F1F3",
                            color: stageTasks.length > 0 ? activeStage?.dot : "#C4C9D4",
                            border: `1px solid ${stageTasks.length > 0 ? activeStage?.dot + "30" : "#E8EAED"}`,
                            borderRadius: 99, padding: "1px 7px",
                            minWidth: 20, textAlign: "center",
                        }}>{stageTasks.length}</span>
                    </div>

                    <button
                        onClick={() => onAdd(activeStage?.id)}
                        style={{
                            width: 26, height: 26, border: "1.5px solid #E8EAED",
                            borderRadius: 8, background: "#fff", color: "#9CA3AF",
                            fontSize: 17, display: "flex", alignItems: "center",
                            justifyContent: "center", cursor: "pointer",
                            transition: "all .15s", lineHeight: 1,
                            boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                        }}
                    >+</button>
                </div>

                <div style={{ height: 1, background: "#EBEBED", marginBottom: 10, borderRadius: 1 }} />

                {/* Tasks */}
                <div style={{ minHeight: 70 }}>
                    {stageTasks.length === 0 ? (
                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            padding: "32px 0", gap: 6,
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "#D1D5DB" }}>
                                <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".4" />
                                <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".25" />
                                <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".15" />
                                <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".08" />
                            </svg>
                            <span style={{ fontSize: 11.5, color: "#D1D5DB", fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>No tasks yet</span>
                        </div>
                    ) : (
                        stageTasks.map((t, i) => (
                            <div key={t.id}>
                                <TaskCard
                                    task={t}
                                    pos={i + 1}
                                    colId={activeStage.id}
                                    onEdit={() => onEdit(t)}
                                    onMove={onMove}
                                    onDuplicate={onDuplicate}
                                    isDoneCol={activeStage.id === "done" || activeStage.label?.toLowerCase() === "done"}
                                />
                                {/* ── Move to stage row ── */}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px 10px", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 10, color: "#C4C9D4", fontWeight: 600, fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>Move →</span>
                                    {stages.filter((s) => s.id !== activeStage.id).map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => onMove(t.id, s.id, null, "end")}
                                            style={{
                                                fontSize: 10.5, padding: "3px 10px", borderRadius: 20,
                                                border: `1px solid ${s.dot}40`,
                                                background: s.dot + "14",
                                                color: s.dot, fontWeight: 600, cursor: "pointer",
                                                fontFamily: "'Poppins',sans-serif",
                                                display: "flex", alignItems: "center", gap: 4,
                                                transition: "all .15s",
                                            }}
                                        >
                                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add task row */}
                <div
                    onClick={() => onAdd(activeStage?.id)}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 8px", marginTop: 6, borderRadius: 9,
                        color: "#C4C9D4", fontSize: 12, fontWeight: 500,
                        cursor: "pointer", border: "1.5px dashed transparent",
                        transition: "all .15s", fontFamily: "'Poppins',sans-serif",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.color = "#9CA3AF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#C4C9D4"; }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Add task
                </div>
            </div>

            {/* ── Prev / Next navigation ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <button
                    onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                    disabled={activeIdx === 0}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", border: "1.5px solid #E8EAED", borderRadius: 10,
                        background: activeIdx === 0 ? "#F4F5F7" : "#fff",
                        color: activeIdx === 0 ? "#C4C9D4" : "#374151",
                        fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600,
                        cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                        transition: "all .15s",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Prev
                </button>

                <span style={{
                    fontSize: 11.5, color: "#9CA3AF",
                    fontFamily: "'Poppins',sans-serif", fontWeight: 600,
                }}>
                    {activeIdx + 1} / {stages.length}
                </span>

                <button
                    onClick={() => setActiveIdx((i) => Math.min(stages.length - 1, i + 1))}
                    disabled={activeIdx === stages.length - 1}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", border: "1.5px solid #E8EAED", borderRadius: 10,
                        background: activeIdx === stages.length - 1 ? "#F4F5F7" : "#fff",
                        color: activeIdx === stages.length - 1 ? "#C4C9D4" : "#374151",
                        fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600,
                        cursor: activeIdx === stages.length - 1 ? "not-allowed" : "pointer",
                        transition: "all .15s",
                    }}
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <style>{`
                .mk-tab-strip { scrollbar-width: none; }
                .mk-tab-strip::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
