SELECT indexname FROM pg_indexes 
WHERE tablename = 'Session' AND schemaname = 'public'
ORDER BY indexname;
