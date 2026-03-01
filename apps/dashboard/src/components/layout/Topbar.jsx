import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { DAYS, MONTHS } from "../../constants";
import { p2 } from "../../utils/deadline";
import { Btn } from "../ui";
import { fetchProjects, createProject } from "../../lib/api";

export default function Topbar({ page, setPage, user, guestMode, currentProject, onSelectProject, onInvite, onShowActivity, onNewTask, onNewIdea, onSettings, onSignOut }) {
    const [clock, setClock] = useState({ time: "", date: "" });
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const tick = () => {
            const n = new Date();
            setClock({
                time: `${p2(n.getHours())}:${p2(n.getMinutes())}:${p2(n.getSeconds())}`,
                date: `${DAYS[n.getDay()]}, ${MONTHS[n.getMonth()]} ${n.getDate()} ${n.getFullYear()}`,
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
                setCreatingNew(false);
                setNewName("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const openDropdown = async () => {
        const opening = !dropdownOpen;
        setDropdownOpen(opening);
        if (opening && !guestMode && user) {
            setLoadingProjects(true);
            const { data } = await fetchProjects();
            if (data) setProjects(data);
            setLoadingProjects(false);
        }
    };

    const handleSwitch = (p) => {
        onSelectProject(p);
        setDropdownOpen(false);
        setCreatingNew(false);
        setNewName("");
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        const { data, error } = await createProject(newName.trim(), user.id);
        setSaving(false);
        if (!error && data) {
            handleSwitch(data);
        }
    };

    const handleSignOut = async () => {
        if (onSignOut) onSignOut();
        else await supabase.auth.signOut();
    };

    const actionBtn =
        page === "roadmap" ? <Btn onClick={onNewTask}>+ New Task</Btn> :
            page === "ideas" ? <Btn onClick={onNewIdea}>+ New Idea</Btn> :
                null;

    return (
        <div style={{
            position: "sticky", top: 0, zIndex: 200, height: 60, padding: "0 28px",
            background: scrolled ? "rgba(255,255,255,.93)" : "rgba(244,245,247,.7)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid #E8EAED", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,.05)" : "none",
            transition: "all .2s"
        }}>
            {/* ── LEFT ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

                {/* Logo */}
                <img src="/logo.png" alt="Frixa" style={{ height: 22, width: "auto", objectFit: "contain", flexShrink: 0 }} />

                <div style={{ width: 1, height: 24, background: "#E8EAED" }} />

                {/* Project switcher pill + dropdown */}
                <div ref={dropdownRef} style={{ position: "relative" }}>
                    <button
                        onClick={openDropdown}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "6px 14px",
                            background: dropdownOpen ? "#fff" : "#F4F5F7",
                            border: dropdownOpen ? "1.5px solid #475569" : "1.5px solid #E8EAED",
                            borderRadius: 99, cursor: "pointer",
                            transition: "all .18s",
                            fontFamily: "'Poppins',sans-serif",
                            boxShadow: dropdownOpen ? "0 2px 12px rgba(71,85,105,.12)" : "none",
                        }}
                        className="project-pill"
                    >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "#475569", display: "inline-block" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111218", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {currentProject?.name || "Workspace"}
                        </span>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                            style={{ color: "#9CA3AF", flexShrink: 0, transition: "transform .2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Dropdown panel */}
                    {dropdownOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 10px)", left: 0,
                            background: "#fff", border: "1.5px solid #E8EAED",
                            borderRadius: 18, padding: 10, minWidth: 240,
                            boxShadow: "0 16px 48px rgba(0,0,0,.12)",
                            animation: "dropDown .18s cubic-bezier(.22,1,.36,1)",
                            zIndex: 400,
                        }}>
                            {/* Project list */}
                            {loadingProjects ? (
                                <div style={{ padding: "12px 10px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>Loading…</div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: projects.length ? 8 : 0 }}>
                                    {projects.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSwitch(p)}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 10,
                                                padding: "9px 12px", border: "none", borderRadius: 10,
                                                background: p.id === currentProject?.id ? "#F1F5F9" : "transparent",
                                                cursor: "pointer", textAlign: "left", transition: "background .12s",
                                                fontFamily: "'Poppins',sans-serif",
                                            }}
                                            className="proj-item"
                                        >
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.id === currentProject?.id ? "#475569" : "#D1D5DB", flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, fontWeight: p.id === currentProject?.id ? 700 : 500, color: "#111218", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {p.name}
                                            </span>
                                            {p.id === currentProject?.id && (
                                                <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", background: "#E2E8F0", borderRadius: 6, padding: "1px 6px" }}>Active</span>
                                            )}
                                        </button>
                                    ))}
                                    {projects.length === 0 && !guestMode && (
                                        <div style={{ padding: "10px 12px", fontSize: 12.5, color: "#9CA3AF", fontStyle: "italic" }}>No other projects</div>
                                    )}
                                </div>
                            )}

                            {/* Divider */}
                            <div style={{ height: 1, background: "#F0F1F3", margin: "4px 0 8px" }} />

                            {/* New project inline form */}
                            {creatingNew ? (
                                <div style={{ padding: "4px 4px 2px" }}>
                                    <input
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") { setCreatingNew(false); setNewName(""); } }}
                                        placeholder="Project name…"
                                        style={{
                                            width: "100%", padding: "9px 12px", border: "1.5px solid #CBD5E1",
                                            borderRadius: 10, fontSize: 13, fontFamily: "'Poppins',sans-serif",
                                            fontWeight: 500, color: "#111218", background: "#F8FAFC",
                                            outline: "none", boxSizing: "border-box", marginBottom: 8,
                                        }}
                                    />
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button
                                            onClick={handleCreate}
                                            disabled={saving}
                                            style={{ flex: 1, padding: "8px 0", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif" }}
                                        >{saving ? "Creating…" : "Create"}</button>
                                        <button
                                            onClick={() => { setCreatingNew(false); setNewName(""); }}
                                            style={{ padding: "8px 12px", background: "#F4F5F7", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
                                        >Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setCreatingNew(true)}
                                    style={{
                                        width: "100%", padding: "9px 12px", border: "1.5px dashed #E8EAED",
                                        borderRadius: 10, background: "transparent", fontFamily: "'Poppins',sans-serif",
                                        fontSize: 12.5, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                                        textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                                    }}
                                    className="proj-item"
                                >
                                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Project
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ width: 1, height: 24, background: "#E8EAED" }} />

                {/* Page nav */}
                <nav style={{ display: "flex", gap: 2 }}>
                    {(guestMode ? ["roadmap", "ideas", "archive"] : ["roadmap", "ideas", "archive", "projects"]).map((id) => (
                        <button
                            key={id}
                            onClick={() => setPage(id)}
                            className={`nav-btn${page === id ? " nav-btn-active" : ""}`}
                            style={{
                                padding: "6px 14px", border: "none", borderRadius: 8,
                                cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                                fontSize: 13, fontWeight: page === id ? 600 : 500,
                                color: page === id ? "#fff" : "#6B7280",
                                background: page === id ? "#111218" : "transparent",
                                transition: "all .15s", textTransform: "capitalize",
                            }}
                        >{id}</button>
                    ))}
                </nav>
            </div>

            {/* ── RIGHT ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Clock */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0F1F3", border: "1px solid #E8EAED", borderRadius: 12, padding: "5px 14px" }}>
                    {/* Calendar icon */}
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: "#9CA3AF", flexShrink: 0 }}>
                        <rect x="1" y="2.5" width="13" height="11.5" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M1 6.5h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M4.5 1v3M10.5 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        <circle cx="5" cy="10" r=".9" fill="currentColor" />
                        <circle cx="7.5" cy="10" r=".9" fill="currentColor" />
                        <circle cx="10" cy="10" r=".9" fill="currentColor" />
                    </svg>
                    <div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218", letterSpacing: ".4px", minWidth: 68 }}>{clock.time}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>{clock.date}</div>
                    </div>
                </div>

                {actionBtn}

                {/* Activity feed */}
                {onShowActivity && !guestMode && (
                    <button
                        onClick={onShowActivity}
                        title="Activity feed"
                        style={{ width: 38, height: 38, border: "1.5px solid #E8EAED", borderRadius: 11, background: "transparent", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                        className="nav-btn"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8h2M4 4h2M4 12h2M7 1h2M7 15h2M10 4h2M10 12h2M13 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                )}

                {/* Invite */}
                {onInvite && !guestMode && (
                    <button
                        onClick={onInvite}
                        title="Invite collaborators"
                        style={{ width: 38, height: 38, border: "1.5px solid #E8EAED", borderRadius: 11, background: "transparent", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                        className="nav-btn"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M1 13c0-2.761 2.239-5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </button>
                )}

                {/* Settings icon */}
                <button
                    onClick={onSettings}
                    title="Settings"
                    style={{ width: 38, height: 38, border: "1.5px solid #E8EAED", borderRadius: 11, background: "transparent", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                    className="nav-btn"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M14.6 3.4l-1.4 1.4M4.8 13.2l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    title={guestMode ? "Exit guest mode" : "Sign out"}
                    style={{ padding: "6px 12px", border: "1.5px solid #E8EAED", borderRadius: 8, background: "transparent", color: "#9CA3AF", fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
                    className="nav-btn"
                >{guestMode ? "↪ Exit" : "↪ Out"}</button>
            </div>

            <style>{`
                .project-pill:hover { background: #fff !important; border-color: #475569 !important; }
                .proj-item:hover { background: #F4F5F7 !important; }
                @keyframes dropDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
