import { dlBadge } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";

const DL_STYLE = { green: { bg: "#F0FDF4", fg: "#16A34A" }, orange: { bg: "#FFFBEB", fg: "#D97706" }, red: { bg: "#FEF2F2", fg: "#DC2626" } };

const TH = ({ children, style }) => (
    <th style={{ padding: "10px 14px", textAlign: "left", fontFamily: "'Poppins',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".07em", borderBottom: "1px solid #E8EAED", background: "#F8F9FA", whiteSpace: "nowrap", ...style }}>{children}</th>
);

export default function TableView({ tasks, stages, onEdit }) {
    const active = tasks.filter((t) => !t.archived).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

    const getStageLabel = (id) => stages.find((s) => s.id === id)?.label ?? id;
    const getStageDot = (id) => stages.find((s) => s.id === id)?.dot ?? "#9CA3AF";

    return (
        <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.05)" }}>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Poppins',sans-serif" }}>
                    <thead>
                        <tr>
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
                                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#C4C9D4", fontSize: 13.5 }}>
                                    No tasks yet — add your first task!
                                </td>
                            </tr>
                        )}
                        {active.map((task, i) => {
                            const db = dlBadge(task.date, task.time);
                            const p = task.priority ? PRI_COLORS[task.priority] : null;
                            const dls = db ? DL_STYLE[db.type] : null;
                            return (
                                <tr key={task.id}
                                    onClick={() => onEdit(task)}
                                    style={{ borderTop: "1px solid #F0F1F3", cursor: "pointer", transition: "background .12s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFBFD"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    {/* row num */}
                                    <td style={{ padding: "12px 14px", color: "#C4C9D4", fontSize: 11, fontWeight: 700, textAlign: "center" }}>{i + 1}</td>

                                    {/* title + desc */}
                                    <td style={{ padding: "12px 14px", maxWidth: 280 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                                        {task.desc && <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.desc}</div>}
                                    </td>

                                    {/* stage */}
                                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: getStageDot(task.status), display: "inline-block", flexShrink: 0 }} />
                                            <span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>{getStageLabel(task.status)}</span>
                                        </span>
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
                                                <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: "#EFF6FF", border: "1px solid rgba(37,99,235,.15)", color: "#2563EB", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
