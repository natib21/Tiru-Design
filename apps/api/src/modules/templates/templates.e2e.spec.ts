import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../../app.module';
import { setupApp } from '../../common/app-setup';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { createBlankContent } from '../projects/schemas/content.schema';

describe('Templates E2E Tests', () => {
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
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.client?.$disconnect();
    await app.close();
  });

  async function createUserAndLogin(platformRole: 'NONE' | 'ADMIN' = 'NONE') {
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

    const userId = registerResponse.body.user.id;

    // If admin role requested, update the user
    // The platformRole will be loaded from DB on every request via JWT strategy
    if (platformRole === 'ADMIN') {
      const client = prisma.client!;
      await client.user.update({
        where: { id: userId },
        data: { platformRole: 'ADMIN' },
      });
    }

    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({ identifier: email, password: 'Test1234!' });

    if (loginResponse.status !== HttpStatus.OK) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    return {
      userId,
      accessToken: loginResponse.body.accessToken,
      email,
    };
  }

  describe('GET /templates', () => {
    it('should return 401 without token', async () => {
      const response = await request(httpServer).get('/api/templates');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should list only published templates', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      // Create draft template
      const draftResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Draft Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const draftId = draftResponse.body.id;

      // Create and publish template
      const publishedResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Published Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const publishedId = publishedResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${publishedId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      // List templates (authenticated endpoint)
      const response = await request(httpServer)
        .get('/api/templates')
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.items).toBeInstanceOf(Array);
      
      const titles = response.body.items.map((t: any) => t.title);
      expect(titles).toContain('Published Template');
      expect(titles).not.toContain('Draft Template');

      // Cleanup
      try {
        await client.template.deleteMany({ where: { id: { in: [draftId, publishedId] } } });
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });

    it('should not include content in list items', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      const response = await request(httpServer)
        .get('/api/templates')
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      const template = response.body.items.find((t: any) => t.id === templateId);
      expect(template).toBeDefined();
      expect(template.content).toBeUndefined();

      // Cleanup
      try {
        await client.template.delete({ where: { id: templateId } });
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });
  });

  describe('GET /templates/:id', () => {
    it('should return 401 without token', async () => {
      const response = await request(httpServer).get('/api/templates/fake-id');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return published template with content', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      const response = await request(httpServer)
        .get(`/api/templates/${templateId}`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.id).toBe(templateId);
      expect(response.body.content).toBeDefined();
      expect(response.body.placeholderKeys).toBeDefined();

      // Cleanup
      try {
        await client.template.delete({ where: { id: templateId } });
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });

    it('should return 404 for draft template', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Draft Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      // Try to get draft template as normal user
      const response = await request(httpServer)
        .get(`/api/templates/${templateId}`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);

      // Cleanup
      try {
        await client.template.delete({ where: { id: templateId } });
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });
  });

  describe('POST /templates/:id/use', () => {
    it('should create project in active workspace', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      // Create and publish template
      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Business Card Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      // Use template
      const response = await request(httpServer)
        .post(`/api/templates/${templateId}/use`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.name).toBe('Business Card Template');
      expect(response.body.sourceTemplateId).toBe(templateId);
      expect(response.body.sourceTemplateVersion).toBe(1);
      expect(response.body.content).toBeDefined();

      // Cleanup
      try {
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });

    it('should create independent copy', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      // Create and publish template
      const contentV1 = createBlankContent();
      contentV1.canvas.background = '#ff0000';

      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: contentV1,
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      // Use template
      const useResponse = await request(httpServer)
        .post(`/api/templates/${templateId}/use`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      const projectId = useResponse.body.id;

      // Update template
      const contentV2 = createBlankContent();
      contentV2.canvas.background = '#00ff00';

      await request(httpServer)
        .patch(`/api/admin/templates/${templateId}`)
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({ content: contentV2 });

      // Check project is unchanged
      const projectResponse = await request(httpServer)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(projectResponse.body.content.canvas.background).toBe('#ff0000');

      // Cleanup
      try {
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });

    it('should reject VIEWER role', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const owner = await createUserAndLogin();
      const viewer = await createUserAndLogin();

      // Create and publish template
      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      // Create workspace and add viewer
      const workspaceResponse = await request(httpServer)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${owner.accessToken}`)
        .send({ name: 'Test Workspace', type: 'TEAM' });

      const workspaceId = workspaceResponse.body.id;

      await client.membership.create({
        data: {
          userId: viewer.userId,
          workspaceId,
          role: 'VIEWER',
          status: 'ACTIVE',
        },
      });

      // Try to use template as viewer
      const response = await request(httpServer)
        .post(`/api/templates/${templateId}/use`)
        .set('Authorization', `Bearer ${viewer.accessToken}`)
        .set('X-Workspace-Id', workspaceId);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      // Cleanup
      try {
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: owner.userId } });
        await client.user.delete({ where: { id: viewer.userId } });
      } catch {}
    });

    it('should return 402 for paid template', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');
      const user = await createUserAndLogin();

      // Create and publish paid template
      const createResponse = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Premium Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 5000, // 50 ETB
          content: createBlankContent(),
        });

      const templateId = createResponse.body.id;

      await request(httpServer)
        .post(`/api/admin/templates/${templateId}/publish`)
        .set('Authorization', `Bearer ${admin.accessToken}`);

      // Try to use paid template
      const response = await request(httpServer)
        .post(`/api/templates/${templateId}/use`)
        .set('Authorization', `Bearer ${user.accessToken}`);

      expect(response.status).toBe(HttpStatus.PAYMENT_REQUIRED);
      expect(response.body.error).toBe('PAYMENT_REQUIRED');

      // Cleanup
      try {
        await client.template.delete({ where: { id: templateId } });
        await client.user.delete({ where: { id: admin.userId } });
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });
  });

  describe('Admin endpoints', () => {
    it('should reject non-admin access', async () => {
      const user = await createUserAndLogin('NONE');
      const client = prisma.client!;

      const response = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${user.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      // Cleanup
      try {
        await client.user.delete({ where: { id: user.userId } });
      } catch {}
    });

    it('should reject workspace OWNER who is not platform admin', async () => {
      const client = prisma.client!;
      const owner = await createUserAndLogin('NONE');

      // Create workspace (owner is now workspace OWNER)
      await request(httpServer)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${owner.accessToken}`)
        .send({ name: 'Test Workspace', type: 'TEAM' });

      // Try to access admin endpoint
      const response = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${owner.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: createBlankContent(),
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);

      // Cleanup
      try {
        await client.user.delete({ where: { id: owner.userId } });
      } catch {}
    });
  });

  describe('Placeholder keys', () => {
    it('should derive placeholderKeys from content', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');

      const content = createBlankContent();
      content.pages[0].elements = [
        {
          id: 'text-1',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
          content: 'Hello {{name}}, your email is {{email}}',
        },
        {
          id: 'text-2',
          type: 'text',
          position: { x: 0, y: 100 },
          size: { width: 100, height: 50 },
          content: 'Welcome {{name}}!',
        },
      ];

      const response = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Template with Placeholders',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.placeholderKeys).toEqual(['email', 'name']);

      // Cleanup
      try {
        await client.template.delete({ where: { id: response.body.id } });
        await client.user.delete({ where: { id: admin.userId } });
      } catch {}
    });

    it('should ignore client-sent placeholderKeys', async () => {
      const client = prisma.client!;
      const admin = await createUserAndLogin('ADMIN');

      const content = createBlankContent();
      content.pages[0].elements = [
        {
          id: 'text-1',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
          content: 'Hello {{name}}',
          style: {},
        },
      ];

      const response = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Test Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content,
          placeholderKeys: ['fake', 'keys'], // Should be ignored
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.placeholderKeys).toEqual(['name']); // Derived from content

      // Cleanup
      try {
        await client.template.delete({ where: { id: response.body.id } });
        await client.user.delete({ where: { id: admin.userId } });
      } catch {}
    });
  });

  describe('Content validation', () => {
    it('should reject invalid content', async () => {
      const admin = await createUserAndLogin('ADMIN');
      const client = prisma.client!;

      const response = await request(httpServer)
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Invalid Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: { invalid: 'schema' },
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('Invalid content');

      // Cleanup
      try {
        await client.user.delete({ where: { id: admin.userId } });
      } catch {}
    });

    it('should reject oversized content', async () => {
      const admin = await createUserAndLogin('ADMIN');
      const client = prisma.client!;

      const largeElements = Array.from({ length: 6500 }, (_, i) => ({
        id: `text-${i}`,
        type: 'text',
        position: { x: i, y: i },
        size: { width: 100, height: 50 },
        content: 'A'.repeat(330),
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
        .post('/api/admin/templates')
        .set('Authorization', `Bearer ${admin.accessToken}`)
        .send({
          title: 'Oversized Template',
          category: 'business',
          language: 'ENGLISH',
          priceMinor: 0,
          content: oversizedContent,
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('exceeds maximum allowed size');

      // Cleanup
      try {
        await client.user.delete({ where: { id: admin.userId } });
      } catch {}
    });
  });
});
