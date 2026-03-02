import { Link, useLocation } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", to: "/#features" },
    { label: "How it works", to: "/#how" },
    { label: "Pricing", to: "/#pricing" },
    { label: "Changelog", to: "/changelog" },
    { label: "Roadmap", to: "/roadmap" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Security", to: "/security" },
  ],
};

function FooterLink({ label, to }) {
  const isAnchor = to.startsWith("/#");
  if (isAnchor) {
    return (
      <a
        href={to}
        style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}
        className="footer-link"
      >
        {label}
      </a>
    );
  }
  return (
    <Link
      to={to}
      style={{ display: "block", fontSize: 13.5, color: "#6B7280", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}
      className="footer-link"
    >
      {label}
    </Link>
  );
}

export default function PageLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #F0F1F3", padding: "0 24px", height: 60, display: "flex", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo.png" alt="Frixa" style={{ height: 20, width: "auto" }} />
          </Link>
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            <a href="/#features" style={{ fontSize: 13.5, color: "#6B7280", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }} className="nav-link-hover">Features</a>
            <a href="/#how" style={{ fontSize: 13.5, color: "#6B7280", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }} className="nav-link-hover">How it works</a>
            <a href="/#pricing" style={{ fontSize: 13.5, color: "#6B7280", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }} className="nav-link-hover">Pricing</a>
          </div>
          <a
            href={import.meta.env.VITE_APP_URL || "https://app.frixa.in"}
            style={{ padding: "8px 20px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
          >
            Get started →
          </a>
        </div>
      </nav>

      {/* Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #F0F1F3", padding: "56px 24px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">
            <div>
              <Link to="/">
                <img src="/logo.png" alt="Frixa" style={{ height: 22, width: "auto", marginBottom: 16 }} />
              </Link>
              <p style={{ fontSize: 13.5, color: "#9CA3AF", lineHeight: 1.7, maxWidth: 280 }}>
                The minimal collaboration workspace for modern teams. Roadmaps, ideas, and real-time sync — all in one place.
              </p>
            </div>
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111218", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>{section}</div>
                {links.map(l => <FooterLink key={l.label} {...l} />)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #F0F1F3", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#C4C9D4", fontWeight: 500 }}>© 2026 Frixa Inc. All rights reserved.</span>
            <span style={{ fontSize: 13, color: "#C4C9D4" }}>Made with ♥ in India</span>
          </div>
        </div>
      </footer>

      <style>{`
        .nav-link-hover:hover { background: #F4F5F7 !important; color: #111218 !important; }
        .footer-link:hover { color: #111218 !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
