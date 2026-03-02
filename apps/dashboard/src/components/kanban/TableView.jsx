import { useState, useRef } from "react";
import { dlBadge } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";
import StageDropdown from "./StageDropdown";

const DL_STYLE = { green: { bg: "#F0FDF4", fg: "#16A34A" }, orange: { bg: "#FFFBEB", fg: "#D97706" }, red: { bg: "#FEF2F2", fg: "#DC2626" } };

const TH = ({ children, style }) => (
    <th style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'Poppins',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", borderBottom: "1px solid #E8EAED", background: "#F8F9FA", whiteSpace: "nowrap", ...style }}>{children}</th>
);

function TableRow({ task, i, stages, onEdit, onMove, onPatchTask }) {
    const [dragState, setDragState] = useState(null);
    const [dragging, setDragging] = useState(false);
    const ref = useRef(null);

    const db = dlBadge(task.date, task.time);
    const p = task.priority ? PRI_COLORS[task.priority] : null;
    const dls = db ? DL_STYLE[db.type] : null;

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
        onMove(id, task.status, task.id, r && e.clientY < r.top + r.height / 2 ? "before" : "after");
    };

    return (
        <tr
            ref={ref}
            draggable
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => onEdit(task)}
            style={{
                borderTop: "1px solid #F0F1F3",
                borderLeft: dragState === "top" ? "3px solid #475569" : "3px solid transparent",
                borderBottom: dragState === "bottom" ? "3px solid #475569" : undefined,
                cursor: "grab",
                transition: "background .12s, border .1s",
                opacity: dragging ? 0.3 : 1,
                background: dragState ? "rgba(71,85,105,.05)" : "transparent",
            }}
            onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.background = "#FAFBFD"; }}
            onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.background = "transparent"; }}
        >
            {/* drag handle */}
            <td style={{ padding: "12px 8px 12px 14px", color: "#D1D5DB", fontSize: 14, textAlign: "center", width: 28 }}>⠿</td>

            {/* row num */}
            <td style={{ padding: "12px 14px", color: "#C4C9D4", fontSize: 11, fontWeight: 700, textAlign: "center", width: 36 }}>{i + 1}</td>

            {/* title + desc */}
            <td style={{ padding: "12px 14px", maxWidth: 280 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                {task.desc && <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.desc}</div>}
            </td>

            {/* stage dropdown */}
            <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                {onPatchTask
                    ? <StageDropdown task={task} stages={stages} onPatchTask={onPatchTask} />
                    : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: stages.find((s) => s.id === task.status)?.dot ?? "#9CA3AF", display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{stages.find((s) => s.id === task.status)?.label ?? task.status}</span>
                        </span>
                    )
                }
            </td>

            {/* priority */}
            <td style={{ padding: "12px 14px" }}>
                {p ? (
                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".06em", background: p.bg, color: p.fg }}>{task.priority}</span>
                ) : <span style={{ color: "#E5E7EB" }}>—</span>}
            </td>

            {/* deadline */}
            <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                {db && dls ? (
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: dls.bg, color: dls.fg }}>{db.text}</span>
                ) : <span style={{ color: "#E5E7EB" }}>—</span>}
            </td>

            {/* tags */}
            <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {task.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: "#F1F5F9", border: "1px solid rgba(71,85,105,.15)", color: "#475569", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{tag}</span>
                    ))}
                </div>
            </td>
        </tr>
    );
}

export default function TableView({ tasks, stages, onEdit, onPatchTask, onMoveTask }) {
    const active = tasks.filter((t) => !t.archived).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

    return (
        <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.05)" }}>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Poppins',sans-serif" }}>
                    <thead>
                        <tr>
                            <TH style={{ width: 28 }} />
                            <TH style={{ width: 36 }}>#</TH>
                            <TH>Task</TH>
                            <TH>Stage</TH>
                            <TH>Priority</TH>
                            <TH>Deadline</TH>
                            <TH>Tags</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {active.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#C4C9D4", fontSize: 13.5 }}>
                                    No tasks yet — add your first task!
                                </td>
                            </tr>
                        )}
                        {active.map((task, i) => (
                            <TableRow
                                key={task.id}
                                task={task}
                                i={i}
                                stages={stages}
                                onEdit={onEdit}
                                onMove={onMoveTask ?? (() => {})}
                                onPatchTask={onPatchTask}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
