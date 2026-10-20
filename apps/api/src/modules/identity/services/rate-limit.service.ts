import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../infrastructure/redis/redis.module';

export interface RateLimitConfig {
  maxAttempts: number;
  windowSeconds: number;
}

@Injectable()
export class RateLimitService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const fullKey = `ratelimit:${key}`;
    const now = Date.now();
    const windowStart = now - config.windowSeconds * 1000;

    try {
      // Remove old entries and count current attempts
      const multi = this.redis.multi();
      multi.zremrangebyscore(fullKey, '-inf', windowStart);
      multi.zcard(fullKey);
      multi.zadd(fullKey, now, `${now}`);
      multi.expire(fullKey, config.windowSeconds);

      const results = await multi.exec();
      
      if (!results) {
        throw new Error('Redis multi command failed');
      }

      const count = results[1][1] as number;
      const allowed = count < config.maxAttempts;
      const remaining = Math.max(0, config.maxAttempts - count - 1);
      const resetAt = new Date(now + config.windowSeconds * 1000);

      return { allowed, remaining, resetAt };
    } catch (error) {
      // Redis is down or error occurred - fail closed for security
      console.error('Rate limiter error (failing closed):', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Rate limiting service temporarily unavailable',
          error: 'RATE_LIMIT_SERVICE_DOWN'
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  async enforce(key: string, config: RateLimitConfig, errorMessage?: string): Promise<void> {
    const result = await this.checkLimit(key, config);
    
    if (!result.allowed) {
      throw new HttpException(
        errorMessage || `Rate limit exceeded. Try again after ${result.resetAt.toISOString()}`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }
}
