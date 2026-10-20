import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Force use of test database
if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}
// Override with test database URL
process.env.DATABASE_URL = 'postgresql://tirudesign:tirudesign_dev_password@localhost:5432/tirudesign_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-long-for-testing';
process.env.GOOGLE_OAUTH_ENABLED = 'false';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Safety guard: ensure we're using the test database
  const databaseUrl = process.env.DATABASE_URL || '';
  if (!databaseUrl.includes('test')) {
    throw new Error(
      'SAFETY VIOLATION: DATABASE_URL must contain "test". ' +
      'Tests must never touch the development database. ' +
      `Current DATABASE_URL: ${databaseUrl}`
    );
  }

  console.log('Safety check passed: Using test database');
  
  // Clean up test database before running tests
  console.log('Cleaning test database...');
  
  try {
    // Delete in correct order to respect foreign key constraints
    await prisma.securityEvent.deleteMany({});
    await prisma.passwordResetToken.deleteMany({});
    await prisma.emailVerification.deleteMany({});
    await prisma.phoneVerification.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.userIdentity.deleteMany({});
    await prisma.membership.deleteMany({});
    await prisma.workspace.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('Test database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning test database:', error);
    throw error;
  }
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});
