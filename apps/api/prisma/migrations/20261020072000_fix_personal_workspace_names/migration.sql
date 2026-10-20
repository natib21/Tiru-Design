-- Fix personal workspace names to use email prefix instead of full email
-- Uses User.name if set, otherwise the part of email before "@"
-- Never uses the full email

DO $$
DECLARE
  workspace_record RECORD;
  owner_user_record RECORD;
  new_name TEXT;
BEGIN
  -- Loop through all PERSONAL workspaces
  FOR workspace_record IN 
    SELECT w.id, w.name
    FROM "Workspace" w
    WHERE w.type = 'PERSONAL'
  LOOP
    -- Find the OWNER of this workspace
    SELECT u.id, u.email, u.name INTO owner_user_record
    FROM "User" u
    INNER JOIN "Membership" m ON m."userId" = u.id
    WHERE m."workspaceId" = workspace_record.id
      AND m.role = 'OWNER'
    LIMIT 1;

    -- If we found the owner, update the workspace name
    IF FOUND THEN
      IF owner_user_record.name IS NOT NULL AND owner_user_record.name != '' THEN
        -- Use User.name if set
        new_name := owner_user_record.name || '''s Workspace';
      ELSE
        -- Use email prefix (part before @)
        new_name := SPLIT_PART(owner_user_record.email, '@', 1) || '''s Workspace';
      END IF;

      -- Update the workspace name
      UPDATE "Workspace"
      SET name = new_name, "updatedAt" = NOW()
      WHERE id = workspace_record.id;
    END IF;
  END LOOP;
END $$;
