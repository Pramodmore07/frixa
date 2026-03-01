import { useState, useCallback, useEffect } from "react";
import { supabase } from "./lib/supabase";
import {
  fetchTasks, fetchIdeas, fetchStages,
  insertTask, updateTask, deleteTaskById,
  insertIdea, updateIdea, deleteIdea,
  upsertStages, deleteStage,
  logActivity,
  dbToTask, taskToDb, dbToIdea, ideaToDb, dbToStage,
  joinProjectByInvite, fetchProjectById,
} from "./lib/api";
import { ls } from "./utils/localStorage";
import { spawnConfetti } from "./utils/confetti";
import { DEFAULT_STAGES, SEED_TASKS, SEED_IDEAS } from "./constants";
import LoginScreen from "./pages/LoginScreen";
import ProjectHome from "./pages/ProjectHome";
import Topbar from "./components/layout/Topbar";
import TaskModal from "./components/modals/TaskModal";
import IdeaModal from "./components/modals/IdeaModal";
import StagesModal from "./components/modals/StagesModal";
import SettingsModal from "./components/modals/SettingsModal";
import CollaboratorsModal from "./components/modals/CollaboratorsModal";
import ActivityFeed from "./components/ActivityFeed";
import TimerPopup from "./components/TimerPopup";
import Toast from "./components/layout/Toast";
import RoadmapPage from "./pages/RoadmapPage";
import IdeasPage from "./pages/IdeasPage";
import ArchivePage from "./pages/ArchivePage";
import ProjectsPage from "./pages/ProjectsPage";

const GUEST_TASKS_KEY = "guest_tasks_v1";
const GUEST_IDEAS_KEY = "guest_ideas_v1";
const GUEST_STAGES_KEY = "guest_stages_v1";
const GUEST_SETTINGS_KEY = "guest_settings_v1";

const DEFAULT_SETTINGS = { showTimer: false };

function seedTasks() {
  return SEED_TASKS.map((t, i) => ({ ...t, id: i + 1, archived: false, sortOrder: t.sortOrder ?? i, createdAt: new Date().toLocaleDateString() }));
}
function seedIdeas() {
  return SEED_IDEAS.map((x, i) => ({ ...x, id: i + 1, voted: false, createdAt: new Date().toLocaleDateString() }));
}

