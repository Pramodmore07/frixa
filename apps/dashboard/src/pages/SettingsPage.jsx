import { useState } from "react";
import StagesModal from "../components/modals/StagesModal";

/* ── Reusable sub-components ── */

function Section({ title, desc, children }) {
    return (
        <div style={{ background: "#fff", border: "1.5px solid #E8EAED", borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #F0F1F3" }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, color: "#111218" }}>{title}</div>
                {desc && <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 3 }}>{desc}</div>}
            </div>
            <div style={{ padding: "8px 28px 20px" }}>{children}</div>
        </div>
    );
}

function Row({ label, desc, children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: "1px solid #F9FAFB" }}>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 600, color: "#111218" }}>{label}</div>
                {desc && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>}
            </div>
            <div style={{ flexShrink: 0 }}>{children}</div>
        </div>
    );
}

function Toggle({ value, onChange }) {
    return (
        <button
            onClick={() => onChange(!value)}
            style={{
                width: 44, height: 25, borderRadius: 99, border: "none",
                background: value ? "#111218" : "#E5E7EB",
                position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0,
            }}
        >
            <span style={{
                position: "absolute", top: 3.5, left: value ? 22 : 3.5,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,.2)", transition: "left .2s", display: "block",
            }} />
        </button>
    );
}

function SaveBtn({ saved, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || saved}
            style={{
                padding: "9px 22px", border: "none", borderRadius: 10,
                background: saved ? "#059669" : "#111218",
                fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700,
                color: "#fff", cursor: saved || disabled ? "default" : "pointer",
                transition: "background .25s", display: "flex", alignItems: "center", gap: 6,
            }}
        >
            {saved ? (
                <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10l5.5-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Saved!</>
            ) : "Save Changes"}
        </button>
    );
}

function Avatar({ initials, color, size = 72 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.36, fontWeight: 700, fontFamily: "'Poppins',sans-serif",
            letterSpacing: ".03em", flexShrink: 0,
        }}>{initials}</div>
    );
}

const AVATAR_COLORS = [
    { label: "Slate", value: "#475569" },
    { label: "Charcoal", value: "#374151" },
    { label: "Navy", value: "#1E3A5F" },
    { label: "Forest", value: "#14532D" },
    { label: "Burgundy", value: "#7F1D1D" },
    { label: "Violet", value: "#4C1D95" },
    { label: "Ocean", value: "#0C4A6E" },
    { label: "Copper", value: "#7C2D12" },
];

