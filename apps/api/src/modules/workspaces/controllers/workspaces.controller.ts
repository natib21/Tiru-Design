import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { WorkspacesService } from '../services/workspaces.service';
import { CurrentUser, CurrentUserPayload } from '../../identity/decorators/current-user.decorator';
import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100)
});

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listWorkspaces(@CurrentUser() user: CurrentUserPayload) {
    return this.workspacesService.getWorkspacesForUser(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: unknown
  ) {
    const { name } = createWorkspaceSchema.parse(body);
    return this.workspacesService.createTeamWorkspace(user.id, name);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getWorkspace(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string
  ) {
    return this.workspacesService.getWorkspaceById(id, user.id);
  }
}
