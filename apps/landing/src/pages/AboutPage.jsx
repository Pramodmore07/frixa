import PageLayout from "../components/PageLayout";

const values = [
  { icon: "⚡", title: "Speed over ceremony", desc: "We ship fast and iterate faster. Every week counts." },
  { icon: "✦", title: "Minimal by design", desc: "Every feature earns its place. No bloat, no clutter." },
  { icon: "🤝", title: "Teams first", desc: "Built for real collaboration, not just solo productivity." },
  { icon: "🔒", title: "Privacy matters", desc: "Your data is yours. We never sell or share it." },
];

const team = [
  { name: "Arjun Mehta", role: "Co-founder & CEO", initials: "AM" },
  { name: "Priya Sharma", role: "Co-founder & CTO", initials: "PS" },
  { name: "Rahul Nair", role: "Head of Design", initials: "RN" },
  { name: "Sneha Patel", role: "Engineering Lead", initials: "SP" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "#3B82F6", background: "#EFF6FF", padding: "4px 12px", borderRadius: 6, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 20 }}>Our story</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, color: "#111218", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 24 }}>
            Built by a team tired of<br />bloated project tools.
          </h1>
          <p style={{ fontSize: 17, color: "#4B5563", lineHeight: 1.8, maxWidth: 640 }}>
            We spent years drowning in Jira tickets, Notion rabbit-holes, and Slack threads that went nowhere. So we built Frixa — the minimal workspace we always wanted. Roadmaps, ideas, and real-time sync, with nothing in the way.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#F0F1F3", borderRadius: 16, overflow: "hidden", marginBottom: 72 }}>
          {[["340+", "Teams"], ["12k+", "Tasks shipped"], ["2025", "Founded"]].map(([num, label]) => (
            <div key={label} style={{ background: "#FAFAFA", padding: "32px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px" }}>{num}</div>
              <div style={{ fontSize: 13.5, color: "#6B7280", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111218", letterSpacing: "-0.8px", marginBottom: 32 }}>What we believe in</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="values-grid">
            {values.map(v => (
              <div key={v.title} style={{ border: "1px solid #F0F1F3", borderRadius: 14, padding: "24px 26px" }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111218", marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111218", letterSpacing: "-0.8px", marginBottom: 32 }}>The team</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="team-grid">
            {team.map(m => (
              <div key={m.name} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "#111218", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, margin: "0 auto 12px" }}>{m.initials}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111218" }}>{m.name}</div>
                <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 2 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}
