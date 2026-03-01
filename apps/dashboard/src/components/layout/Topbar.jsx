import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { DAYS, MONTHS } from "../../constants";
import { p2 } from "../../utils/deadline";
import { Btn } from "../ui";
import { fetchProjects, createProject } from "../../lib/api";

/* ── Apple-style gear SVG ── */
function GearIcon({ size = 17, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path
                d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
                d="M16.2 12.5a1.4 1.4 0 0 0 .28 1.54l.05.05a1.7 1.7 0 0 1-2.4 2.4l-.05-.05a1.4 1.4 0 0 0-1.54-.28 1.4 1.4 0 0 0-.85 1.28V17.5a1.7 1.7 0 0 1-3.4 0v-.07a1.4 1.4 0 0 0-.92-1.28 1.4 1.4 0 0 0-1.54.28l-.05.05a1.7 1.7 0 0 1-2.4-2.4l.05-.05a1.4 1.4 0 0 0 .28-1.54 1.4 1.4 0 0 0-1.28-.85H2.5a1.7 1.7 0 0 1 0-3.4h.07a1.4 1.4 0 0 0 1.28-.92 1.4 1.4 0 0 0-.28-1.54l-.05-.05a1.7 1.7 0 0 1 2.4-2.4l.05.05a1.4 1.4 0 0 0 1.54.28h.07A1.4 1.4 0 0 0 8.43 2.5V2.5a1.7 1.7 0 0 1 3.4 0v.07a1.4 1.4 0 0 0 .85 1.28 1.4 1.4 0 0 0 1.54-.28l.05-.05a1.7 1.7 0 0 1 2.4 2.4l-.05.05a1.4 1.4 0 0 0-.28 1.54v.07a1.4 1.4 0 0 0 1.28.85h.06a1.7 1.7 0 0 1 0 3.4h-.07a1.4 1.4 0 0 0-1.28.85Z"
                stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    );
}

/* ── Profile initials avatar ── */
function Avatar({ email, size = 32 }) {
    const initials = email ? email.slice(0, 2).toUpperCase() : "?";
    // Deterministic color from email
    const colors = ["#475569", "#64748B", "#374151", "#1E293B", "#334155"];
    const idx = email ? email.charCodeAt(0) % colors.length : 0;
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: colors[idx], color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.38, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
            flexShrink: 0, letterSpacing: ".03em", userSelect: "none",
        }}>
            {initials}
        </div>
    );
}

