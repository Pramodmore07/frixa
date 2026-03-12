import { useState } from "react";
import { Modal, FG, Row2, Input, Textarea, Select, ModalFoot, Btn, GhostBtn, DangerBtn } from "../ui";
import { IOSDatePicker, IOSTimePicker } from "../ui/Picker";

export default function TaskModal({ mode, initial, stages = [], onSave, onArchive, onClose }) {
    const firstStageId = stages[0]?.id ?? "planned";

    const [form, setForm] = useState(() => {
        const merged = { title: "", desc: "", status: firstStageId, priority: "", date: "", time: "", ...initial };
        merged.tags = Array.isArray(initial?.tags) ? initial.tags.join(", ") : (initial?.tags || "");
        return merged;
    });

    const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) });

    const save = () => {
        if (!form.title.trim()) return;
        const out = {
            ...form,
            title: form.title.trim().slice(0, 200),
            desc: (form.desc || "").slice(0, 5000),
            // Limit to 20 tags, each max 50 chars
            tags: form.tags.split(",").map((s) => s.trim().slice(0, 50)).filter(Boolean).slice(0, 20),
        };
        if (initial?.id) out.id = initial.id;
        onSave(out);
    };

    return (
        <Modal onClose={onClose} title={mode === "edit" ? "Edit Task" : "New Task"}>
            <FG label="Title *">
                <Input {...field("title")} placeholder="What needs to be done?" autoFocus />
            </FG>
            <FG label="Description">
                <Textarea {...field("desc")} placeholder="Add context, notes, links…" />
            </FG>
            <Row2>
                <FG label="Stage">
                    <Select {...field("status")}>
                        {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </Select>
                </FG>
                <FG label="Priority">
                    <Select {...field("priority")}>
                        <option value="">None</option>
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                    </Select>
                </FG>
            </Row2>
            <Row2>
                <FG label="Deadline Date (optional)">
                    <IOSDatePicker
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: e.target.value ? f.time : "" }))}
                    />
                </FG>
                <FG label="Deadline Time (optional)"><IOSTimePicker {...field("time")} /></FG>
            </Row2>
            <FG label="Tags (comma separated)">
                <Input {...field("tags")} placeholder="#Marketing, #Tech, #Launch" />
            </FG>

            <ModalFoot>
                {mode === "edit" && <DangerBtn onClick={() => onArchive(initial.id)}>🗑 Archive</DangerBtn>}
                <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                <Btn onClick={save}>Save Task</Btn>
            </ModalFoot>
        </Modal>
    );
}
