import PageLayout from "../components/PageLayout";

const columns = [
  {
    label: "Planned",
    color: "#9CA3AF",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    items: [
      { title: "Mobile app (iOS & Android)", desc: "Native apps with full parity to the web experience.", votes: 248 },
      { title: "AI task suggestions", desc: "Let AI break epics into subtasks and suggest priorities.", votes: 191 },
      { title: "Custom fields on tasks", desc: "Add dropdowns, numbers, and URLs to any task.", votes: 134 },
      { title: "Public roadmap sharing", desc: "Share a read-only roadmap view with external stakeholders.", votes: 88 },
    ],
  },
  {
    label: "In progress",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    items: [
      { title: "Recurring tasks", desc: "Schedule tasks to repeat daily, weekly, or monthly.", votes: 172 },
      { title: "Bulk task actions", desc: "Select multiple tasks and move, assign, or delete them at once.", votes: 95 },
      { title: "Email notifications digest", desc: "Daily or weekly summary of activity via email.", votes: 61 },
    ],
  },
  {
    label: "Shipped",
    color: "#10B981",
    bg: "#F0FDF4",
    border: "#A7F3D0",
    items: [
      { title: "Real-time cursors", desc: "See teammates' cursors live on the board.", votes: 203 },
      { title: "Multi-project workspaces", desc: "Manage multiple projects under one organisation.", votes: 156 },
      { title: "Slack integration", desc: "Get notified in Slack when tasks change status.", votes: 112 },
      { title: "Idea voting board", desc: "Collect, vote, and discuss feature ideas from your team.", votes: 97 },
    ],
  },
];

function UpvoteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export default function RoadmapPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 52, maxWidth: 560 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Public Roadmap</h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
            Here's what we're working on and what's coming next. Vote on the features that matter most to you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="roadmap-grid">
          {columns.map(col => (
            <div key={col.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: col.color, textTransform: "uppercase", letterSpacing: ".06em" }}>{col.label}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>{col.items.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.items.map((item, i) => (
                  <div key={i} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111218", marginBottom: 6, lineHeight: 1.4 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0, padding: "4px 8px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, color: "#6B7280", cursor: "pointer", minWidth: 40 }}>
                        <UpvoteIcon />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{item.votes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .roadmap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}
