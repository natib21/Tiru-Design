import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'SESSION_REVOKED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_CHANGED'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_DEACTIVATED';

export interface SecurityEventMetadata {
  [key: string]: unknown;
}

@Injectable()
export class SecurityEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async logEvent(
    eventType: SecurityEventType,
    userId: string | null,
    ipAddress: string | null,
    userAgent: string | null,
    metadata?: SecurityEventMetadata
  ): Promise<void> {
    const client = this.prisma.client;
    if (!client) {
      console.warn('Cannot log security event: database client not available');
      return;
    }

    try {
      await client.securityEvent.create({
        data: {
          eventType,
          userId,
          ipAddress,
          userAgent,
          metadata: metadata ? (metadata as Record<string, unknown>) : null
        }
      });
    } catch (error) {
      // Never let security logging break the request
      console.error('Failed to log security event:', error);
    }
  }
}
