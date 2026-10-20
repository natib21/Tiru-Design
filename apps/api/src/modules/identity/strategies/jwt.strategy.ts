import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

export interface JwtPayload {
  sub: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!
    });
  }

  async validate(payload: JwtPayload) {
    const client = this.prisma.client;
    if (!client) {
      throw new UnauthorizedException('Database unavailable');
    }

    const session = await client.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true }
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    if (session.user.status === 'SUSPENDED' || session.user.status === 'DEACTIVATED') {
      throw new UnauthorizedException('Account unavailable');
    }

    return {
      id: session.user.id,
      email: session.user.email,
      phoneNumber: session.user.phoneNumber,
      status: session.user.status,
      sessionId: session.id
    };
  }
}
