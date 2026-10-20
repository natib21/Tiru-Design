import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

type PrismaClientLike = any;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma?: PrismaClientLike;
  private hasLoggedDatabaseConnection = false;

  constructor() {
    try {
      // In local development, Prisma may not be generated yet. Avoid crashing the whole app
      // when the database layer is still being bootstrapped or the client isn't available.
      const { PrismaClient } = require('@prisma/client') as typeof import('@prisma/client');
      this.prisma = new PrismaClient() as PrismaClientLike;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Prisma client not available yet; continuing without database connectivity.', error);
      this.prisma = undefined;
    }
  }

  async onModuleInit() {
    if (!this.prisma || typeof this.prisma.$queryRaw !== 'function') {
      // eslint-disable-next-line no-console
      console.warn('Database not connected: Prisma client is unavailable.');
      return;
    }

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      if (!this.hasLoggedDatabaseConnection) {
        this.hasLoggedDatabaseConnection = true;
        // eslint-disable-next-line no-console
        console.log('Database connected successfully.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Database connection failed.', error);
    }
  }

  async onModuleDestroy() {
    await this.prisma?.$disconnect?.();
  }

  get client() {
    return this.prisma as PrismaClientLike;
  }
}
