import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { IdentityService } from './identity.service';
import { SessionService } from './session.service';
import { SecurityEventsService } from './security-events.service';

type GoogleAuthInput = {
  googleId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;
};

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly identityService: IdentityService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly securityEvents: SecurityEventsService
  ) {}

  async register(data: { email: string; phoneNumber: string; password: string }) {
    const email = this.identityService.normalizeEmail(data.email);
    const phoneNumber = this.identityService.normalizePhone(data.phoneNumber);

    if (await this.identityService.findUserByEmail(email)) {
      throw new ConflictException('Email already registered');
    }

    if (phoneNumber && await this.identityService.findUserByPhone(phoneNumber)) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await this.identityService.hashPassword(data.password);
    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    // Create user, personal workspace, and membership in a single transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      const user = await tx.user.create({
        data: { email, phoneNumber, passwordHash }
      });

      // Create personal workspace
      const workspace = await tx.workspace.create({
        data: {
          type: 'PERSONAL',
          name: this.generatePersonalWorkspaceName(user.email, user.name)
        }
      });

      // Create OWNER membership
      await tx.membership.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
          status: 'ACTIVE'
        }
      });

      // Create verification records
      const otp = this.generateOtp();
      const otpHash = await this.sessionService.hashValue(otp);

      await tx.phoneVerification.create({
        data: {
          userId: user.id,
          otpHash,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0
        }
      });

      await tx.emailVerification.create({
        data: {
          userId: user.id,
          tokenHash: await this.sessionService.hashValue(this.identityService.generateToken()),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
      });

      return user;
    });

    return {
      user: {
        id: result.id,
        email: result.email,
        phoneNumber: result.phoneNumber,
        emailVerified: Boolean(result.emailVerifiedAt),
        phoneVerified: Boolean(result.phoneVerifiedAt),
        status: result.status
      }
    };
  }

  async login(data: { identifier: string; password: string }, ctx?: RequestContext) {
    const identifier = data.identifier.trim();
    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      await this.securityEvents.logEvent(
        'LOGIN_FAILED',
        null,
        ctx?.ipAddress || null,
        ctx?.userAgent || null,
        { reason: 'user_not_found', identifier }
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      await this.securityEvents.logEvent(
        'LOGIN_FAILED',
        user.id,
        ctx?.ipAddress || null,
        ctx?.userAgent || null,
        { reason: 'account_unavailable', status: user.status }
      );
      throw new UnauthorizedException('Account unavailable');
    }

    const valid = await this.identityService.verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      await this.securityEvents.logEvent(
        'LOGIN_FAILED',
        user.id,
        ctx?.ipAddress || null,
        ctx?.userAgent || null,
        { reason: 'invalid_password' }
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    const refreshToken = this.identityService.generateToken();
    const refreshTokenHash = this.sessionService.hashToken(refreshToken);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        previousRefreshHash: refreshTokenHash,
        currentRefreshHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: ctx?.ipAddress || null,
        userAgent: ctx?.userAgent || null
      }
    });

    const accessToken = this.jwtService.sign({ sub: user.id, sessionId: session.id }, { expiresIn: '15m' });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    await this.securityEvents.logEvent(
      'LOGIN_SUCCESS',
      user.id,
      ctx?.ipAddress || null,
      ctx?.userAgent || null,
      { sessionId: session.id }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: Boolean(user.emailVerifiedAt),
        phoneVerified: Boolean(user.phoneVerifiedAt),
        status: user.status
      },
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

  async refresh(refreshToken: string, ctx?: RequestContext) {
    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    const tokenHash = this.sessionService.hashToken(refreshToken);

    const session = await prisma.session.findFirst({
      where: { currentRefreshHash: tokenHash },
      include: { user: true }
    });

    if (!session) {
      // Token not found - check if it was already rotated (reuse detection)
      const reuseAttempt = await prisma.session.findFirst({
        where: { 
          previousRefreshHash: tokenHash,
          currentRefreshHash: { not: tokenHash }
        },
        include: { user: true }
      });

      if (reuseAttempt) {
        // SECURITY: Refresh token reuse detected! Revoke the session immediately
        await prisma.session.update({
          where: { id: reuseAttempt.id },
          data: { revokedAt: new Date() }
        });

        await this.securityEvents.logEvent(
          'SESSION_REVOKED',
          reuseAttempt.userId,
          ctx?.ipAddress || null,
          ctx?.userAgent || null,
          { 
            reason: 'refresh_token_reuse_detected',
            sessionId: reuseAttempt.id
          }
        );

        console.error(`[SECURITY] Refresh token reuse detected for user ${reuseAttempt.userId}, session revoked`);
      }

      throw new UnauthorizedException('Invalid refresh token');
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

    // Store current token hash before rotation for reuse detection
    const currentTokenHashBeforeRotation = session.currentRefreshHash;

    // Rotate refresh token
    const newRefreshToken = this.identityService.generateToken();
    const newRefreshTokenHash = this.sessionService.hashToken(newRefreshToken);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        currentRefreshHash: newRefreshTokenHash,
        previousRefreshHash: currentTokenHashBeforeRotation, // Store current hash for reuse detection
        ipAddress: ctx?.ipAddress || session.ipAddress,
        userAgent: ctx?.userAgent || session.userAgent
      }
    });

    const accessToken = this.jwtService.sign(
      { sub: session.user.id, sessionId: session.id },
      { expiresIn: '15m' }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

  async logout(sessionId: string, userId: string, ctx?: RequestContext) {
    await this.sessionService.revokeSession(sessionId);
    await this.securityEvents.logEvent(
      'LOGOUT',
      userId,
      ctx?.ipAddress || null,
      ctx?.userAgent || null,
      { sessionId }
    );
  }

  async me(userId: string) {
    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: Boolean(user.emailVerifiedAt),
      phoneVerified: Boolean(user.phoneVerifiedAt),
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
  }

  async loginWithGoogle(data: GoogleAuthInput, ctx?: RequestContext) {
    // Check if Google OAuth is enabled
    const googleEnabled = process.env.GOOGLE_OAUTH_ENABLED === 'true';
    if (!googleEnabled) {
      throw new BadRequestException('Google OAuth is not enabled');
    }

    const email = this.identityService.normalizeEmail(data.email);
    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    let user = await this.identityService.findUserByEmail(email);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user from Google profile WITH personal workspace
      const passwordHash = await this.identityService.hashPassword(`${this.identityService.generateToken()}${data.googleId}`);
      
      user = await prisma.$transaction(async (tx: typeof prisma) => {
        const newUser = await tx.user.create({
          data: {
            email,
            passwordHash,
            phoneNumber: null,
            emailVerifiedAt: new Date(),
            status: 'ACTIVE'
          }
        });

        // Create personal workspace
        const workspace = await tx.workspace.create({
          data: {
            type: 'PERSONAL',
            name: this.generatePersonalWorkspaceName(newUser.email, newUser.name)
          }
        });

        // Create OWNER membership
        await tx.membership.create({
          data: {
            userId: newUser.id,
            workspaceId: workspace.id,
            role: 'OWNER',
            status: 'ACTIVE'
          }
        });

        return newUser;
      });
    } else {
      // User exists - only link if their email is verified
      if (!user.emailVerifiedAt) {
        throw new UnauthorizedException(
          'Email must be verified before linking Google account'
        );
      }
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw new UnauthorizedException('Account unavailable');
    }

    const identity = await prisma.userIdentity.upsert({
      where: {
        provider_providerUserId: {
          provider: 'GOOGLE',
          providerUserId: data.googleId
        }
      },
      update: {
        userId: user.id,
        email,
        displayName: [data.firstName, data.lastName].filter(Boolean).join(' ') || null,
        avatarUrl: data.picture ?? null,
      },
      create: {
        userId: user.id,
        provider: 'GOOGLE',
        providerUserId: data.googleId,
        email,
        displayName: [data.firstName, data.lastName].filter(Boolean).join(' ') || null,
        avatarUrl: data.picture ?? null,
      }
    });

    if (identity.userId !== user.id) {
      throw new ConflictException('Google identity is already linked to another account');
    }

    const refreshToken = this.identityService.generateToken();
    const refreshTokenHash = this.sessionService.hashToken(refreshToken);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        previousRefreshHash: refreshTokenHash,
        currentRefreshHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: ctx?.ipAddress || null,
        userAgent: ctx?.userAgent || null
      }
    });

    const accessToken = this.jwtService.sign({ sub: user.id, sessionId: session.id }, { expiresIn: '15m' });

    if (!isNewUser) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
          status: 'ACTIVE',
          lastLoginAt: new Date(),
        }
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        }
      });
    }

    await this.securityEvents.logEvent(
      'LOGIN_SUCCESS',
      user.id,
      ctx?.ipAddress || null,
      ctx?.userAgent || null,
      { provider: 'google', sessionId: session.id }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: true,
        phoneVerified: Boolean(user.phoneVerifiedAt),
        status: 'ACTIVE'
      },
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

  async verifyPhone(data: { phoneNumber: string; otp: string }) {
    const phoneNumber = this.identityService.normalizePhone(data.phoneNumber);
    const user = await this.identityService.findUserByPhone(phoneNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prisma = this.prisma.client;
    if (!prisma) throw new Error('Database client not available');

    const verification = await prisma.phoneVerification.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!verification || verification.consumedAt) {
      throw new BadRequestException('OTP is invalid or already used');
    }

    const valid = await this.sessionService.verifyHash(data.otp, verification.otpHash);
    if (!valid) {
      throw new BadRequestException('OTP is invalid');
    }

    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { consumedAt: new Date() }
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerifiedAt: new Date(), status: 'ACTIVE' }
    });

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        emailVerified: Boolean(updatedUser.emailVerifiedAt),
        phoneVerified: Boolean(updatedUser.phoneVerifiedAt),
        status: updatedUser.status
      }
    };
  }

  async resendPhoneOtp(data: { phoneNumber: string }) {
    const phoneNumber = this.identityService.normalizePhone(data.phoneNumber);
    const user = await this.identityService.findUserByPhone(phoneNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { ok: true };
  }

  async verifyEmail(data: { token: string }) {
    return { ok: true, message: 'Email verification is not yet implemented in full.' };
  }

  async resendEmailVerification(data: { email: string }) {
    return { ok: true, message: 'Email verification resend is not yet implemented in full.' };
  }

  async forgotPassword(data: { email: string }) {
    const email = this.identityService.normalizeEmail(data.email);
    const user = await this.identityService.findUserByEmail(email);
    if (!user) {
      return { ok: true };
    }

    return { ok: true };
  }

  async resetPassword(data: { token: string; password: string }) {
    return { ok: true, message: 'Password reset flow is not yet fully implemented.' };
  }

  async changePassword(userId: string | undefined, data: { currentPassword: string; newPassword: string }) {
    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return { ok: true, message: 'Change password flow is not yet fully implemented.' };
  }

  private async findUserByIdentifier(identifier: string) {
    const emailCandidate = this.identityService.normalizeEmail(identifier);
    const phoneCandidate = this.identityService.normalizePhone(identifier);

    return (
      (await this.identityService.findUserByEmail(emailCandidate)) ??
      (await this.identityService.findUserByPhone(phoneCandidate))
    );
  }

  private generateOtp() {
    return randomBytes(3).toString('hex').slice(0, 6).toUpperCase();
  }

  /**
   * Generate personal workspace name from user data.
   * Uses User.name if set, otherwise the part of email before "@".
   * Never uses the full email.
   */
  private generatePersonalWorkspaceName(email: string, name?: string | null): string {
    if (name) {
      return `${name}'s Workspace`;
    }
    const emailPrefix = email.split('@')[0];
    return `${emailPrefix}'s Workspace`;
  }
}
