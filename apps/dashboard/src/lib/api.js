import { supabase } from "./supabase";

/* ══════════════════════════════════════════════════════
   DATA TRANSFORMERS  (DB snake_case ↔ app camelCase)
   Now include project_id for all entities.
══════════════════════════════════════════════════════ */
export function dbToTask(row) {
    return {
        id: row.id,
        title: row.title,
        desc: row.description ?? "",
        status: row.status,
        priority: row.priority ?? "",
        tags: row.tags ?? [],
        date: row.deadline_date ?? "",
        time: row.deadline_time ?? "",
        archived: row.archived,
        sortOrder: row.sort_order,
        projectId: row.project_id,
        userId: row.user_id,
    };
}

export function taskToDb(task, userId, projectId) {
    const out = {
        title: task.title,
        description: task.desc ?? "",
        status: task.status,
        priority: task.priority ?? "",
        tags: Array.isArray(task.tags) ? task.tags : [],
        deadline_date: task.date || null,
        deadline_time: task.time || null,
        archived: task.archived ?? false,
        sort_order: task.sortOrder ?? 0,
    };
    if (userId) out.user_id = userId;
    if (projectId) out.project_id = projectId;
    return out;
}

export function dbToIdea(row) {
    return {
        id: row.id,
        title: row.title,
        desc: row.description ?? "",
        cat: row.category ?? "other",
        votes: row.votes ?? 0,
        voted: row.voted ?? false,
        projectId: row.project_id,
        createdAt: new Date(row.created_at).toLocaleDateString(),
    };
}

export function ideaToDb(idea, userId, projectId) {
    const out = {
        title: idea.title,
        description: idea.desc ?? "",
        category: idea.cat ?? "other",
        votes: idea.votes ?? 0,
        // Note: 'voted' is per-user UI state — never written to DB
    };
    if (userId) out.user_id = userId;
    if (projectId) out.project_id = projectId;
    return out;
}

export function dbToStage(row) {
    return { id: row.id, label: row.label, dot: row.dot, sortOrder: row.sort_order, projectId: row.project_id };
}

export function dbToNote(row) {
    return {
        id: row.id,
        title: row.title,
        content: row.content ?? "",
        color: row.color ?? "yellow",
        pinned: row.pinned ?? false,
        archived: row.archived ?? false,
        projectId: row.project_id,
        userId: row.user_id,
        createdAt: new Date(row.created_at).toLocaleDateString(),
    };
}

export function noteToDb(note, userId, projectId) {
    const out = {
        title: note.title,
        content: note.content ?? "",
        color: note.color ?? "yellow",
        pinned: note.pinned ?? false,
    };
    if (userId) out.user_id = userId;
    if (projectId) out.project_id = projectId;
    return out;
}

/* ══════════════════════════════════════════════════════
   PROJECTS & COLLABORATION
══════════════════════════════════════════════════════ */
export async function fetchProjects() {
    // Strategy: two parallel queries — owned projects (always works via owner_id RLS)
    // and member projects (via project_members join). Merge and deduplicate.
    // This avoids any RPC dependency and works regardless of whether policies are set up.

    const [ownedRes, memberRes] = await Promise.all([
        // Query 1: projects where I am the owner (direct column match — always passes RLS)
        supabase.from("projects").select("*").order("created_at"),

        // Query 2: projects where I am a member via project_members
        // Using an async IIFE so both queries are truly parallel at the top level
        (async () => {
            const { data: rows } = await supabase.from("project_members").select("project_id");
            if (!rows || rows.length === 0) return { data: [] };
            const ids = rows.map(r => r.project_id);
            return supabase.from("projects").select("*").in("id", ids).order("created_at");
        })(),
    ]);

    const owned = ownedRes.data || [];
    const membered = (memberRes.data) || [];

    // Merge + deduplicate by id
    const seen = new Set();
    const all = [];
    for (const p of [...owned, ...membered]) {
        if (!seen.has(p.id)) { seen.add(p.id); all.push(p); }
    }
    all.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return { data: all, error: null };
}

export async function createProject(name, ownerId) {
    // 1. Create the project
    const { data, error } = await supabase
        .from("projects")
        .insert({ name, owner_id: ownerId })
        .select()
        .single();
    if (error || !data) return { data, error };

    // 2. Add the owner as a member so fetchProjects (which queries project_members) can find it
    await supabase
        .from("project_members")
        .insert({ project_id: data.id, user_id: ownerId, role: "owner" });

    return { data, error: null };
}

export async function deleteProject(projectId) {
    return supabase.from("projects").delete().eq("id", projectId);
}

