import { useState, useEffect, useCallback } from "react";
import { Modal, FG, Input, ModalFoot, GhostBtn } from "../ui";
import { fetchProjectMembers, inviteMemberByEmail, removeMember } from "../../lib/api";

function RoleBadge({ role }) {
    const colors = {
        owner: { bg: "#F1F5F9", color: "#475569" },
        member: { bg: "#F0FDF4", color: "#16A34A" },
        viewer: { bg: "#F9FAFB", color: "#6B7280" },
    };
    const c = colors[role] ?? colors.member;
    return (
        <span style={{
            fontSize: 10.5, fontWeight: 700, textTransform: "capitalize",
            background: c.bg, color: c.color,
            padding: "2px 8px", borderRadius: 6,
        }}>{role}</span>
    );
}

function Avatar({ email, isMe }) {
    const initials = email ? email.slice(0, 2).toUpperCase() : "??";
    return (
        <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: isMe ? "#111218" : "#E8EAED",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: isMe ? "#fff" : "#6B7280",
            flexShrink: 0,
        }}>{initials}</div>
    );
}

export default function CollaboratorsModal({ project, user, onClose }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState("");
    const [inviteSuccess, setInviteSuccess] = useState("");
    const [copied, setCopied] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const isOwner = project?.owner_id === user?.id;
    const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${project?.id}`;

    const loadMembers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await fetchProjectMembers(project.id);
        if (!error && data) setMembers(data);
        setLoading(false);
    }, [project.id]);

    useEffect(() => { loadMembers(); }, [loadMembers]);

    const handleInvite = async () => {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) return;
        setInviteError("");
        setInviteSuccess("");
        setInviting(true);
        const { error } = await inviteMemberByEmail(project.id, trimmed);
        setInviting(false);
        if (error) {
            setInviteError(error.message);
        } else {
            setInviteSuccess(`${trimmed} was added to the project.`);
            setEmail("");
            loadMembers();
            setTimeout(() => setInviteSuccess(""), 3500);
        }
    };

    const handleRemove = async (memberId, memberUserId) => {
        setRemovingId(memberUserId);
        await removeMember(project.id, memberUserId);
        setRemovingId(null);
        loadMembers();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Modal title="Collaborators" onClose={onClose}>
            {/* Invite by email */}
            {isOwner && (
                <div style={{ marginBottom: 20 }}>
                    <FG label="Invite by Email">
                        <div style={{ display: "flex", gap: 8 }}>
                            <Input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setInviteError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                                placeholder="colleague@example.com"
                                type="email"
                            />
                            <button
                                onClick={handleInvite}
                                disabled={inviting || !email.trim()}
                                style={{
                                    padding: "0 18px", background: inviting ? "#9CA3AF" : "#111218",
                                    color: "#fff", border: "none", borderRadius: 10,
                                    fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700,
                                    cursor: inviting || !email.trim() ? "not-allowed" : "pointer",
                                    whiteSpace: "nowrap", flexShrink: 0, transition: "background .15s",
                                }}
                            >{inviting ? "Adding…" : "Add"}</button>
                        </div>
                    </FG>
                    {inviteError && (
                        <div style={{ marginTop: 6, padding: "8px 12px", background: "#FEF2F2", border: "1px solid rgba(220,38,38,.2)", borderRadius: 8, fontSize: 12.5, color: "#DC2626", fontWeight: 500 }}>
                            {inviteError}
                        </div>
                    )}
                    {inviteSuccess && (
                        <div style={{ marginTop: 6, padding: "8px 12px", background: "#F0FDF4", border: "1px solid rgba(22,163,74,.2)", borderRadius: 8, fontSize: 12.5, color: "#16A34A", fontWeight: 500 }}>
                            ✓ {inviteSuccess}
                        </div>
                    )}
                </div>
            )}

            {/* Members list */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 10, letterSpacing: ".05em" }}>
                    Members ({members.length})
                </div>

                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0", gap: 10 }}>
                        <div style={{ width: 20, height: 20, border: "2px solid #E8EAED", borderTop: "2px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>Loading members…</span>
                    </div>
                ) : members.length === 0 ? (
                    <div style={{ padding: "16px", textAlign: "center", fontSize: 13, color: "#9CA3AF", background: "#F9FAFB", borderRadius: 12, border: "1.5px dashed #E8EAED" }}>
                        No members yet.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {members.map((m) => {
                            const memberEmail = m.profiles?.email || `user-${m.user_id?.slice(0, 6)}`;
                            const isMe = m.user_id === user?.id;
                            const canRemove = isOwner && !isMe && m.role !== "owner";
                            return (
                                <div
                                    key={m.user_id}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "10px 12px", background: isMe ? "#F8FAFC" : "#F9FAFB",
                                        borderRadius: 12,
                                        border: `1px solid ${isMe ? "#CBD5E1" : "#E8EAED"}`,
                                    }}
                                >
                                    <Avatar email={memberEmail} isMe={isMe} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {memberEmail}
                                            {isMe && <span style={{ marginLeft: 6, fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>(you)</span>}
                                        </div>
                                        {m.created_at && (
                                            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                                                Joined {new Date(m.created_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <RoleBadge role={m.role} />
                                    {canRemove && (
                                        <button
                                            onClick={() => handleRemove(m.id, m.user_id)}
                                            disabled={removingId === m.user_id}
                                            title="Remove member"
                                            style={{
                                                width: 28, height: 28, border: "1.5px solid rgba(220,38,38,.2)",
                                                borderRadius: 7, background: "#FEF2F2", color: "#DC2626",
                                                cursor: removingId === m.user_id ? "not-allowed" : "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0, opacity: removingId === m.user_id ? 0.5 : 1,
                                                transition: "all .15s",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Invite link */}
            <div style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 14, border: "1px solid #CBD5E1", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M5.5 7.5a3 3 0 004.243 0l1.5-1.5a3 3 0 00-4.243-4.243L6 2.757" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M7.5 5.5a3 3 0 00-4.243 0L1.757 7A3 3 0 006 11.243L7 10.243" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Invite Link</span>
                </div>
                <p style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.5, marginBottom: 10 }}>
                    Share this link — anyone who opens it while logged in will join this project automatically.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                    <div style={{
                        flex: 1, padding: "8px 10px", background: "#fff", border: "1px solid #CBD5E1",
                        borderRadius: 8, fontSize: 11, color: "#6B7280",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {inviteLink}
                    </div>
                    <button
                        onClick={handleCopyLink}
                        style={{
                            padding: "8px 14px", background: copied ? "#059669" : "#111218",
                            color: "#fff", border: "none", borderRadius: 8,
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            flexShrink: 0, transition: "background .2s",
                        }}
                    >{copied ? "✓ Copied!" : "Copy"}</button>
                </div>
            </div>

            <ModalFoot>
                <GhostBtn onClick={onClose}>Done</GhostBtn>
            </ModalFoot>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </Modal>
    );
}
