-- Enforce at most one PERSONAL workspace per user using a CHECK constraint approach
-- We create a function and trigger to validate this rule

-- First, verify there are no violations before creating the constraint
DO $$
DECLARE
  violation_count INT;
BEGIN
  -- Count users with multiple PERSONAL workspaces
  SELECT COUNT(*) INTO violation_count
  FROM (
    SELECT m."userId", COUNT(*) as workspace_count
    FROM "Membership" m
    INNER JOIN "Workspace" w ON w.id = m."workspaceId"
    WHERE w.type = 'PERSONAL'
      AND m.role = 'OWNER'
      AND m.status = 'ACTIVE'
    GROUP BY m."userId"
    HAVING COUNT(*) > 1
  ) violations;

  IF violation_count > 0 THEN
    RAISE EXCEPTION 'Cannot create unique constraint: % users have multiple PERSONAL workspaces', violation_count;
  END IF;
END $$;

-- Create a function to check the constraint
CREATE OR REPLACE FUNCTION check_single_personal_workspace()
RETURNS TRIGGER AS $$
DECLARE
  workspace_type TEXT;
  existing_count INT;
BEGIN
  -- Only check if this is an OWNER membership that's ACTIVE
  IF NEW.role = 'OWNER' AND NEW.status = 'ACTIVE' THEN
    -- Get the workspace type
    SELECT type INTO workspace_type
    FROM "Workspace"
    WHERE id = NEW."workspaceId";

    -- If it's a PERSONAL workspace, check if user already has one
    IF workspace_type = 'PERSONAL' THEN
      SELECT COUNT(*) INTO existing_count
      FROM "Membership" m
      INNER JOIN "Workspace" w ON w.id = m."workspaceId"
      WHERE m."userId" = NEW."userId"
        AND w.type = 'PERSONAL'
        AND m.role = 'OWNER'
        AND m.status = 'ACTIVE'
        AND m.id != NEW.id;  -- Exclude the current membership being inserted/updated

      IF existing_count > 0 THEN
        RAISE EXCEPTION 'User already has a PERSONAL workspace';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
CREATE TRIGGER enforce_single_personal_workspace_insert
BEFORE INSERT ON "Membership"
FOR EACH ROW
EXECUTE FUNCTION check_single_personal_workspace();

-- Create trigger for UPDATE
CREATE TRIGGER enforce_single_personal_workspace_update
BEFORE UPDATE ON "Membership"
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role 
  OR OLD.status IS DISTINCT FROM NEW.status
  OR OLD."workspaceId" IS DISTINCT FROM NEW."workspaceId")
EXECUTE FUNCTION check_single_personal_workspace();
