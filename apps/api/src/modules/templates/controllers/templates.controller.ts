import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TemplatesService } from '../services/templates.service';
import { JwtAuthGuard } from '../../identity/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../workspaces/guards/workspace.guard';
import { PolicyGuard } from '../../workspaces/guards/policy.guard';
import { RequirePolicy } from '../../workspaces/decorators/require-policy.decorator';
import { ListTemplatesDto } from '../dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async list(@Query() dto: ListTemplatesDto) {
    return this.templatesService.list(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post(':id/use')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, PolicyGuard)
  @RequirePolicy('project:create')
  async useTemplate(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    const workspaceId = req.workspace.workspaceId;
    const userId = req.user.id;
    return this.templatesService.useTemplate(id, workspaceId, userId);
  }
}
