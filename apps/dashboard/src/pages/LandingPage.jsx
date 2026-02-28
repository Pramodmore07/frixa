import { useState, useEffect } from "react";

export default function LandingPage({ onGetStarted }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        { title: "Isolated Workspaces", desc: "Create separate projects for different teams or goals. No data spills.", icon: "📁" },
        { title: "Team Collaboration", desc: "Invite colleagues and clients with role-based access control.", icon: "👥" },
        { title: "Live Activity Logs", desc: "See real-time updates as they happen across your entire project.", icon: "⚡" },
        { title: "Minimal Kanban", desc: "A sleek drag-and-drop board that feels buttery smooth.", icon: "🎨" },
        { title: "Idea Voting", desc: "Prioritize what matters by letting your team vote on ideas.", icon: "💡" },
        { title: "Encrypted & Secure", desc: "Your data is stored with industry-standard encryption.", icon: "🔒" },
    ];

    return (
        <div style={{ background: "#fafafa", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", color: "#111218", overflowX: "hidden" }}>

            {/* ── DOT GRID BACKGROUND ── */}
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
                backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
                backgroundSize: "40px 40px", opacity: 0.55, pointerEvents: "none"
            }} />

            {/* ── NAVBAR ── */}
            <nav style={{
                position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
                width: "min(1200px, 92%)", height: 64, zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 28px", background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)", borderRadius: 20,
                border: "1px solid rgba(232,234,237,0.9)",
                boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.07)" : "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.35s ease",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "#111218", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, fontWeight: 900 }}>F</div>
                    <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>Frixa</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", textDecoration: "none" }}>Platform</a>
                    <a href="#about" style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", textDecoration: "none" }}>Changelog</a>
                    <div style={{ width: 1, height: 18, background: "#E8EAED" }} />
                    <button onClick={onGetStarted} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "#111218", cursor: "pointer" }}>Log in</button>
                    <button
                        onClick={onGetStarted}
                        style={{ padding: "9px 18px", background: "#111218", color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >Get Started</button>
                </div>
            </nav>

            {/* ── HERO ── */}
            <header style={{ position: "relative", zIndex: 1, padding: "200px 20px 100px", textAlign: "center" }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
                    background: "#F0F4FF", borderRadius: 100, marginBottom: 32, border: "1px solid #DBEAFE",
                }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", background: "#fff", padding: "2px 7px", borderRadius: 100 }}>NEW</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Cloud Workspaces is now in Beta</span>
                </div>

                <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 24 }}>
                    Roadmap planning <br />
                    <span style={{ color: "#3B82F6" }}>without the friction.</span>
                </h1>

                <p style={{ fontSize: "clamp(15px, 1.2vw, 19px)", color: "#6B7280", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.65 }}>
                    Frixa is the minimal collaboration suite for modern teams. Build roadmaps, manage ideas, and sync with your team effortlessly.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                    <button
                        onClick={onGetStarted}
                        style={{ padding: "15px 34px", background: "#111218", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 16px 36px rgba(0,0,0,0.12)" }}
                    >Launch Your First Project</button>
                    <button
                        onClick={onGetStarted}
                        style={{ padding: "15px 34px", background: "#fff", color: "#111218", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "1.5px solid #E8EAED", cursor: "pointer" }}
                    >Watch Demo</button>
                </div>
            </header>

            {/* ── FEATURES GRID ── */}
            <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: 72 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 14 }}>Crafted for the elite.</h2>
                    <p style={{ fontSize: 17, color: "#6B7280" }}>Every interaction polished to perfection. No bloat, just speed.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            padding: 36, background: "rgba(255,255,255,0.7)",
                            backdropFilter: "blur(10px)", border: "1.5px solid #ECEEF1",
                            borderRadius: 28, transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)", cursor: "default",
                        }} className="feat-card">
                            <div style={{ width: 50, height: 50, background: "#111218", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 24, boxShadow: "0 8px 18px rgba(0,0,0,0.1)" }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                            <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.65 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── GRID SPLIT ── */}
            <section id="about" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 72, alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, background: "#DBEAFE", filter: "blur(80px)", borderRadius: "50%", zIndex: -1 }} />
                        <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 28 }}>
                            A workspace that adapts to you.
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            {[
                                { t: "Instant Sync", d: "Your changes are broadcast to your team in milliseconds." },
                                { t: "Dark Mode Native", d: "Built for late-night sessions with eye-comfort palettes." },
                                { t: "Export Everything", d: "Own your data. Export roadmaps to CSV instantly." },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 14 }}>
                                    <div style={{ fontSize: 16, color: "#2563EB", fontWeight: 900, minWidth: 28 }}>0{idx + 1}</div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{item.t}</div>
                                        <div style={{ fontSize: 14, color: "#6B7280" }}>{item.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: 28, background: "#111218", borderRadius: 36, transform: "rotate(-1.5deg)", boxShadow: "0 40px 80px rgba(0,0,0,0.22)" }}>
                        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 22, padding: 28 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                                <div style={{ width: 10, height: 10, background: "#FF5F56", borderRadius: "50%" }} />
                                <div style={{ width: 10, height: 10, background: "#FFBD2E", borderRadius: "50%" }} />
                                <div style={{ width: 10, height: 10, background: "#27C93F", borderRadius: "50%" }} />
                            </div>
                            <div style={{ height: 10, width: "65%", background: "rgba(255,255,255,0.12)", borderRadius: 5, marginBottom: 14 }} />
                            <div style={{ height: 10, width: "42%", background: "rgba(255,255,255,0.07)", borderRadius: 5, marginBottom: 28 }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div style={{ height: 90, background: "rgba(255,255,255,0.09)", borderRadius: 14 }} />
                                <div style={{ height: 90, background: "rgba(255,255,255,0.09)", borderRadius: 14 }} />
                                <div style={{ height: 90, background: "rgba(255,255,255,0.06)", borderRadius: 14 }} />
                                <div style={{ height: 90, background: "rgba(255,255,255,0.06)", borderRadius: 14 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section style={{ padding: "140px 20px 100px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-2px", marginBottom: 28 }}>Built for the future of work.</h2>
                <button
                    onClick={onGetStarted}
                    style={{ padding: "18px 48px", background: "#111218", color: "#fff", borderRadius: 18, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer" }}
                >Join Frixa Today →</button>
                <p style={{ marginTop: 20, fontSize: 13.5, color: "#9CA3AF" }}>No credit card required. Cancel anytime.</p>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ padding: "60px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1.5px solid #F0F0F3", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 24, height: 24, background: "#111218", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 900 }}>F</div>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Frixa</span>
                </div>
                <div style={{ display: "flex", gap: 28, fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>
                    <span style={{ cursor: "pointer" }}>Twitter</span>
                    <span style={{ cursor: "pointer" }}>GitHub</span>
                    <span style={{ cursor: "pointer" }}>Privacy</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#C4C9D4" }}>© 2026 FRIXA INC.</div>
            </footer>

            <style>{`
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .feat-card:hover {
                    background: #fff !important;
                    border-color: #3B82F6 !important;
                    transform: translateY(-8px);
                    box-shadow: 0 32px 64px rgba(59,130,246,0.09);
                }
            `}</style>
        </div>
    );
}
