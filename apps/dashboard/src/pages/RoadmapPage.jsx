import { useState } from "react";
import { dlStatus } from "../utils/deadline";
import KanbanCol from "../components/kanban/KanbanCol";
import ListView from "../components/kanban/ListView";
import TableView from "../components/kanban/TableView";
import PriorityView from "../components/kanban/PriorityView";
import TimelineView from "../components/kanban/TimelineView";
import FocusTimer from "../components/FocusTimer";

// Clean SVG icons — no emoji
const Icons = {
    kanban: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0" y="0" width="3.8" height="13" rx="1.4" fill="currentColor" opacity=".9" /><rect x="4.6" y="0" width="3.8" height="8" rx="1.4" fill="currentColor" opacity=".65" /><rect x="9.2" y="0" width="3.8" height="10.5" rx="1.4" fill="currentColor" opacity=".4" /></svg>
    ),
    list: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0" y="1" width="2" height="2" rx=".7" fill="currentColor" /><rect x="3.5" y="1" width="9.5" height="2" rx=".7" fill="currentColor" opacity=".7" /><rect x="0" y="5.5" width="2" height="2" rx=".7" fill="currentColor" /><rect x="3.5" y="5.5" width="9.5" height="2" rx=".7" fill="currentColor" opacity=".7" /><rect x="0" y="10" width="2" height="2" rx=".7" fill="currentColor" /><rect x="3.5" y="10" width="9.5" height="2" rx=".7" fill="currentColor" opacity=".7" /></svg>
    ),
    table: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0" y="0" width="13" height="3" rx="1.2" fill="currentColor" /><rect x="0" y="4" width="6" height="3.5" rx="1" fill="currentColor" opacity=".6" /><rect x="7" y="4" width="6" height="3.5" rx="1" fill="currentColor" opacity=".6" /><rect x="0" y="8.5" width="6" height="3.5" rx="1" fill="currentColor" opacity=".35" /><rect x="7" y="8.5" width="6" height="3.5" rx="1" fill="currentColor" opacity=".35" /></svg>
    ),
    priority: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0" y="8" width="3" height="5" rx="1" fill="currentColor" opacity=".4" /><rect x="4" y="5" width="3" height="8" rx="1" fill="currentColor" opacity=".65" /><rect x="8" y="2" width="3" height="11" rx="1" fill="currentColor" opacity=".9" /><rect x="12" y="0" width="1" height="13" rx=".5" fill="currentColor" opacity=".2" /></svg>
    ),
    timeline: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="2" cy="3" r="1.5" fill="currentColor" /><rect x="4" y="2" width="9" height="2" rx="1" fill="currentColor" opacity=".4" /><circle cx="2" cy="7" r="1.5" fill="currentColor" opacity=".7" /><rect x="4" y="6" width="6.5" height="2" rx="1" fill="currentColor" opacity=".4" /><circle cx="2" cy="11" r="1.5" fill="currentColor" opacity=".45" /><rect x="4" y="10" width="8" height="2" rx="1" fill="currentColor" opacity=".4" /></svg>
    ),
};

const VIEWS = [
    { id: "kanban", label: "Kanban", icon: Icons.kanban },
    { id: "list", label: "List", icon: Icons.list },
    { id: "table", label: "Table", icon: Icons.table },
    { id: "priority", label: "Priority", icon: Icons.priority },
    { id: "timeline", label: "Timeline", icon: Icons.timeline },
];

export default function RoadmapPage({
    tasks, stages, showTimer = true,
    onEditTask, onAddTask, onMoveTask, onPatchTask, onTimerDone
}) {
    const [view, setView] = useState("kanban");
    const active = tasks.filter((t) => !t.archived);
    const doneId = stages.find((s) => s.id === "done")?.id;
    const done = active.filter((t) => t.status === doneId).length;
    const overdue = active.filter((t) => t.date && dlStatus(t.date, t.time) === "red").length;
    const inFlight = active.length - done;

    const stats = [
        { label: "Total", val: active.length, color: "#111218", bg: "#F4F5F7", bdg: "transparent" },
        { label: "Active", val: inFlight, color: "#2563EB", bg: "#EFF6FF", bdg: "#DBEAFE" },
        { label: "Done", val: done, color: "#059669", bg: "#ECFDF5", bdg: "#A7F3D0" },
        { label: "Overdue", val: overdue, color: "#DC2626", bg: "#FEF2F2", bdg: "#FECACA" },
    ];

    return (
        <div style={{ padding: "32px 32px 80px" }}>

            {/* ── Header row ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: "-.6px", lineHeight: 1.1, color: "#0F1117" }}>Roadmap</h1>
                    <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4, fontWeight: 500 }}>Track goals & upcoming tasks</p>
                </div>

                {/* Stat pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: s.bg, border: `1.5px solid ${s.bdg === "transparent" ? "#E8EAED" : s.bdg}`,
                            borderRadius: 12, padding: "8px 14px",
                        }}>
                            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</span>
                            <span style={{ fontSize: 10.5, color: s.color, fontWeight: 700, opacity: .7, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Focus Timer ── */}
            {showTimer && <FocusTimer onDone={onTimerDone} />}

            {/* ── View switcher ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", background: "#fff", border: "1.5px solid #EBEBED", borderRadius: 12, padding: 4, gap: 2 }}>
                    {VIEWS.map((v) => {
                        const isActive = view === v.id;
                        return (
                            <button key={v.id} onClick={() => setView(v.id)}
                                style={{
                                    padding: "6px 13px", border: "none", borderRadius: 9, cursor: "pointer",
                                    fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600,
                                    background: isActive ? "#111218" : "transparent",
                                    color: isActive ? "#fff" : "#9CA3AF",
                                    transition: "all .18s",
                                    display: "flex", alignItems: "center", gap: 6,
                                    whiteSpace: "nowrap",
                                }}
                                className="view-tab"
                            >
                                {v.icon} {v.label}
                            </button>
                        );
                    })}
                </div>
                <span style={{ fontSize: 11.5, color: "#D1D5DB", fontWeight: 600, letterSpacing: ".03em" }}>
                    {active.length} task{active.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* ── Kanban ── */}
            {view === "kanban" && (
                <div style={{ overflowX: "auto", paddingBottom: 16 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", width: "100%" }}>
                        {stages.map((col, ci) => {
                            const colTasks = active.filter((t) => t.status === col.id).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
                            const n = stages.length;
                            const colWidth = n <= 4
                                ? `calc((100% - ${(n - 1) * 14}px) / ${n})`
                                : `calc((90% - (3 * 14px)) / 4)`;
                            return (
                                <div key={col.id} style={{ width: colWidth, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                                    <KanbanCol col={col} tasks={colTasks} animDelay={ci * 0.07}
                                        onEdit={onEditTask} onAdd={() => onAddTask(col.id)} onMove={onMoveTask} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === "list" && <ListView tasks={tasks} stages={stages} onEdit={onEditTask} onMove={onMoveTask} />}
            {view === "table" && <TableView tasks={tasks} stages={stages} onEdit={onEditTask} />}
            {view === "priority" && <PriorityView tasks={tasks} stages={stages} onEdit={onEditTask} onPatchTask={onPatchTask} />}
            {view === "timeline" && <TimelineView tasks={tasks} stages={stages} onEdit={onEditTask} onPatchTask={onPatchTask} />}
        </div>
    );
}
