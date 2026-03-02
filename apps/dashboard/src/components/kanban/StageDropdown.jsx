import { useState, useRef, useEffect } from "react";

export default function StageDropdown({ task, stages, onPatchTask }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = stages.find((s) => s.id === task.status);
    const dot = current?.dot ?? "#9CA3AF";
    const label = current?.label ?? task.status;

    useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    const pick = (stageId) => {
        setOpen(false);
        if (stageId !== task.status) onPatchTask(task.id, { status: stageId });
    };

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-flex" }}
            onClick={(e) => e.stopPropagation()}
        >
            <span
                onClick={() => setOpen((v) => !v)}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, padding: "3px 9px",
                    background: open ? "#E8EAED" : "#F3F4F6",
                    borderRadius: 6, fontWeight: 600, color: "#374151",
                    whiteSpace: "nowrap", cursor: "pointer",
                    border: `1px solid ${open ? "#D1D5DB" : "transparent"}`,
                    transition: "all .12s",
                    userSelect: "none",
                }}
            >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, display: "inline-block", flexShrink: 0 }} />
                {label}
                <span style={{ fontSize: 8, color: "#9CA3AF", marginLeft: 2 }}>▾</span>
            </span>

            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 300,
                    background: "#fff", border: "1px solid #E8EAED", borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)", padding: 6,
                    minWidth: 160,
                }}>
                    {stages.map((s) => (
                        <div key={s.id}
                            onClick={() => pick(s.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                                fontFamily: "'Poppins',sans-serif", fontSize: 12.5, fontWeight: 600,
                                color: "#111218",
                                background: s.id === task.status ? "#F1F5F9" : "transparent",
                                transition: "background .1s",
                            }}
                            onMouseEnter={(e) => { if (s.id !== task.status) e.currentTarget.style.background = "#F8F9FA"; }}
                            onMouseLeave={(e) => { if (s.id !== task.status) e.currentTarget.style.background = "transparent"; }}
                        >
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0, display: "inline-block" }} />
                            {s.label}
                            {s.id === task.status && <span style={{ marginLeft: "auto", color: "#475569", fontSize: 11 }}>✓</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
