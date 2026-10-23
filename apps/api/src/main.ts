import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import chalk from 'chalk';
import { AppModule } from './app.module';
import { validateSecrets } from './common/config/secrets-validator';
import { setupApp, setupSwagger } from './common/app-setup';
import { PrismaService } from './infrastructure/database/prisma.service';

async function checkConnections(app: NestExpressApplication) {
  const connections = {
    database: false,
    redis: false,
    minio: false,
  };

  // Check Database Connection
  try {
    const prisma = app.get(PrismaService);
    if (prisma.client && typeof prisma.client.$queryRaw === 'function') {
      await prisma.client.$queryRaw`SELECT 1`;
      connections.database = true;
      // eslint-disable-next-line no-console
      console.log(chalk.green('✓') + ' Database connected');
    } else {
      // eslint-disable-next-line no-console
      console.log(chalk.yellow('⚠') + ' Database client not initialized');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('✗') + ' Database connection failed');
    // eslint-disable-next-line no-console
    console.error(chalk.red('  Error:'), error instanceof Error ? error.message : error);
  }

  // Check Redis Connection
  try {
    const Redis = await import('ioredis').then((m) => m.default);
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.ping();
    connections.redis = true;
    // eslint-disable-next-line no-console
    console.log(chalk.green('✓') + ' Redis connected');
    await redis.quit();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('⚠') + ' Redis connection failed (optional)');
  }

  // Check MinIO/S3 Connection
  try {
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
    const response = await fetch(`${endpoint}/minio/health/live`);
    if (response.ok) {
      connections.minio = true;
      // eslint-disable-next-line no-console
      console.log(chalk.green('✓') + ' MinIO connected');
    } else {
      // eslint-disable-next-line no-console
      console.log(chalk.yellow('⚠') + ' MinIO connection failed (optional)');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('⚠') + ' MinIO not reachable (optional)');
  }

  return connections;
}

async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan.bold('\n🚀 Starting TiruDesign API...\n'));

  // Validate secrets before starting the application
  try {
    validateSecrets();
    // eslint-disable-next-line no-console
    console.log(chalk.green('✓') + ' Environment variables validated\n');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('✗') + ' Environment validation failed');
    throw error;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Common setup
  setupApp(app);

  // Swagger documentation
  setupSwagger(app);

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
  const host = process.env.API_HOST || 'localhost';

  await app.listen(port, host);

  // eslint-disable-next-line no-console
  console.log(chalk.cyan('📡 Checking connections...\n'));
  await checkConnections(app);

  // eslint-disable-next-line no-console
  console.log(chalk.green.bold('\n✨ Server is ready!\n'));
  // eslint-disable-next-line no-console
  console.log(chalk.blue('🌐 API:  ') + chalk.white(`http://${host}:${port}`));
  // eslint-disable-next-line no-console
  console.log(chalk.blue('📚 Docs: ') + chalk.white(`http://${host}:${port}/api/docs`));
  // eslint-disable-next-line no-console
  console.log(chalk.gray('\nPress') + chalk.white(' CTRL+C ') + chalk.gray('to stop\n'));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(chalk.red.bold('\n❌ Failed to start API\n'));
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
