import { useState, useRef, useEffect } from "react";
import { p2 } from "../utils/deadline";

const PRESETS = [
    { label: "5m", h: 0, m: 5, s: 0 },
    { label: "10m", h: 0, m: 10, s: 0 },
    { label: "25m", h: 0, m: 25, s: 0 },
    { label: "45m", h: 0, m: 45, s: 0 },
    { label: "1h", h: 1, m: 0, s: 0 },
];

const R = 52;
const CIRC = 2 * Math.PI * R;

export default function FocusTimer({ onDone }) {
    const [h, setH] = useState(0);
    const [m, setM] = useState(25);
    const [s, setS] = useState(0);
    const [remain, setRemain] = useState(0);
    const [total, setTotal] = useState(0);
    const [running, setRunning] = useState(false);
    const [label, setLabel] = useState("");
    const [activePreset, setActivePreset] = useState("25m");
    const iv = useRef(null);

    const fmt = (r) => `${p2(Math.floor(r / 3600))}:${p2(Math.floor((r % 3600) / 60))}:${p2(r % 60)}`;
    const shown = remain > 0 ? fmt(remain) : fmt(h * 3600 + m * 60 + s) || "00:25:00";
    const pct = total > 0 ? remain / total : 1;

    const isUrgent = running && remain <= 60;
    const isWarning = running && remain > 60 && remain <= 300;
    const accent = isUrgent ? "#EF4444" : isWarning ? "#F59E0B" : "#2563EB";
    const accentBg = isUrgent ? "rgba(239,68,68,.08)" : isWarning ? "rgba(245,158,11,.08)" : "rgba(37,99,235,.07)";

    const start = () => {
        if (running) return;
        const secs = remain > 0 ? remain : h * 3600 + m * 60 + s;
        if (secs <= 0) return;
        if (remain <= 0) { setTotal(secs); setRemain(secs); }
        setRunning(true);
        iv.current = setInterval(() => {
            setRemain((r) => {
                if (r <= 1) { clearInterval(iv.current); setRunning(false); onDone(label); return 0; }
                return r - 1;
            });
        }, 1000);
    };
    const pause = () => { clearInterval(iv.current); setRunning(false); };
    const reset = () => { clearInterval(iv.current); setRunning(false); setRemain(0); setTotal(0); };
    const applyPreset = (p) => {
        if (running) return;
        setH(p.h); setM(p.m); setS(p.s);
        const t = p.h * 3600 + p.m * 60 + p.s;
        setTotal(t); setRemain(t);
        setActivePreset(p.label);
    };

    useEffect(() => () => clearInterval(iv.current), []);

    return (
        <div style={{
            background: "linear-gradient(160deg, #FAFBFF 0%, #F8F9FC 100%)",
            border: "1.5px solid #EBEDF2",
            borderRadius: 20,
            marginBottom: 22,
            boxShadow: `0 1px 4px rgba(0,0,0,.04), 0 8px 32px rgba(37,99,235,.06)`,
            overflow: "hidden",
            position: "relative",
            transition: "box-shadow .4s, border-color .4s",
        }}>
            {/* Subtle left accent strip */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent, borderRadius: "20px 0 0 20px", transition: "background .4s" }} />

            <div style={{ display: "flex", alignItems: "center", paddingLeft: 16 }}>

                {/* ── Ring + time ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 28px 24px 16px", flexShrink: 0 }}>
                    <div style={{ position: "relative", width: 124, height: 124 }}>
                        <svg width={124} height={124} style={{ transform: "rotate(-90deg)" }}>
                            {/* Track */}
                            <circle cx={62} cy={62} r={R} fill="none" stroke="#EBEDF2" strokeWidth={5.5} />
                            {/* Progress */}
                            <circle
                                cx={62} cy={62} r={R} fill="none"
                                stroke={accent} strokeWidth={5.5} strokeLinecap="round"
                                strokeDasharray={CIRC}
                                strokeDashoffset={CIRC * (1 - pct)}
                                style={{ transition: "stroke-dashoffset .9s linear, stroke .4s", filter: `drop-shadow(0 0 5px ${accent}55)` }}
                            />
                        </svg>
                        {/* Centre */}
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <span style={{
                                fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800,
                                color: "#0F1117", letterSpacing: "-.3px", lineHeight: 1,
                            }}>{shown}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{
                                    width: 5, height: 5, borderRadius: "50%",
                                    background: running ? "#22C55E" : "#CBD5E1",
                                    display: "inline-block",
                                    boxShadow: running ? "0 0 6px #22C55E" : "none",
                                    animation: running ? "pulse 1.4s ease infinite" : "none",
                                    transition: "background .3s",
                                }} />
                                <span style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: running ? "#22C55E" : "#94A3B8", transition: "color .3s" }}>
                                    {running ? "Focus" : "Ready"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 72, background: "#EBEDF2", flexShrink: 0 }} />

                {/* ── HMS Inputs ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px 24px", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
                        {[["H", h, setH, 23], ["M", m, setM, 59], ["S", s, setS, 59]].map(([lbl, val, setter, max], i) => (
                            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 8.5, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".12em" }}>{lbl}</span>
                                    <input
                                        type="number" min={0} max={max} value={val} disabled={running}
                                        onChange={(e) => { setter(Math.min(max, Math.max(0, parseInt(e.target.value) || 0))); setActivePreset(""); }}
                                        style={{
                                            width: 50, height: 50, textAlign: "center",
                                            background: "#fff", border: "1.5px solid #E8EAED",
                                            borderRadius: 12, fontFamily: "'Poppins',sans-serif",
                                            fontSize: 20, fontWeight: 800, color: "#111218",
                                            outline: "none", cursor: running ? "not-allowed" : "auto",
                                            boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                                            transition: "border-color .15s, box-shadow .15s",
                                            WebkitAppearance: "none", MozAppearance: "textfield",
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                                        onBlur={(e) => { e.target.style.borderColor = "#E8EAED"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,.05)"; }}
                                    />
                                </div>
                                {i < 2 && (
                                    <span style={{ fontSize: 18, fontWeight: 800, color: "#D1D5DB", margin: "10px 4px 0", lineHeight: 1 }}>:</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Preset chips */}
                    <div style={{ display: "flex", gap: 4 }}>
                        {PRESETS.map((p) => {
                            const isActive = activePreset === p.label;
                            return (
                                <button key={p.label} onClick={() => applyPreset(p)}
                                    style={{
                                        padding: "4px 10px", borderRadius: 99,
                                        fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, fontWeight: 600,
                                        cursor: running ? "not-allowed" : "pointer",
                                        border: isActive ? `1.5px solid ${accent}` : "1.5px solid #E8EAED",
                                        background: isActive ? accentBg : "transparent",
                                        color: isActive ? accent : "#94A3B8",
                                        opacity: running ? 0.45 : 1,
                                        transition: "all .15s",
                                    }}
                                >{p.label}</button>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 72, background: "#EBEDF2", flexShrink: 0 }} />

                {/* ── Label + actions ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, padding: "20px 24px" }}>
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="What are you focusing on?"
                        style={{
                            width: "100%", padding: "10px 14px", borderRadius: 12,
                            background: "#fff", border: "1.5px solid #E8EAED",
                            fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: "#374151",
                            outline: "none", boxSizing: "border-box",
                            boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                            transition: "border-color .15s, box-shadow .15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                        onBlur={(e) => { e.target.style.borderColor = "#E8EAED"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,.04)"; }}
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                        {!running ? (
                            <button onClick={start} style={{
                                flex: 1, padding: "10px 20px", borderRadius: 12, border: "none",
                                background: accent, color: "#fff",
                                fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: `0 4px 16px ${accent}40`,
                                transition: "opacity .15s, box-shadow .15s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = ".88"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                            >
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M1 1l8 5-8 5V1z" fill="currentColor" /></svg>
                                Start Session
                            </button>
                        ) : (
                            <button onClick={pause} style={{
                                flex: 1, padding: "10px 20px", borderRadius: 12,
                                border: `1.5px solid ${accent}40`,
                                background: accentBg, color: accent,
                                fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 700,
                                cursor: "pointer", transition: "all .15s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                            }}>
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="0" y="0" width="3.5" height="12" rx="1.5" fill="currentColor" /><rect x="6.5" y="0" width="3.5" height="12" rx="1.5" fill="currentColor" /></svg>
                                Pause
                            </button>
                        )}
                        <button onClick={reset} title="Reset"
                            style={{
                                padding: "10px 13px", borderRadius: 12,
                                border: "1.5px solid #E8EAED", background: "#fff",
                                color: "#94A3B8", fontSize: 16, cursor: "pointer",
                                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                                transition: "all .15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.color = "#94A3B8"; }}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
                                <path d="M7 1.5A5.5 5.5 0 1 1 2.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M1.5 7V4.5H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress bar */}
                    {total > 0 && (
                        <div style={{ height: 3, background: "#EBEDF2", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct * 100}%`, borderRadius: 99, background: accent, transition: "width .9s linear, background .4s" }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
