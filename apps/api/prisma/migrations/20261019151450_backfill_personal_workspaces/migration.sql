-- Backfill personal workspaces for existing users
DO $$
DECLARE
  user_record RECORD;
  new_workspace_id TEXT;
BEGIN
  -- Loop through all users who don't have any memberships
  FOR user_record IN 
    SELECT u.id, u.email
    FROM "User" u
    LEFT JOIN "Membership" m ON m."userId" = u.id
    WHERE m.id IS NULL
  LOOP
    -- Create a personal workspace for this user
    INSERT INTO "Workspace" (id, type, name, plan, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid()::text,
      'PERSONAL',
      user_record.email || '''s Workspace',
      'free',
      NOW(),
      NOW()
    )
    RETURNING id INTO new_workspace_id;

    -- Create OWNER membership
    INSERT INTO "Membership" (id, "userId", "workspaceId", role, status, "createdAt")
    VALUES (
      gen_random_uuid()::text,
      user_record.id,
      new_workspace_id,
      'OWNER',
      'ACTIVE',
      NOW()
    );
  END LOOP;
END $$;
