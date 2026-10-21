import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './common/health.module';
import { PrismaService } from './infrastructure/database/prisma.service';
import { RedisModule } from './infrastructure/redis/redis.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { IdentityModule } from './modules/identity';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.docker']
    }),
    HealthModule,
    RedisModule,
    QueueModule,
    StorageModule,
    LoggingModule,
    TemplatesModule,
    IdentityModule,
    WorkspacesModule,
    ProjectsModule
  ],
  controllers: [],
  providers: [PrismaService]
})
export class AppModule {}
