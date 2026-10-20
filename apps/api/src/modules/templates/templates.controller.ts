import { Body, Controller, Post } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post('render')
  async enqueueRender(@Body() payload: Record<string, unknown>) {
    const job = await this.templatesService.enqueueRender(payload);
    return {
      ok: true,
      jobId: job.id,
      queue: 'template-render',
      payload
    };
  }
}
