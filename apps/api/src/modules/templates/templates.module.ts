import { Module } from '@nestjs/common';
import { TemplatesService } from './services/templates.service';
import { TemplatesController } from './controllers/templates.controller';
import { AdminTemplatesController } from './controllers/admin-templates.controller';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [WorkspacesModule],
  controllers: [TemplatesController, AdminTemplatesController],
  providers: [TemplatesService, PrismaService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
