import PageLayout from "../components/PageLayout";

const posts = [
  {
    date: "Feb 18, 2026",
    tag: "Product",
    tagColor: "#3B82F6",
    title: "How real-time cursors change the feel of remote collaboration",
    excerpt: "We shipped live cursors last week. Here's what we learned building them, and why presence makes such a difference for async teams.",
    readTime: "5 min read",
    initials: "AM",
  },
  {
    date: "Jan 30, 2026",
    tag: "Engineering",
    tagColor: "#8B5CF6",
    title: "Building a high-performance kanban board with React and Supabase",
    excerpt: "A behind-the-scenes look at how we architected Frixa's roadmap board — optimistic updates, conflict resolution, and real-time subscriptions.",
    readTime: "8 min read",
    initials: "PS",
  },
  {
    date: "Jan 12, 2026",
    tag: "Insights",
    tagColor: "#10B981",
    title: "Why most teams have too many project management tools",
    excerpt: "The average engineering team uses 4.3 different tools to track work. Here's how we think about reducing that number to one.",
    readTime: "4 min read",
    initials: "RN",
  },
  {
    date: "Dec 20, 2025",
    tag: "Product",
    tagColor: "#3B82F6",
    title: "Introducing multi-project workspaces in Frixa",
    excerpt: "Managing several products? You can now create multiple projects under a single organisation and switch between them in one click.",
    readTime: "3 min read",
    initials: "AM",
  },
  {
    date: "Nov 5, 2025",
    tag: "Design",
    tagColor: "#F59E0B",
    title: "The design principles behind Frixa's minimal UI",
    excerpt: "Every pixel in Frixa is intentional. We share the constraints we set for ourselves and why we keep saying no to feature requests.",
    readTime: "6 min read",
    initials: "RN",
  },
  {
    date: "Sep 15, 2025",
    tag: "News",
    tagColor: "#6B7280",
    title: "Frixa is now live — here's the story",
    excerpt: "After 8 months of building, we launched Frixa to the world. This is the story of how we got here, what we got wrong, and what comes next.",
    readTime: "7 min read",
    initials: "AM",
  },
];

export default function BlogPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 52 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Blog</h1>
          <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.7 }}>
            Product updates, engineering deep-dives, and thoughts on how teams work.
          </p>
        </div>

        {/* Featured post */}
        <div style={{ border: "1px solid #F0F1F3", borderRadius: 16, padding: "32px 36px", marginBottom: 40, cursor: "pointer", transition: "all .15s" }} className="blog-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: posts[0].tagColor, background: `${posts[0].tagColor}18`, padding: "3px 10px", borderRadius: 6 }}>{posts[0].tag}</span>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>{posts[0].date}</span>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>· {posts[0].readTime}</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111218", letterSpacing: "-0.6px", marginBottom: 10, lineHeight: 1.3 }}>{posts[0].title}</h2>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>{posts[0].excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#111218", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{posts[0].initials}</div>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Read more →</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="blog-grid">
          {posts.slice(1).map((post, i) => (
            <div key={i} style={{ border: "1px solid #F0F1F3", borderRadius: 14, padding: "24px 26px", cursor: "pointer", transition: "all .15s" }} className="blog-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: post.tagColor, background: `${post.tagColor}18`, padding: "3px 8px", borderRadius: 5 }}>{post.tag}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{post.date}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111218", letterSpacing: "-0.3px", marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>{post.excerpt}</p>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>{post.readTime}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .blog-card:hover { border-color: #E2E8F0 !important; box-shadow: 0 8px 32px rgba(0,0,0,0.06) !important; transform: translateY(-2px); }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}
