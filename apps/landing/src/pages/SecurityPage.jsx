import PageLayout from "../components/PageLayout";

const practices = [
  {
    icon: "🔐",
    title: "Encryption in transit & at rest",
    desc: "All data transmitted between your browser and Frixa is encrypted using TLS 1.3. Data stored in our database is encrypted at rest using AES-256.",
  },
  {
    icon: "🛡️",
    title: "Authentication & access control",
    desc: "Passwords are hashed with bcrypt. We support SSO and magic-link login. Role-based access control ensures team members can only access what they need.",
  },
  {
    icon: "🏗️",
    title: "Infrastructure security",
    desc: "Frixa runs on Supabase infrastructure hosted on AWS. We use private networking, firewalls, and automated patch management to keep our servers secure.",
  },
  {
    icon: "🔍",
    title: "Monitoring & logging",
    desc: "We continuously monitor our systems for anomalies and security events. All API access is logged and retained for 90 days for incident investigation.",
  },
  {
    icon: "🧪",
    title: "Penetration testing",
    desc: "We conduct periodic security assessments and penetration tests by third-party security professionals. Critical findings are patched within 24 hours.",
  },
  {
    icon: "📋",
    title: "Compliance",
    desc: "Frixa is designed with GDPR principles in mind. We provide data export and deletion tools for all users. We do not sell or share user data with third parties.",
  },
];

export default function SecurityPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Security</h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7, maxWidth: 560 }}>
            Your team's data is entrusted to us, and we take that responsibility seriously. Here's how we keep Frixa secure.
          </p>
        </div>

        {/* Security practices */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 64 }} className="security-grid">
          {practices.map(p => (
            <div key={p.title} style={{ border: "1px solid #F0F1F3", borderRadius: 14, padding: "24px 26px" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111218", marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Responsible disclosure */}
        <div style={{ background: "#111218", borderRadius: 18, padding: "40px 44px", color: "#fff" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", marginBottom: 12 }}>Responsible disclosure</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 24, maxWidth: 560 }}>
            Found a security vulnerability in Frixa? We appreciate responsible disclosure and will work with you to resolve it quickly. Please do not publicly disclose any vulnerability until we've had a chance to address it.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="mailto:security@frixa.in"
              style={{ padding: "12px 24px", background: "#fff", color: "#111218", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              Report a vulnerability →
            </a>
            <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, fontSize: 14 }}>
              security@frixa.in
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .security-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}
