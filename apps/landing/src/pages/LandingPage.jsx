import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
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

    useEffect(() => {
        if (mobileMenu) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenu]);

    const features = [
        { icon: "⚡", title: "Live updates, zero latency", desc: "Every task move, comment, and status change hits your team's screens in under 100ms. No polling. No refresh. Just instant." },
        { icon: "🗂️", title: "Views that think like you do", desc: "Kanban when you're planning, List when you're sprinting, Timeline when stakeholders are watching. One click switches everything." },
        { icon: "💡", title: "Ideas your team actually votes on", desc: "Surface what to build next. Kill the features nobody cares about before you spend a sprint on them. Ship what matters." },
        { icon: "👥", title: "Onboard anyone in two taps", desc: "Send a magic link. They sign up, they're in. Role-based access means admins lead and members execute — no configuration headache." },
        { icon: "📊", title: "A complete audit trail", desc: "Every action logged with a timestamp and author. See exactly who changed what and when — accountability without surveillance." },
        { icon: "🔒", title: "Secure by architecture, not policy", desc: "Row-Level Security baked into every query. Your data is isolated at the database layer — not just the application layer." },
        { icon: "🗃️", title: "Clean board, permanently", desc: "Completed tasks archive automatically so your board stays focused. Your history stays fully searchable. Restore any task in one click." },
        { icon: "⏱️", title: "A focus timer that ships with you", desc: "Built-in Pomodoro mode locks in deep work, celebrates completions, and keeps sprint momentum alive when energy is low." },
        { icon: "🎯", title: "Blockers, front and centre", desc: "Critical, High, Medium, Low — surfaced and sorted so high-stakes tasks never get buried under the nice-to-haves." },
    ];

    const steps = [
        { n: "01", title: "Create a workspace", desc: "Name it, hit enter. No credit card, no onboarding call, no tutorial pop-up dragging you through twelve screens. You're live." },
        { n: "02", title: "Add your team", desc: "Drop in a magic link or type an email address. Either way, they're onboarded and contributing before your next standup." },
        { n: "03", title: "Ship together", desc: "Drag tasks, kill bad ideas, watch your board update live. This is what work feels like when the tool gets out of the way." },
    ];

    const testimonials = [
        { name: "Arjun Mehta", role: "CTO @ Stackbloom", text: "We migrated our entire sprint board from Jira in one afternoon. The team opens Frixa voluntarily now. That has never happened with any tool.", avatar: "AM" },
        { name: "Priya Sharma", role: "Product Lead @ Clarafy", text: "Three timezones, one board. My team in Bangalore, London, and New York all see the same update the instant it happens. Real-time is not a buzzword here.", avatar: "PS" },
        { name: "Rohan Verma", role: "Founder @ Byteship", text: "I've paid for Linear, Asana, and Notion. Frixa is the only one that didn't need a Loom video to explain to a new hire.", avatar: "RV" },
        { name: "Sneha Nair", role: "Engineering Manager @ Driftly", text: "The idea voting board stopped us building two features nobody wanted. That's two full sprints saved in our first month.", avatar: "SN" },
        { name: "Vikram Rao", role: "Solo Founder", text: "I'm my own PM. Frixa is my planning layer, my focus tool, and my changelog. I've cancelled three other subscriptions since switching.", avatar: "VR" },
        { name: "Meera Kapoor", role: "Design Lead @ Orbio", text: "My designers actually open it without being asked. If you work with designers, you know exactly how rare that is.", avatar: "MK" },
    ];

    const faqs = [
        { q: "Is Frixa actually free — no catch?", a: "Yes, and we mean it. Unlimited tasks, unlimited ideas, and real-time collaboration for up to 5 team members — free forever. No trial period, no expiry, no credit card required. We'll introduce optional Pro features for power users, but the core product stays free." },
        { q: "How fast is 'real-time', exactly?", a: "Under 100 milliseconds. We use Supabase's WebSocket infrastructure to stream every change directly to every connected client. You will not notice any lag — it feels like everyone is on the same machine." },
        { q: "Can I add someone who doesn't have an account yet?", a: "Yes. Share your project's magic invite link. When they sign up, they're automatically added as a member with the right permissions. No admin steps, no approval queues." },
        { q: "How do I know my data is actually private?", a: "Row-Level Security enforces isolation at the Postgres level — not at the application layer. Even if something were to break in our code, your data would still be architecturally inaccessible to any other team. That's not a policy. That's the design." },
        { q: "What happens when I delete a project?", a: "You have to type DELETE to confirm, then it's gone — all tasks, ideas, and stages, permanently. We make you type it for a reason. There's no recycle bin, no 30-day grace period. Treat it accordingly." },
        { q: "Does Frixa work on mobile?", a: "Yes. The app is fully responsive and works well in any modern mobile browser. We use Frixa on our phones ourselves — a native app is on the public roadmap because we want it too." },
    ];

    const stats = [
        { value: 2400, suffix: "+", label: "Active Workspaces" },
        { value: 18000, suffix: "+", label: "Tasks Shipped" },
        { value: 340, suffix: "+", label: "Teams Onboarded" },
        { value: 99, suffix: ".9%", label: "Uptime SLA" },
    ];

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <div style={{ background: "#fafafa", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#111218", overflowX: "hidden" }}>

            {/* ── DOT GRID BG ── */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.4, pointerEvents: "none" }} />

            {/* ── GRADIENT ORBS ── */}
            <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(71,85,105,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: 200, right: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(100,116,139,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            {/* ═══════════════════════════════════ NAVBAR ═══════════════════════════════════ */}
            <nav style={{
                position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
                width: "min(1200px, 94%)", height: 60, zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 20px",
                background: scrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.72)",
                backdropFilter: "blur(20px)",
                borderRadius: 18, border: "1px solid rgba(232,234,237,0.9)",
                boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.09)" : "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
            }}>
                <img src="/logo.png" alt="Frixa" style={{ height: 24, width: "auto", flexShrink: 0 }} />

                {/* Desktop nav */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="desktop-nav">
                    {navLinks.map(l => (
                        <a key={l.label} href={l.href} style={{ padding: "6px 13px", fontSize: 13, fontWeight: 500, color: "#6B7280", textDecoration: "none", borderRadius: 8, transition: "all .15s", letterSpacing: "-0.1px" }} className="nav-link-hover">{l.label}</a>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={onGetStarted} style={{ padding: "8px 16px", background: "transparent", border: "none", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer", borderRadius: 8 }} className="nav-link-hover desktop-nav">Log in</button>
                    <button onClick={onGetStarted} style={{ padding: "9px 20px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "opacity .15s" }} className="btn-hover-ink">Get Started →</button>
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#374151" }}
                        className="mobile-menu-btn"
                        aria-label="Menu"
                    >
                        {mobileMenu
                            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
                        }
                    </button>
                </div>
            </nav>

            {/* Mobile menu drawer */}
            {mobileMenu && (
                <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={() => setMobileMenu(false)}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 280, height: "100%", background: "#fff", padding: "88px 24px 40px", display: "flex", flexDirection: "column", gap: 4, boxShadow: "-16px 0 40px rgba(0,0,0,0.1)" }} onClick={e => e.stopPropagation()}>
                        {navLinks.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)} style={{ padding: "12px 16px", fontSize: 15, fontWeight: 600, color: "#374151", textDecoration: "none", borderRadius: 10, transition: "background .15s" }} className="mobile-nav-link">{l.label}</a>
                        ))}
                        <div style={{ height: 1, background: "#F0F1F3", margin: "12px 0" }} />
                        <button onClick={() => { setMobileMenu(false); onGetStarted(); }} style={{ padding: "14px", background: "#111218", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>Get started free →</button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
            <header style={{ position: "relative", zIndex: 1, padding: "160px 20px 80px", textAlign: "center" }}>
                <div style={{ animation: "heroFadeUp .8s cubic-bezier(.22,1,.36,1) both" }}>
                    {/* Announcement badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 6px 5px 14px", background: "#F4F5F7", borderRadius: 100, marginBottom: 32, border: "1px solid #E8EAED", cursor: "pointer" }} className="badge-hover" onClick={onGetStarted}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: "#374151" }}>Real-time collaboration is now 3× faster</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#111218", padding: "4px 10px", borderRadius: 100 }}>What's new →</span>
                    </div>

                    <h1 style={{ fontSize: "clamp(40px, 6.5vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, marginBottom: 24, maxWidth: 860, margin: "0 auto 24px" }}>
                        Stop managing tools.<br />
                        <span style={{ background: "linear-gradient(135deg, #111218 30%, #64748B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start shipping product.</span>
                    </h1>

                    <p style={{ fontSize: "clamp(16px, 1.3vw, 19px)", color: "#6B7280", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.72, fontWeight: 400 }}>
                        Frixa replaces your Jira backlog, your Notion doc, and your "quick sync" meeting — with one minimal, blazing-fast workspace your whole team will actually use.
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                        <button onClick={onGetStarted} style={{ padding: "16px 36px", background: "#111218", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.14)", transition: "all .2s", letterSpacing: "-0.2px" }} className="cta-primary">
                            Start building, free →
                        </button>
                        <a href="#how" style={{ padding: "16px 28px", background: "#fff", color: "#374151", borderRadius: 14, fontSize: 15, fontWeight: 600, border: "1.5px solid #E8EAED", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }} className="cta-secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#374151"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            See how it works
                        </a>
                    </div>

                    <p style={{ fontSize: 12.5, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.1px" }}>
                        No credit card · <strong style={{ color: "#6B7280", fontWeight: 600 }}>340+ teams</strong> already onboard · Live in 30 seconds
                    </p>
                </div>

                {/* Hero dashboard mockup */}
                <div style={{ maxWidth: 980, margin: "72px auto 0", animation: "heroFadeUp .9s .15s cubic-bezier(.22,1,.36,1) both" }}>
                    <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", boxShadow: "0 48px 120px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.025)", overflow: "hidden" }}>
                        {/* Window chrome */}
                        <div style={{ background: "#F4F5F7", borderBottom: "1px solid #E8EAED", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ display: "flex", gap: 6 }}>
                                {["#FF5F56","#FFBD2E","#27C93F"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                            </div>
                            <div style={{ flex: 1, background: "#fff", borderRadius: 7, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9CA3AF", fontWeight: 500, maxWidth: 280, margin: "0 auto", border: "1px solid #E8EAED", gap: 6 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                                app.frixa.in/roadmap
                            </div>
                        </div>
                        {/* Topbar mockup */}
                        <div style={{ background: "rgba(244,245,247,.95)", borderBottom: "1px solid #E8EAED", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img src="/logo.png" alt="" style={{ height: 18, width: "auto", opacity: 0.65 }} />
                                <div style={{ width: 1, height: 18, background: "#E8EAED" }} />
                                <div style={{ display: "flex", gap: 4 }}>
                                    {["roadmap","ideas","archive","projects"].map((p, i) => (
                                        <div key={p} style={{ padding: "4px 10px", borderRadius: 6, background: i === 0 ? "#111218" : "transparent", color: i === 0 ? "#fff" : "#9CA3AF", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{p}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                {/* Live presence dots */}
                                <div style={{ display: "flex", gap: -4 }}>
                                    {["#6366F1","#10B981","#F59E0B"].map((c, i) => (
                                        <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid #F4F5F7", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#fff" }}>{["AK","PS","RV"][i]}</div>
                                    ))}
                                </div>
                                <div style={{ padding: "0 12px", height: 28, borderRadius: 8, background: "#111218", display: "flex", alignItems: "center", fontSize: 11, color: "#fff", fontWeight: 700, gap: 4 }}>
                                    <span style={{ fontSize: 13, lineHeight: 1 }}>+</span> New Task
                                </div>
                            </div>
                        </div>
                        {/* Kanban mockup */}
                        <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, background: "#F4F5F7", minHeight: 260 }}>
                            {[
                                { label: "Planned", color: "#94A3B8", cards: ["Design system audit","API rate limiting","Mobile responsive nav"] },
                                { label: "In Progress", color: "#3B82F6", cards: ["Auth flow redesign","Real-time collab","Supabase migration"] },
                                { label: "Review", color: "#F59E0B", cards: ["Landing page v2","Performance audit"] },
                                { label: "Done", color: "#10B981", cards: ["Project setup","Kanban board","User onboarding"] },
                            ].map((col) => (
                                <div key={col.label}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.color }} />
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{col.label}</span>
                                        <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: "auto" }}>{col.cards.length}</span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {col.cards.map(c => (
                                            <div key={c} style={{ background: "#fff", borderRadius: 8, padding: "9px 11px", fontSize: 11, fontWeight: 500, color: "#374151", border: "1px solid #E8EAED", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>{c}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════ STATS ═══════════════════════════════════ */}
            <section style={{ position: "relative", zIndex: 1, padding: "48px 24px 72px" }}>
                <div style={{ maxWidth: 860, margin: "0 auto", background: "#fff", borderRadius: 20, border: "1px solid #F0F1F3", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                    {stats.map((s, i) => (
                        <Reveal key={i} delay={i * 80}>
                            <div style={{ textAlign: "center", padding: "32px 20px", borderRight: i < stats.length - 1 ? "1px solid #F0F1F3" : "none" }} className="stat-cell">
                                <div style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 800, letterSpacing: "-2px", color: "#111218", lineHeight: 1 }}>
                                    <Counter target={s.value} suffix={s.suffix} />
                                </div>
                                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500, marginTop: 6 }}>{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════ FEATURES ═══════════════════════════════════ */}
            <section id="features" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 72 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F4F5F7", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: "#475569", marginBottom: 18, border: "1px solid #E8EAED", letterSpacing: ".06em" }}>FEATURES</div>
                            <h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16, lineHeight: 1.1 }}>
                                Nine features that replace<br /><span style={{ color: "#9CA3AF", fontWeight: 600 }}>twelve other tools.</span>
                            </h2>
                            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                                We studied 47 project management tools and cut everything that wasn't earning its place. What's left is Frixa.
                            </p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 18 }}>
                        {features.map((f, i) => (
                            <Reveal key={i} delay={i * 50}>
                                <div className="feat-card" style={{ padding: "32px 28px", background: "#fff", border: "1.5px solid #F0F1F3", borderRadius: 22, transition: "all .25s cubic-bezier(.22,1,.36,1)", cursor: "default" }}>
                                    <div style={{ width: 46, height: 46, background: "#111218", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 20, boxShadow: "0 4px 14px rgba(0,0,0,0.14)" }}>{f.icon}</div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#111218", letterSpacing: "-0.2px" }}>{f.title}</h3>
                                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.72, margin: 0 }}>{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ HOW IT WORKS ═══════════════════════════════════ */}
            <section id="how" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px", background: "linear-gradient(180deg, transparent, rgba(241,245,249,0.7), transparent)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 72 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F0FDF4", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: "#059669", marginBottom: 18, border: "1px solid #D1FAE5", letterSpacing: ".06em" }}>HOW IT WORKS</div>
                            <h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16, lineHeight: 1.1 }}>
                                From zero to shipping —<br /><span style={{ color: "#475569" }}>in three steps.</span>
                            </h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>No onboarding call. No setup wizard. No tutorial you'll skip anyway.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, position: "relative" }}>
                        {steps.map((s, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <div style={{ position: "relative" }}>
                                    {i < steps.length - 1 && (
                                        <div style={{ position: "absolute", top: 36, left: "calc(100% + 12px)", width: "calc(100% - 24px)", height: 2, background: "linear-gradient(90deg,#E2E8F0,transparent)", zIndex: 1, display: "none" }} className="step-arrow" />
                                    )}
                                    <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 22, border: "1.5px solid #F0F1F3", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                                        <div style={{ fontSize: "clamp(44px,5vw,68px)", fontWeight: 900, letterSpacing: "-3px", color: "#F0F1F3", lineHeight: 1, marginBottom: 20, fontFamily: "system-ui" }}>{s.n}</div>
                                        <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12, color: "#111218", letterSpacing: "-0.3px" }}>{s.title}</h3>
                                        <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ BENTO HIGHLIGHT ═══════════════════════════════════ */}
            <section style={{ position: "relative", zIndex: 1, padding: "60px 24px 80px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="bento-grid">
                            {/* Left big card */}
                            <div style={{ background: "#111218", borderRadius: 28, padding: "48px 44px", color: "#fff", gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 400, position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", pointerEvents: "none" }} />
                                <div style={{ position: "relative" }}>
                                    <div style={{ fontSize: 36, marginBottom: 22 }}>⚡</div>
                                    <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.2 }}>&lt; 100ms.<br />Every single time.</h3>
                                    <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.72 }}>Every action in Frixa — drag, type, vote, comment — reaches your teammates in under 100ms. That's not a feature. That's the floor we built everything else on.</p>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32 }}>
                                    {["Supabase Realtime", "WebSocket-powered", "Zero polling"].map(t => (
                                        <span key={t} style={{ padding: "5px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            {/* Right top */}
                            <div style={{ background: "#F8FAFC", borderRadius: 28, padding: "36px 34px", border: "1.5px solid #E2E8F0" }}>
                                <div style={{ fontSize: 30, marginBottom: 16 }}>🔒</div>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "#111218", letterSpacing: "-0.4px" }}>Secure by architecture, not policy</h3>
                                <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.72, margin: 0 }}>Row-Level Security is enforced at the database layer. Your data is isolated before it ever reaches application code. Not a checkbox — a guarantee.</p>
                            </div>
                            {/* Right bottom */}
                            <div style={{ background: "#F1F5F9", borderRadius: 28, padding: "36px 34px", border: "1.5px solid #E2E8F0" }}>
                                <div style={{ fontSize: 30, marginBottom: 16 }}>📱</div>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "#111218", letterSpacing: "-0.4px" }}>Desktop. Tablet. Phone. Whatever.</h3>
                                <p style={{ fontSize: 14.5, color: "#6B7280", lineHeight: 1.72, margin: 0 }}>Fully responsive, works in any modern browser. Open it during standup on your phone — it adapts. A native app is coming because we want it too.</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════════════════════ TESTIMONIALS ═══════════════════════════════════ */}
            <section id="testimonials" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#FFF7ED", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: "#EA580C", marginBottom: 18, border: "1px solid #FED7AA", letterSpacing: ".06em" }}>TESTIMONIALS</div>
                            <h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 14, lineHeight: 1.1 }}>Frixa users don't look back.</h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>Honest words from teams who've switched from tools they used to dread.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 60}>
                                <div className="testi-card" style={{ padding: "28px 26px", background: "#fff", borderRadius: 20, border: "1.5px solid #F0F1F3", transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                                        {[...Array(5)].map((_, s) => <span key={s} style={{ color: "#F59E0B", fontSize: 13 }}>★</span>)}
                                    </div>
                                    <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.72, marginBottom: 20, flex: 1 }}>"{t.text}"</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #F4F5F7", paddingTop: 16 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1E293B,#475569)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.avatar}</div>
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
            <section id="pricing" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px", background: "linear-gradient(180deg,transparent,rgba(241,245,249,0.6),transparent)" }}>
                <div style={{ maxWidth: 1020, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#F0FDF4", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: "#059669", marginBottom: 18, border: "1px solid #D1FAE5", letterSpacing: ".06em" }}>PRICING</div>
                            <h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: 16, lineHeight: 1.1 }}>Honest pricing.<br /><span style={{ color: "#9CA3AF", fontWeight: 600 }}>No calculator required.</span></h2>
                            <p style={{ fontSize: 17, color: "#6B7280" }}>One plan is free forever. One is less than your team's Friday lunch.</p>
                        </div>
                    </Reveal>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18 }}>
                        {/* Free */}
                        <Reveal delay={0}>
                            <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 24, border: "1.5px solid #E8EAED", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".07em" }}>Free</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-3px", color: "#111218", lineHeight: 1 }}>₹0</span>
                                    <span style={{ fontSize: 14, color: "#9CA3AF" }}>/forever</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>For small teams who need to move fast without a procurement process.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 32, flex: 1 }}>
                                    {["Unlimited tasks & ideas","Up to 5 team members","Real-time collaboration","Kanban, List, Table views","Activity logs","2 active projects"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#F4F5F7", color: "#111218", border: "1.5px solid #E8EAED", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .15s" }} className="outline-btn-hover">Get started free →</button>
                            </div>
                        </Reveal>
                        {/* Pro */}
                        <Reveal delay={100}>
                            <div style={{ padding: "36px 32px", background: "#111218", borderRadius: 24, border: "1.5px solid #1F2937", height: "100%", position: "relative", overflow: "hidden", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                                <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", pointerEvents: "none" }} />
                                <div style={{ position: "absolute", top: 18, right: 18, padding: "4px 10px", background: "rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: ".05em" }}>MOST POPULAR</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".07em" }}>Pro</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-3px", color: "#fff", lineHeight: 1 }}>₹499</span>
                                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>/month</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.48)", marginBottom: 28, lineHeight: 1.6 }}>For teams serious about shipping. Everything you need, nothing you don't.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 32, flex: 1 }}>
                                    {["Everything in Free","Unlimited projects","Unlimited team members","CSV & PDF exports","Priority Timeline view","Custom stages & workflows","Priority support (24h SLA)","Early access to new features"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#fff", color: "#111218", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity .15s" }} className="btn-hover-ink">Start Pro free for 14 days →</button>
                            </div>
                        </Reveal>
                        {/* Enterprise */}
                        <Reveal delay={200}>
                            <div style={{ padding: "36px 32px", background: "#fff", borderRadius: 24, border: "1.5px solid #E8EAED", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: ".07em" }}>Enterprise</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                                    <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-2px", color: "#111218", lineHeight: 1 }}>Custom</span>
                                </div>
                                <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>For organisations where security, compliance, and scale are non-negotiable.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 32, flex: 1 }}>
                                    {["Everything in Pro","SSO & SAML 2.0","Dedicated infrastructure","Advanced audit logs","Custom SLA guarantee","Bespoke integrations","Dedicated onboarding"].map(f => (
                                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>{f}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={onGetStarted} style={{ width: "100%", padding: "13px", background: "#F4F5F7", color: "#111218", border: "1.5px solid #E8EAED", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .15s" }} className="outline-btn-hover">Talk to us →</button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════ FAQ ═══════════════════════════════════ */}
            <section id="faq" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    <Reveal>
                        <div style={{ textAlign: "center", marginBottom: 56 }}>
                            <div style={{ display: "inline-block", padding: "4px 14px", background: "#FFF7ED", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: "#EA580C", marginBottom: 18, border: "1px solid #FED7AA", letterSpacing: ".06em" }}>FAQ</div>
                            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.1 }}>Every excuse not to try it —<br /><span style={{ color: "#9CA3AF", fontWeight: 600 }}>addressed.</span></h2>
                        </div>
                    </Reveal>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {faqs.map((f, i) => (
                            <Reveal key={i} delay={i * 40}>
                                <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${openFaq === i ? "#D1D5DB" : "#F0F1F3"}`, overflow: "hidden", transition: "border-color .2s" }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
                                    >
                                        <span style={{ fontSize: 15, fontWeight: 600, color: "#111218", fontFamily: "inherit", letterSpacing: "-0.1px" }}>{f.q}</span>
                                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: openFaq === i ? "#111218" : "#F4F5F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={openFaq === i ? "#fff" : "#6B7280"} strokeWidth="3" strokeLinecap="round" style={{ transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </span>
                                    </button>
                                    {openFaq === i && (
                                        <div style={{ padding: "0 24px 20px", fontSize: 14.5, color: "#6B7280", lineHeight: 1.75, borderTop: "1px solid #F4F5F7", paddingTop: 16 }}>
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
            <section style={{ position: "relative", zIndex: 1, padding: "60px 24px 120px" }}>
                <Reveal>
                    <div style={{ maxWidth: 860, margin: "0 auto", background: "#111218", borderRadius: 32, padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -80, left: "15%", width: 360, height: 360, background: "radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -60, right: "15%", width: 280, height: 280, background: "radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "relative" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 24 }}>YOUR NEXT MOVE</div>
                            <h2 style={{ fontSize: "clamp(30px,5vw,58px)", fontWeight: 800, letterSpacing: "-2.5px", color: "#fff", marginBottom: 20, lineHeight: 1.06 }}>
                                Your best work is one<br />workspace away.
                            </h2>
                            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.48)", marginBottom: 44, maxWidth: 440, margin: "0 auto 44px", lineHeight: 1.7 }}>
                                340+ teams already shipping faster. Join them — free, forever, no card required.
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                                <button onClick={onGetStarted} style={{ padding: "16px 40px", background: "#fff", color: "#111218", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 16px 40px rgba(0,0,0,0.3)", transition: "opacity .15s", letterSpacing: "-0.2px" }} className="btn-hover-ink">
                                    Start building, free →
                                </button>
                                <a href="#features" style={{ padding: "16px 32px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "all .15s" }} className="ghost-btn-hover">
                                    See all features
                                </a>
                            </div>
                            <p style={{ marginTop: 24, fontSize: 12.5, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1px" }}>No credit card · Free forever on core plan · Setup in 30 seconds</p>
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
                            <p style={{ fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.72, maxWidth: 280 }}>
                                The minimal collaboration workspace for modern teams. Roadmaps, ideas, and real-time sync — all in one place.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#111218", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 16 }}>Product</div>
                            {[
                                { label: "Features", href: "#features", anchor: true },
                                { label: "How it works", href: "#how", anchor: true },
                                { label: "Pricing", href: "#pricing", anchor: true },
                                { label: "Changelog", href: "/changelog" },
                                { label: "Roadmap", href: "/roadmap" },
                            ].map(l => l.anchor
                                ? <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none" }} className="footer-link">{l.label}</a>
                                : <Link key={l.label} to={l.href} style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none" }} className="footer-link">{l.label}</Link>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#111218", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 16 }}>Company</div>
                            {[
                                { label: "About", href: "/about" },
                                { label: "Blog", href: "/blog" },
                                { label: "Contact", href: "/contact" },
                            ].map(l => (
                                <Link key={l.label} to={l.href} style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none" }} className="footer-link">{l.label}</Link>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#111218", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
                            {[
                                { label: "Privacy Policy", href: "/privacy" },
                                { label: "Terms of Service", href: "/terms" },
                                { label: "Cookie Policy", href: "/cookies" },
                                { label: "Security", href: "/security" },
                            ].map(l => (
                                <Link key={l.label} to={l.href} style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none" }} className="footer-link">{l.label}</Link>
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
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(36px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nav-link-hover:hover { background: #F4F5F7 !important; color: #111218 !important; }
                .btn-hover-ink:hover { opacity: 0.82 !important; }
                .badge-hover:hover { background: #ECEEF0 !important; }
                .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 28px 56px rgba(0,0,0,0.18) !important; }
                .cta-secondary:hover { border-color: #CBD5E1 !important; background: #F8FAFC !important; }
                .feat-card:hover { border-color: #E2E8F0 !important; transform: translateY(-5px); box-shadow: 0 20px 44px rgba(71,85,105,0.09) !important; }
                .testi-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; }
                .outline-btn-hover:hover { background: #111218 !important; color: #fff !important; border-color: #111218 !important; }
                .ghost-btn-hover:hover { background: rgba(255,255,255,0.14) !important; }
                .footer-link:hover { color: #111218 !important; }
                .mobile-nav-link:hover { background: #F4F5F7; }
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                    .bento-grid { grid-template-columns: 1fr !important; }
                    .footer-grid { grid-template-columns: 1fr 1fr !important; }
                    .step-arrow { display: none !important; }
                    .stat-cell { border-right: none !important; border-bottom: 1px solid #F0F1F3; }
                }
                @media (max-width: 480px) {
                    .footer-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
