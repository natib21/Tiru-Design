import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TemplatesService } from '../services/templates.service';
import { JwtAuthGuard } from '../../identity/guards/jwt-auth.guard';
import { PlatformAdminGuard } from '../../../common/guards/platform-admin.guard';
import { CreateTemplateDto, UpdateTemplateDto, ListTemplatesDto } from '../dto';

@Controller('admin/templates')
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
export class AdminTemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async list(@Query() dto: ListTemplatesDto) {
    return this.templatesService.adminList(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.adminFindOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTemplateDto) {
    return this.templatesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.templatesService.update(id, dto);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.templatesService.publish(id);
  }

  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return this.templatesService.unpublish(id);
  }
}