export async function fetchProjectMembers(projectId) {
    // Join with profiles to get emails
    return supabase
        .from("project_members")
        .select("*, profiles(email)")
        .eq("project_id", projectId)
        .order("created_at");
}

export async function inviteMemberByEmail(projectId, email) {
    // Look up user in profiles by email
    const { data: profile, error: lookupErr } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();
    if (lookupErr || !profile) {
        return { error: { message: "No account found with that email address." } };
    }
    // Insert into project_members
    const { data, error } = await supabase
        .from("project_members")
        .insert({ project_id: projectId, user_id: profile.id, role: "member" })
        .select()
        .single();
    if (error) {
        if (error.code === "23505") return { error: { message: "This user is already a member of the project." } };
        return { error: { message: "Failed to add member. Please try again." } };
    }
    return { data, error: null };
}

export async function removeMember(projectId, userId) {
    return supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);
}

export async function joinProjectByInvite(projectId, userId) {
    // Add current user as member (idempotent — ignore conflict)
    const { data, error } = await supabase
        .from("project_members")
        .insert({ project_id: projectId, user_id: userId, role: "member" })
        .select()
        .single();
    if (error && error.code === "23505") return { data: null, error: null }; // already a member
    return { data, error };
}

export async function fetchProjectById(projectId) {
    return supabase.from("projects").select("*").eq("id", projectId).single();
}

/* ══════════════════════════════════════════════════════
   ACTIVITY LOG
══════════════════════════════════════════════════════ */
export async function fetchActivity(projectId) {
    return supabase.from("activity_log")
        .select("*, profiles(email)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(20);
}

// Allowlist of valid action types to prevent arbitrary strings being logged
const VALID_ACTIONS = new Set([
    "task_patched", "task_archived", "task_restored", "task_deleted",
    "tasks_reordered", "idea_voted",
]);

export async function logActivity(projectId, userId, action, details = {}) {
    if (!VALID_ACTIONS.has(action)) return; // silently ignore unknown actions
    // Truncate each string value individually so the resulting object is always valid JSON
    const safeDetails = Object.fromEntries(
        Object.entries(details).slice(0, 20).map(([k, v]) => [
            String(k).slice(0, 64),
            typeof v === "string" ? v.slice(0, 256) : v,
        ])
    );
    return supabase.from("activity_log").insert({
        project_id: projectId,
        user_id: userId,
        action,
        details: safeDetails,
    });
}

/* ══════════════════════════════════════════════════════
   TASKS
══════════════════════════════════════════════════════ */
export async function fetchTasks(projectId) {
    return supabase.from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order");
}

export async function insertTask(taskDb) {
    return supabase.from("tasks").insert(taskDb).select().single();
}

export async function updateTask(id, changes, projectId) {
    let q = supabase.from("tasks").update(changes).eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

export async function deleteTaskById(id, projectId) {
    let q = supabase.from("tasks").delete().eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

/* ══════════════════════════════════════════════════════
   IDEAS
══════════════════════════════════════════════════════ */
export async function fetchIdeas(projectId) {
    return supabase.from("ideas")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at");
}

export async function insertIdea(ideaDb) {
    return supabase.from("ideas").insert(ideaDb).select().single();
}

export async function updateIdea(id, changes, projectId) {
    let q = supabase.from("ideas").update(changes).eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

export async function deleteIdea(id, projectId) {
    let q = supabase.from("ideas").delete().eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

/* ══════════════════════════════════════════════════════
   STAGES
══════════════════════════════════════════════════════ */
export async function fetchStages(projectId) {
    return supabase.from("stages")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order");
}

export async function upsertStages(stages, userId, projectId) {
    const rows = stages.map((s, i) => ({
        id: s.id,
        label: s.label,
        dot: s.dot,
        sort_order: i,
        user_id: userId,
        project_id: projectId
    }));
    return supabase.from("stages").upsert(rows, { onConflict: "id,project_id" });
}

export async function deleteStage(id, projectId) {
    let q = supabase.from("stages").delete().eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

/* ══════════════════════════════════════════════════════
   NOTES
══════════════════════════════════════════════════════ */
export async function fetchNotes(projectId) {
    return supabase.from("notes")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
}

export async function insertNote(noteDb) {
    return supabase.from("notes").insert(noteDb).select().single();
}

export async function updateNote(id, changes, projectId) {
    let q = supabase.from("notes").update(changes).eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}

export async function deleteNoteById(id, projectId) {
    let q = supabase.from("notes").delete().eq("id", id);
    if (projectId) q = q.eq("project_id", projectId);
    return q;
}
