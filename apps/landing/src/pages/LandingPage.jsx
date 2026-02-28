import { useState, useEffect, useRef } from "react";

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            obs.disconnect();
            let start = 0;
            const step = Math.ceil(target / 60);
            const t = setInterval(() => {
                start += step;
                if (start >= target) { setCount(target); clearInterval(t); }
                else setCount(start);
            }, 16);
        }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)", transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms` }}>
            {children}
        </div>
    );
}

export default function LandingPage({ onGetStarted }) {
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const features = [
        { icon: "⚡", title: "Real-Time Sync", desc: "Every change — task move, status update, new idea — is broadcast to your entire team in under 100ms. No refresh needed." },
        { icon: "🗂️", title: "Kanban & More", desc: "Switch between Kanban, List, Table, Priority, and Timeline views with one click. Your data, your way." },
        { icon: "💡", title: "Idea Board", desc: "Capture product ideas before they disappear. Let your team vote on what to build next with a simple thumbs-up system." },
        { icon: "👥", title: "Team Collaboration", desc: "Invite teammates via email or a magic link. Role-based access keeps owners in control while members stay productive." },
        { icon: "📊", title: "Activity Logs", desc: "A full audit trail of everything that happened in your project — who moved what, when. Transparency by default." },
        { icon: "🔒", title: "Enterprise Security", desc: "Row-level security via Supabase means your data is completely isolated. No cross-tenant leaks, ever." },
        { icon: "🗃️", title: "Smart Archive", desc: "Completed tasks move to Archive automatically. Restore or permanently delete — your history, your choice." },
        { icon: "⏱️", title: "Focus Timer", desc: "Built-in Pomodoro-style focus timer keeps your team in the zone and celebrates completions with confetti." },
        { icon: "🎯", title: "Priority Views", desc: "See all Critical, High, Medium, and Low priority tasks at a glance. Never miss a blocker again." },
    ];

    const steps = [
        { n: "01", title: "Create a project", desc: "Sign up free, name your project, and you're live in under 30 seconds. No setup wizard, no credit card." },
        { n: "02", title: "Invite your team", desc: "Share a magic link or type an email. Your teammate clicks — they're in. Role-based access from day one." },
        { n: "03", title: "Build together", desc: "Drag tasks, vote on ideas, watch activity stream live. Everyone sees the same board in real time." },
    ];

    const testimonials = [
        { name: "Arjun Mehta", role: "CTO @ Stackbloom", text: "We replaced Jira with Frixa in one afternoon. The team actually uses it now — that says everything.", avatar: "AM" },
        { name: "Priya Sharma", role: "Product Lead @ Clarafy", text: "The real-time sync is insane. My remote team in 3 timezones all see the same board instantly. Game changer.", avatar: "PS" },
        { name: "Rohan Verma", role: "Founder @ Byteship", text: "I've tried Linear, Asana, Notion. Frixa is the first tool that didn't require a 2-hour onboarding call.", avatar: "RV" },
        { name: "Sneha Nair", role: "Engineering Manager @ Driftly", text: "The idea voting feature alone saved us from building 3 features nobody wanted. The team loves it.", avatar: "SN" },
        { name: "Vikram Rao", role: "Solo Founder", text: "As a solo founder, I use Frixa as my second brain. The focus timer + kanban combo is unbeatable.", avatar: "VR" },
        { name: "Meera Kapoor", role: "Design Lead @ Orbio", text: "Finally a project tool that looks good. My designers actually open it without complaining.", avatar: "MK" },
    ];

    const faqs = [
        { q: "Is Frixa really free?", a: "Yes. The core product — unlimited tasks, ideas, real-time collaboration — is free. We'll introduce an optional Pro plan for power features like custom exports and priority support." },
        { q: "How does real-time sync work?", a: "Frixa uses Supabase Realtime under the hood. Every database change is streamed via WebSockets to all connected clients. Your teammates see your updates within milliseconds." },
        { q: "Can I invite people who don't have a Frixa account?", a: "Yes. Share your project's magic invite link. When a new user opens it after signing up, they're automatically added as a member." },
        { q: "Is my data secure?", a: "Absolutely. Frixa uses Row Level Security (RLS) at the database level. Your project data is completely isolated — no other user or project can ever access it." },
        { q: "Can I delete a project?", a: "Yes. You can delete any project you own from the Projects page. We require you to type DELETE to confirm — this action permanently removes all tasks, ideas, and stages associated with it." },
        { q: "Does Frixa work on mobile?", a: "The web app is fully responsive and works well on mobile browsers. A native mobile app is on the roadmap." },
    ];

    const stats = [
        { value: 2400, suffix: "+", label: "Active Workspaces" },
        { value: 18000, suffix: "+", label: "Tasks Completed" },
        { value: 340, suffix: "+", label: "Teams Onboarded" },
        { value: 99, suffix: "%", label: "Uptime SLA" },
    ];

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <div style={{ background: "#fafafa", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", color: "#111218", overflowX: "hidden" }}>

            {/* ── DOT GRID BG ── */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.45, pointerEvents: "none" }} />

            {/* ── GRADIENT ORBS ── */}
            <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: 200, right: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            {/* ═══════════════════════════════════ NAVBAR ═══════════════════════════════════ */}
            <nav style={{
                position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
                width: "min(1200px, 94%)", height: 60, zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 24px",
                background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(20px)",
                borderRadius: 18, border: "1px solid rgba(232,234,237,0.9)",
                boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.09)" : "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
            }}>
                <img src="/logo.png" alt="Frixa" style={{ height: 24, width: "auto" }} />

                {/* Desktop nav */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
                    {navLinks.map(l => (
                        <a key={l.label} href={l.href} style={{ padding: "6px 12px", fontSize: 13, fontWeight: 600, color: "#6B7280", textDecoration: "none", borderRadius: 8, transition: "all .15s" }} className="nav-link-hover">{l.label}</a>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={onGetStarted} style={{ padding: "8px 16px", background: "transparent", border: "none", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", borderRadius: 8 }} className="nav-link-hover">Log in</button>
                    <button onClick={onGetStarted} style={{ padding: "9px 20px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "opacity .15s" }} className="btn-hover-ink">Get Started →</button>
                </div>
            </nav>

            {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
            <header style={{ position: "relative", zIndex: 1, padding: "160px 20px 80px", textAlign: "center" }}>
                <div style={{ animation: "heroFadeUp .8s cubic-bezier(.22,1,.36,1) both" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 6px 5px 14px", background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)", borderRadius: 100, marginBottom: 28, border: "1px solid #DBEAFE" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Cloud Workspaces is now live</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#2563EB", padding: "3px 10px", borderRadius: 100 }}>Beta →</span>
                    </div>

                    <h1 style={{ fontSize: "clamp(42px, 6.5vw, 82px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03, marginBottom: 22, maxWidth: 900, margin: "0 auto 22px" }}>
                        The project workspace<br />
                        <span style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>your team will actually use.</span>
                    </h1>

                    <p style={{ fontSize: "clamp(16px, 1.3vw, 20px)", color: "#6B7280", maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400 }}>
                        Frixa combines roadmaps, idea boards, and real-time collaboration into one minimal, blazing-fast workspace. No bloat. No learning curve.
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                        <button onClick={onGetStarted} style={{ padding: "16px 36px", background: "#111218", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.14)", transition: "all .2s" }} className="cta-primary">
                            Start for free — no card needed
                        </button>
                        <a href="#how" style={{ padding: "16px 32px", background: "#fff", color: "#111218", borderRadius: 14, fontSize: 15, fontWeight: 600, border: "1.5px solid #E8EAED", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }} className="cta-secondary">
                            <span style={{ fontSize: 18 }}>▶</span> See how it works
                        </a>
                    </div>

                    <p style={{ fontSize: 12.5, color: "#9CA3AF", fontWeight: 500 }}>
                        Trusted by <strong style={{ color: "#6B7280" }}>340+ teams</strong> · Free forever on core plan · Setup in 30 seconds
                    </p>
                </div>

                {/* Hero dashboard mockup */}
                <div style={{ maxWidth: 960, margin: "64px auto 0", animation: "heroFadeUp .9s .15s cubic-bezier(.22,1,.36,1) both" }}>
                    <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E8EAED", boxShadow: "0 40px 100px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                        {/* Window chrome */}
                        <div style={{ background: "#F4F5F7", borderBottom: "1px solid #E8EAED", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ display: "flex", gap: 6 }}>
                                {["#FF5F56","#FFBD2E","#27C93F"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                            </div>
                            <div style={{ flex: 1, background: "#fff", borderRadius: 7, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9CA3AF", fontWeight: 500, maxWidth: 280, margin: "0 auto", border: "1px solid #E8EAED" }}>
                                app.frixa.in/roadmap
                            </div>
                        </div>
                        {/* Topbar mockup */}
                        <div style={{ background: "rgba(244,245,247,.9)", borderBottom: "1px solid #E8EAED", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img src="/logo.png" alt="" style={{ height: 18, width: "auto", opacity: 0.7 }} />
                                <div style={{ width: 1, height: 18, background: "#E8EAED" }} />
                                <div style={{ display: "flex", gap: 4 }}>
                                    {["roadmap","ideas","archive","projects"].map((p, i) => (
                                        <div key={p} style={{ padding: "4px 10px", borderRadius: 6, background: i === 0 ? "#111218" : "transparent", color: i === 0 ? "#fff" : "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{p}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E8EAED" }} />
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E8EAED" }} />
                                <div style={{ padding: "0 12px", height: 30, borderRadius: 8, background: "#111218", display: "flex", alignItems: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>+ New Task</div>
                            </div>
                        </div>
                        {/* Kanban mockup */}
                        <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, background: "#F4F5F7", minHeight: 260 }}>
                            {[
                                { label: "Planned", color: "#6B7280", cards: ["Design system audit","API rate limiting","Mobile responsive nav"] },
                                { label: "In Progress", color: "#2563EB", cards: ["Auth flow redesign","Real-time collab","Supabase migration"] },
                                { label: "Review", color: "#D97706", cards: ["Landing page v2","Performance audit"] },
                                { label: "Done", color: "#059669", cards: ["Project setup","Kanban board","User onboarding"] },
                            ].map((col) => (
                                <div key={col.label}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{col.label}</span>
                                        <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: "auto" }}>{col.cards.length}</span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {col.cards.map(c => (
                                            <div key={c} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", fontSize: 11, fontWeight: 500, color: "#374151", border: "1px solid #E8EAED", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>{c}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════ STATS ═══════════════════════════════════ */}
            <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 2 }}>
                    {stats.map((s, i) => (
                        <Reveal key={i} delay={i * 80}>
                            <div style={{ textAlign: "center", padding: "28px 20px", borderRight: i < stats.length - 1 ? "1px solid #F0F1F3" : "none" }}>
                                <div style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px", color: "#111218" }}>
                                    <Counter target={s.value} suffix={s.suffix} />
                                </div>
                                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════ FEATURES ═══════════════════════════════════ */}
            <section id="features" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 72 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F0F4FF", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 16, border: "1px solid #DBEAFE" }}>FEATURES</div>
                            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16 }}>Everything your team needs.<br /><span style={{ color: "#9CA3AF", fontWeight: 600 }}>Nothing it doesn't.</span></h2>
                            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>Built by a team that was frustrated with bloated tools. Frixa does one thing: keeps your team aligned and moving fast.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 20 }}>
                        {features.map((f, i) => (
                            <Reveal key={i} delay={i * 60}>
                                <div className="feat-card" style={{ padding: "32px 28px", background: "#fff", border: "1.5px solid #F0F1F3", borderRadius: 24, transition: "all .25s cubic-bezier(.22,1,.36,1)", cursor: "default" }}>
                                    <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#111218,#374151)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>{f.icon}</div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#111218" }}>{f.title}</h3>
                                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ HOW IT WORKS ═══════════════════════════════════ */}
            <section id="how" style={{ position: "relative", zIndex: 1, padding: "100px 24px", background: "linear-gradient(180deg, transparent, rgba(239,246,255,0.5), transparent)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 72 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F0FDF4", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 16, border: "1px solid #D1FAE5" }}>HOW IT WORKS</div>
                            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16 }}>Up and running in<br /><span style={{ color: "#2563EB" }}>under 3 minutes.</span></h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>No onboarding calls. No setup wizard. Just create, invite, and build.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32, position: "relative" }}>
                        {steps.map((s, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <div style={{ position: "relative" }}>
                                    {i < steps.length - 1 && (
                                        <div style={{ position: "absolute", top: 28, left: "calc(100% + 16px)", width: "calc(100% - 32px)", height: 2, background: "linear-gradient(90deg,#DBEAFE,transparent)", zIndex: 1, display: "none" }} className="step-arrow" />
                                    )}
                                    <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 24, border: "1.5px solid #F0F1F3", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                                        <div style={{ fontSize: "clamp(48px,5vw,72px)", fontWeight: 900, letterSpacing: "-3px", color: "#F0F1F3", lineHeight: 1, marginBottom: 20, fontFamily: "system-ui" }}>{s.n}</div>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#111218" }}>{s.title}</h3>
                                        <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.7 }}>{s.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ BENTO HIGHLIGHT ═══════════════════════════════════ */}
            <section style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="bento-grid">
                            {/* Left big card */}
                            <div style={{ background: "#111218", borderRadius: 28, padding: "44px 40px", color: "#fff", gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 380 }}>
                                <div>
                                    <div style={{ fontSize: 32, marginBottom: 20 }}>⚡</div>
                                    <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.2 }}>Real-time everything.</h3>
                                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Tasks, ideas, stage changes — all broadcast to your team the moment they happen. Built on WebSockets via Supabase Realtime. Zero polling, zero delay.</p>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32 }}>
                                    {["< 100ms latency", "WebSocket powered", "Zero refresh needed"].map(t => (
                                        <span key={t} style={{ padding: "5px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            {/* Right top */}
                            <div style={{ background: "#EFF6FF", borderRadius: 28, padding: "36px 32px", border: "1.5px solid #DBEAFE" }}>
                                <div style={{ fontSize: 28, marginBottom: 16 }}>🔒</div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#111218" }}>Enterprise-grade security</h3>
                                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>Row Level Security enforced at the database. Your data never mixes with another team's. GDPR-friendly by design.</p>
                            </div>
                            {/* Right bottom */}
                            <div style={{ background: "#F5F3FF", borderRadius: 28, padding: "36px 32px", border: "1.5px solid #EDE9FE" }}>
                                <div style={{ fontSize: 28, marginBottom: 16 }}>📱</div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#111218" }}>Works everywhere</h3>
                                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>Fully responsive on all devices. Open Frixa on your phone during standup and it just works. Native mobile app coming soon.</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════════════════════ TESTIMONIALS ═══════════════════════════════════ */}
            <section id="testimonials" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#FFF7ED", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#EA580C", marginBottom: 16, border: "1px solid #FED7AA" }}>TESTIMONIALS</div>
                            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16 }}>Teams love Frixa.</h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>Don't take our word for it.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 70}>
                                <div className="testi-card" style={{ padding: "28px 24px", background: "#fff", borderRadius: 20, border: "1.5px solid #F0F1F3", transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                                    <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                                        {[...Array(5)].map((_, s) => <span key={s} style={{ color: "#F59E0B", fontSize: 14 }}>★</span>)}
                                    </div>
                                    <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #F0F1F3", paddingTop: 16 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.avatar}</div>
                                        <div>
                                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111218" }}>{t.name}</div>
                                            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ PRICING ═══════════════════════════════════ */}
            <section id="pricing" style={{ position: "relative", zIndex: 1, padding: "100px 24px", background: "linear-gradient(180deg,transparent,rgba(239,246,255,0.4),transparent)" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F0FDF4", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 16, border: "1px solid #D1FAE5" }}>PRICING</div>
                            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16 }}>Simple, transparent pricing.</h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>Start free. Upgrade when you're ready.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                        {/* Free */}
                        <Reveal delay={0}>
                            <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 24, border: "1.5px solid #E8EAED", height: "100%" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".06em" }}>Free</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-3px", color: "#111218" }}>₹0</span>
                                    <span style={{ fontSize: 14, color: "#9CA3AF" }}>/forever</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 28 }}>Everything you need to get started and collaborate with a small team.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                                    {["Unlimited tasks & ideas","Up to 5 team members","Real-time collaboration","Kanban, List, Table views","Activity logs","2 projects"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                                            <span style={{ color: "#059669", fontWeight: 700, fontSize: 16 }}>✓</span>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#F4F5F7", color: "#111218", border: "1.5px solid #E8EAED", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .15s" }} className="outline-btn-hover">Get started free →</button>
                            </div>
                        </Reveal>
                        {/* Pro */}
                        <Reveal delay={120}>
                            <div style={{ padding: "36px 32px", background: "#111218", borderRadius: 24, border: "1.5px solid #1F2937", height: "100%", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: 20, right: 20, padding: "4px 12px", background: "linear-gradient(135deg,#2563EB,#7C3AED)", borderRadius: 100, fontSize: 11, fontWeight: 700, color: "#fff" }}>MOST POPULAR</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".06em" }}>Pro</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-3px", color: "#fff" }}>₹499</span>
                                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>/month</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>For growing teams that need more power, more projects, and priority support.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                                    {["Everything in Free","Unlimited projects","Unlimited team members","CSV & PDF exports","Priority Timeline view","Custom stages & workflows","Priority support (24h SLA)","Early access to new features"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                                            <span style={{ color: "#34D399", fontWeight: 700, fontSize: 16 }}>✓</span>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#fff", color: "#111218", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity .15s" }} className="btn-hover-ink">Start Pro free for 14 days →</button>
                            </div>
                        </Reveal>
                        {/* Enterprise */}
                        <Reveal delay={240}>
                            <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 24, border: "1.5px solid #E8EAED", height: "100%" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".06em" }}>Enterprise</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-2px", color: "#111218" }}>Custom</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 28 }}>For large organisations that need SSO, audit logs, and dedicated infrastructure.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                                    {["Everything in Pro","SSO & SAML","Dedicated instance","Advanced audit logs","SLA guarantee","Custom integrations","Onboarding & training"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                                            <span style={{ color: "#059669", fontWeight: 700, fontSize: 16 }}>✓</span>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#F4F5F7", color: "#111218", border: "1.5px solid #E8EAED", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .15s" }} className="outline-btn-hover">Talk to sales →</button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FAQ ═══════════════════════════════════ */}
            <section id="faq" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 56 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#FFF7ED", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#EA580C", marginBottom: 16, border: "1px solid #FED7AA" }}>FAQ</div>
                            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-2px" }}>Questions? Answered.</h2>
                        </div>
                    </Reveal>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {faqs.map((f, i) => (
                            <Reveal key={i} delay={i * 50}>
                                <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${openFaq === i ? "#DBEAFE" : "#F0F1F3"}`, overflow: "hidden", transition: "border-color .2s" }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
                                    >
                                        <span style={{ fontSize: 15, fontWeight: 600, color: "#111218", fontFamily: "'Poppins',sans-serif" }}>{f.q}</span>
                                        <span style={{ fontSize: 20, color: "#9CA3AF", fontWeight: 300, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s", lineHeight: 1 }}>+</span>
                                    </button>
                                    {openFaq === i && (
                                        <div style={{ padding: "0 24px 20px", fontSize: 14.5, color: "#6B7280", lineHeight: 1.75, borderTop: "1px solid #F0F1F3", paddingTop: 16 }}>
                                            {f.a}
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FINAL CTA ═══════════════════════════════════ */}
            <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 120px" }}>
                <Reveal>
                    <div style={{ maxWidth: 860, margin: "0 auto", background: "#111218", borderRadius: 32, padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        {/* Glow effects */}
                        <div style={{ position: "absolute", top: -60, left: "20%", width: 300, height: 300, background: "radial-gradient(circle,rgba(37,99,235,0.3),transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -60, right: "20%", width: 250, height: 250, background: "radial-gradient(circle,rgba(124,58,237,0.25),transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "relative" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>START TODAY</div>
                            <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 800, letterSpacing: "-2.5px", color: "#fff", marginBottom: 20, lineHeight: 1.05 }}>
                                Your team deserves<br />a better workflow.
                            </h2>
                            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.65 }}>
                                Join 340+ teams already shipping faster with Frixa. Free forever on the core plan.
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                                <button onClick={onGetStarted} style={{ padding: "16px 40px", background: "#fff", color: "#111218", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 16px 40px rgba(0,0,0,0.3)", transition: "opacity .15s" }} className="btn-hover-ink">
                                    Get started free →
                                </button>
                                <a href="#features" style={{ padding: "16px 32px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "all .15s" }} className="ghost-btn-hover">
                                    Explore features
                                </a>
                            </div>
                            <p style={{ marginTop: 20, fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>No credit card · Free forever on core plan · Setup in 30 seconds</p>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ═══════════════════════════════════ FOOTER ═══════════════════════════════════ */}
            <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid #F0F1F3", padding: "56px 24px 40px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">
                        <div>
                            <img src="/logo.png" alt="Frixa" style={{ height: 22, width: "auto", marginBottom: 16 }} />
                            <p style={{ fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.7, maxWidth: 280 }}>
                                The minimal collaboration workspace for modern teams. Roadmaps, ideas, and real-time sync — all in one place.
                            </p>
                            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                                {["𝕏", "in", "gh"].map(s => (
                                    <div key={s} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #E8EAED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#6B7280", cursor: "pointer", fontWeight: 700 }}>{s}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#111218", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>Product</div>
                            {["Features", "How it works", "Pricing", "Changelog", "Roadmap"].map(l => (
                                <div key={l} style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 10, cursor: "pointer" }} className="footer-link">{l}</div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#111218", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>Company</div>
                            {["About", "Blog", "Careers", "Press", "Contact"].map(l => (
                                <div key={l} style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 10, cursor: "pointer" }} className="footer-link">{l}</div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#111218", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
                            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map(l => (
                                <div key={l} style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 10, cursor: "pointer" }} className="footer-link">{l}</div>
                            ))}
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid #F0F1F3", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <span style={{ fontSize: 13, color: "#C4C9D4", fontWeight: 500 }}>© 2026 Frixa Inc. All rights reserved.</span>
                        <span style={{ fontSize: 13, color: "#C4C9D4" }}>Made with ♥ in India</span>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(36px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nav-link-hover:hover { background: #F4F5F7 !important; color: #111218 !important; }
                .btn-hover-ink:hover { opacity: 0.85 !important; }
                .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 28px 56px rgba(0,0,0,0.18) !important; }
                .cta-secondary:hover { border-color: #2563EB !important; color: #2563EB !important; }
                .feat-card:hover { border-color: #DBEAFE !important; transform: translateY(-6px); box-shadow: 0 24px 48px rgba(37,130,246,0.08) !important; }
                .testi-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; }
                .outline-btn-hover:hover { background: #111218 !important; color: #fff !important; border-color: #111218 !important; }
                .ghost-btn-hover:hover { background: rgba(255,255,255,0.18) !important; }
                .footer-link:hover { color: #111218 !important; }
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .bento-grid { grid-template-columns: 1fr !important; }
                    .footer-grid { grid-template-columns: 1fr 1fr !important; }
                    .step-arrow { display: none !important; }
                }
            `}</style>
        </div>
    );
}
