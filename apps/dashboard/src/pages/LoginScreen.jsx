import { useState } from "react";
import { supabase } from "../lib/supabase";

// Google "G" logo SVG
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.448 14.013 17.64 11.774 17.64 9.2z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
        <path d="M3.964 10.707C3.784 10.167 3.682 9.59 3.682 9c0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
);

export default function LoginScreen({ onGuestMode }) {
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    // ── Google OAuth ──────────────────────────────────────────────────────────
    const signInWithGoogle = async () => {
        setGoogleLoading(true);
        setError("");
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (err) { setError(err.message); setGoogleLoading(false); }
        // On success Supabase redirects — page will reload with session
    };

    // ── Email / Password ──────────────────────────────────────────────────────
    const submit = async () => {
        if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
        setLoading(true); setError(""); setInfo("");
        try {
            if (mode === "signup") {
                const { error: err } = await supabase.auth.signUp({ email, password });
                if (err) { setError(err.message); }
                else { setInfo("✅ Account created! Check your email for a confirmation link, then sign in."); setMode("signin"); }
            } else {
                const { error: err } = await supabase.auth.signInWithPassword({ email, password });
                if (err) {
                    if (err.message.toLowerCase().includes("invalid login credentials")) {
                        const { error: upErr } = await supabase.auth.signUp({ email, password });
                        if (upErr) {
                            setError(upErr.message.includes("already registered")
                                ? "Not verified yet? Check your inbox for a confirmation link."
                                : upErr.message);
                        } else {
                            setInfo("✅ Account created. Check your inbox to verify, then sign in.");
                        }
                    } else {
                        setError(err.message);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(145deg,#EFF6FF 0%,#F4F5F7 55%,#F0FDF4 100%)",
        }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 45% at 18% 18%, rgba(37,99,235,.11) 0%, transparent 70%), radial-gradient(ellipse 45% 38% at 82% 82%, rgba(16,185,129,.08) 0%, transparent 70%)" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: 420, animation: "fadeUp .65s cubic-bezier(.22,1,.36,1) both" }}>
                {/* Logo */}
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src="/logo.png" alt="Frixa" style={{ height: 40, width: "auto", objectFit: "contain" }} />
                </div>

                <div style={{ width: "100%", background: "#fff", border: "1px solid #E8EAED", borderRadius: 24, padding: "40px 38px 32px", boxShadow: "0 28px 72px rgba(0,0,0,.13)", textAlign: "center" }}>
                    <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-.5px", lineHeight: 1.2, marginBottom: 6, color: "#0F1117" }}>
                        {mode === "signin" ? "Welcome back" : "Create account"}
                    </h1>
                    <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 24, fontWeight: 500 }}>
                        {mode === "signin" ? "Sign in to your Frixa workspace" : "Start your personal Frixa workspace"}
                    </p>

                    {/* ── Google Sign-in ── */}
                    <button
                        onClick={signInWithGoogle}
                        disabled={googleLoading}
                        style={{
                            width: "100%", padding: "12px 16px",
                            background: googleLoading ? "#F4F5F7" : "#fff",
                            color: "#374151", border: "1.5px solid #E2E4E8",
                            borderRadius: 12, fontFamily: "'Inter','Poppins',sans-serif",
                            fontSize: 14, fontWeight: 600, cursor: googleLoading ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            boxShadow: "0 1px 6px rgba(0,0,0,.06)",
                            transition: "all .18s",
                            marginBottom: 16,
                        }}
                        className="google-btn"
                    >
                        {googleLoading
                            ? <><span style={{ width: 16, height: 16, border: "2px solid #D1D5DB", borderTop: "2px solid #2563EB", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> Redirecting…</>
                            : <><GoogleIcon /> Continue with Google</>
                        }
                    </button>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 1, background: "#F0F1F3" }} />
                        <span style={{ fontSize: 11, color: "#D1D5DB", fontWeight: 700, letterSpacing: ".06em" }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: "#F0F1F3" }} />
                    </div>

                    {/* ── Email fields ── */}
                    <input
                        type="email" value={email} placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        style={{ width: "100%", padding: "12px 15px", marginBottom: 9, background: "#F4F5F7", border: "1.5px solid #EBEBED", borderRadius: 11, fontFamily: "inherit", fontSize: 13.5, color: "#111218", outline: "none" }}
                    />
                    <input
                        type="password" value={password} placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        style={{ width: "100%", padding: "12px 15px", marginBottom: 13, background: "#F4F5F7", border: "1.5px solid #EBEBED", borderRadius: 11, fontFamily: "inherit", fontSize: 13.5, color: "#111218", letterSpacing: 3, outline: "none" }}
                    />

                    <button
                        onClick={submit} disabled={loading}
                        style={{ width: "100%", padding: "12px", background: loading ? "#6B7280" : "#111218", color: "#fff", border: "none", borderRadius: 11, fontFamily: "'Poppins',sans-serif", fontSize: 13.5, fontWeight: 700, letterSpacing: ".3px", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 18px rgba(17,18,24,.18)" }}
                    >
                        {loading ? "Please wait…" : mode === "signin" ? "Sign In →" : "Create Account →"}
                    </button>

                    {error && <p style={{ marginTop: 11, fontSize: 12.5, color: "#DC2626", fontWeight: 500 }}>{error}</p>}
                    {info && <p style={{ marginTop: 11, fontSize: 12.5, color: "#059669", fontWeight: 500 }}>{info}</p>}



                    <p style={{ marginTop: 18, fontSize: 12.5, color: "#9CA3AF" }}>
                        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setInfo(""); }}
                            style={{ border: "none", background: "transparent", color: "#2563EB", fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 12.5 }}>
                            {mode === "signin" ? "Sign up" : "Sign in"}
                        </button>
                    </p>

                    {onGuestMode && (
                        <button
                            onClick={onGuestMode}
                            style={{ marginTop: 12, width: "100%", padding: "10px", background: "transparent", border: "1.5px dashed #D1D5DB", borderRadius: 11, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 500, color: "#9CA3AF", cursor: "pointer" }}
                        >
                            Continue as Guest
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .google-btn:hover:not(:disabled) { background: #F8F9FF !important; border-color: #2563EB !important; box-shadow: 0 3px 12px rgba(37,99,235,.12) !important; }
            `}</style>
        </div>
    );
}
