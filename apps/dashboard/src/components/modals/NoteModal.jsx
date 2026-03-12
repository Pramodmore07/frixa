import { useState } from "react";
import { Modal, FG, Input, Textarea, ModalFoot, Btn, GhostBtn, DangerBtn } from "../ui";

export const NOTE_COLORS = [
    { id: "yellow", bg: "#FEFCE8", border: "#FDE047", dot: "#CA8A04", label: "Yellow" },
    { id: "blue",   bg: "#EFF6FF", border: "#93C5FD", dot: "#2563EB", label: "Blue"   },
    { id: "green",  bg: "#F0FDF4", border: "#86EFAC", dot: "#16A34A", label: "Green"  },
    { id: "pink",   bg: "#FDF2F8", border: "#F9A8D4", dot: "#DB2777", label: "Pink"   },
    { id: "purple", bg: "#F5F3FF", border: "#C4B5FD", dot: "#7C3AED", label: "Purple" },
    { id: "gray",   bg: "#F9FAFB", border: "#D1D5DB", dot: "#6B7280", label: "Gray"   },
];

export default function NoteModal({ mode, initial, onSave, onArchive, onClose }) {
    const [form, setForm] = useState({ title: "", content: "", color: "yellow", pinned: false, ...initial });
    const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) });

    const save = () => {
        if (!form.title.trim()) return;
        onSave({ ...form, id: initial?.id });
    };

    return (
        <Modal onClose={onClose} title={mode === "edit" ? "Edit Note" : "New Note"}>
            <FG label="Title *">
                <Input {...field("title")} placeholder="Note title…" autoFocus />
            </FG>
            <FG label="Content">
                <Textarea {...field("content")} placeholder="Write your note here…" rows={5} />
            </FG>

            {/* Color picker */}
            <FG label="Color">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {NOTE_COLORS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setForm((f) => ({ ...f, color: c.id }))}
                            title={c.label}
                            style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: c.bg,
                                border: form.color === c.id
                                    ? `2.5px solid ${c.dot}`
                                    : `2px solid ${c.border}`,
                                cursor: "pointer",
                                boxShadow: form.color === c.id ? `0 0 0 3px ${c.dot}25` : "none",
                                transition: "all .15s",
                                flexShrink: 0,
                            }}
                        />
                    ))}
                </div>
            </FG>

            <ModalFoot>
                {mode === "edit" && <DangerBtn onClick={() => onArchive(initial.id)}>📦 Archive</DangerBtn>}
                <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                <Btn onClick={save}>Save Note</Btn>
            </ModalFoot>
        </Modal>
    );
}
