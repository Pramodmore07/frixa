import PageLayout from "../components/PageLayout";

const cookieTypes = [
  {
    name: "Strictly necessary",
    color: "#10B981",
    required: true,
    desc: "These cookies are essential for Frixa to function. They enable core features like authentication, session management, and security. You cannot opt out of these.",
    examples: ["Session token (auth)", "CSRF protection token", "Cookie consent preference"],
  },
  {
    name: "Functional",
    color: "#3B82F6",
    required: false,
    desc: "These cookies allow Frixa to remember your preferences and settings, such as your selected project, sidebar state, and notification preferences.",
    examples: ["Last visited project", "Sidebar collapsed state", "Theme preference"],
  },
  {
    name: "Analytics",
    color: "#8B5CF6",
    required: false,
    desc: "We use privacy-first analytics (no third-party trackers) to understand how people use Frixa so we can improve it. All data is anonymised and never sold.",
    examples: ["Page views (anonymised)", "Feature usage frequency", "Error tracking"],
  },
];

export default function CookiesPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Cookie Policy</h1>
          <p style={{ fontSize: 14, color: "#9CA3AF" }}>Last updated: February 1, 2026</p>
        </div>

        <p style={{ fontSize: 15.5, color: "#4B5563", lineHeight: 1.8, marginBottom: 48 }}>
          Frixa uses a minimal set of cookies to keep your session secure and to understand how our product is used. We don't use third-party advertising cookies or sell your browsing data.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111218", letterSpacing: "-0.5px", marginBottom: 24 }}>Types of cookies we use</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
          {cookieTypes.map(ct => (
            <div key={ct.name} style={{ border: "1px solid #F0F1F3", borderRadius: 14, padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ct.color }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111218" }}>{ct.name}</span>
                {ct.required && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: ct.color, background: `${ct.color}18`, padding: "2px 8px", borderRadius: 5, marginLeft: "auto" }}>Required</span>
                )}
              </div>
              <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, marginBottom: 14 }}>{ct.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ct.examples.map(ex => (
                  <span key={ex} style={{ fontSize: 12.5, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "4px 10px", borderRadius: 6 }}>{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[
            ["How long are cookies stored?", "Strictly necessary cookies expire at the end of your session or after 30 days of inactivity. Functional and analytics cookies persist for up to 12 months and are renewed if you continue using Frixa."],
            ["How can I control cookies?", "You can manage cookie preferences through your browser settings. Note that disabling strictly necessary cookies will prevent you from signing in to Frixa. Most modern browsers allow you to view, manage, block, and delete cookies in the privacy or security settings."],
            ["Third-party cookies", "Frixa does not use third-party advertising cookies. We use privacy-first analytics that do not rely on third-party cookies or fingerprinting."],
            ["Contact", "If you have questions about our use of cookies, contact us at privacy@frixa.in."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111218", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14.5, color: "#4B5563", lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
