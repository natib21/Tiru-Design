import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { setupApp } from '../../common/app-setup';

describe('Identity E2E Tests', () => {
  let app: INestApplication;
  let httpServer: any;
  let prisma: PrismaService;

  // Helper to create unique user and login, asserting success
  async function createUserAndLogin() {
    const email = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    const phoneNumber = `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;
    const password = 'SecurePassword123!';

    // Register
    const registerResponse = await request(httpServer)
      .post('/api/auth/register')
      .send({ email, phoneNumber, password });

    if (registerResponse.status !== HttpStatus.CREATED) {
      throw new Error(`Register failed: ${registerResponse.status} - ${JSON.stringify(registerResponse.body)}`);
    }

    // Login
    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({ identifier: email, password });

    if (loginResponse.status !== HttpStatus.OK) {
      throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginResponse.body)}`);
    }

    if (!loginResponse.body.accessToken || typeof loginResponse.body.accessToken !== 'string') {
      throw new Error(`Login succeeded but accessToken is missing or invalid: ${JSON.stringify(loginResponse.body)}`);
    }

    if (!loginResponse.body.refreshToken || typeof loginResponse.body.refreshToken !== 'string') {
      throw new Error(`Login succeeded but refreshToken is missing or invalid: ${JSON.stringify(loginResponse.body)}`);
    }

    return {
      email,
      password,
      userId: loginResponse.body.user.id,
      accessToken: loginResponse.body.accessToken,
      refreshToken: loginResponse.body.refreshToken
    };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Use shared app setup
    setupApp(app);
    
    await app.init();
    httpServer = app.getHttpServer();

    prisma = app.get<PrismaService>(PrismaService);
  }, 30000); // 30 second timeout for setup

  beforeEach(async () => {
    // Clear Redis test database (database 1) before each test to reset rate limits
    const Redis = (await import('ioredis')).default;
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379/1');
    await redis.flushdb(); // FLUSHDB only clears current database, not all databases
    await redis.quit();
  });

  afterAll(async () => {
    await app.close();
  }, 30000); // 30 second timeout for teardown

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'SecurePassword123!';

      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          phoneNumber: '+251911234567',
          password: testPassword
        });
      
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.status).toBe('UNVERIFIED');
      expect(response.body.user.emailVerified).toBe(false);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: response.body.user.id } });
      } catch {
        // User may already be deleted
      }
    });

    it('should reject duplicate email', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'SecurePassword123!';

      // Register first user
      const response1 = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          phoneNumber: '+251911234568',
          password: testPassword
        });

      // Try to register duplicate
      const response2 = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          phoneNumber: '+251911234569',
          password: testPassword
        });

      expect(response2.status).toBe(HttpStatus.CONFLICT);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: response1.body.user.id } });
      } catch {
        // User may already be deleted
      }
    });

    it('should treat email as case-insensitive', async () => {
      const testPassword = 'SecurePassword123!';

      // Register with uppercase email
      const response1 = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: 'A@x.com',
          phoneNumber: '+251911234599',
          password: testPassword
        });

      expect(response1.status).toBe(HttpStatus.CREATED);
      expect(response1.body.user.email).toBe('a@x.com'); // Stored normalized

      // Try to register with lowercase - should fail as duplicate
      const response2 = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: 'a@x.com',
          phoneNumber: '+251911234598',
          password: testPassword
        });

      expect(response2.status).toBe(HttpStatus.CONFLICT);

      // Login with uppercase should work
      const loginResponse1 = await request(httpServer)
        .post('/api/auth/login')
        .send({
          identifier: 'A@x.com',
          password: testPassword
        });

      expect(loginResponse1.status).toBe(HttpStatus.OK);
      expect(loginResponse1.body.user.email).toBe('a@x.com');

      // Login with lowercase should also work
      const loginResponse2 = await request(httpServer)
        .post('/api/auth/login')
        .send({
          identifier: 'a@x.com',
          password: testPassword
        });

      expect(loginResponse2.status).toBe(HttpStatus.OK);
      expect(loginResponse2.body.user.email).toBe('a@x.com');

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: response1.body.user.id } });
      } catch {
        // User may already be deleted
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with email and password', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'SecurePassword123!';

      // Register user first
      await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          phoneNumber: '+251911234570',
          password: testPassword
        });

      // Login
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          identifier: testEmail,
          password: testPassword
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { email: testEmail } });
      } catch {
        // User may already be deleted
      }
    });

    it('should reject invalid credentials', async () => {
      const testEmail = `test-${Date.now()}@example.com`;

      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          identifier: testEmail,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should rate limit login attempts', async () => {
      const identifier = 'ratelimit@example.com';
      const password = 'WrongPassword123!';

      // Make 5 failed login attempts (the limit is 5 per 15 minutes)
      for (let i = 0; i < 5; i++) {
        await request(httpServer)
          .post('/api/auth/login')
          .send({ identifier, password });
      }

      // 6th attempt should be rate limited
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({ identifier, password });

      expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(response.body.error).toBe('INTERNAL_SERVER_ERROR');
      expect(response.body.message).toMatch(/Rate limit exceeded/);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'SecurePassword123!';

      // Register and login
      await request(httpServer)
        .post('/api/auth/register')
        .send({ email: testEmail, phoneNumber: '+251911234571', password: testPassword });

      const loginResponse = await request(httpServer)
        .post('/api/auth/login')
        .send({ identifier: testEmail, password: testPassword });

      // Get current user
      const response = await request(httpServer)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.email).toBe(testEmail);
      expect(response.body.id).toBeDefined();

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { email: testEmail } });
      } catch {
        // User may already be deleted
      }
    });

    it('should return 401 without token', async () => {
      const response = await request(httpServer)
        .get('/api/auth/me');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token and rotate refresh token', async () => {
      const { refreshToken: oldRefreshToken, userId } = await createUserAndLogin();

      // Refresh
      const response = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.refreshToken).not.toBe(oldRefreshToken);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted
      }
    });

    it('should allow new access token to work on protected routes after refresh', async () => {
      const { refreshToken, userId } = await createUserAndLogin();

      // Refresh to get new access token
      const refreshResponse = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken });
      
      const newAccessToken = refreshResponse.body.accessToken;

      // Test /auth/me with new access token
      const meResponse = await request(httpServer)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`);
      
      expect(meResponse.status).toBe(HttpStatus.OK);

      // Test /auth/logout with new access token
      const logoutResponse = await request(httpServer)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${newAccessToken}`);
      
      expect(logoutResponse.status).toBe(HttpStatus.NO_CONTENT);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted
      }
    });

    it('should reject old refresh token after rotation', async () => {
      const { refreshToken: oldRefreshToken, userId } = await createUserAndLogin();

      // Use refresh once
      await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      // Try to use old refresh token again
      const response2 = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(response2.status).toBe(HttpStatus.UNAUTHORIZED);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted
      }
    });

    it('should detect refresh token reuse and revoke session', async () => {
      const { refreshToken: initialRefreshToken, userId } = await createUserAndLogin();

      // First refresh - rotate token
      const refresh1 = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: initialRefreshToken });
      
      expect(refresh1.status).toBe(HttpStatus.OK);

      // Attempt to reuse old token - should fail and revoke session
      const reuseAttempt = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: initialRefreshToken });
      
      expect(reuseAttempt.status).toBe(HttpStatus.UNAUTHORIZED);

      // New token should also be invalid (session revoked)
      const newTokenAttempt = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken: refresh1.body.refreshToken });
      
      expect(newTokenAttempt.status).toBe(HttpStatus.UNAUTHORIZED);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted
      }
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should revoke session and reject refresh token', async () => {
      const { accessToken, refreshToken, userId } = await createUserAndLogin();

      // Logout
      const logoutResponse = await request(httpServer)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(logoutResponse.status).toBe(HttpStatus.NO_CONTENT);

      // Try to use refresh token after logout
      const refreshResponse = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(refreshResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      // Cleanup
      try {
        await prisma.client.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted
      }
    });
  });

  describe('GET /health', () => {
    it('should work without authentication', async () => {
      const response = await request(httpServer)
        .get('/health');

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('Google OAuth', () => {
    it('should return 404 when GOOGLE_OAUTH_ENABLED is false', async () => {
      const getResponse = await request(httpServer)
        .get('/api/auth/google');

      const callbackResponse = await request(httpServer)
        .get('/api/auth/google/callback');

      expect(getResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(callbackResponse.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should create personal workspace when new user logs in with Google (service test)', async () => {
      // This is a service-level test since we can't easily mock Google OAuth in e2e tests
      const AuthenticationService = (await import('../../modules/identity/services/authentication.service')).AuthenticationService;
      const authService = app.get(AuthenticationService);
      const client = prisma.client;
      if (!client) throw new Error('Database client not available');

      const testGoogleId = `google-test-${Date.now()}`;
      const testEmail = `google-${Date.now()}@example.com`;

      // Temporarily enable Google OAuth
      const originalValue = process.env.GOOGLE_OAUTH_ENABLED;
      process.env.GOOGLE_OAUTH_ENABLED = 'true';

      try {
        const result = await authService.loginWithGoogle({
          googleId: testGoogleId,
          email: testEmail,
          firstName: 'Test',
          lastName: 'User',
          picture: null
        });

        expect(result.user).toBeDefined();
        expect(result.accessToken).toBeDefined();

        // Verify personal workspace was created
        const membership = await client.membership.findFirst({
          where: { userId: result.user.id },
          include: { workspace: true }
        });

        expect(membership).toBeDefined();
        expect(membership!.workspace.type).toBe('PERSONAL');
        expect(membership!.role).toBe('OWNER');
        expect(membership!.status).toBe('ACTIVE');

        // Cleanup
        try {
          await client.user.delete({ where: { id: result.user.id } });
        } catch {}
      } finally {
        process.env.GOOGLE_OAUTH_ENABLED = originalValue;
      }
    });

    it('should rollback user creation when workspace creation fails in Google login transaction', async () => {
      // This test verifies that if the workspace/membership creation fails,
      // the user creation is also rolled back
      const AuthenticationService = (await import('../../modules/identity/services/authentication.service')).AuthenticationService;
      const authService = app.get(AuthenticationService);
      const client = prisma.client;
      if (!client) throw new Error('Database client not available');

      // First, create a user with a personal workspace
      const firstEmail = `google-rollback-first-${Date.now()}@example.com`;
      const firstGoogleId = `google-rollback-first-${Date.now()}`;

      const originalValue = process.env.GOOGLE_OAUTH_ENABLED;
      process.env.GOOGLE_OAUTH_ENABLED = 'true';

      try {
        // Create first user successfully
        const firstResult = await authService.loginWithGoogle({
          googleId: firstGoogleId,
          email: firstEmail,
          firstName: 'First',
          lastName: 'User',
          picture: null
        });

        const firstUserId = firstResult.user.id;

        // Now attempt a scenario that would cause rollback
        // We'll manually trigger the constraint by trying to create a duplicate personal workspace
        const testEmail = `google-rollback-${Date.now()}@example.com`;
        
        // Manually create user and then try to violate the constraint
        await expect(
          client.$transaction(async (tx: typeof client) => {
            const newUser = await tx.user.create({
              data: {
                email: testEmail,
                passwordHash: 'dummy',
                emailVerifiedAt: new Date(),
                status: 'ACTIVE'
              }
            });

            // Create a workspace
            const workspace = await tx.workspace.create({
              data: {
                type: 'PERSONAL',
                name: 'Test Workspace'
              }
            });

            // Try to create membership for the first user (who already has personal workspace)
            // This should trigger the constraint and rollback everything
            await tx.membership.create({
              data: {
                userId: firstUserId,
                workspaceId: workspace.id,
                role: 'OWNER',
                status: 'ACTIVE'
              }
            });
          })
        ).rejects.toThrow(/User already has a PERSONAL workspace/);

        // Verify the user was NOT created (rollback worked)
        const userExists = await client.user.findUnique({
          where: { email: testEmail }
        });
        expect(userExists).toBeNull();

        // Cleanup first user
        try {
          await client.user.delete({ where: { id: firstUserId } });
        } catch {}
      } finally {
        process.env.GOOGLE_OAUTH_ENABLED = originalValue;
      }
    });
  });
});
