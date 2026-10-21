import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { setupApp } from '../../common/app-setup';
import { createBlankContent } from './schemas/content.schema';

describe('Projects E2E Tests', () => {
  let app: INestApplication;
  let httpServer: any;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    httpServer = app.getHttpServer();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  // Helper to create user and login
  async function createUserAndLogin() {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const email = `test-${timestamp}-${randomSuffix}@example.com`;
    const phoneNumber = `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;

    const registerResponse = await request(httpServer)
      .post('/api/auth/register')
      .send({ email, phoneNumber, password: 'Test1234!' });

    if (registerResponse.status !== HttpStatus.CREATED) {
      throw new Error(`Register failed: ${registerResponse.status} - ${JSON.stringify(registerResponse.body)}`);
    }

    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({ identifier: email, password: 'Test1234!' });

    if (loginResponse.status !== HttpStatus.OK) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    return {
      userId: registerResponse.body.user.id,
      accessToken: loginResponse.body.accessToken,
      email,
    };
  }

  describe('POST /projects', () => {
    it('should create a blank project', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'My Project' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.name).toBe('My Project');
      expect(response.body.version).toBe(1);
      expect(response.body.content).toBeDefined();
      expect(response.body.content.pages).toHaveLength(1);
      expect(response.body.deletedAt).toBeNull();

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should create a project with custom content', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const customContent = {
        schemaVersion: 1,
        canvas: { width: 800, height: 600, background: '#f0f0f0' },
        pages: [
          {
            id: 'page-1',
            name: 'Custom Page',
            elements: [
              {
                id: 'text-1',
                type: 'text',
                position: { x: 10, y: 20 },
                size: { width: 100, height: 50 },
                content: 'Hello',
                style: { fill: '#000000', fontSize: 16 },
              },
            ],
          },
        ],
      };

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Custom Project', content: customContent });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.content.canvas.width).toBe(800);
      expect(response.body.content.pages[0].elements).toHaveLength(1);
      expect(response.body.content.pages[0].elements[0].content).toBe('Hello');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should reject invalid content', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const invalidContent = {
        schemaVersion: 1,
        canvas: { width: 800, height: 600 },
        pages: [
          {
            id: 'page-1',
            elements: [
              {
                id: 'invalid-1',
                type: 'unknown-type', // Invalid element type
                position: { x: 0, y: 0 },
                size: { width: 100, height: 100 },
              },
            ],
          },
        ],
      };

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Invalid Project', content: invalidContent });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('Invalid content');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should reject oversized content (>2MB)', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create content just over 2 MB (about 2.1 MB) to test Zod validation
      const largeElements = Array.from({ length: 6500 }, (_, i) => ({
        id: `text-${i}`,
        type: 'text',
        position: { x: i, y: i },
        size: { width: 100, height: 50 },
        content: 'A'.repeat(330), // ~330 bytes per element = ~2.15 MB total
        style: { fill: '#000000', fontSize: 16 },
      }));

      const oversizedContent = {
        schemaVersion: 1,
        canvas: { width: 1920, height: 1080 },
        pages: [
          {
            id: 'page-1',
            elements: largeElements,
          },
        ],
      };

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Oversized Project', content: oversizedContent });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('exceeds maximum allowed size');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should reject extremely large payload (>3MB) with 413', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create content above 3 MB to test Express body limit
      const largeElements = Array.from({ length: 12000 }, (_, i) => ({
        id: `text-${i}`,
        type: 'text',
        position: { x: i, y: i },
        size: { width: 100, height: 50 },
        content: 'A'.repeat(350),
        style: { fill: '#000000', fontSize: 16 },
      }));

      const extremelyOversizedContent = {
        schemaVersion: 1,
        canvas: { width: 1920, height: 1080 },
        pages: [
          {
            id: 'page-1',
            elements: largeElements,
          },
        ],
      };

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Extremely Large Project', content: extremelyOversizedContent });

      expect(response.status).toBe(HttpStatus.PAYLOAD_TOO_LARGE); // 413
      expect(response.body.message).toContain('too large');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should accept normal-size content (~500KB)', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create content around 500 KB to test normal autosave scenario
      const normalElements = Array.from({ length: 1500 }, (_, i) => ({
        id: `text-${i}`,
        type: 'text',
        position: { x: i % 100 * 10, y: Math.floor(i / 100) * 10 },
        size: { width: 100, height: 50 },
        content: 'Sample text content for design element',
        style: { fill: '#000000', fontSize: 14 },
      }));

      const normalContent = {
        schemaVersion: 1,
        canvas: { width: 1920, height: 1080 },
        pages: [
          {
            id: 'page-1',
            name: 'Normal Page',
            elements: normalElements,
          },
        ],
      };

      const response = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Normal Project', content: normalContent });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.name).toBe('Normal Project');
      expect(response.body.content.pages[0].elements).toHaveLength(1500);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });
  });

  describe('GET /projects', () => {
    it('should list projects in the workspace', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create two projects
      await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project 1' });

      await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project 2' });

      const response = await request(httpServer)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.hasMore).toBe(false);
      expect(response.body.nextCursor).toBeNull();

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should exclude soft-deleted projects from list', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create a project
      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project to Delete' });

      const projectId = createResponse.body.id;

      // Delete it
      await request(httpServer)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // List should be empty
      const listResponse = await request(httpServer)
        .get('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(listResponse.status).toBe(HttpStatus.OK);
      expect(listResponse.body.items).toHaveLength(0);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should support cursor-based pagination', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      // Create 3 projects
      for (let i = 1; i <= 3; i++) {
        await request(httpServer)
          .post('/api/projects')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: `Project ${i}` });
      }

      // Get first page (limit 2)
      const page1 = await request(httpServer)
        .get('/api/projects?limit=2')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(page1.status).toBe(HttpStatus.OK);
      expect(page1.body.items).toHaveLength(2);
      expect(page1.body.hasMore).toBe(true);
      expect(page1.body.nextCursor).toBeDefined();

      // Get second page using cursor
      const page2 = await request(httpServer)
        .get(`/api/projects?limit=2&cursor=${page1.body.nextCursor}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(page2.status).toBe(HttpStatus.OK);
      expect(page2.body.items).toHaveLength(1);
      expect(page2.body.hasMore).toBe(false);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a project by ID', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.id;

      const response = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(projectId);
      expect(response.body.name).toBe('Test Project');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should return 404 for project from another workspace', async () => {
      const userA = await createUserAndLogin();
      const userB = await createUserAndLogin();
      const client = prisma.client!;

      // User A creates a project
      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${userA.accessToken}`)
        .send({ name: 'User A Project' });

      const projectId = createResponse.body.id;

      // User B tries to access it
      const response = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${userB.accessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userA.userId } });
        await client.user.delete({ where: { id: userB.userId } });
      } catch {}
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update project name', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Original Name' });

      const projectId = createResponse.body.id;

      const response = await request(httpServer)
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.name).toBe('Updated Name');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });
  });

  describe('PUT /projects/:id/content', () => {
    it('should update project content and increment version', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.id;
      const currentVersion = createResponse.body.version;

      const updatedContent = {
        schemaVersion: 1,
        canvas: { width: 1920, height: 1080, background: '#000000' },
        pages: [
          {
            id: 'page-1',
            elements: [
              {
                id: 'text-1',
                type: 'text',
                position: { x: 50, y: 50 },
                size: { width: 200, height: 100 },
                content: 'Updated text',
                style: { fill: '#ffffff' },
              },
            ],
          },
        ],
      };

      const response = await request(httpServer)
        .put(`/api/projects/${projectId}/content`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ version: currentVersion, content: updatedContent });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.version).toBe(currentVersion + 1);
      expect(response.body.content.canvas.background).toBe('#000000');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should return 409 when version is stale', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.id;

      // First update
      const updatedContent1 = createBlankContent();
      await request(httpServer)
        .put(`/api/projects/${projectId}/content`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ version: 1, content: updatedContent1 });

      // Try to update with stale version (version 1)
      const updatedContent2 = createBlankContent();
      const response = await request(httpServer)
        .put(`/api/projects/${projectId}/content`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ version: 1, content: updatedContent2 });

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toContain('Version mismatch');

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should leave content unchanged when version is stale', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Project' });

      const projectId = createResponse.body.id;

      // First update with specific content
      const firstUpdate = {
        schemaVersion: 1,
        canvas: { width: 800, height: 600, background: '#ff0000' },
        pages: [{ id: 'page-1', elements: [] }],
      };

      await request(httpServer)
        .put(`/api/projects/${projectId}/content`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ version: 1, content: firstUpdate });

      // Try stale update
      const staleUpdate = {
        schemaVersion: 1,
        canvas: { width: 800, height: 600, background: '#00ff00' },
        pages: [{ id: 'page-1', elements: [] }],
      };

      await request(httpServer)
        .put(`/api/projects/${projectId}/content`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ version: 1, content: staleUpdate });

      // Verify content is still from first update
      const getResponse = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(getResponse.body.content.canvas.background).toBe('#ff0000');
      expect(getResponse.body.version).toBe(2); // Only one successful update

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });
  });

  describe('POST /projects/:id/duplicate', () => {
    it('should create an independent copy of a project', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Original Project' });

      const originalId = createResponse.body.id;

      const duplicateResponse = await request(httpServer)
        .post(`/api/projects/${originalId}/duplicate`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(duplicateResponse.status).toBe(HttpStatus.CREATED);
      expect(duplicateResponse.body.id).not.toBe(originalId);
      expect(duplicateResponse.body.name).toBe('Original Project (Copy)');
      expect(duplicateResponse.body.version).toBe(1); // New version sequence
      expect(duplicateResponse.body.content).toEqual(createResponse.body.content);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should soft delete a project', async () => {
      const { userId, accessToken } = await createUserAndLogin();
      const client = prisma.client!;

      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Project to Delete' });

      const projectId = createResponse.body.id;

      const deleteResponse = await request(httpServer)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);

      // Verify it returns 404 when accessing deleted project
      const getResponse = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(getResponse.status).toBe(HttpStatus.NOT_FOUND);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userId } });
      } catch {}
    });

    it('should return 404 when deleting project from another workspace', async () => {
      const userA = await createUserAndLogin();
      const userB = await createUserAndLogin();
      const client = prisma.client!;

      // User A creates a project
      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${userA.accessToken}`)
        .send({ name: 'User A Project' });

      const projectId = createResponse.body.id;

      // User B tries to delete it
      const response = await request(httpServer)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${userB.accessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      // Cleanup
      try {
        await client.user.delete({ where: { id: userA.userId } });
        await client.user.delete({ where: { id: userB.userId } });
      } catch {}
    });
  });

  describe('Permission Tests', () => {
    it('VIEWER can read but cannot create/update/delete', async () => {
      const owner = await createUserAndLogin();
      const viewer = await createUserAndLogin();
      const client = prisma.client!;

      // Create team workspace as owner
      const workspaceResponse = await request(httpServer)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${owner.accessToken}`)
        .send({ name: 'Test Team' });

      const workspaceId = workspaceResponse.body.id;

      // Add viewer to workspace
      await client.membership.create({
        data: {
          userId: viewer.userId,
          workspaceId,
          role: 'VIEWER',
          status: 'ACTIVE',
        },
      });

      // Owner creates a project
      const createResponse = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.accessToken}`)
        .set('X-Workspace-Id', workspaceId)
        .send({ name: 'Team Project' });

      const projectId = createResponse.body.id;

      // VIEWER can read
      const readResponse = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${viewer.accessToken}`)
        .set('X-Workspace-Id', workspaceId);

      expect(readResponse.status).toBe(HttpStatus.OK);

      // VIEWER cannot create
      const createAttempt = await request(httpServer)
        .post('/api/projects')
        .set('Authorization', `Bearer ${viewer.accessToken}`)
        .set('X-Workspace-Id', workspaceId)
        .send({ name: 'Viewer Project' });

      expect(createAttempt.status).toBe(HttpStatus.FORBIDDEN);

      // VIEWER cannot update
      const updateAttempt = await request(httpServer)
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${viewer.accessToken}`)
        .set('X-Workspace-Id', workspaceId)
        .send({ name: 'Updated Name' });

      expect(updateAttempt.status).toBe(HttpStatus.FORBIDDEN);

      // VIEWER cannot delete
      const deleteAttempt = await request(httpServer)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${viewer.accessToken}`)
        .set('X-Workspace-Id', workspaceId);

      expect(deleteAttempt.status).toBe(HttpStatus.FORBIDDEN);

      // Cleanup
      try {
        await client.user.delete({ where: { id: owner.userId } });
        await client.user.delete({ where: { id: viewer.userId } });
      } catch {}
    });
  });
});
