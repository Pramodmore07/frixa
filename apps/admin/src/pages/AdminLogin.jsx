import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
            } else {
                onLogin();
                // Optionally reset loading after a delay if unmount hasn't happened
                setTimeout(() => setLoading(false), 2000);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error("Login Error:", err);
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F4F5F7",
            fontFamily: "'Inter', sans-serif",
            color: "#111218"
        }}>
            <form onSubmit={handleLogin} style={{
                background: "#fff",
                padding: "60px 50px",
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
                width: "100%",
                maxWidth: "440px",
                border: "1px solid #E2E4E8",
                animation: "fadeUp .5s ease-out"
            }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <img src="/logo.png" alt="Frixa" style={{ height: "40px", width: "auto", marginBottom: "20px", objectFit: "contain" }} />
                    <h2 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-1px" }}>Admin Portal</h2>
                    <p style={{ color: "#5F6368", fontSize: "14px", marginTop: "4px", fontWeight: "500" }}>Manage your cloud infrastructure</p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px" }}>Admin Identification</label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            background: "#F9FAFB",
                            border: "1.5px solid #E2E4E8",
                            outline: "none",
                            fontSize: "14px",
                            transition: "all 0.2s"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "40px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            background: "#F9FAFB",
                            border: "1.5px solid #E2E4E8",
                            outline: "none",
                            fontSize: "14px",
                            transition: "all 0.2s"
                        }}
                    />
                </div>

                {error && (
                    <div style={{
                        padding: "12px", background: "#fef2f2",
                        borderRadius: "10px", color: "#dc2626", fontSize: "13px",
                        fontWeight: "600", marginBottom: "24px", textAlign: "center",
                        border: "1px solid #fee2e2"
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "16px",
                        background: loading ? "#9CA3AF" : "#111218",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    className="btn-hover-ink"
                >
                    {loading ? "Authenticating..." : "Sign in to Dashboard →"}
                </button>

                <p style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: "#9CA3AF", fontWeight: "500" }}>
                    © 2026 Frixa Cloud Services
                </p>
            </form>
        </div>
    );
}
