import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { createHash } from 'crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Hash high-entropy tokens (refresh tokens, reset tokens) with SHA-256
   */
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Hash low-entropy values (OTPs) with Argon2
   */
  async hashValue(value: string) {
    return argon2.hash(value);
  }

  async verifyHash(value: string, hash: string) {
    return argon2.verify(hash, value);
  }

  async revokeSession(sessionId: string): Promise<void> {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    await client.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });
  }

  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    await client.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {})
      },
      data: { revokedAt: new Date() }
    });
  }
}
