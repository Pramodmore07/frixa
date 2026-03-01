import { useState } from "react";
import { dlDiff } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthKey(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}
function getMonthLabel(key) {
    if (!key) return null;
    const [yr, mo] = key.split("-");
    return `${MONTHS[parseInt(mo)]} ${yr}`;
}

function TimelineItem({ task, onEdit, stages, deadlineColor }) {
    const [dragging, setDragging] = useState(false);
    const getStageLabel = (id) => stages.find((s) => s.id === id)?.label ?? id;
    const getStageDot = (id) => stages.find((s) => s.id === id)?.dot ?? "#9CA3AF";

    const dc = task.date ? deadlineColor(task.date) : { fg: "#9CA3AF", bg: "#F3F4F6" };
    const p = task.priority ? PRI_COLORS[task.priority] : null;

    const onDragStart = (e) => {
        setDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", String(task.id));
    };
    const onDragEnd = () => { setDragging(false); };

    const dl = task.date ? new Date(task.date) : null;
    const day = dl ? dl.getDate() : "—";
    const dow = dl ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dl.getDay()] : "";

    return (
        <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={() => onEdit(task)}
            style={{
                display: "flex", alignItems: "center", gap: 14, background: "#fff",
                border: "1px solid #E8EAED", borderRadius: 12, padding: "10px 16px",
                cursor: "grab", transition: "all .15s ease",
                opacity: dragging ? 0.3 : 1,
                boxShadow: "0 2px 5px rgba(0,0,0,.03)"
            }}
            onMouseEnter={(e) => { if (!dragging) { e.currentTarget.style.background = "#F8F9FA"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.08)"; } }}
            onMouseLeave={(e) => { if (!dragging) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,.03)"; } }}
        >
            {/* day bubble */}
            <div style={{ flexShrink: 0, textAlign: "center", width: 42 }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: dc.fg, lineHeight: 1 }}>{day}</div>
                {dow && <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>{dow}</div>}
            </div>

            <div style={{ width: 1, height: 36, background: "#E8EAED", flexShrink: 0 }} />

            {/* title + desc */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                {task.desc && <div style={{ fontSize: 11.5, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.desc}</div>}
            </div>

            {/* stage */}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, padding: "3px 9px", background: "#F3F4F6", borderRadius: 6, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: getStageDot(task.status), display: "inline-block" }} />
                {getStageLabel(task.status)}
            </span>

            {/* priority */}
            {p && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".06em", background: p.bg, color: p.fg, whiteSpace: "nowrap" }}>{task.priority}</span>}

            {/* deadline status chip */}
            {task.date && (
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: dc.bg, color: dc.fg, whiteSpace: "nowrap" }}>
                    {dlDiff(task.date, null) === null ? "—" : dlDiff(task.date, null) < 0 ? "Overdue" : dlDiff(task.date, null) === 0 ? "Today" : dlDiff(task.date, null) === 1 ? "Tomorrow" : `in ${dlDiff(task.date, null)}d`}
                </span>
            )}
        </div>
    );
}

