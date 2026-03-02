import PageLayout from "../components/PageLayout";

const entries = [
  {
    version: "v1.4.0",
    date: "February 2026",
    tag: "Feature",
    tagColor: "#3B82F6",
    title: "Real-time collaboration cursors",
    items: [
      "See your teammates' cursors live on the roadmap board",
      "Presence indicators in task detail panels",
      "Live typing indicators in idea comments",
    ],
  },
  {
    version: "v1.3.2",
    date: "January 2026",
    tag: "Improvement",
    tagColor: "#10B981",
    title: "Ideas board performance & UX",
    items: [
      "Ideas now load 3× faster with cursor-based pagination",
      "Drag-to-reorder ideas within the same status column",
      "Keyboard shortcut N to quickly create a new idea",
    ],
  },
  {
    version: "v1.3.0",
    date: "December 2025",
    tag: "Feature",
    tagColor: "#3B82F6",
    title: "Projects & multi-workspace support",
    items: [
      "Create multiple projects under a single organisation",
      "Switch projects from the sidebar without re-logging",
      "Per-project member roles: Admin, Editor, Viewer",
    ],
  },
  {
    version: "v1.2.1",
    date: "November 2025",
    tag: "Fix",
    tagColor: "#EF4444",
    title: "Task date picker & timezone fixes",
    items: [
      "Date/time pickers no longer clip outside the viewport",
      "Due dates now respect the user's local timezone",
      "Fixed phantom overdue badge on tasks with no due date",
    ],
  },
  {
    version: "v1.2.0",
    date: "October 2025",
    tag: "Feature",
    tagColor: "#3B82F6",
    title: "Settings page & integrations",
    items: [
      "Full Settings page with project, team, and billing sections",
      "Slack notifications for task status changes",
      "GitHub issue sync — link commits directly to tasks",
    ],
  },
  {
    version: "v1.0.0",
    date: "September 2025",
    tag: "Launch",
    tagColor: "#8B5CF6",
    title: "Frixa public launch 🎉",
    items: [
      "Kanban roadmap with drag-and-drop columns",
      "Idea voting board with upvote and comment threads",
      "Invite-based team collaboration",
      "Free forever core plan",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Changelog</h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
            New features, improvements and fixes — shipped every few weeks.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 0, top: 8, bottom: 0, width: 2, background: "#F0F1F3" }} />

          {entries.map((entry, i) => (
            <div key={i} style={{ paddingLeft: 28, marginBottom: 52, position: "relative" }}>
              {/* Dot */}
              <div style={{ position: "absolute", left: -5, top: 6, width: 12, height: 12, borderRadius: "50%", background: entry.tagColor, border: "2px solid #fff", boxShadow: `0 0 0 3px ${entry.tagColor}22` }} />

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: entry.tagColor, background: `${entry.tagColor}18`, padding: "3px 10px", borderRadius: 6 }}>{entry.tag}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111218" }}>{entry.version}</span>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>· {entry.date}</span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111218", letterSpacing: "-0.4px", marginBottom: 14 }}>{entry.title}</h2>

              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {entry.items.map((item, j) => (
                  <li key={j} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "#4B5563", marginBottom: 8, lineHeight: 1.6 }}>
                    <span style={{ color: "#9CA3AF", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
