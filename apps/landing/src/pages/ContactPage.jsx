import { useState } from "react";
import PageLayout from "../components/PageLayout";

const channels = [
  { icon: "✉️", label: "Email us", value: "hello@frixa.in", href: "mailto:hello@frixa.in" },
  { icon: "💬", label: "Live chat", value: "Available Mon–Fri, 9am–6pm IST", href: null },
  { icon: "🐦", label: "Twitter / X", value: "@frixahq", href: "https://x.com/frixahq" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Get in touch</h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 48, alignItems: "start" }} className="contact-grid">
          {/* Channels */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111218", marginBottom: 24 }}>Other ways to reach us</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {channels.map(ch => (
                <div key={ch.label} style={{ border: "1px solid #F0F1F3", borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{ch.icon}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111218", marginBottom: 2 }}>{ch.label}</div>
                  {ch.href ? (
                    <a href={ch.href} style={{ fontSize: 13, color: "#3B82F6", textDecoration: "none" }}>{ch.value}</a>
                  ) : (
                    <div style={{ fontSize: 13, color: "#9CA3AF" }}>{ch.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ border: "1px solid #F0F1F3", borderRadius: 16, padding: "36px 32px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111218", marginBottom: 8 }}>Message sent!</h3>
                <p style={{ fontSize: 14.5, color: "#6B7280" }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111218", marginBottom: 24 }}>Send a message</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[["name", "Name", "Your name"], ["email", "Email", "you@example.com"]].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        placeholder={placeholder}
                        required
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111218" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Subject</label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111218" }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Message</label>
                  <textarea
                    placeholder="Tell us more..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 9, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", color: "#111218", fontFamily: "inherit" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: "100%", padding: "12px", background: "#111218", color: "#fff", border: "none", borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: "pointer" }}
                >
                  Send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}
