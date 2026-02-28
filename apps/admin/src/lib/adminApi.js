import { supabase } from "./supabase";

export async function fetchAdminStats() {
    try {
        const [pRes, tRes, iRes, uRes] = await Promise.all([
            supabase.from("projects").select("*", { count: "exact", head: true }),
            supabase.from("tasks").select("*", { count: "exact", head: true }),
            supabase.from("ideas").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
        ]);

        return {
            projects: pRes.count ?? 0,
            tasks: tRes.count ?? 0,
            ideas: iRes.count ?? 0,
            users: uRes.count ?? 0,
        };
    } catch (err) {
        console.error("fetchAdminStats Critical Error:", err);
        return { projects: 0, tasks: 0, ideas: 0, users: 0 };
    }
}

export async function fetchAllProjects() {
    return supabase.from("projects").select("*").order("created_at", { ascending: false });
}

export async function fetchAllTasks() {
    return supabase.from("tasks").select("*, projects(name)").order("created_at", { ascending: false }).limit(20);
}

// Global settings can be stored in a 'settings' table or as a single row
export async function fetchGlobalSettings() {
    return supabase.from("settings").select("*").single();
}
export async function getUserRole(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("getUserRole Error:", error);
        return null;
    }
    return data?.role;
}

export async function updateGlobalSettings(updates) {
    return supabase.from("settings").upsert({ id: 1, ...updates });
}
