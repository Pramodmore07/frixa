-- ══════════════════════════════════════════════════════════════════════════════
-- FRIXA — Notes Table Migration
-- ⚠️  Paste this into Supabase SQL Editor → New Query → Run
-- Requires the base schema (SUPABASE_SCHEMA.sql) to already be applied.
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Notes ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  project_id  UUID        REFERENCES projects   ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT        DEFAULT '',
  color       TEXT        DEFAULT 'yellow',
  pinned      BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- All project members can read, create, update, and delete notes
DROP POLICY IF EXISTS "Members manage notes" ON notes;
CREATE POLICY "Members manage notes" ON notes
  USING  (public.is_project_member(project_id) OR public.is_admin())
  WITH CHECK (public.is_project_member(project_id) OR public.is_admin());

-- Enable realtime for the notes table (run once)
-- If you get an error saying it already exists, that's fine — skip it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notes;
  END IF;
END $$;