export default function Topbar({ page, setPage, user, guestMode, currentProject, onSelectProject, onInvite, onShowActivity, onNewTask, onNewIdea, onSettings, onSignOut }) {
    const [clock, setClock] = useState({ time: "", date: "" });
    const [scrolled, setScrolled] = useState(false);

    // Project switcher dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [creatingNew, setCreatingNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);
    const dropdownRef = useRef(null);

    // Profile dropdown
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

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

    // Close project dropdown on outside click
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

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
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
            if (data) {
                const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setProjects(sorted);
            }
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
        if (!error && data) handleSwitch(data);
    };

    const handleSignOut = async () => {
        setProfileOpen(false);
        if (onSignOut) onSignOut();
        else await supabase.auth.signOut();
    };

    // Profile menu item helper
    const profileNav = (label, target, icon) => (
        <button
            key={target}
            onClick={() => { setPage(target); setProfileOpen(false); }}
            className="profile-menu-item"
            style={{
                width: "100%", padding: "9px 14px", border: "none", borderRadius: 10,
                background: page === target ? "#F1F5F9" : "transparent",
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                fontFamily: "'Poppins',sans-serif", fontSize: 13,
                fontWeight: page === target ? 600 : 500,
                color: page === target ? "#111218" : "#374151",
                transition: "background .12s",
            }}
        >
            <span style={{ color: page === target ? "#475569" : "#9CA3AF", display: "flex", alignItems: "center" }}>{icon}</span>
            {label}
            {page === target && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#475569" }} />}
        </button>
    );

    const actionBtn =
        page === "roadmap" ? <Btn onClick={onNewTask}>+ New Task</Btn> :
            page === "ideas" ? <Btn onClick={onNewIdea}>+ New Idea</Btn> :
                null;

    const email = user?.email || "";

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

                    {/* Project dropdown panel */}
                    {dropdownOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 10px)", left: 0,
                            background: "#fff", border: "1.5px solid #E8EAED",
                            borderRadius: 18, padding: 10, minWidth: 240,
                            boxShadow: "0 16px 48px rgba(0,0,0,.12)",
                            animation: "dropDown .18s cubic-bezier(.22,1,.36,1)",
                            zIndex: 400,
                        }}>
                            <div style={{ padding: "4px 12px 6px", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", letterSpacing: ".06em", textTransform: "uppercase" }}>Recent Projects</div>

                            {loadingProjects ? (
                                <div style={{ padding: "12px 10px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>Loading…</div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {projects.slice(0, 5).map(p => (
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
                                        <div style={{ padding: "10px 12px", fontSize: 12.5, color: "#9CA3AF", fontStyle: "italic" }}>No projects yet</div>
                                    )}
                                </div>
                            )}

                            {projects.length > 5 && (
                                <button
                                    onClick={() => { setPage("projects"); setDropdownOpen(false); setCreatingNew(false); setNewName(""); }}
                                    style={{
                                        width: "100%", padding: "8px 12px", border: "none", borderRadius: 10,
                                        background: "transparent", fontFamily: "'Poppins',sans-serif",
                                        fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer",
                                        textAlign: "left", display: "flex", alignItems: "center", gap: 6, marginTop: 2,
                                    }}
                                    className="proj-item"
                                >
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                                        <rect x="1" y="1" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                                        <rect x="7.5" y="1" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                                        <rect x="1" y="7.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                                        <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                                    </svg>
                                    View all {projects.length} projects
                                </button>
                            )}

                            <div style={{ height: 1, background: "#F0F1F3", margin: "8px 0" }} />

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
                                        <button onClick={handleCreate} disabled={saving}
                                            style={{ flex: 1, padding: "8px 0", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif" }}
                                        >{saving ? "Creating…" : "Create"}</button>
                                        <button onClick={() => { setCreatingNew(false); setNewName(""); }}
                                            style={{ padding: "8px 12px", background: "#F4F5F7", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
                                        >Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setCreatingNew(true)}
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

                {/* Action button (New Task / New Idea) */}
                {actionBtn}

                {/* Settings gear icon */}
                <button
                    onClick={onSettings}
                    title="Settings"
                    style={{ width: 38, height: 38, border: "1.5px solid #E8EAED", borderRadius: 11, background: "transparent", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                    className="nav-btn"
                >
                    <GearIcon size={17} />
                </button>

                {/* Profile avatar + dropdown */}
                <div ref={profileRef} style={{ position: "relative" }}>
                    <button
                        onClick={() => setProfileOpen(o => !o)}
                        title="Profile & navigation"
                        style={{
                            width: 38, height: 38, padding: 0, border: profileOpen ? "2px solid #475569" : "2px solid #E8EAED",
                            borderRadius: "50%", background: "transparent", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "border-color .15s",
                        }}
                    >
                        <Avatar email={email} size={32} />
                    </button>

                    {/* Profile dropdown */}
                    {profileOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 10px)", right: 0,
                            background: "#fff", border: "1.5px solid #E8EAED",
                            borderRadius: 18, padding: 10, minWidth: 220,
                            boxShadow: "0 16px 48px rgba(0,0,0,.13)",
                            animation: "dropDown .18s cubic-bezier(.22,1,.36,1)",
                            zIndex: 400,
                        }}>
                            {/* User info header */}
                            <div style={{ padding: "8px 14px 12px", borderBottom: "1px solid #F0F1F3", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Avatar email={email} size={36} />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {guestMode ? "Guest" : (email.split("@")[0] || "User")}
                                        </div>
                                        {!guestMode && email && (
                                            <div style={{ fontSize: 11, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Navigation items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {profileNav("Roadmap", "roadmap",
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/></svg>
                                )}
                                {profileNav("Ideas", "ideas",
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 10.5h4M5.5 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                                )}
                                {profileNav("Archive", "archive",
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 5.5v5.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 8h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                                )}
                                {!guestMode && profileNav("Projects", "projects",
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3.5h12M1 3.5V11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5M1 3.5l1.5-2h9L13 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                                )}
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "#F0F1F3", margin: "8px 0" }} />

                            {/* Tools */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {!guestMode && onShowActivity && (
                                    <button onClick={() => { onShowActivity(); setProfileOpen(false); }} className="profile-menu-item"
                                        style={{ width: "100%", padding: "9px 14px", border: "none", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, color: "#374151", transition: "background .12s" }}>
                                        <span style={{ color: "#9CA3AF", display: "flex" }}>
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8h2M4 4h2M4 12h2M7 1h2M7 15h2M10 4h2M10 12h2M13 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        </span>
                                        Activity Feed
                                    </button>
                                )}
                                {!guestMode && onInvite && (
                                    <button onClick={() => { onInvite(); setProfileOpen(false); }} className="profile-menu-item"
                                        style={{ width: "100%", padding: "9px 14px", border: "none", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, color: "#374151", transition: "background .12s" }}>
                                        <span style={{ color: "#9CA3AF", display: "flex" }}>
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M1 13c0-2.761 2.239-5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                        </span>
                                        Invite Members
                                    </button>
                                )}
                                <button onClick={() => { onSettings(); setProfileOpen(false); }} className="profile-menu-item"
                                    style={{ width: "100%", padding: "9px 14px", border: "none", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, color: "#374151", transition: "background .12s" }}>
                                    <span style={{ color: "#9CA3AF", display: "flex" }}><GearIcon size={14} /></span>
                                    Settings
                                </button>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "#F0F1F3", margin: "8px 0" }} />

                            {/* Sign out */}
                            <button
                                onClick={handleSignOut}
                                className="profile-menu-item-danger"
                                style={{
                                    width: "100%", padding: "9px 14px", border: "none", borderRadius: 10,
                                    background: "transparent", cursor: "pointer", textAlign: "left",
                                    display: "flex", alignItems: "center", gap: 10,
                                    fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600,
                                    color: "#DC2626", transition: "background .12s",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 12H2.5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1H5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                                    <path d="M9.5 10l3-3-3-3M12.5 7h-7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {guestMode ? "Exit Guest Mode" : "Sign Out"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .project-pill:hover { background: #fff !important; border-color: #475569 !important; }
                .proj-item:hover { background: #F4F5F7 !important; }
                .nav-btn:hover { background: #F4F5F7 !important; }
                .profile-menu-item:hover { background: #F4F5F7 !important; }
                .profile-menu-item-danger:hover { background: #FEF2F2 !important; }
                @keyframes dropDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
