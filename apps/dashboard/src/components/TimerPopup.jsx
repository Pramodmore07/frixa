export default function TimerPopup({ label, onClose }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(10,12,18,.48)", backdropFilter: "blur(9px)",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{
                background: "#fff", border: "1px solid #E8EAED", borderRadius: 24,
                padding: "52px 40px", textAlign: "center", maxWidth: 400, width: "90%",
                boxShadow: "0 28px 72px rgba(0,0,0,.16)",
                animation: "scaleIn .3s cubic-bezier(.22,1,.36,1)",
            }}>
                <div style={{ fontSize: 60, marginBottom: 18, display: "inline-block", animation: "popBounce .5s cubic-bezier(.22,1,.36,1)" }}>🎉</div>
                <h2 style={{
                    fontFamily: "'Poppins',sans-serif", fontSize: 25, fontWeight: 700,
                    letterSpacing: "-.4px", marginBottom: 10, color: "#111218",
                }}>
                    Time&apos;s up!
                </h2>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 28 }}>
                    {label ? `"${label}" complete.` : "Your focus session is complete."}<br />
                    Awesome work, Pramod! 🚀
                </p>
                <button
                    onClick={onClose}
                    className="login-btn-hover"
                    style={{
                        padding: "12px 34px", background: "#111218", color: "#fff",
                        border: "none", borderRadius: 12, fontFamily: "'Poppins',sans-serif",
                        fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity .2s",
                    }}
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}
