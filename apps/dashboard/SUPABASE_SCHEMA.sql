-- ══════════════════════════════════════════════════════════════════════════════
-- FRIXA — Complete Supabase Schema (Final Recursion Fix)
-- Paste this entire file into SQL Editor → New Query → Run
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

-- ── 7. Profiles (RBAC) ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ── 8. Security Definer (Bypass Recursion) ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_project_owner(p_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ══════════════════════════════════════════════════════════════════════════════
-- RLS POLICIES (All policies use DROP IF EXISTS for safety)
-- ══════════════════════════════════════════════════════════════════════════════

-- projects
DROP POLICY IF EXISTS "Owner manages project" ON projects;
CREATE POLICY "Owner manages project" ON projects
  USING  (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owner can insert project" ON projects;
CREATE POLICY "Owner can insert project" ON projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Members can view project" ON projects;
CREATE POLICY "Members can view project" ON projects
  FOR SELECT USING (
    auth.uid() = owner_id
    OR public.is_project_member(id)
    OR public.is_admin()
  );

-- project_members
DROP POLICY IF EXISTS "Owner manages members" ON project_members;
CREATE POLICY "Owner manages members" ON project_members
  USING (public.is_project_owner(project_id))
  WITH CHECK (public.is_project_owner(project_id));

DROP POLICY IF EXISTS "Members can see co-members" ON project_members;
CREATE POLICY "Members can see co-members" ON project_members
  FOR SELECT USING (
    public.is_project_member(project_id)
    OR public.is_admin()
  );

-- stages
DROP POLICY IF EXISTS "Members manage stages" ON stages;
CREATE POLICY "Members manage stages" ON stages
  USING (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  );

-- tasks
DROP POLICY IF EXISTS "Members manage tasks" ON tasks;
CREATE POLICY "Members manage tasks" ON tasks
  USING (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  );

-- ideas
DROP POLICY IF EXISTS "Members manage ideas" ON ideas;
CREATE POLICY "Members manage ideas" ON ideas
  USING (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_project_member(project_id)
    OR public.is_admin()
  );

-- activity_log
DROP POLICY IF EXISTS "Members view activity" ON activity_log;
CREATE POLICY "Members view activity" ON activity_log
  FOR SELECT USING (
    public.is_project_owner(project_id)
    OR public.is_project_member(project_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Members log activity" ON activity_log;
CREATE POLICY "Members log activity" ON activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- Allow project members to read co-member profiles (needed for collaborator email display)
DROP POLICY IF EXISTS "Members can view co-member profiles" ON public.profiles;
CREATE POLICY "Members can view co-member profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm1
      JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
      WHERE pm1.user_id = auth.uid() AND pm2.user_id = public.profiles.id
    )
  );

-- ── 9. Triggers & Functions ─────────────────────────────────────────────────

-- Automatically create profile and assign roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE 
      WHEN NEW.email = 'Pramodmore672@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper for existing users: Run this manually if you already have users
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'admin' WHERE email = 'Pramodmore672@gmail.com';
