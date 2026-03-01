import { useState, useRef } from "react";
import TaskCard from "./TaskCard";

export default function KanbanCol({ col, tasks, animDelay, onEdit, onAdd, onMove, onDuplicate }) {
    const [over, setOver] = useState(false);
    const ref = useRef(null);

    const onDragOver = (e) => { e.preventDefault(); setOver(true); };
    const onDragLeave = (e) => { if (!ref.current?.contains(e.relatedTarget)) setOver(false); };
    const onDrop = (e) => {
        e.preventDefault(); setOver(false);
        const id = parseInt(e.dataTransfer.getData("taskId"));
        if (id) onMove(id, col.id, null, "end");
    };

    return (
        <div
            ref={ref}
            style={{
                width: "100%",
                background: over ? "#F5F8FF" : "#FAFAFA",
                border: `1.5px solid ${over ? "rgba(37,99,235,.25)" : "#EBEBED"}`,
                borderRadius: 18,
                padding: "14px 14px 10px",
                minHeight: 300,
                boxShadow: over ? "0 4px 24px rgba(37,99,235,.07)" : "0 1px 2px rgba(0,0,0,.03)",
                animation: `colIn .38s cubic-bezier(.22,1,.36,1) ${animDelay}s both`,
                boxSizing: "border-box",
                transition: "border-color .18s, background .18s, box-shadow .18s",
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {/* ── Column header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    {/* Status dot */}
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: col.dot, display: "inline-block", flexShrink: 0,
                        boxShadow: `0 0 0 3px ${col.dot}22`,
                    }} />
                    <span style={{
                        fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: ".08em", color: "#6B7280",
                    }}>{col.label}</span>
                    {/* Count badge */}
                    <span style={{
                        fontSize: 10.5, fontWeight: 700,
                        background: tasks.length > 0 ? col.dot + "18" : "#F0F1F3",
                        color: tasks.length > 0 ? col.dot : "#C4C9D4",
                        border: `1px solid ${tasks.length > 0 ? col.dot + "30" : "#E8EAED"}`,
                        borderRadius: 99, padding: "1px 7px",
                        minWidth: 20, textAlign: "center",
                        transition: "all .2s",
                    }}>{tasks.length}</span>
                </div>

                {/* Add button */}
                <button
                    className="col-add-hover"
                    onClick={onAdd}
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

            {/* Divider */}
            <div style={{ height: 1, background: "#EBEBED", marginBottom: 10, borderRadius: 1 }} />

            {/* ── Cards area ── */}
            <div style={{
                minHeight: 70, borderRadius: 10, padding: "2px 0",
                transition: "background .15s",
            }}>
                {tasks.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "28px 0", gap: 6,
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "#D1D5DB" }}>
                            <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".4" />
                            <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".25" />
                            <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".15" />
                            <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".08" />
                        </svg>
                        <span style={{ fontSize: 11.5, color: "#D1D5DB", fontWeight: 500 }}>No tasks yet</span>
                    </div>
                ) : (
                    tasks.map((t, i) => (
                        <TaskCard
                            key={t.id}
                            task={t}
                            pos={i + 1}
                            colId={col.id}
                            onEdit={() => onEdit(t)}
                            onMove={onMove}
                            onDuplicate={onDuplicate}
                        />
                    ))
                )}
            </div>

            {/* ── Add task row ── */}
            <div
                className="add-row-hover"
                onClick={onAdd}
                style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 8px", marginTop: 6, borderRadius: 9,
                    color: "#C4C9D4", fontSize: 12, fontWeight: 500,
                    cursor: "pointer", border: "1.5px dashed transparent",
                    transition: "all .15s",
                }}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Add task
            </div>
        </div>
    );
}
