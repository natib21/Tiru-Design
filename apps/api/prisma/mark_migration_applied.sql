INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES (
  gen_random_uuid()::text,
  'dummy_checksum',
  NOW(),
  '20261020071000_drop_duplicate_user_indexes',
  NULL,
  NULL,
  NOW(),
  1
);
