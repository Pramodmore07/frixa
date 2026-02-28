export default function Toast({ msg, type = "error" }) {
    const colors = type === "error"
        ? { bg: "#FEF2F2", border: "rgba(220,38,38,.25)", color: "#B91C1C", icon: "⚠" }
        : { bg: "#F0FDF4", border: "rgba(5,150,105,.25)", color: "#065F46", icon: "✓" };

    return (
        <div style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9999,
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 12, padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            fontFamily: "'Poppins',sans-serif", fontSize: 13, color: colors.color, fontWeight: 500,
            animation: "fadeUp .25s cubic-bezier(.22,1,.36,1) both",
            maxWidth: 340,
        }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{colors.icon}</span>
            {msg}
        </div>
    );
}
