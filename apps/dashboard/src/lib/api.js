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
        voted: idea.voted ?? false,
    };
    if (userId) out.user_id = userId;
    if (projectId) out.project_id = projectId;
    return out;
}

export function dbToStage(row) {
    return { id: row.id, label: row.label, dot: row.dot, sortOrder: row.sort_order, projectId: row.project_id };
}

/* ══════════════════════════════════════════════════════
   PROJECTS & COLLABORATION
══════════════════════════════════════════════════════ */
export async function fetchProjects() {
    // Fetch all projects the user owns OR is a member of.
    // We query project_members for the current user first, then fetch those projects.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    // Get all project_ids where this user is a member (includes owner row)
    const { data: memberRows, error: memberErr } = await supabase
        .from("project_members")
        .select("project_id")
        .eq("user_id", user.id);

    if (memberErr) return { data: [], error: memberErr };

    const projectIds = (memberRows || []).map((r) => r.project_id);
    if (projectIds.length === 0) return { data: [], error: null };

    return supabase
        .from("projects")
        .select("*, project_members(*)")
        .in("id", projectIds)
        .order("created_at");
}

export async function createProject(name, ownerId) {
    return supabase.from("projects").insert({ name, owner_id: ownerId }).select().single();
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
    return supabase
        .from("project_members")
        .insert({ project_id: projectId, user_id: profile.id, role: "member" })
        .select()
        .single();
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
        .select("*, auth.users(email)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(20);
}

export async function logActivity(projectId, userId, action, details = {}) {
    return supabase.from("activity_log").insert({
        project_id: projectId,
        user_id: userId,
        action,
        details
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

export async function updateTask(id, changes) {
    return supabase.from("tasks").update(changes).eq("id", id);
}

export async function deleteTaskById(id) {
    return supabase.from("tasks").delete().eq("id", id);
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

export async function updateIdea(id, changes) {
    return supabase.from("ideas").update(changes).eq("id", id);
}

export async function deleteIdea(id) {
    return supabase.from("ideas").delete().eq("id", id);
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

export async function deleteStage(id) {
    return supabase.from("stages").delete().eq("id", id);
}
