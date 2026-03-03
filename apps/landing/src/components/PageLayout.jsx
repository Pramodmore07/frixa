import { useState } from "react";
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

const innerNavLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
];

export default function PageLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #F0F1F3", padding: "0 24px", height: 60, display: "flex", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="Frixa" style={{ height: 20, width: "auto" }} />
          </Link>
          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: 4, flex: 1 }} className="lp-desktop-nav">
            {innerNavLinks.map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 13.5, color: "#6B7280", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }} className="nav-link-hover">{l.label}</a>
            ))}
          </div>
          {/* Desktop CTA */}
          <a
            href={import.meta.env.VITE_APP_URL || "https://app.frixa.in"}
            style={{ padding: "8px 20px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}
            className="lp-desktop-nav"
          >
            Get started →
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#374151", marginLeft: "auto" }}
            className="lp-mobile-btn"
            aria-label="Menu"
          >
            {mobileOpen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
            }
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 260, height: "100%", background: "#fff", padding: "76px 20px 40px", display: "flex", flexDirection: "column", gap: 4, boxShadow: "-16px 0 40px rgba(0,0,0,0.1)" }} onClick={e => e.stopPropagation()}>
            {innerNavLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "12px 16px", fontSize: 15, fontWeight: 600, color: "#374151", textDecoration: "none", borderRadius: 10, display: "block" }} className="lp-mobile-nav-link">{l.label}</a>
            ))}
            <div style={{ height: 1, background: "#F0F1F3", margin: "12px 0" }} />
            <a href={import.meta.env.VITE_APP_URL || "https://app.frixa.in"} style={{ padding: "14px", background: "#111218", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: "center", textDecoration: "none", display: "block" }}>Get started →</a>
          </div>
        </div>
      )}

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
        .lp-mobile-nav-link:hover { background: #F4F5F7 !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-desktop-nav { display: none !important; }
          .lp-mobile-btn { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
