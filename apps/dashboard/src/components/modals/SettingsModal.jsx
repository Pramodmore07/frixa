import { useState } from "react";
import StagesModal from "./StagesModal";
import { Modal } from "../ui";

const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #F0F1F3" }}>
        <div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218" }}>{label}</div>
            {desc && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>}
        </div>
        <button
            onClick={() => onChange(!value)}
            style={{
                width: 42, height: 24, borderRadius: 99, border: "none",
                background: value ? "#111218" : "#E5E7EB",
                position: "relative", cursor: "pointer",
                transition: "background .2s", flexShrink: 0,
            }}
        >
            <span style={{
                position: "absolute", top: 3, left: value ? 21 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                transition: "left .2s", display: "block",
            }} />
        </button>
    </div>
);

export default function SettingsModal({ settings, onSave, stages, tasks, onSaveStages, onDeleteStage, onClose }) {
    const [showTimer, setShowTimer] = useState(settings.showTimer ?? false);
    const [stagesOpen, setStagesOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    const save = () => {
        onSave({ showTimer });
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1200);
    };

    return (
        <>
            <Modal onClose={onClose} title="⚙ Settings">
                <div style={{ marginBottom: 8 }}>
                    <Toggle
                        label="Focus Timer"
                        desc="Show the focus session timer on the Roadmap page"
                        value={showTimer}
                        onChange={setShowTimer}
                    />
                </div>

                {/* Manage Stages */}
                <div style={{ padding: "16px 0", borderBottom: "1px solid #F0F1F3" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218" }}>Kanban Stages</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Add, rename, reorder or remove columns</div>
                        </div>
                        <button
                            onClick={() => setStagesOpen(true)}
                            style={{
                                padding: "7px 16px", border: "1.5px solid #E8EAED", borderRadius: 10,
                                background: "#F8F9FA", fontFamily: "'Poppins',sans-serif",
                                fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer",
                            }}
                        >Manage →</button>
                    </div>
                </div>

                {/* footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 20, borderTop: "1px solid #F0F1F3", marginTop: 4 }}>
                    <button onClick={onClose} style={{ padding: "9px 20px", border: "1.5px solid #E8EAED", borderRadius: 10, background: "transparent", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>Cancel</button>
                    <button onClick={save} disabled={saved} style={{ padding: "9px 22px", border: "none", borderRadius: 10, background: saved ? "#059669" : "#111218", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: saved ? "default" : "pointer", boxShadow: saved ? "0 2px 10px rgba(5,150,105,.25)" : "0 2px 10px rgba(0,0,0,.15)", transition: "background .25s, box-shadow .25s", display: "flex", alignItems: "center", gap: 6 }}>
                        {saved ? (
                            <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10l5.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> Saved!</>
                        ) : "Save Settings"}
                    </button>
                </div>
            </Modal>

            {stagesOpen && (
                <StagesModal
                    stages={stages} tasks={tasks}
                    onSave={(s) => { onSaveStages(s); setStagesOpen(false); }}
                    onDelete={onDeleteStage}
                    onClose={() => setStagesOpen(false)}
                />
            )}
        </>
    );
}
