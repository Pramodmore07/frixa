-- ══════════════════════════════════════════════════════════════════════════════
-- FRIXA — COMPLETE FIX SQL
-- Run this ENTIRE block in Supabase → SQL Editor → New Query → Run
-- This replaces all previous partial fixes.
-- ══════════════════════════════════════════════════════════════════════════════

-- ── STEP 1: Recreate helper functions with SECURITY DEFINER + search_path ──────
-- This prevents RLS recursion entirely.

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
    SELECT 1 FROM public.projects
    WHERE id = p_id AND owner_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Optional RPC (not required by app, but useful)
CREATE OR REPLACE FUNCTION public.get_my_projects()
RETURNS TABLE (id UUID, name TEXT, owner_id UUID, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT p.id, p.name, p.owner_id, p.created_at
    FROM public.projects p
    WHERE p.owner_id = auth.uid()
       OR EXISTS (
         SELECT 1 FROM public.project_members pm
         WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
       )
    ORDER BY p.created_at;
END;
$$;

-- ── STEP 2: Fix projects RLS ───────────────────────────────────────────────────
-- The bug: "Owner manages project" uses FOR ALL which blocks member SELECTs.
-- Fix: separate INSERT/UPDATE/DELETE from SELECT.

DROP POLICY IF EXISTS "Owner manages project"    ON public.projects;
DROP POLICY IF EXISTS "Owner can insert project" ON public.projects;
DROP POLICY IF EXISTS "Members can view project" ON public.projects;

-- Members AND owners can SELECT
CREATE POLICY "Members can view project" ON public.projects
  FOR SELECT USING (
    auth.uid() = owner_id
    OR public.is_project_member(id)
  );

-- Only owner can INSERT
CREATE POLICY "Owner can insert project" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only owner can UPDATE
CREATE POLICY "Owner can update project" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Only owner can DELETE
CREATE POLICY "Owner can delete project" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- ── STEP 3: Fix project_members RLS ───────────────────────────────────────────
DROP POLICY IF EXISTS "Owner manages members"         ON public.project_members;
DROP POLICY IF EXISTS "Users can read own membership" ON public.project_members;
DROP POLICY IF EXISTS "Members can see co-members"    ON public.project_members;

-- CRITICAL: every user can always read rows where user_id = their own id
-- This is what lets fetchProjects work for both owners and members
CREATE POLICY "Users can read own membership" ON public.project_members
  FOR SELECT USING (auth.uid() = user_id);

-- Members can see who else is in their project
CREATE POLICY "Members can see co-members" ON public.project_members
  FOR SELECT USING (public.is_project_member(project_id));

-- Only owner can add/remove members
CREATE POLICY "Owner manages members" ON public.project_members
  FOR INSERT WITH CHECK (public.is_project_owner(project_id));

CREATE POLICY "Owner removes members" ON public.project_members
  FOR DELETE USING (public.is_project_owner(project_id));

-- ── STEP 4: Fix tasks RLS ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage tasks" ON public.tasks;

CREATE POLICY "Members manage tasks" ON public.tasks
  USING  (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

-- ── STEP 5: Fix ideas RLS ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage ideas" ON public.ideas;

CREATE POLICY "Members manage ideas" ON public.ideas
  USING  (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

-- ── STEP 6: Fix stages RLS ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members manage stages" ON public.stages;

CREATE POLICY "Members manage stages" ON public.stages
  USING  (public.is_project_member(project_id))
  WITH CHECK (public.is_project_member(project_id));

-- ── STEP 7: Fix activity_log RLS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Members view activity" ON public.activity_log;
DROP POLICY IF EXISTS "Members log activity"  ON public.activity_log;

CREATE POLICY "Members view activity" ON public.activity_log
  FOR SELECT USING (public.is_project_member(project_id));

CREATE POLICY "Members log activity" ON public.activity_log
  FOR INSERT WITH CHECK (public.is_project_member(project_id));

-- ── STEP 8: Fix profiles RLS ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"        ON public.profiles;
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

-- ── STEP 9: DATA FIXES ────────────────────────────────────────────────────────

-- Back-fill: ensure all project owners have a row in project_members
INSERT INTO public.project_members (project_id, user_id, role)
SELECT p.id, p.owner_id, 'owner'
FROM public.projects p
WHERE p.owner_id IS NOT NULL
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Back-fill: ensure all auth users have a profile row
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Set admin role
UPDATE public.profiles SET role = 'admin' WHERE email = 'Pramodmore672@gmail.com';

-- ── DONE ──────────────────────────────────────────────────────────────────────
-- Verify: run these selects to confirm data exists
-- SELECT count(*) FROM project_members;   -- should show rows
-- SELECT count(*) FROM projects;          -- should show all your projects
-- SELECT * FROM get_my_projects();        -- should return projects for current user
