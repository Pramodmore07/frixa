import { useState, useRef } from "react";
import { dlStatus, dlBadge, DL_BADGE_STYLE, DL_BORDER_COLOR } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";

export default function TaskCard({ task, pos, colId, onEdit, onMove }) {
    const [dragState, setDragState] = useState(null);
    const [dragging, setDragging] = useState(false);
    const ref = useRef(null);

    const ds = dlStatus(task.date, task.time);
    const db = dlBadge(task.date, task.time);
    const hasFoot = task.tags?.length || task.priority || db;

    // left-border colour by deadline, otherwise a neutral border
    const leftBorder = ds !== "none"
        ? `4px solid ${DL_BORDER_COLOR[ds]}`
        : "1px solid #E8EAED";

    const onDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", String(task.id));
        e.dataTransfer.setData("sourceColId", colId);
    };
    const onDragEnd = () => { setDragging(false); setDragState(null); };
    const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); const r = ref.current?.getBoundingClientRect(); if (r) setDragState(e.clientY < r.top + r.height / 2 ? "top" : "bottom"); };
    const onDragLeave = (e) => { e.stopPropagation(); setDragState(null); };
    const onDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragState(null);
        const id = parseInt(e.dataTransfer.getData("taskId"));
        if (!id || id === task.id) return;
        const r = ref.current?.getBoundingClientRect();
        onMove(id, colId, task.id, r && e.clientY < r.top + r.height / 2 ? "before" : "after");
    };

    return (
        <div
            ref={ref}
            draggable
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={onEdit}
            style={{
                width: "100%",
                boxSizing: "border-box",
                background: dragging ? "transparent" : "#fff",
                border: "1px solid #E8EAED",
                borderLeft: leftBorder,
                borderTop: dragState === "top" ? "3px solid #2563EB" : undefined,
                borderBottom: dragState === "bottom" ? "3px solid #2563EB" : undefined,
                borderRadius: 14, marginBottom: 12,
                cursor: "grab", userSelect: "none",
                opacity: dragging ? 0.3 : 1,
                boxShadow: dragState ? "0 4px 12px rgba(37,99,235,.2)" : "0 2px 5px rgba(0,0,0,.03)",
                transition: "all .2s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden"
            }}
            onMouseEnter={(e) => { if (!dragging) { e.currentTarget.style.boxShadow = "0 8px 24px rgba(149, 157, 165, 0.15)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { if (!dragging) { e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,.03)"; e.currentTarget.style.transform = "translateY(0)"; } }}
        >
            {/* body */}
            <div style={{ padding: "14px 16px 12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    {/* drag handle + pos number */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <div style={{ color: "#D1D5DB", fontSize: 16, lineHeight: 1, cursor: "grab" }}>⠿</div>
                        <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #E5E7EB", background: "#F9FAFB",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
                            color: "#6B7280",
                        }}>{pos}</div>
                    </div>

                    {/* title + desc */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: "#111218", marginBottom: task.desc ? 6 : 0 }}>{task.title}</div>
                        {task.desc && <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.desc}</div>}
                    </div>

                    {/* menu dot */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        style={{ flexShrink: 0, width: 28, height: 28, border: "none", background: "transparent", color: "#C9CDD5", fontSize: 20, cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "background .15s, color .15s", padding: 0 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#6B7280"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9CDD5"; }}
                    >⋮</button>
                </div>
            </div>

            {/* footer */}
            {hasFoot && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "10px 16px 14px", background: "#FAFBFD", borderTop: "1px solid #F0F1F3" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
                        {task.tags?.map((tag) => (
                            <span key={tag} style={{ fontSize: 11, padding: "3px 10px", background: "#EFF6FF", border: "1px solid rgba(37,99,235,.12)", color: "#2563EB", borderRadius: 6, fontWeight: 600 }}>{tag}</span>
                        ))}
                    </div>
                    {task.priority && (() => {
                        const p = PRI_COLORS[task.priority] || { bg: "#F3F4F6", fg: "#374151" };
                        return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".06em", background: p.bg, color: p.fg }}>{task.priority}</span>;
                    })()}
                    {db && (() => {
                        const st = DL_BADGE_STYLE[db.type];
                        return <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, fontWeight: 600, background: st.bg, color: st.fg }}>{db.text}</span>;
                    })()}
                </div>
            )}
        </div>
    );
}
