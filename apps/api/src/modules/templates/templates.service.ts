import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TemplatesService {
  constructor(@InjectQueue('template-render') private readonly templateRenderQueue: Queue) {}

  async enqueueRender(payload: Record<string, unknown>) {
    return this.templateRenderQueue.add('render-template', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    });
  }
}