export default function App() {
  const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState("roadmap");
  const [tasks, setTasks] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [settings, setSettings] = useState(() => {
    try { return ls.get(GUEST_SETTINGS_KEY, DEFAULT_SETTINGS); }
    catch { return DEFAULT_SETTINGS; }
  });

  const [taskModal, setTaskModal] = useState(null);
  const [ideaModal, setIdeaModal] = useState(null);
  const [stagesModal, setStagesModal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [timerDone, setTimerDone] = useState(null);
  const [toast, setToast] = useState(null);
  const [nextId, setNextId] = useState(100);

  const showToast = useCallback((msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Guest mode ── */
  const enterGuestMode = useCallback(() => {
    setTasks(ls.get(GUEST_TASKS_KEY, null) ?? seedTasks());
    setIdeas(ls.get(GUEST_IDEAS_KEY, null) ?? seedIdeas());
    setStages(ls.get(GUEST_STAGES_KEY, null) ?? DEFAULT_STAGES);
    setSettings(ls.get(GUEST_SETTINGS_KEY, DEFAULT_SETTINGS));
    setGuestMode(true);
    setLoading(false);
  }, []);

  const exitGuestMode = useCallback(() => {
    setGuestMode(false);
    setTasks([]); setIdeas([]); setStages(DEFAULT_STAGES); setCurrentProject(null);
  }, []);

  /* ── Supabase auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const timeout = setTimeout(() => setLoading(false), 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Remove the #access_token hash Supabase appends after email confirmation / OAuth
        if (window.location.hash) {
          window.history.replaceState({}, "", window.location.pathname + window.location.search);
        }
      }
      if (event === "SIGNED_OUT") {
        setTasks([]); setIdeas([]); setStages(DEFAULT_STAGES); setCurrentProject(null); setLoading(false);
      }
    });
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  /* ── Handle invite link: ?invite=<projectId> ── */
  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get("invite");
    if (!inviteId) return;
    window.history.replaceState({}, "", window.location.pathname);
    (async () => {
      await joinProjectByInvite(inviteId, user.id);
      const { data } = await fetchProjectById(inviteId);
      if (data) { setCurrentProject(data); setPage("roadmap"); }
    })();
  }, [user]);

  /* ── Load project data ── */
  const loadData = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [tRes, iRes, sRes] = await Promise.all([
        fetchTasks(projectId), fetchIdeas(projectId), fetchStages(projectId),
      ]);

      // Always set tasks/ideas even if empty — don't block on errors
      setTasks(Array.isArray(tRes.data) ? tRes.data.map(dbToTask) : []);
      setIdeas(Array.isArray(iRes.data) ? iRes.data.map(dbToIdea) : []);

      if (sRes.data?.length > 0) {
        setStages(sRes.data.map(dbToStage));
      } else {
        setStages(DEFAULT_STAGES);
        // Only upsert stages if we are a member (will fail silently if not)
        if (!guestMode && !sRes.error) {
          await upsertStages(DEFAULT_STAGES, user?.id, projectId);
        }
      }
    } catch {
      // Don't show error — partial data is better than blocking the UI
      setTasks([]);
      setIdeas([]);
      setStages(DEFAULT_STAGES);
    } finally {
      setLoading(false);
    }
  }, [user, showToast, guestMode]);

  useEffect(() => {
    if (user && currentProject) loadData(currentProject.id);
  }, [user, currentProject, loadData]);

  /* ── Real-time collaboration ── */
  useEffect(() => {
    if (!user || !currentProject || guestMode) return;
    const pid = currentProject.id;

    // Small debounce so rapid consecutive DB changes don't cause multiple fetches
    let taskTimer, ideaTimer, stageTimer;

    const channel = supabase
      .channel(`project-${pid}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `project_id=eq.${pid}` },
        () => {
          clearTimeout(taskTimer);
          taskTimer = setTimeout(() => {
            fetchTasks(pid).then(({ data }) => { if (data) setTasks(data.map(dbToTask)); });
          }, 150);
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas", filter: `project_id=eq.${pid}` },
        () => {
          clearTimeout(ideaTimer);
          ideaTimer = setTimeout(() => {
            fetchIdeas(pid).then(({ data }) => { if (data) setIdeas(data.map(dbToIdea)); });
          }, 150);
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "stages", filter: `project_id=eq.${pid}` },
        () => {
          clearTimeout(stageTimer);
          stageTimer = setTimeout(() => {
            fetchStages(pid).then(({ data }) => { if (data?.length > 0) setStages(data.map(dbToStage)); });
          }, 150);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(taskTimer); clearTimeout(ideaTimer); clearTimeout(stageTimer);
      supabase.removeChannel(channel);
    };
  }, [user, currentProject?.id, guestMode]);

  const guestSave = (key, val) => ls.set(key, val);

  /* ── Task CRUD ── */
  const saveTask = useCallback(async (form) => {
    if (form.id) {
      // UPDATE — optimistic update is safe, no tempId issue
      setTasks((prev) => { const next = prev.map((t) => t.id === form.id ? { ...t, ...form } : t); if (guestMode) guestSave(GUEST_TASKS_KEY, next); return next; });
      if (!guestMode && currentProject) {
        const { error } = await updateTask(form.id, taskToDb(form, user.id, currentProject.id));
        if (error) showToast("Failed to save task.");
        // realtime will sync to other members
      }
    } else {
      if (guestMode) {
        // Guest: use local nextId
        const newId = nextId;
        setNextId((n) => n + 1);
        setTasks((prev) => {
          const colMax = prev.filter((t) => !t.archived && t.status === form.status).reduce((mx, t) => Math.max(mx, t.sortOrder ?? -1), -1);
          const newTask = { ...form, id: newId, sortOrder: colMax + 1, archived: false };
          const next = [...prev, newTask];
          guestSave(GUEST_TASKS_KEY, next);
          return next;
        });
      } else if (currentProject) {
        // DB mode: insert directly, let realtime subscription update ALL clients (including self)
        // Do NOT do optimistic update — realtime fires immediately and would conflict
        const colMax = tasks.filter((t) => !t.archived && t.status === form.status).reduce((mx, t) => Math.max(mx, t.sortOrder ?? -1), -1);
        const taskDb = taskToDb({ ...form, sortOrder: colMax + 1 }, user.id, currentProject.id);
        const { error } = await insertTask(taskDb);
        if (error) { showToast("Failed to create task."); return; }
        // realtime postgres_changes will push the new task to all clients including this one
      }
    }
    setTaskModal(null);
  }, [guestMode, nextId, tasks, user, currentProject, showToast]);

  const patchTask = useCallback(async (id, patches) => {
    const dbPatches = {};
    if ("title" in patches) dbPatches.title = patches.title;
    if ("desc" in patches) dbPatches.description = patches.desc;
    if ("status" in patches) dbPatches.status = patches.status;
    if ("priority" in patches) dbPatches.priority = patches.priority;
    if ("date" in patches) dbPatches.deadline_date = patches.date;
    if ("time" in patches) dbPatches.deadline_time = patches.time;
    if ("archived" in patches) dbPatches.archived = patches.archived;
    if ("sortOrder" in patches) dbPatches.sort_order = patches.sortOrder;

    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...patches } : t));
    if (!guestMode && currentProject) {
      await updateTask(id, dbPatches);
      await logActivity(currentProject.id, user.id, "task_patched", { id, patches: Object.keys(patches) });
    }
  }, [guestMode, currentProject, user]);

  const moveTask = useCallback(async (dragged, targetCol, anchorId, position) => {
    let reordered;
    setTasks((prev) => {
      const updated = prev.map((t) => t.id === dragged ? { ...t, status: targetCol } : t);
      const col = updated.filter((t) => !t.archived && t.status === targetCol).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
      const item = col.find((t) => t.id === dragged);
      const others = col.filter((t) => t.id !== dragged);
      let idx = others.length;
      if (anchorId != null) { const ai = others.findIndex((t) => t.id === anchorId); if (ai !== -1) idx = position === "before" ? ai : ai + 1; }
      others.splice(idx, 0, item);
      others.forEach((t, i) => { t.sortOrder = i; });
      reordered = others;
      const next = updated.map((t) => { const f = others.find((o) => o.id === t.id); return f ? { ...t, sortOrder: f.sortOrder } : t; });
      if (guestMode) guestSave(GUEST_TASKS_KEY, next);
      return next;
    });
    if (!guestMode && reordered && currentProject) {
      await Promise.all(reordered.map((t) => updateTask(t.id, { status: targetCol, sort_order: t.sortOrder })));
      await logActivity(currentProject.id, user.id, "tasks_reordered", { status: targetCol });
    }
  }, [guestMode, currentProject, user]);

  const archiveTask = useCallback(async (id) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, archived: true } : t));
    setTaskModal(null);
    if (!guestMode && currentProject) {
      await updateTask(id, { archived: true });
      await logActivity(currentProject.id, user.id, "task_archived", { id });
    }
  }, [guestMode, currentProject, user]);

  const restoreTask = useCallback(async (id) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, archived: false, status: stages[0]?.id ?? "planned" } : t));
    if (!guestMode && currentProject) {
      await updateTask(id, { archived: false, status: stages[0]?.id ?? "planned" });
      await logActivity(currentProject.id, user.id, "task_restored", { id });
    }
  }, [guestMode, currentProject, user, stages]);

  const deleteTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (!guestMode && currentProject) {
      await deleteTaskById(id);
      await logActivity(currentProject.id, user.id, "task_deleted", { id });
    }
  }, [guestMode, currentProject, user]);

  const duplicateTask = useCallback(async (task) => {
    if (guestMode) {
      const newTask = { ...task, id: nextId, title: task.title + " (copy)", archived: false, sortOrder: (task.sortOrder ?? 0) + 1 };
      setNextId((n) => n + 1);
      setTasks((prev) => { const next = [...prev, newTask]; guestSave(GUEST_TASKS_KEY, next); return next; });
      return;
    }
    if (!currentProject) return;
    // DB mode: insert directly, realtime will update all clients
    const taskDb = taskToDb(
      { ...task, title: task.title + " (copy)", sortOrder: (task.sortOrder ?? 0) + 1, archived: false },
      user.id, currentProject.id
    );
    const { error } = await insertTask(taskDb);
    if (error) showToast("Failed to duplicate task.");
    // realtime fires for all clients — no manual state update needed
  }, [guestMode, nextId, user, currentProject, showToast]);

  /* ── Ideas CRUD ── */
  const saveIdea = useCallback(async (form) => {
    if (form.id) {
      // UPDATE — optimistic is safe for edits
      setIdeas((prev) => prev.map((x) => x.id === form.id ? { ...x, ...form } : x));
      if (!guestMode && currentProject) {
        const { error } = await updateIdea(form.id, ideaToDb(form, user.id, currentProject.id));
        if (error) showToast("Failed to update idea.");
      }
      if (guestMode) guestSave(GUEST_IDEAS_KEY, ideas.map((x) => x.id === form.id ? { ...x, ...form } : x));
    } else {
      if (guestMode) {
        const newIdea = { ...form, id: Date.now(), votes: 0, voted: false, createdAt: new Date().toLocaleDateString() };
        setIdeas((prev) => { const next = [...prev, newIdea]; guestSave(GUEST_IDEAS_KEY, next); return next; });
      } else if (currentProject) {
        // DB mode: insert directly, let realtime push to all clients — no optimistic update
        const ideaDb = ideaToDb({ ...form, votes: 0, voted: false }, user.id, currentProject.id);
        const { error } = await insertIdea(ideaDb);
        if (error) { showToast("Failed to save idea."); return; }
      }
    }
    setIdeaModal(null);
  }, [guestMode, currentProject, user, showToast, ideas]);

  const handleDeleteIdea = useCallback(async (id) => {
    setIdeas((prev) => prev.filter((x) => x.id !== id));
    setIdeaModal(null);
    if (!guestMode && currentProject) await deleteIdea(id);
  }, [guestMode, currentProject]);

  const voteIdea = useCallback(async (id) => {
    setIdeas((prev) => prev.map((x) => x.id === id ? { ...x, voted: !x.voted, votes: x.votes + (x.voted ? -1 : 1) } : x));
    if (!guestMode && currentProject) {
      const idea = ideas.find((i) => i.id === id);
      if (idea) {
        await updateIdea(id, { voted: !idea.voted, votes: idea.votes + (idea.voted ? -1 : 1) });
        await logActivity(currentProject.id, user.id, "idea_voted", { title: idea.title });
      }
    }
  }, [guestMode, currentProject, ideas, user]);

  /* ── Settings ── */
  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    ls.set(GUEST_SETTINGS_KEY, newSettings);
  }, []);

  /* ── Stages CRUD ── */
  const saveStages = useCallback(async (newStages) => {
    setStages(newStages);
    setStagesModal(false);
    if (guestMode) guestSave(GUEST_STAGES_KEY, newStages);
    else if (currentProject) await upsertStages(newStages, user.id, currentProject.id);
  }, [guestMode, user, currentProject]);

  const removeStage = useCallback(async (stageId) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    if (!guestMode && currentProject) await deleteStage(stageId);
  }, [guestMode, currentProject]);

  /* ── Switch project ── */
  const handleSwitchProject = useCallback((p) => {
    setCurrentProject(p);
    setPage("roadmap");
  }, []);

  /* ── Loading gate ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <img src="/logo.png" alt="Frixa" style={{ height: 32, width: "auto", marginBottom: 8, opacity: .7 }} />
        <div style={{ width: 36, height: 36, border: "3px solid #E8EAED", borderTop: "3px solid #111218", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user && !guestMode) return <LoginScreen onGuestMode={enterGuestMode} />;
  if (user && !currentProject) return <ProjectHome user={user} onSelectProject={setCurrentProject} />;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Poppins',sans-serif" }}>
      {guestMode && (
        <div style={{ background: "#FEF9C3", borderBottom: "1px solid #FDE68A", padding: "8px 20px", fontSize: 12.5, color: "#78350F", fontWeight: 500 }}>
          <strong>Guest Mode</strong> — project features and activity logging are disabled.
          <button onClick={exitGuestMode} style={{ marginLeft: 10, border: "1px solid #FCD34D", borderRadius: 6, background: "transparent", color: "#78350F", fontWeight: 600, cursor: "pointer", padding: "3px 10px" }}>Sign in</button>
        </div>
      )}

      <Topbar
        page={page} setPage={setPage}
        user={user} guestMode={guestMode}
        currentProject={currentProject}
        onSelectProject={() => setCurrentProject(null)}
        onInvite={() => setCollaboratorsOpen(true)}
        onShowActivity={() => setActivityOpen(!activityOpen)}
        onNewTask={() => setTaskModal({ mode: "add", data: { status: stages[0]?.id ?? "planned" } })}
        onNewIdea={() => setIdeaModal({ mode: "add", data: {} })}
        onSettings={() => setSettingsOpen(true)}
        onSignOut={guestMode ? exitGuestMode : () => supabase.auth.signOut()}
      />

      <div style={{ animation: "fadeUp .35s cubic-bezier(.22,1,.36,1) both" }} key={page}>
        {page === "roadmap" && (
          <RoadmapPage
            tasks={tasks} stages={stages}
            showTimer={settings.showTimer}
            onEditTask={(t) => setTaskModal({ mode: "edit", data: t })}
            onAddTask={(status) => setTaskModal({ mode: "add", data: { status } })}
            onMoveTask={moveTask}
            onPatchTask={patchTask}
            onTimerDone={(label) => { setTimerDone(label); spawnConfetti(); }}
            onDuplicateTask={duplicateTask}
          />
        )}
        {page === "ideas" && (
          <IdeasPage
            ideas={ideas}
            onVote={voteIdea}
            onEdit={(x) => setIdeaModal({ mode: "edit", data: x })}
            onAdd={() => setIdeaModal({ mode: "add", data: {} })}
          />
        )}
        {page === "archive" && (
          <ArchivePage tasks={tasks} stages={stages} onRestore={restoreTask} onDelete={deleteTask} />
        )}
        {page === "projects" && !guestMode && (
          <ProjectsPage
            currentProject={currentProject}
            user={user}
            onSwitch={handleSwitchProject}
            onCreateProject={handleSwitchProject}
          />
        )}
      </div>

      {taskModal && <TaskModal mode={taskModal.mode} initial={taskModal.data} stages={stages} onSave={saveTask} onArchive={archiveTask} onClose={() => setTaskModal(null)} />}
      {ideaModal && <IdeaModal mode={ideaModal.mode} initial={ideaModal.data} onSave={saveIdea} onDelete={handleDeleteIdea} onClose={() => setIdeaModal(null)} />}
      {stagesModal && <StagesModal stages={stages} tasks={tasks} onSave={saveStages} onDelete={removeStage} onClose={() => setStagesModal(false)} />}
      {settingsOpen && (
        <SettingsModal
          settings={settings} stages={stages} tasks={tasks}
          onSave={saveSettings} onSaveStages={saveStages} onDeleteStage={removeStage}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {collaboratorsOpen && <CollaboratorsModal project={currentProject} user={user} onClose={() => setCollaboratorsOpen(false)} />}
      {activityOpen && <ActivityFeed project={currentProject} onClose={() => setActivityOpen(false)} />}
      {timerDone !== null && <TimerPopup label={timerDone} onClose={() => setTimerDone(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}
