import { useState, useRef, useEffect } from "react";
import { p2 } from "../utils/deadline";

const PRESETS = [
    { label: "5m",  h: 0, m: 5,  s: 0 },
    { label: "10m", h: 0, m: 10, s: 0 },
    { label: "25m", h: 0, m: 25, s: 0 },
    { label: "45m", h: 0, m: 45, s: 0 },
    { label: "1h",  h: 1, m: 0,  s: 0 },
];

const R    = 108;
const SW   = 8;          // stroke-width
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
    const accent    = isUrgent ? "#EF4444" : isWarning ? "#F59E0B" : "#475569";
    const accentBg  = isUrgent ? "rgba(239,68,68,.08)" : isWarning ? "rgba(245,158,11,.08)" : "rgba(71,85,105,.07)";
    const glowColor = isUrgent ? "rgba(239,68,68,.28)" : isWarning ? "rgba(245,158,11,.22)" : "rgba(71,85,105,.18)";

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
        <div style={{
            background: "linear-gradient(160deg, #FAFBFF 0%, #F4F6FC 100%)",
            border: "1.5px solid #EBEDF2",
            borderRadius: 24,
            marginBottom: 24,
            boxShadow: `0 2px 8px rgba(0,0,0,.04), 0 12px 40px rgba(37,99,235,.06)`,
            overflow: "hidden",
            position: "relative",
            transition: "box-shadow .4s, border-color .4s",
        }}>

            {/* Top accent bar */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
                transition: "background .4s",
            }} />

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px 40px 28px",
                gap: 0,
            }}>

                {/* ── Section label ── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 24, alignSelf: "flex-start",
                }}>
                    <span style={{
                        fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: ".1em",
                        color: accent, transition: "color .4s",
                    }}>⏱ Focus Timer</span>
                    <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: running ? "#22C55E" : "#CBD5E1",
                        display: "inline-block",
                        boxShadow: running ? "0 0 8px #22C55E" : "none",
                        animation: running ? "ftPulse 1.4s ease infinite" : "none",
                        transition: "background .3s",
                        flexShrink: 0,
                    }} />
                    {running && (
                        <span style={{
                            fontSize: 10.5, fontWeight: 700, color: "#22C55E",
                            fontFamily: "'Poppins',sans-serif",
                        }}>Focusing…</span>
                    )}
                </div>

                {/* ── Main body: ring LEFT + controls RIGHT ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 48,
                    width: "100%",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}>

                    {/* ────── Big Ring ────── */}
                    <div style={{ position: "relative", flexShrink: 0 }}>

                        {/* Outer glow ring */}
                        <div style={{
                            position: "absolute",
                            inset: -12,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                            transition: "background .5s",
                            pointerEvents: "none",
                        }} />

                        <svg
                            width={SIZE} height={SIZE}
                            style={{ display: "block", transform: "rotate(-90deg)" }}
                        >
                            {/* Track */}
                            <circle
                                cx={cx} cy={cy} r={R}
                                fill="none" stroke="#EBEDF2" strokeWidth={SW}
                            />
                            {/* Progress arc */}
                            <circle
                                cx={cx} cy={cy} r={R}
                                fill="none"
                                stroke={accent} strokeWidth={SW}
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                strokeDashoffset={CIRC * (1 - pct)}
                                style={{
                                    transition: "stroke-dashoffset .9s linear, stroke .4s",
                                    filter: `drop-shadow(0 0 8px ${accent}66)`,
                                }}
                            />
                        </svg>

                        {/* Centre content — overlaid on ring */}
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            gap: 6,
                        }}>
                            {/* Big time display */}
                            <span style={{
                                fontFamily: "'Poppins',sans-serif",
                                fontSize: 44,
                                fontWeight: 800,
                                color: "#0F1117",
                                letterSpacing: "-2px",
                                lineHeight: 1,
                                transition: "color .4s",
                                fontVariantNumeric: "tabular-nums",
                            }}>{shown}</span>

                            {/* Status */}
                            <span style={{
                                fontSize: 11, fontWeight: 700,
                                textTransform: "uppercase", letterSpacing: ".12em",
                                color: running ? accent : "#94A3B8",
                                fontFamily: "'Poppins',sans-serif",
                                transition: "color .4s",
                            }}>
                                {isUrgent ? "⚡ Urgent!" : isWarning ? "Almost done" : running ? "In progress" : "Ready"}
                            </span>

                            {/* Progress bar inside ring (thin) */}
                            {total > 0 && (
                                <div style={{
                                    width: 80, height: 3,
                                    background: "#EBEDF2", borderRadius: 99,
                                    overflow: "hidden", marginTop: 4,
                                }}>
                                    <div style={{
                                        height: "100%", width: `${pct * 100}%`,
                                        borderRadius: 99, background: accent,
                                        transition: "width .9s linear, background .4s",
                                    }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ────── Right column: controls ────── */}
                    <div style={{
                        display: "flex", flexDirection: "column",
                        gap: 18, minWidth: 240, flex: 1, maxWidth: 360,
                    }}>

                        {/* Focus label input */}
                        <div>
                            <div style={{
                                fontSize: 10.5, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: ".1em",
                                marginBottom: 6, fontFamily: "'Poppins',sans-serif",
                            }}>Session label</div>
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
                        </div>

                        {/* HMS inputs */}
                        <div>
                            <div style={{
                                fontSize: 10.5, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: ".1em",
                                marginBottom: 8, fontFamily: "'Poppins',sans-serif",
                            }}>Custom duration</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                {[["H", h, setH, 23], ["M", m, setM, 59], ["S", s, setS, 59]].map(([lbl, val, setter, max], i) => (
                                    <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, color: "#94A3B8",
                                                textTransform: "uppercase", letterSpacing: ".12em",
                                                fontFamily: "'Poppins',sans-serif",
                                            }}>{lbl}</span>
                                            <input
                                                type="number" min={0} max={max} value={val} disabled={running}
                                                onChange={(e) => {
                                                    setter(Math.min(max, Math.max(0, parseInt(e.target.value) || 0)));
                                                    setActivePreset("");
                                                }}
                                                style={{
                                                    width: 58, height: 52, textAlign: "center",
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
                                            <span style={{
                                                fontSize: 20, fontWeight: 800, color: "#D1D5DB",
                                                marginTop: 12, lineHeight: 1,
                                            }}>:</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preset chips */}
                        <div>
                            <div style={{
                                fontSize: 10.5, fontWeight: 700, color: "#94A3B8",
                                textTransform: "uppercase", letterSpacing: ".1em",
                                marginBottom: 8, fontFamily: "'Poppins',sans-serif",
                            }}>Quick set</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {PRESETS.map((p) => {
                                    const isActive = activePreset === p.label;
                                    return (
                                        <button key={p.label} onClick={() => applyPreset(p)}
                                            style={{
                                                padding: "6px 14px", borderRadius: 99,
                                                fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600,
                                                cursor: running ? "not-allowed" : "pointer",
                                                border: isActive ? `1.5px solid ${accent}` : "1.5px solid #E8EAED",
                                                background: isActive ? accentBg : "#fff",
                                                color: isActive ? accent : "#6B7280",
                                                opacity: running ? 0.45 : 1,
                                                transition: "all .15s",
                                                boxShadow: isActive ? `0 0 0 3px ${accent}12` : "none",
                                            }}
                                        >{p.label}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 8 }}>
                            {!running ? (
                                <button onClick={start}
                                    style={{
                                        flex: 1, padding: "12px 20px", borderRadius: 14, border: "none",
                                        background: accent, color: "#fff",
                                        fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700,
                                        cursor: "pointer",
                                        boxShadow: `0 4px 18px ${accent}44`,
                                        transition: "opacity .15s, box-shadow .15s, background .4s",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.opacity = ".88"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                                >
                                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                                        <path d="M1 1l9 5.5L1 12V1z" fill="currentColor" />
                                    </svg>
                                    Start Session
                                </button>
                            ) : (
                                <button onClick={pause}
                                    style={{
                                        flex: 1, padding: "12px 20px", borderRadius: 14,
                                        border: `1.5px solid ${accent}44`,
                                        background: accentBg, color: accent,
                                        fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700,
                                        cursor: "pointer", transition: "all .15s",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    }}
                                >
                                    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                                        <rect x="0" y="0" width="4" height="13" rx="1.8" fill="currentColor" />
                                        <rect x="7" y="0" width="4" height="13" rx="1.8" fill="currentColor" />
                                    </svg>
                                    Pause
                                </button>
                            )}

                            {/* Reset */}
                            <button onClick={reset} title="Reset"
                                style={{
                                    padding: "12px 14px", borderRadius: 14,
                                    border: "1.5px solid #E8EAED", background: "#fff",
                                    color: "#94A3B8", fontSize: 16, cursor: "pointer",
                                    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                                    transition: "all .15s",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.color = "#94A3B8"; }}
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ display: "block" }}>
                                    <path d="M7.5 1.5A6 6 0 1 1 2.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    <path d="M1.5 7.5V4.5H4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                    </div>
                    {/* ── end right column ── */}
                </div>
                {/* ── end main body ── */}
            </div>

            <style>{`
                @keyframes ftPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: .5; transform: scale(1.3); }
                }
            `}</style>
        </div>
    );
}