export default function TimelineView({ tasks, stages, onEdit, onPatchTask }) {
    const [dropState, setDropState] = useState(null); // month key
    const active = tasks.filter((t) => !t.archived);

    const grouped = {};
    active.filter(t => t.date).sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((t) => {
        const k = getMonthKey(t.date);
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(t);
    });

    const noDate = active.filter((t) => !t.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineColor = (dateStr) => {
        const diff = dlDiff(dateStr, null);
        if (diff === null) return { fg: "#9CA3AF", bg: "#F3F4F6" };
        if (diff > 2) return { fg: "#16A34A", bg: "#F0FDF4" };
        if (diff >= 0) return { fg: "#D97706", bg: "#FFFBEB" };
        return { fg: "#DC2626", bg: "#FEF2F2" };
    };

    const onDrop = (e, key) => {
        e.preventDefault();
        setDropState(null);
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        if (!taskId) return;

        if (key === "none") {
            onPatchTask(taskId, { date: null, time: null });
            return;
        }

        const [yr, mo] = key.split("-");
        const targetDate = new Date(parseInt(yr), parseInt(mo), 1);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Use today if dropping on current month and it's 1st is in past
        const finalDate = (targetDate < now && targetDate.getMonth() === now.getMonth()) ? now : targetDate;
        const dateStr = finalDate.toISOString().split("T")[0];
        onPatchTask(taskId, { date: dateStr });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {Object.keys(grouped).length === 0 && noDate.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#DADCE0", fontFamily: "'Poppins',sans-serif" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    <p style={{ fontSize: 14 }}>No tasks with deadlines. Set a deadline to see them on the timeline!</p>
                </div>
            )}

            {Object.entries(grouped).map(([key, monthTasks]) => {
                const now = new Date();
                const [yr, mo] = key.split("-");
                const isPast = new Date(parseInt(yr), parseInt(mo) + 1, 0) < today;
                const isCurrent = parseInt(yr) === now.getFullYear() && parseInt(mo) === now.getMonth();
                const isOver = dropState === key;

                return (
                    <div key={key}
                        onDragOver={(e) => { e.preventDefault(); setDropState(key); }}
                        onDragLeave={() => setDropState(null)}
                        onDrop={(e) => onDrop(e, key)}
                        style={{
                            padding: 10, borderRadius: 16,
                            background: isOver ? "rgba(37,99,235,.03)" : "transparent",
                            border: isOver ? "2px dashed #2563EB" : "2px dashed transparent",
                            transition: "all .2s"
                        }}
                    >
                        {/* month header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{
                                fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700,
                                padding: "4px 14px", borderRadius: 20,
                                background: isCurrent ? "#111218" : isPast ? "#F3F4F6" : "#F1F5F9",
                                color: isCurrent ? "#fff" : isPast ? "#9CA3AF" : "#475569",
                            }}>{getMonthLabel(key)}{isCurrent ? " · Now" : ""}</div>
                            <div style={{ flex: 1, height: 1, background: "#E8EAED" }} />
                            <span style={{ fontSize: 11, color: "#C4C9D4", fontWeight: 600 }}>{monthTasks.length} task{monthTasks.length !== 1 ? "s" : ""}</span>
                        </div>

                        {/* tasks in this month */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, borderLeft: `2px solid ${isCurrent ? "#475569" : "#E8EAED"}` }}>
                            {monthTasks.map((task) => (
                                <TimelineItem key={task.id} task={task} onEdit={onEdit} stages={stages} deadlineColor={deadlineColor} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* tasks without deadline */}
            <div onDragOver={(e) => { e.preventDefault(); setDropState("none"); }}
                onDragLeave={() => setDropState(null)}
                onDrop={(e) => onDrop(e, "none")}
                style={{
                    padding: 10, borderRadius: 16,
                    background: dropState === "none" ? "rgba(37,99,235,.03)" : "transparent",
                    border: dropState === "none" ? "2px dashed #2563EB" : "2px dashed transparent",
                    transition: "all .2s"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: "#F3F4F6", color: "#9CA3AF" }}>No Deadline</div>
                    <div style={{ flex: 1, height: 1, background: "#E8EAED" }} />
                    <span style={{ fontSize: 11, color: "#C4C9D4", fontWeight: 600 }}>{noDate.length} task{noDate.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, borderLeft: "2px solid #E8EAED" }}>
                    {noDate.map((task) => (
                        <TimelineItem key={task.id} task={task} onEdit={onEdit} stages={stages} deadlineColor={deadlineColor} />
                    ))}
                    {noDate.length === 0 && (
                        <div style={{ padding: "12px", textAlign: "center", color: "#C4C9D4", fontSize: 12, fontStyle: "italic" }}>Drag tasks here to remove deadline.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
