import { useState, useRef, useEffect } from "react";
import { p2 } from "../utils/deadline";

const PRESETS = [
    { label: "5m",  h: 0, m: 5,  s: 0 },
    { label: "10m", h: 0, m: 10, s: 0 },
    { label: "25m", h: 0, m: 25, s: 0 },
    { label: "45m", h: 0, m: 45, s: 0 },
    { label: "1h",  h: 1, m: 0,  s: 0 },
];

const R    = 50;
const SW   = 4;
const SIZE = (R + SW) * 2;
const CIRC = 2 * Math.PI * R;

export default function FocusTimer({ onDone }) {
    const [h, setH]             = useState(0);
    const [m, setM]             = useState(25);
    const [s, setS]             = useState(0);
    const [remain, setRemain]   = useState(0);
    const [total,  setTotal]    = useState(0);
    const [running, setRunning] = useState(false);
    const [label,  setLabel]    = useState("");
    const [activePreset, setActivePreset] = useState("25m");
    const iv = useRef(null);

    const fmt   = (r) => `${p2(Math.floor(r / 3600))}:${p2(Math.floor((r % 3600) / 60))}:${p2(r % 60)}`;
    const shown = remain > 0 ? fmt(remain) : fmt(h * 3600 + m * 60 + s) || "00:25:00";
    const pct   = total > 0 ? remain / total : 1;

    const isUrgent  = running && remain <= 60;
    const isWarning = running && remain > 60 && remain <= 300;
    const accent    = isUrgent ? "#EF4444" : isWarning ? "#F59E0B" : "#111218";
    const accentBg  = isUrgent ? "rgba(239,68,68,.08)" : isWarning ? "rgba(245,158,11,.08)" : "rgba(17,18,24,.06)";
    const glowColor = isUrgent ? "rgba(239,68,68,.18)" : isWarning ? "rgba(245,158,11,.14)" : "rgba(17,18,24,.10)";
    const ringTrack = isUrgent ? "rgba(239,68,68,.12)" : isWarning ? "rgba(245,158,11,.12)" : "#EBEDF2";

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

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    return (
        <div className="ft-card" style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,.07)",
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 6px 24px rgba(0,0,0,.05)",
            overflow: "hidden",
            position: "relative",
            transition: "box-shadow .3s",
        }}>

            {/* 2px top accent bar */}
            <div style={{
                height: 2,
                background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 100%)`,
                transition: "background .4s",
            }} />

            <div className="ft-inner" style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                gap: 20,
            }}>

                {/* ── Ring ── */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    {/* Ambient glow */}
                    <div style={{
                        position: "absolute", inset: -8, borderRadius: "50%",
                        background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
                        transition: "background .5s", pointerEvents: "none",
                    }} />

                    <svg width={SIZE} height={SIZE} style={{ display: "block", transform: "rotate(-90deg)" }}>
                        <circle cx={cx} cy={cy} r={R} fill="none" stroke={ringTrack} strokeWidth={SW} style={{ transition: "stroke .4s" }} />
                        <circle
                            cx={cx} cy={cy} r={R} fill="none"
                            stroke={accent} strokeWidth={SW} strokeLinecap="round"
                            strokeDasharray={CIRC}
                            strokeDashoffset={CIRC * (1 - pct)}
                            style={{ transition: "stroke-dashoffset .9s linear, stroke .4s", filter: `drop-shadow(0 0 5px ${accent}55)` }}
                        />
                    </svg>

                    {/* Centre overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 2,
                    }}>
                        <span style={{
                            fontFamily: "'Poppins',sans-serif",
                            fontSize: 22, fontWeight: 800,
                            color: "#0F1117", letterSpacing: "-1.5px", lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                            transition: "color .4s",
                        }}>{shown}</span>

                        <span style={{
                            fontSize: 8, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: ".12em",
                            color: running ? accent : "#B0B7C3",
                            fontFamily: "'Poppins',sans-serif",
                            transition: "color .4s",
                        }}>
                            {isUrgent ? "⚡ Urgent" : isWarning ? "Almost" : running ? "Focusing" : "Ready"}
                        </span>

                        {total > 0 && (
                            <div style={{ width: 36, height: 2, background: "#EBEDF2", borderRadius: 99, overflow: "hidden", marginTop: 2 }}>
                                <div style={{
                                    height: "100%", width: `${pct * 100}%`,
                                    borderRadius: 99, background: accent,
                                    transition: "width .9s linear, background .4s",
                                }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right panel ── */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>

                    {/* Row 1: header left + preset pills right */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        {/* Title + status */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{
                                fontFamily: "'Poppins',sans-serif", fontSize: 9.5, fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: ".1em",
                                color: "#0F1117",
                            }}>Focus Timer</span>
                            <span style={{
                                width: 5, height: 5, borderRadius: "50%",
                                background: running ? "#22C55E" : "#CBD5E1",
                                display: "inline-block", flexShrink: 0,
                                boxShadow: running ? "0 0 6px #22C55E" : "none",
                                animation: running ? "ftPulse 1.4s ease infinite" : "none",
                                transition: "background .3s",
                            }} />
                            {running && (
                                <span style={{
                                    fontSize: 9, fontWeight: 600, color: "#22C55E",
                                    fontFamily: "'Poppins',sans-serif",
                                }}>Focusing…</span>
                            )}
                        </div>

                        {/* Preset pills */}
                        <div style={{ display: "flex", gap: 3 }}>
                            {PRESETS.map((p) => {
                                const isActive = activePreset === p.label;
                                return (
                                    <button key={p.label} onClick={() => applyPreset(p)} disabled={running}
                                        style={{
                                            padding: "2px 8px", borderRadius: 99,
                                            fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 600,
                                            cursor: running ? "not-allowed" : "pointer",
                                            border: isActive ? `1.5px solid ${accent}` : "1.5px solid #E8EAED",
                                            background: isActive ? accent : "#FAFAFA",
                                            color: isActive ? "#fff" : "#6B7280",
                                            opacity: running ? 0.4 : 1,
                                            transition: "all .15s",
                                            lineHeight: 1.5,
                                        }}
                                    >{p.label}</button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Row 2: Session label input */}
                    <input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="What are you focusing on?"
                        style={{
                            width: "100%", padding: "5px 10px", borderRadius: 8,
                            background: "#FAFAFA", border: "1.5px solid #EBEDF2",
                            fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#374151",
                            outline: "none", boxSizing: "border-box",
                            transition: "border-color .15s, background .15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.background = "#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#EBEDF2"; e.target.style.background = "#FAFAFA"; }}
                    />

                    {/* Row 3: H:M:S inputs + action buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

                        {/* Compact H:M:S */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 2,
                            background: "#F4F5F7", borderRadius: 8, padding: "0 7px",
                            border: "1.5px solid #EBEDF2", height: 30, flexShrink: 0,
                        }}>
                            {[["H", h, setH, 23], ["M", m, setM, 59], ["S", s, setS, 59]].map(([lbl, val, setter, max], i) => (
                                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                                        <span style={{ fontSize: 7, fontWeight: 700, color: "#B0B7C3", letterSpacing: ".1em", fontFamily: "'Poppins',sans-serif", textTransform: "uppercase" }}>{lbl}</span>
                                        <input
                                            type="number" min={0} max={max} value={val} disabled={running}
                                            onChange={(e) => { setter(Math.min(max, Math.max(0, parseInt(e.target.value) || 0))); setActivePreset(""); }}
                                            style={{
                                                width: 26, height: 18, textAlign: "center",
                                                background: "transparent", border: "none",
                                                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 800,
                                                color: "#111218", outline: "none",
                                                cursor: running ? "not-allowed" : "auto",
                                                WebkitAppearance: "none", MozAppearance: "textfield",
                                            }}
                                        />
                                    </div>
                                    {i < 2 && (
                                        <span style={{ fontSize: 13, fontWeight: 800, color: "#D1D5DB", lineHeight: 1, marginTop: 8 }}>:</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Start / Pause */}
                        {!running ? (
                            <button onClick={start}
                                style={{
                                    flex: 1, height: 30, borderRadius: 8, border: "none",
                                    background: accent, color: "#fff",
                                    fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
                                    cursor: "pointer", letterSpacing: ".01em",
                                    boxShadow: `0 3px 10px ${accent}40`,
                                    transition: "opacity .15s, box-shadow .15s, background .4s",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = ".87"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                            >
                                <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                                    <path d="M1 1l8 5-8 5V1z" fill="currentColor" />
                                </svg>
                                Start Session
                            </button>
                        ) : (
                            <button onClick={pause}
                                style={{
                                    flex: 1, height: 30, borderRadius: 8,
                                    border: `1.5px solid ${accent}33`,
                                    background: accentBg, color: accent,
                                    fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
                                    cursor: "pointer", transition: "all .15s",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                }}
                            >
                                <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                                    <rect x="0" y="0" width="3.5" height="12" rx="1.5" fill="currentColor" />
                                    <rect x="6.5" y="0" width="3.5" height="12" rx="1.5" fill="currentColor" />
                                </svg>
                                Pause
                            </button>
                        )}

                        {/* Reset icon button */}
                        <button onClick={reset} title="Reset"
                            style={{
                                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                border: "1.5px solid #EBEDF2", background: "#FAFAFA",
                                color: "#94A3B8", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all .15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "#fff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EBEDF2"; e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.background = "#FAFAFA"; }}
                        >
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M7 1.5A5.5 5.5 0 1 1 2.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M1.5 7V4.5H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                </div>
                {/* ── end right panel ── */}

            </div>

            <style>{`
                @keyframes ftPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: .4; transform: scale(1.35); }
                }
                .ft-card:hover {
                    box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 10px 32px rgba(0,0,0,.08) !important;
                }
                /* hide number input arrows */
                .ft-inner input[type=number]::-webkit-inner-spin-button,
                .ft-inner input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                @media (max-width: 680px) {
                    .ft-inner { flex-direction: column !important; padding: 16px 18px !important; gap: 16px !important; }
                }
            `}</style>
        </div>
    );
}
