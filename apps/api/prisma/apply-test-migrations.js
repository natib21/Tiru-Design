const { execSync } = require('child_process');

process.env.DATABASE_URL = 'postgresql://tirudesign:tirudesign_dev_password@localhost:5432/tirudesign_test';

try {
  console.log('Applying migrations to test database...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Migrations applied successfully!');
} catch (error) {
  console.error('Failed to apply migrations:', error.message);
  process.exit(1);
}
