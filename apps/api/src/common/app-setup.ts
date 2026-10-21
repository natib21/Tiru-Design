import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

export function setupApp(app: INestApplication): void {
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Increase body size limit to 3MB (validation rejects >2MB with 400)
  const expressApp = app as NestExpressApplication;
  expressApp.useBodyParser('json', { limit: '3mb' });
  expressApp.useBodyParser('urlencoded', { limit: '3mb', extended: true });
  
  // Global prefix
  app.setGlobalPrefix('api', { exclude: ['health', 'ready'] });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  // CORS
  app.enableCors();
}

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('TiruDesign API')
    .setDescription('Multi-tenant design platform API for the Ethiopian market')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('identity', 'Identity and user management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
