import { useState } from "react";
import { dlBadge, dlStatus, DL_BORDER_COLOR } from "../../utils/deadline";

const PRI_SECTIONS = [
    { id: "high", label: "🔴 High Priority", color: "#EF4444", bg: "#FEF2F2", border: "#FEE2E2" },
    { id: "medium", label: "🟡 Medium Priority", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
    { id: "low", label: "🟢 Low Priority", color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0" },
    { id: null, label: "⬜ No Priority", color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" },
];

function PriorityCard({ task, onEdit, stages, priorityColor, priorityBg, priorityBorder }) {
    const [dragging, setDragging] = useState(false);
    const ds = dlStatus(task.date, task.time);
    const db = dlBadge(task.date, task.time);
    const getStageLabel = (id) => stages.find((s) => s.id === id)?.label ?? id;
    const getStageDot = (id) => stages.find((s) => s.id === id)?.dot ?? "#9CA3AF";

    const onDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", String(task.id));
    };
    const onDragEnd = () => { setDragging(false); };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={() => onEdit(task)}
            style={{
                background: priorityBg, border: `1px solid ${priorityBorder}`,
                borderLeft: ds !== "none" ? `3px solid ${DL_BORDER_COLOR[ds]}` : `3px solid ${priorityColor}`,
                borderRadius: 12, padding: "13px 14px", cursor: "grab",
                transition: "all .15s ease",
                opacity: dragging ? 0.3 : 1,
            }}
            onMouseEnter={(e) => { if (!dragging) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.09)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { if (!dragging) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } }}
        >
            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218", marginBottom: 4 }}>{task.title}</div>
            {task.desc && <div style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.desc}</div>}

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {/* stage pill */}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 8px", background: "rgba(0,0,0,.05)", borderRadius: 5, fontWeight: 600, color: "#374151" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: getStageDot(task.status), display: "inline-block" }} />
                    {getStageLabel(task.status)}
                </span>
                {task.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: "#F1F5F9", border: "1px solid rgba(71,85,105,.15)", color: "#475569", borderRadius: 4, fontWeight: 600 }}>{tag}</span>
                ))}
                {db && <span style={{ fontSize: 10.5, fontWeight: 600, marginLeft: "auto", color: db.type === "red" ? "#EF4444" : db.type === "orange" ? "#F59E0B" : "#22C55E" }}>{db.text}</span>}
            </div>
        </div>
    );
}

export default function PriorityView({ tasks, stages, onEdit, onPatchTask }) {
    const [dropState, setDropState] = useState(null); // section id
    const active = tasks.filter((t) => !t.archived);

    const onDrop = (e, newPriority) => {
        e.preventDefault();
        setDropState(null);
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        if (taskId) onPatchTask(taskId, { priority: newPriority });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PRI_SECTIONS.map(({ id, label, color, bg, border }) => {
                const group = active.filter((t) => (t.priority ?? null) === id).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
                const isOver = dropState === id;

                return (
                    <div key={id ?? "none"}
                        onDragOver={(e) => { e.preventDefault(); setDropState(id); }}
                        onDragLeave={() => setDropState(null)}
                        onDrop={(e) => onDrop(e, id)}
                        style={{
                            padding: 10,
                            borderRadius: 16,
                            background: isOver ? "rgba(71,85,105,.03)" : "transparent",
                            border: isOver ? "2px dashed #475569" : "2px dashed transparent",
                            transition: "all .2s"
                        }}
                    >
                        {/* section header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color }}>{label}</span>
                            <span style={{ fontSize: 11, color: "#C4C9D4", fontWeight: 600 }}>({group.length})</span>
                            <div style={{ flex: 1, height: 1, background: border }} />
                        </div>

                        {/* task cards grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                            {group.map((task) => (
                                <PriorityCard
                                    key={task.id}
                                    task={task}
                                    onEdit={onEdit}
                                    stages={stages}
                                    priorityColor={color}
                                    priorityBg={bg}
                                    priorityBorder={border}
                                />
                            ))}
                            {group.length === 0 && (
                                <div style={{ padding: "20px", textAlign: "center", color: "#C4C9D4", fontSize: 13, background: "#FAFBFD", borderRadius: 12, border: "1px dashed #E5E7EB" }}>
                                    No {label.toLowerCase()} tasks. Drag tasks here to change priority.
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            {active.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                    <p style={{ fontSize: 14 }}>No tasks yet. Add your first task!</p>
                </div>
            )}
        </div>
    );
}
