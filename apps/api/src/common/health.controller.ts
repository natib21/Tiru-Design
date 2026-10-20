import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ServiceUnavailableException
} from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { REDIS_CLIENT } from '../infrastructure/redis/redis.module';
import { Public } from '../modules/identity/decorators/public.decorator';

@Controller()
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  @Public()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    const prismaHealthy = await this.checkPrisma();
    const redisHealthy = await this.checkRedis();

    if (prismaHealthy && redisHealthy) {
      return { status: 'ok' };
    }

    throw new ServiceUnavailableException({ status: 'error' });
  }

  @Public()
  @Get('ready')
  ready() {
    return { status: 'ready' };
  }

  private async checkPrisma(): Promise<boolean> {
    const prisma = this.prismaService.client;

    if (!prisma) {
      return false;
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
