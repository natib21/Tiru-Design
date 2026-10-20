import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { validateSecrets } from './common/config/secrets-validator';
import { setupApp, setupSwagger } from './common/app-setup';

async function bootstrap() {
  // Validate secrets before starting the application
  validateSecrets();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Common setup
  setupApp(app);
  
  // Swagger documentation
  setupSwagger(app);

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
  console.log(`API docs available at http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap API', err);
  process.exit(1);
});
