import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('template-render')
export class TemplateRenderProcessor extends WorkerHost {
  async process(job: Job<Record<string, unknown>>) {
    // eslint-disable-next-line no-console
    console.log('[template-render] job received', job.data);
    return job.data;
  }
}
