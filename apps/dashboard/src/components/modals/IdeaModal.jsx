import { useState } from "react";
import { Modal, FG, Input, Textarea, Select, ModalFoot, Btn, GhostBtn, DangerBtn } from "../ui";

export default function IdeaModal({ mode, initial, onSave, onDelete, onClose }) {
    const [form, setForm] = useState({ title: "", desc: "", cat: "product", ...initial });
    const field = (k) => ({ value: form[k], onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })) });

    const save = () => {
        if (!form.title.trim()) return;
        onSave({ ...form, id: initial?.id });
    };

    return (
        <Modal onClose={onClose} title={mode === "edit" ? "Edit Idea" : "New Idea"}>
            <FG label="Idea Title *">
                <Input {...field("title")} placeholder="What's the big idea?" autoFocus />
            </FG>
            <FG label="Description">
                <Textarea {...field("desc")} placeholder="Describe it in a few sentences…" />
            </FG>
            <FG label="Category">
                <Select {...field("cat")}>
                    <option value="product">Product</option>
                    <option value="marketing">Marketing</option>
                    <option value="growth">Growth</option>
                    <option value="tech">Tech</option>
                    <option value="other">Other</option>
                </Select>
            </FG>

            <ModalFoot>
                {mode === "edit" && <DangerBtn onClick={() => onDelete(initial.id)}>🗑 Delete</DangerBtn>}
                <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                <Btn onClick={save}>Save Idea</Btn>
            </ModalFoot>
        </Modal>
    );
}
