export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CAT_COLORS = {
    product: { bg: "#EDE9FE", fg: "#5B21B6" },
    marketing: { bg: "#FEF9C3", fg: "#92400E" },
    growth: { bg: "#DCFCE7", fg: "#14532D" },
    tech: { bg: "#F1F5F9", fg: "#334155" },
    other: { bg: "#F3F4F6", fg: "#374151" },
};

export const PRI_COLORS = {
    high: { bg: "#FEE2E2", fg: "#B91C1C" },
    medium: { bg: "#FEF9C3", fg: "#854D0E" },
    low: { bg: "#DCFCE7", fg: "#166534" },
};

export const DEFAULT_STAGES = [
    { id: "planned", label: "Planned", dot: "#475569" },
    { id: "ongoing", label: "Ongoing", dot: "#10B981" },
    { id: "hold", label: "On Hold", dot: "#F59E0B" },
    { id: "done", label: "Done", dot: "#374151" },
];

export const DOT_PALETTE = [
    "#475569", "#10B981", "#F59E0B", "#374151", "#EF4444",
    "#F97316", "#EC4899", "#0EA5E9", "#14B8A6", "#6B7280",
];

export const SEED_TASKS = [
    { title: "Define MVP scope", desc: "List core features needed for the first launch.", status: "planned", priority: "high", tags: ["#Strategy"], date: "", time: "", archived: false, sortOrder: 0 },
    { title: "Set up landing page", desc: "Build a waitlist and capture early emails.", status: "planned", priority: "high", tags: ["#Marketing"], date: "", time: "", archived: false, sortOrder: 1 },
    { title: "Research competitors", desc: "Deep dive into the top 5 competitors.", status: "ongoing", priority: "medium", tags: ["#Research"], date: "", time: "", archived: false, sortOrder: 0 },
    { title: "Investor outreach", desc: "Identify and contact 10 angel investors.", status: "ongoing", priority: "", tags: ["#Fundraising"], date: "", time: "", archived: false, sortOrder: 1 },
    { title: "CI/CD pipeline setup", desc: "Automate builds and deploys with GitHub Actions.", status: "hold", priority: "medium", tags: ["#Tech"], date: "", time: "", archived: false, sortOrder: 0 },
    { title: "Brand identity", desc: "Logo, typography and color guidelines.", status: "done", priority: "low", tags: ["#Design"], date: "", time: "", archived: false, sortOrder: 0 },
];

export const SEED_IDEAS = [
    { title: "AI-powered onboarding", desc: "Personalise the first-run experience using user goals.", cat: "product", votes: 7 },
    { title: "Weekly digest newsletter", desc: "Automated Monday email with user progress highlights.", cat: "marketing", votes: 4 },
    { title: "Notion integration", desc: "Bi-directional task sync with Notion databases.", cat: "growth", votes: 11 },
    { title: "Full dark mode", desc: "System-aware dark theme across every surface.", cat: "tech", votes: 9 },
];
