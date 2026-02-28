import { useState, useRef } from "react";
import { dlBadge, dlStatus, DL_BORDER_COLOR } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";

const PRI_DOT = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };

function ListRow({ task, i, isFirst, onEdit, onMove, colId }) {
    const [dragState, setDragState] = useState(null);
    const [dragging, setDragging] = useState(false);
    const ref = useRef(null);

    const ds = dlStatus(task.date, task.time);
    const db = dlBadge(task.date, task.time);
    const p = PRI_COLORS[task.priority];

    const onDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", String(task.id));
    };
    const onDragEnd = () => { setDragging(false); setDragState(null); };
    const onDragOver = (e) => {
        e.preventDefault(); e.stopPropagation();
        const r = ref.current?.getBoundingClientRect();
        if (r) setDragState(e.clientY < r.top + r.height / 2 ? "top" : "bottom");
    };
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
            onClick={() => onEdit(task)}
            style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 18px",
                borderTop: isFirst ? "none" : "1px solid #F0F1F3",
                borderLeft: ds !== "none" ? `3px solid ${DL_BORDER_COLOR[ds]}` : "3px solid transparent",
                borderTopColor: dragState === "top" ? "#2563EB" : undefined,
                borderBottomColor: dragState === "bottom" ? "#2563EB" : undefined,
                borderTopWidth: dragState === "top" ? 2 : undefined,
                borderBottomWidth: dragState === "bottom" ? 2 : undefined,
                cursor: "grab", transition: "background .12s, border .1s",
                opacity: dragging ? 0.3 : 1,
                background: dragState ? "rgba(37,99,235,.05)" : "transparent",
            }}
            onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.background = "#F8F9FA"; }}
            onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.background = "transparent"; }}
        >
            {/* number */}
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: "#C4C9D4", minWidth: 18, textAlign: "right" }}>{i + 1}</span>

            {/* drag handle */}
            <span style={{ color: "#E5E7EB", fontSize: 14 }}>⠿</span>

            {/* priority dot */}
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: task.priority ? PRI_DOT[task.priority] : "#E5E7EB", flexShrink: 0, display: "inline-block" }} />

            {/* title */}
            <span style={{ flex: 1, fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</span>

            {/* desc truncated */}
            {task.desc && (
                <span style={{ fontSize: 12, color: "#9CA3AF", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{task.desc}</span>
            )}

            {/* tags */}
            <div style={{ display: "flex", gap: 4 }}>
                {task.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: "#EFF6FF", border: "1px solid rgba(37,99,235,.18)", color: "#2563EB", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{tag}</span>
                ))}
            </div>

            {/* priority badge */}
            {p && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".06em", background: p.bg, color: p.fg, whiteSpace: "nowrap" }}>{task.priority}</span>}

            {/* deadline */}
            {db && <span style={{ fontSize: 11, fontWeight: 600, color: db.type === "red" ? "#EF4444" : db.type === "orange" ? "#F59E0B" : "#22C55E", whiteSpace: "nowrap" }}>{db.text}</span>}
        </div>
    );
}

export default function ListView({ tasks, stages, onEdit, onMove }) {
    const active = tasks.filter((t) => !t.archived);

    const onStageDrop = (e, stageId) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        if (taskId) onMove(taskId, stageId, null, "after");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {stages.map((stage) => {
                const stageTasks = active.filter((t) => t.status === stage.id).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

                return (
                    <div key={stage.id} style={{ marginBottom: 24 }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onStageDrop(e, stage.id)}>
                        {/* stage header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "0 4px" }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.dot, flexShrink: 0, display: "inline-block" }} />
                            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#6B7280" }}>{stage.label}</span>
                            <span style={{ fontSize: 11, color: "#C4C9D4", fontWeight: 600 }}>({stageTasks.length})</span>
                        </div>

                        <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", minHeight: stageTasks.length === 0 ? 40 : "auto" }}>
                            {stageTasks.length === 0 && (
                                <div style={{ padding: "12px 18px", fontSize: 12, color: "#C4C9D4", fontStyle: "italic" }}>Drop tasks here...</div>
                            )}
                            {stageTasks.map((task, i) => (
                                <ListRow
                                    key={task.id}
                                    task={task}
                                    i={i}
                                    isFirst={i === 0}
                                    onEdit={onEdit}
                                    onMove={onMove}
                                    colId={stage.id}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {active.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    <p style={{ fontSize: 14 }}>No tasks yet. Add your first task!</p>
                </div>
            )}
        </div>
    );
}
