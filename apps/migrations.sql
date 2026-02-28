-- ── Projects ──────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ── Project Members ────────────────────────────────────────────────────────────
CREATE TABLE project_members (
  project_id UUID REFERENCES projects ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'member', 'viewer'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- ── Activity Log ──────────────────────────────────────────────────────────────
CREATE TABLE activity_log (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'task_created', 'idea_voted'
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ── Update Existing Tables ──────────────────────────────────────────────────
ALTER TABLE stages ADD COLUMN project_id UUID REFERENCES projects ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects ON DELETE CASCADE;
ALTER TABLE ideas ADD COLUMN project_id UUID REFERENCES projects ON DELETE CASCADE;

-- ── RLS Policies ─────────────────────────────────────────────────────────────

-- Function to check if a user is a member of a project
CREATE OR REPLACE FUNCTION is_project_member(p_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = p_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Projects: owners and members can see/manage
CREATE POLICY "Members can view projects" ON projects
  FOR SELECT USING (is_project_member(id));

CREATE POLICY "Owners can manage projects" ON projects
  FOR ALL USING (auth.uid() = owner_id);

-- Project Members: members can see colleagues
CREATE POLICY "Members can view project members" ON project_members
  FOR SELECT USING (is_project_member(project_id));

CREATE POLICY "Owners can manage members" ON project_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND owner_id = auth.uid())
  );

-- Activity Log: members can view
CREATE POLICY "Members can view logs" ON activity_log
  FOR SELECT USING (is_project_member(project_id));

-- Tasks/Ideas/Stages: scope to project membership
DROP POLICY IF EXISTS "Users manage own tasks" ON tasks;
CREATE POLICY "Members manage tasks" ON tasks
  FOR ALL USING (is_project_member(project_id));

DROP POLICY IF EXISTS "Users manage own ideas" ON ideas;
CREATE POLICY "Members manage ideas" ON ideas
  FOR ALL USING (is_project_member(project_id));

DROP POLICY IF EXISTS "Users manage own stages" ON stages;
CREATE POLICY "Members manage stages" ON stages
  FOR ALL USING (is_project_member(project_id));

-- ── Utility: Automatically add owner as member ──
CREATE OR REPLACE FUNCTION handle_new_project() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_new_project();
