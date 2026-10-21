import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto, UpdateContentDto, ListProjectsDto } from '../dto';
import { WorkspaceGuard } from '../../workspaces/guards/workspace.guard';
import { PolicyGuard } from '../../workspaces/guards/policy.guard';
import { RequirePolicy } from '../../workspaces/decorators/require-policy.decorator';

@Controller('projects')
@UseGuards(WorkspaceGuard, PolicyGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @RequirePolicy('project:create')
  async create(@Request() req: any, @Body() createProjectDto: CreateProjectDto) {
    const workspaceId = req.workspace.workspaceId;
    const userId = req.user.id;
    return this.projectsService.create(workspaceId, userId, createProjectDto);
  }

  @Get()
  @RequirePolicy('project:read')
  async list(@Request() req: any, @Query() listProjectsDto: ListProjectsDto) {
    const workspaceId = req.workspace.workspaceId;
    return this.projectsService.list(workspaceId, listProjectsDto);
  }

  @Get(':id')
  @RequirePolicy('project:read')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const workspaceId = req.workspace.workspaceId;
    return this.projectsService.findOne(workspaceId, id);
  }

  @Patch(':id')
  @RequirePolicy('project:update')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const workspaceId = req.workspace.workspaceId;
    return this.projectsService.update(workspaceId, id, updateProjectDto);
  }

  @Put(':id/content')
  @RequirePolicy('project:update')
  async updateContent(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const workspaceId = req.workspace.workspaceId;
    return this.projectsService.updateContent(workspaceId, id, updateContentDto);
  }

  @Post(':id/duplicate')
  @RequirePolicy('project:create')
  async duplicate(@Request() req: any, @Param('id') id: string) {
    const workspaceId = req.workspace.workspaceId;
    const userId = req.user.id;
    return this.projectsService.duplicate(workspaceId, id, userId);
  }

  @Delete(':id')
  @RequirePolicy('project:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string) {
    const workspaceId = req.workspace.workspaceId;
    await this.projectsService.remove(workspaceId, id);
  }
}
