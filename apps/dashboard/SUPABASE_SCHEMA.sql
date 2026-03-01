-- ══════════════════════════════════════════════════════════════════════════════
-- FRIXA — Complete Supabase Schema
-- ⚠️  Paste the ENTIRE file into Supabase SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. Projects ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  owner_id    UUID        REFERENCES auth.users ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ── 2. Project Members ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        REFERENCES projects ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'member',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- ── 3. Stages ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stages (
  id          TEXT        NOT NULL,
  label       TEXT        NOT NULL,
  dot         TEXT        NOT NULL DEFAULT '#6B7280',
  sort_order  INT         NOT NULL DEFAULT 0,
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  project_id  UUID        REFERENCES projects   ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, project_id)
);
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

-- ── 4. Tasks ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id              BIGSERIAL   PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users ON DELETE CASCADE,
  project_id      UUID        REFERENCES projects   ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  description     TEXT        DEFAULT '',
  status          TEXT        DEFAULT 'planned',
  priority        TEXT        DEFAULT '',
  tags            TEXT[]      DEFAULT '{}',
  deadline_date   DATE,
  deadline_time   TIME,
  archived        BOOLEAN     DEFAULT FALSE,
  sort_order      INT         DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ── 5. Ideas ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ideas (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  project_id  UUID        REFERENCES projects   ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT        DEFAULT '',
  category    TEXT        DEFAULT 'other',
  votes       INT         DEFAULT 0,
  voted       BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- ── 6. Activity Log ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          BIGSERIAL   PRIMARY KEY,
  project_id  UUID        REFERENCES projects   ON DELETE CASCADE,
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  action      TEXT        NOT NULL,
  details     JSONB       DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ── 7. Profiles ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════════════════════
-- SECURITY DEFINER HELPER FUNCTIONS
-- These run as the DB superuser so they bypass RLS — no recursion possible.
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Returns true if the calling user is a member (or owner) of the given project.
-- SECURITY DEFINER bypasses RLS on project_members, breaking the recursion loop.
CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_id AND user_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_project_owner(p_id UUID)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.projects WHERE id = p_id AND owner_id = auth.uid()
  );
END;
$$;

-- RPC: returns all projects for the current user (owned + member of).
-- SECURITY DEFINER = no RLS applied, so no recursion and no permission errors.
CREATE OR REPLACE FUNCTION public.get_my_projects()
RETURNS TABLE (
  id          UUID,
  name        TEXT,
  owner_id    UUID,
  created_at  TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT p.id, p.name, p.owner_id, p.created_at
    FROM public.projects p
    WHERE
      p.owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.project_members pm
        WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
      )
    ORDER BY p.created_at;
END;
$$;

-- RPC: ensure owner row exists in project_members (idempotent back-fill)
CREATE OR REPLACE FUNCTION public.ensure_owner_member(p_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (p_id, auth.uid(), 'owner')
  ON CONFLICT (project_id, user_id) DO NOTHING;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ══════════════════════════════════════════════════════════════════════════════

-- ── projects ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Owner manages project"    ON projects;
DROP POLICY IF EXISTS "Owner can insert project" ON projects;
DROP POLICY IF EXISTS "Members can view project" ON projects;

-- Anyone can insert a project they own
CREATE POLICY "Owner can insert project" ON projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owner can update/delete their project
CREATE POLICY "Owner manages project" ON projects
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Members AND owners can read a project
CREATE POLICY "Members can view project" ON projects
  FOR SELECT USING (
    auth.uid() = owner_id
    OR public.is_project_member(id)
    OR public.is_admin()
  );

-- ── project_members ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Owner manages members"      ON project_members;
DROP POLICY IF EXISTS "Users can read own membership" ON project_members;
DROP POLICY IF EXISTS "Members can see co-members" ON project_members;

-- Every user can ALWAYS read their own membership rows (needed for fetchProjects)
CREATE POLICY "Users can read own membership" ON project_members
  FOR SELECT USING (auth.uid() = user_id);

-- Members can see other members in their project
CREATE POLICY "Members can see co-members" ON project_members
  FOR SELECT USING (public.is_project_member(project_id) OR public.is_admin());

-- Only the project owner can insert/update/delete members
CREATE POLICY "Owner manages members" ON project_members
  FOR ALL USING (public.is_project_owner(project_id))
  WITH CHECK (public.is_project_owner(project_id));

-- ── stages ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage stages" ON stages;
CREATE POLICY "Members manage stages" ON stages
  USING  (public.is_project_member(project_id) OR public.is_admin())
  WITH CHECK (public.is_project_member(project_id) OR public.is_admin());

-- ── tasks ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage tasks" ON tasks;
CREATE POLICY "Members manage tasks" ON tasks
  USING  (public.is_project_member(project_id) OR public.is_admin())
  WITH CHECK (public.is_project_member(project_id) OR public.is_admin());

-- ── ideas ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage ideas" ON ideas;
CREATE POLICY "Members manage ideas" ON ideas
  USING  (public.is_project_member(project_id) OR public.is_admin())
  WITH CHECK (public.is_project_member(project_id) OR public.is_admin());

-- ── activity_log ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members view activity" ON activity_log;
CREATE POLICY "Members view activity" ON activity_log
  FOR SELECT USING (public.is_project_member(project_id) OR public.is_admin());

DROP POLICY IF EXISTS "Members log activity" ON activity_log;
CREATE POLICY "Members log activity" ON activity_log
  FOR INSERT WITH CHECK (public.is_project_member(project_id) OR public.is_admin());

-- ── profiles ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"         ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"       ON public.profiles;
DROP POLICY IF EXISTS "Members can view co-member profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Members can view co-member profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm1
      JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
      WHERE pm1.user_id = auth.uid() AND pm2.user_id = public.profiles.id
    )
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIGGERS — auto-create profile on signup
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'Pramodmore672@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Back-fill profiles for any existing users
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'admin' WHERE email = 'Pramodmore672@gmail.com';

-- Back-fill project_members owner rows for any existing projects
INSERT INTO public.project_members (project_id, user_id, role)
SELECT p.id, p.owner_id, 'owner'
FROM public.projects p
WHERE NOT EXISTS (
  SELECT 1 FROM public.project_members pm
  WHERE pm.project_id = p.id AND pm.user_id = p.owner_id
)
ON CONFLICT (project_id, user_id) DO NOTHING;
