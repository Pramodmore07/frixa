import { useState, useRef } from "react";
import { dlStatus, dlBadge, DL_BADGE_STYLE, DL_BORDER_COLOR } from "../../utils/deadline";
import { PRI_COLORS } from "../../constants";

export default function TaskCard({ task, pos, colId, onEdit, onMove, onDuplicate, isDoneCol }) {
    const [dragState, setDragState] = useState(null);
    const [dragging, setDragging] = useState(false);
    const ref = useRef(null);

    const ds = dlStatus(task.date, task.time);
    const db = dlBadge(task.date, task.time);
    const hasFoot = task.tags?.length || task.priority || db;

    const leftBorder = isDoneCol
        ? "4px solid #10B981"
        : ds !== "none"
            ? `4px solid ${DL_BORDER_COLOR[ds]}`
            : "1px solid #E8EAED";

    const priColor = task.priority ? (PRI_COLORS[task.priority] || { bg: "#F3F4F6", fg: "#374151" }) : null;

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
        const id = e.dataTransfer.getData("taskId");
        if (!id || id === String(task.id)) return;
        const r = ref.current?.getBoundingClientRect();
        onMove(id, colId, task.id, r && e.clientY < r.top + r.height / 2 ? "before" : "after");
    };

    return (
        <>
            <div
                ref={ref}
                draggable
                className="task-card"
                onDragStart={onDragStart} onDragEnd={onDragEnd}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={onEdit}
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: dragging ? "transparent" : "#fff",
                    border: "1px solid #E8EAED",
                    borderLeft: leftBorder,
                    borderTop: dragState === "top" ? "3px solid #475569" : undefined,
                    borderBottom: dragState === "bottom" ? "3px solid #475569" : undefined,
                    borderRadius: 14, marginBottom: 8,
                    cursor: "grab", userSelect: "none",
                    opacity: dragging ? 0.3 : 1,
                    boxShadow: dragState ? "0 4px 12px rgba(71,85,105,.2)" : undefined,
                    display: "flex", flexDirection: "column",
                    position: "relative", overflow: "hidden",
                }}
            >
                {/* ── Main row ── */}
                <div className="tc-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* drag handle */}
                        <div className="tc-handle" style={{ color: "#D1D5DB", fontSize: 15, lineHeight: 1, cursor: "grab", flexShrink: 0 }}>⠿</div>

                        {/* pos badge */}
                        <div style={{
                            width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                            border: "1px solid #E5E7EB", background: "#F9FAFB",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                        }}>{pos}</div>

                        {/* title + micro-indicators */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="tc-title" style={{
                                fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600,
                                lineHeight: 1.35, color: "#111218",
                            }}>{task.title}</div>

                            {hasFoot && (
                                <div className="tc-indicators">
                                    {task.priority && (
                                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".05em", background: priColor.bg, color: priColor.fg }}>{task.priority}</span>
                                    )}
                                    {task.tags?.length > 0 && (
                                        <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>
                                            #{task.tags.length > 1 ? `${task.tags.length} tags` : task.tags[0]}
                                        </span>
                                    )}
                                    {db && (() => { const st = DL_BADGE_STYLE[db.type]; return <span style={{ fontSize: 9.5, fontWeight: 600, color: st.fg }}>{db.text}</span>; })()}
                                </div>
                            )}
                        </div>

                        {/* action buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                            {onDuplicate && (
                                <button
                                    className="tc-dup"
                                    onClick={(e) => { e.stopPropagation(); onDuplicate(task); }}
                                    title="Duplicate task"
                                    style={{ width: 26, height: 26, border: "1px solid #E8EAED", background: "#F9FAFB", color: "#6B7280", cursor: "pointer", borderRadius: 7, alignItems: "center", justifyContent: "center", transition: "background .15s, color .15s, border-color .15s", padding: 0 }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#111218"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#111218"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.borderColor = "#E8EAED"; }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                                        <rect x="4" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                                        <path d="M3 9H2a1 1 0 01-1-1V2a1 1 0 011-1h6a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                style={{ flexShrink: 0, width: 26, height: 26, border: "none", background: "transparent", color: "#C9CDD5", fontSize: 18, cursor: "pointer", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "background .15s, color .15s", padding: 0 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#6B7280"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9CDD5"; }}
                            >⋮</button>
                        </div>
                    </div>

                    {/* Description */}
                    {task.desc && (
                        <div className="tc-desc">
                            <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.desc}</div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {hasFoot && (
                    <div className="tc-footer">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "8px 14px 12px", background: "#FAFBFD", borderTop: "1px solid #F0F1F3" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1 }}>
                                {task.tags?.map((tag) => (
                                    <span key={tag} style={{ fontSize: 10.5, padding: "2px 9px", background: "#F1F5F9", border: "1px solid rgba(71,85,105,.15)", color: "#475569", borderRadius: 5, fontWeight: 600 }}>{tag}</span>
                                ))}
                            </div>
                            {task.priority && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 5, textTransform: "uppercase", letterSpacing: ".06em", background: priColor.bg, color: priColor.fg }}>{task.priority}</span>}
                            {db && (() => { const st = DL_BADGE_STYLE[db.type]; return <span style={{ fontSize: 10.5, padding: "2px 9px", borderRadius: 5, fontWeight: 600, background: st.bg, color: st.fg }}>{db.text}</span>; })()}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .task-card {
                    box-shadow: 0 2px 5px rgba(0,0,0,.03);
                    transition: box-shadow .22s, transform .22s;
                }
                .task-card:hover {
                    box-shadow: 0 8px 24px rgba(149,157,165,.15);
                    transform: translateY(-1px);
                }
                .tc-body { padding: 9px 14px 9px; transition: padding .22s; }
                .task-card:hover .tc-body { padding: 13px 14px 10px; }
                .tc-handle { opacity: 0.35; transition: opacity .2s; }
                .task-card:hover .tc-handle { opacity: 1; }
                .tc-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .task-card:hover .tc-title { white-space: normal; overflow: visible; text-overflow: unset; }
                .tc-indicators {
                    display: flex; align-items: center; gap: 5px; margin-top: 3px;
                    overflow: hidden; max-height: 22px; opacity: 1;
                    transition: max-height .22s, opacity .15s, margin-top .22s;
                }
                .task-card:hover .tc-indicators { max-height: 0; opacity: 0; margin-top: 0; }
                .tc-desc {
                    max-height: 0; opacity: 0; overflow: hidden; margin-left: 32px; margin-top: 0;
                    transition: max-height .25s cubic-bezier(0.4,0,0.2,1), opacity .2s, margin-top .22s;
                }
                .task-card:hover .tc-desc { max-height: 80px; opacity: 1; margin-top: 6px; }
                .tc-footer {
                    max-height: 0; opacity: 0; overflow: hidden;
                    transition: max-height .25s cubic-bezier(0.4,0,0.2,1), opacity .2s;
                }
                .task-card:hover .tc-footer { max-height: 60px; opacity: 1; }
                .tc-dup { display: none; }
                .task-card:hover .tc-dup { display: flex; }
            `}</style>
        </>
    );
}
