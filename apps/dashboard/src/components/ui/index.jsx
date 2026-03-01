
/* ── shared base style for inputs ── */
const baseInput = {
    width: "100%", padding: "10px 13px", background: "#F4F5F7",
    border: "1.5px solid #E8EAED", borderRadius: 12,
    fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#111218",
    outline: "none", transition: "border-color .2s, box-shadow .2s",
    WebkitAppearance: "none",
};

export function Input(props) {
    return <input className="inp-focus" style={baseInput} {...props} />;
}

export function Textarea(props) {
    return (
        <textarea
            className="inp-focus"
            style={{ ...baseInput, resize: "vertical", minHeight: 76, lineHeight: 1.6 }}
            {...props}
        />
    );
}

export function Select({ children, ...props }) {
    return (
        <select className="inp-focus" style={baseInput} {...props}>
            {children}
        </select>
    );
}

export function Btn({ children, onClick, style = {} }) {
    return (
        <button
            onClick={onClick}
            className="btn-hover-ink"
            style={{
                padding: "9px 20px", background: "#111218", color: "#fff",
                border: "none", borderRadius: 8,
                fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "opacity .15s",
                display: "flex", alignItems: "center", gap: 6, ...style,
            }}
        >
            {children}
        </button>
    );
}

export function GhostBtn({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "9px 18px", background: "transparent",
                border: "1.5px solid #D1D5DB", borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer",
                fontFamily: "'Poppins',sans-serif",
            }}
        >
            {children}
        </button>
    );
}

export function DangerBtn({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "9px 14px", background: "#FEF2F2", color: "#DC2626",
                border: "1.5px solid rgba(220,38,38,.22)", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                marginRight: "auto", fontFamily: "'Poppins',sans-serif",
            }}
        >
            {children}
        </button>
    );
}

export function FG({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{
                display: "block", fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7,
            }}>
                {label}
            </label>
            {children}
        </div>
    );
}

export function Row2({ children }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
            {children}
        </div>
    );
}

export function ModalFoot({ children }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 22, paddingTop: 18, borderTop: "1px solid #F0F1F3",
        }}>
            {children}
        </div>
    );
}

export function Modal({ children, onClose, title }) {
    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 500,
                background: "rgba(10,12,18,.42)", backdropFilter: "blur(7px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 16px",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: "#fff", border: "1px solid #E8EAED", borderRadius: 24,
                padding: 32, width: "min(540px, 100%)", maxHeight: "88vh", overflowY: "auto",
                boxShadow: "0 28px 72px rgba(0,0,0,.15)",
                animation: "scaleIn .22s cubic-bezier(.22,1,.36,1)",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
                    <h2 style={{
                        fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700,
                        letterSpacing: "-.2px", color: "#111218",
                    }}>
                        {title}
                    </h2>
                    <button
                        className="close-hover"
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, border: "1.5px solid #E8EAED", borderRadius: 8,
                            background: "transparent", fontSize: 14, color: "#6B7280", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background .15s",
                        }}
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