/* ── Main Settings Page ── */
export default function SettingsPage({
    user, settings, onSave,
    stages, tasks, onSaveStages, onDeleteStage,
    guestMode,
}) {
    /* Profile */
    const email = user?.email || "";
    const defaultName = email.split("@")[0] || "User";
    const [displayName, setDisplayName] = useState(() => {
        try { return localStorage.getItem("profile_display_name") || defaultName; } catch { return defaultName; }
    });
    const [avatarColor, setAvatarColor] = useState(() => {
        try { return localStorage.getItem("profile_avatar_color") || "#475569"; } catch { return "#475569"; }
    });
    const [profileSaved, setProfileSaved] = useState(false);

    const saveProfile = () => {
        try {
            localStorage.setItem("profile_display_name", displayName);
            localStorage.setItem("profile_avatar_color", avatarColor);
        } catch { /* ignore */ }
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const initials = displayName.trim()
        ? displayName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : email.slice(0, 2).toUpperCase();

    /* Appearance */
    const [showTimer, setShowTimer] = useState(settings.showTimer ?? false);
    const [appSaved, setAppSaved] = useState(false);

    const saveAppearance = () => {
        onSave({ showTimer });
        setAppSaved(true);
        setTimeout(() => setAppSaved(false), 2000);
    };

    /* Workspace / Stages */
    const [stagesOpen, setStagesOpen] = useState(false);

    return (
        <div style={{ padding: "28px 28px 80px", maxWidth: 720, margin: "0 auto" }}>

            {/* ── Page header ── */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px", color: "#111218" }}>Settings</h1>
                <p style={{ fontSize: 13.5, color: "#6B7280", marginTop: 5 }}>Manage your profile, appearance and workspace preferences</p>
            </div>

            {/* ── Profile ── */}
            <Section title="Profile" desc="How you appear to yourself and collaborators">

                {/* Avatar preview + color picker */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0 20px", borderBottom: "1px solid #F0F1F3" }}>
                    <Avatar initials={initials} color={avatarColor} size={72} />
                    <div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Avatar Color</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {AVATAR_COLORS.map(c => (
                                <button
                                    key={c.value}
                                    title={c.label}
                                    onClick={() => setAvatarColor(c.value)}
                                    style={{
                                        width: 28, height: 28, borderRadius: "50%", background: c.value,
                                        border: avatarColor === c.value ? "3px solid #111218" : "3px solid transparent",
                                        cursor: "pointer", transition: "border .15s", outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <Row label="Display Name" desc="Shown in activity logs and collaboration features">
                    <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        style={{
                            padding: "8px 12px", border: "1.5px solid #E8EAED", borderRadius: 10,
                            fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500,
                            color: "#111218", background: "#F8F9FA", outline: "none",
                            width: 200, transition: "border-color .2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "#475569"}
                        onBlur={e => e.target.style.borderColor = "#E8EAED"}
                    />
                </Row>

                <Row label="Email" desc="Your Supabase account email — cannot be changed here">
                    <div style={{
                        padding: "8px 12px", border: "1.5px solid #E8EAED", borderRadius: 10,
                        fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#9CA3AF",
                        background: "#F4F5F7", width: 200, boxSizing: "border-box",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {guestMode ? "Guest (no account)" : email || "—"}
                    </div>
                </Row>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}>
                    <SaveBtn saved={profileSaved} onClick={saveProfile} />
                </div>
            </Section>

            {/* ── Appearance ── */}
            <Section title="Appearance" desc="Customize how the app looks and behaves">
                <Row label="Focus Timer" desc="Show the focus session countdown timer on the Roadmap page">
                    <Toggle value={showTimer} onChange={setShowTimer} />
                </Row>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16 }}>
                    <SaveBtn saved={appSaved} onClick={saveAppearance} />
                </div>
            </Section>

            {/* ── Workspace ── */}
            <Section title="Workspace" desc="Configure your Kanban stages and workflow">
                <Row label="Kanban Stages" desc={`${stages.length} stage${stages.length !== 1 ? "s" : ""} configured — add, rename, reorder or delete columns`}>
                    <button
                        onClick={() => setStagesOpen(true)}
                        style={{
                            padding: "8px 18px", border: "1.5px solid #E8EAED", borderRadius: 10,
                            background: "#F8F9FA", fontFamily: "'Poppins',sans-serif",
                            fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer",
                            transition: "all .15s", display: "flex", alignItems: "center", gap: 7,
                        }}
                        className="settings-manage-btn"
                    >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Manage Stages
                    </button>
                </Row>

                {/* Stage list preview */}
                <div style={{ paddingTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {stages.map(s => (
                        <div key={s.id} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "5px 12px", background: "#F4F5F7", borderRadius: 99,
                            fontSize: 12, fontWeight: 600, color: "#374151",
                            fontFamily: "'Poppins',sans-serif",
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                            {s.label}
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Account ── */}
            {!guestMode && (
                <Section title="Account" desc="Account information and danger zone">
                    <Row label="Account Type" desc="Your authentication method">
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#475569", background: "#F1F5F9", padding: "4px 12px", borderRadius: 99, fontFamily: "'Poppins',sans-serif" }}>
                            Supabase Auth
                        </span>
                    </Row>
                    <Row label="User ID" desc="Your unique Supabase user identifier">
                        <span style={{
                            fontSize: 11, fontWeight: 500, color: "#9CA3AF", background: "#F4F5F7",
                            padding: "5px 10px", borderRadius: 8, fontFamily: "monospace",
                            maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            display: "block",
                        }}>
                            {user?.id || "—"}
                        </span>
                    </Row>
                    <Row label="Member Since" desc="When your account was created">
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                            {user?.created_at
                                ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                                : "—"}
                        </span>
                    </Row>
                </Section>
            )}

            {/* StagesModal */}
            {stagesOpen && (
                <StagesModal
                    stages={stages} tasks={tasks}
                    onSave={(s) => { onSaveStages(s); setStagesOpen(false); }}
                    onDelete={onDeleteStage}
                    onClose={() => setStagesOpen(false)}
                />
            )}

            <style>{`
                .settings-manage-btn:hover { background: #fff !important; border-color: #475569 !important; }
            `}</style>
        </div>
    );
}
