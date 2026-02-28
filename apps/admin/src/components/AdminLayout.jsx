import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const NAV = [
    { id: "overview",  label: "Overview",  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: "projects",  label: "Projects",  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a1 1 0 011-1h3l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
    { id: "tasks",     label: "Tasks",     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4.5 8l2.5 2.5 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "users",     label: "Users",     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="13" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 9c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: "ideas",     label: "Ideas",     icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 014 8l-.5 1H4.5L4 9A5 5 0 018 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5.5 13.5h5M6.5 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: "activity",  label: "Activity",  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h2.5l2-5 3 10 2-5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "settings",  label: "Settings",  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

export default function AdminLayout({ children, activeTab, setActiveTab, onLogout }) {
    const [adminEmail, setAdminEmail] = useState("");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setAdminEmail(data?.user?.email || ""));
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const initials = adminEmail ? adminEmail.slice(0, 2).toUpperCase() : "AD";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Inter', 'Poppins', sans-serif", color: "#111218" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #E2E4E8; border-radius: 99px; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
                @keyframes scaleIn { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
                .nav-item:hover { background: #F4F5F7!important; color: #111218!important; }
                .row-hover:hover { background: #FAFBFD!important; }
                .btn-hover:hover { opacity:.85!important; }
                .ghost-btn:hover { background: #F4F5F7!important; border-color: #D1D5DB!important; }
                .danger-btn:hover { background: #DC2626!important; }
                .tag-chip:hover { border-color: #2563EB!important; color: #2563EB!important; }
            `}</style>

            {/* ── Sidebar ── */}
            <aside style={{
                width: 260, background: "#fff", borderRight: "1px solid #E8EAED",
                display: "flex", flexDirection: "column", position: "fixed",
                height: "100vh", zIndex: 100, boxShadow: "2px 0 12px rgba(0,0,0,.04)"
            }}>
                {/* Logo */}
                <div style={{ padding: "28px 24px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F0F1F3" }}>
                    <div style={{ height: 36, padding: "0 10px", background: "#111218", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <img src="/logo.png" alt="Frixa" style={{ height: 20, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} onError={e => { e.target.style.display="none"; }} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 800, letterSpacing: "-.4px" }}>Frixa</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em" }}>Admin Console</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#C4C9D4", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 12px", marginBottom: 8 }}>Management</div>
                    {NAV.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveTab(item.id)}
                                className={isActive ? "" : "nav-item"}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 14px", borderRadius: 11, border: "none",
                                    background: isActive ? "#111218" : "transparent",
                                    color: isActive ? "#fff" : "#6B7280",
                                    fontFamily: "'Inter',sans-serif", fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                                    cursor: "pointer", marginBottom: 2, textAlign: "left",
                                    transition: "all .15s",
                                }}
                            >
                                <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                                {item.label}
                                {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: .6 }} />}
                            </button>
                        );
                    })}
                </nav>

                {/* Admin profile */}
                <div style={{ padding: "16px", borderTop: "1px solid #F0F1F3" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F8F9FA", borderRadius: 12, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#111218", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminEmail || "Admin"}</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF" }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={onLogout} className="ghost-btn"
                        style={{ width: "100%", padding: "9px", background: "#fff", border: "1.5px solid #E8EAED", borderRadius: 10, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7280", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 1H2a1 1 0 00-1 1v10a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div style={{ flex: 1, marginLeft: 260, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                {/* Topbar */}
                <header style={{
                    height: 64, background: scrolled ? "rgba(255,255,255,.92)" : "#fff",
                    backdropFilter: "blur(12px)", borderBottom: "1px solid #E8EAED",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 40px", position: "sticky", top: 0, zIndex: 90,
                    transition: "box-shadow .2s",
                    boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,.06)" : "none",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>Frixa Admin</span>
                        <span style={{ color: "#D1D5DB" }}>/</span>
                        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 700, color: "#111218" }}>
                            {NAV.find(n => n.id === activeTab)?.label}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ padding: "5px 12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 6px #22C55E" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>System Online</span>
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#111218", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>{initials}</div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: "36px 40px", maxWidth: 1280, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
