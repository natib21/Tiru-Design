-- Drop duplicate indexes on User (email and phoneNumber already have unique constraints)
DROP INDEX IF EXISTS "User_email_idx";
DROP INDEX IF EXISTS "User_phoneNumber_idx";
