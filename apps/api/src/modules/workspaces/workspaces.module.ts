import { Module } from '@nestjs/common';
import { WorkspacesController } from './controllers/workspaces.controller';
import { PolicyTestController } from './controllers/policy-test.controller';
import { WorkspacesService } from './services/workspaces.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Module({
  controllers: [WorkspacesController, PolicyTestController],
  providers: [WorkspacesService, PrismaService],
  exports: [WorkspacesService]
})
export class WorkspacesModule {}
