import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        // eslint-disable-next-line no-console
        console.log(`BullMQ connecting to Redis at ${url}`);

        return {
          connection: {
            url
          },
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true
          }
        };
      }
    })
  ],
  exports: [BullModule]
})
export class QueueModule {}
