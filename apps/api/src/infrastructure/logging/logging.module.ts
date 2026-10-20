import { Global, Module } from '@nestjs/common';
import * as winston from 'winston';

export const LOGGER = 'LOGGER';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: () => {
        const logger = winston.createLogger({
          level: process.env.LOG_LEVEL || 'info',
          format: winston.format.json(),
          transports: [new winston.transports.Console()]
        });
        return logger;
      }
    }
  ],
  exports: [LOGGER]
})
export class LoggingModule {}
