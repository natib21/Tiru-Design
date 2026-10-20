import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { TemplateRenderProcessor } from './template-render.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'template-render' })],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplateRenderProcessor],
  exports: [TemplatesService]
})
export class TemplatesModule {}
