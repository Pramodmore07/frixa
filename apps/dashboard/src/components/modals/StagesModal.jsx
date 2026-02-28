import { useState } from "react";
import { Modal, ModalFoot, Btn, GhostBtn, DangerBtn, Input } from "../ui";
import { DOT_PALETTE, DEFAULT_STAGES } from "../../constants";

function genId() { return "stage_" + Math.random().toString(36).slice(2, 9); }

export default function StagesModal({ stages, tasks, onSave, onDelete, onClose }) {
    const [list, setList] = useState(stages.map((s) => ({ ...s })));
    const [editId, setEditId] = useState(null);
    const [tempLabel, setTempLabel] = useState("");
    const [pickerOpen, setPickerOpen] = useState(null); // stage id or null
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const activeTasks = tasks.filter((t) => !t.archived);

    const startEdit = (s) => { setEditId(s.id); setTempLabel(s.label); setPickerOpen(null); };
    const commitEdit = () => {
        if (tempLabel.trim()) setList((prev) => prev.map((s) => s.id === editId ? { ...s, label: tempLabel.trim() } : s));
        setEditId(null);
    };

    const setDot = (id, dot) => { setList((prev) => prev.map((s) => s.id === id ? { ...s, dot } : s)); setPickerOpen(null); };
    const moveUp = (i) => { if (i === 0) return; const n = [...list];[n[i - 1], n[i]] = [n[i], n[i - 1]]; setList(n); };
    const moveDown = (i) => { if (i === list.length - 1) return; const n = [...list];[n[i], n[i + 1]] = [n[i + 1], n[i]]; setList(n); };

    const addStage = () => {
        const id = genId();
        setList((prev) => [...prev, { id, label: "New Stage", dot: "#6B7280" }]);
        setTimeout(() => startEdit({ id, label: "New Stage" }), 0);
    };

    const requestDelete = (s) => {
        const count = activeTasks.filter((t) => t.status === s.id).length;
        if (count > 0) setDeleteConfirm({ ...s, count });
        else setList((prev) => prev.filter((x) => x.id !== s.id));
    };

    const confirmDelete = () => {
        if (!deleteConfirm) return;
        setList((prev) => prev.filter((x) => x.id !== deleteConfirm.id));
        onDelete(deleteConfirm.id);
        setDeleteConfirm(null);
    };

    return (
        <>
            <Modal onClose={onClose} title="Manage Stages">
                <p style={{ fontSize: 12.5, color: "#6B7280", marginBottom: 18 }}>
                    Rename, reorder, add or remove columns on your kanban board.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}
                    onClick={() => setPickerOpen(null)} // close picker on outside click
                >
                    {list.map((s, i) => (
                        <div key={s.id}
                            style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F9FA", border: "1px solid #E8EAED", borderRadius: 12, padding: "10px 14px", position: "relative" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* colour dot + picker */}
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <span
                                    onClick={(e) => { e.stopPropagation(); setPickerOpen(pickerOpen === s.id ? null : s.id); }}
                                    style={{ width: 20, height: 20, borderRadius: "50%", background: s.dot, display: "inline-block", cursor: "pointer", border: "2px solid rgba(0,0,0,.1)", flexShrink: 0 }}
                                    title="Click to change colour"
                                />
                                {pickerOpen === s.id && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ position: "absolute", top: 26, left: 0, zIndex: 100, background: "#fff", border: "1px solid #E8EAED", borderRadius: 12, padding: 12, display: "flex", flexWrap: "wrap", gap: 7, width: 162, boxShadow: "0 8px 28px rgba(0,0,0,.16)" }}
                                    >
                                        {DOT_PALETTE.map((c) => (
                                            <span key={c} onClick={() => setDot(s.id, c)}
                                                style={{ width: 22, height: 22, borderRadius: "50%", background: c, display: "inline-block", cursor: "pointer", outline: s.dot === c ? "2.5px solid #111218" : "none", outlineOffset: 2, transition: "transform .1s" }}
                                                onMouseEnter={(e) => { e.target.style.transform = "scale(1.2)"; }}
                                                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* label */}
                            {editId === s.id ? (
                                <Input
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    onBlur={commitEdit}
                                    onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditId(null); }}
                                    autoFocus
                                    style={{ flex: 1, padding: "4px 10px", fontSize: 13, borderRadius: 8 }}
                                />
                            ) : (
                                <span
                                    onClick={() => startEdit(s)}
                                    title="Click to rename"
                                    style={{ flex: 1, fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218", cursor: "text" }}
                                >{s.label}</span>
                            )}

                            {/* reorder */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <button onClick={() => moveUp(i)} disabled={i === 0} style={{ border: "none", background: "transparent", cursor: i === 0 ? "not-allowed" : "pointer", fontSize: 10, color: "#9CA3AF", lineHeight: 1, padding: "2px 4px" }}>▲</button>
                                <button onClick={() => moveDown(i)} disabled={i === list.length - 1} style={{ border: "none", background: "transparent", cursor: i === list.length - 1 ? "not-allowed" : "pointer", fontSize: 10, color: "#9CA3AF", lineHeight: 1, padding: "2px 4px" }}>▼</button>
                            </div>

                            {/* delete */}
                            {list.length > 1 && (
                                <button onClick={() => requestDelete(s)} style={{ padding: "4px 8px", border: "none", borderRadius: 6, background: "transparent", color: "#EF4444", fontSize: 13, cursor: "pointer" }}>✕</button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={addStage}
                    style={{ marginTop: 12, width: "100%", padding: "10px", border: "2px dashed #D1D5DB", borderRadius: 12, background: "transparent", color: "#6B7280", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}
                    className="add-idea-hover"
                >+ Add new stage</button>

                <ModalFoot>
                    <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                    <Btn onClick={() => onSave(list)}>Save Stages</Btn>
                </ModalFoot>
            </Modal>

            {deleteConfirm && (
                <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(10,12,18,.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#fff", borderRadius: 18, padding: "32px 28px", maxWidth: 360, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,.2)", textAlign: "center" }}>
                        <div style={{ fontSize: 36, marginBottom: 14 }}>⚠️</div>
                        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Delete "{deleteConfirm.label}"?</h3>
                        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 22 }}>
                            This stage has <strong>{deleteConfirm.count}</strong> active task{deleteConfirm.count > 1 ? "s" : ""}. They'll remain unassigned.
                        </p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                            <GhostBtn onClick={() => setDeleteConfirm(null)}>Cancel</GhostBtn>
                            <DangerBtn onClick={confirmDelete}>Delete Stage</DangerBtn>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
