import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { AuthController } from './controllers/auth.controller';
import { VerificationController } from './controllers/verification.controller';
import { PasswordController } from './controllers/password.controller';
import { AuthenticationService } from './services/authentication.service';
import { IdentityService } from './services/identity.service';
import { OtpService } from './services/otp.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { SecurityEventsService } from './services/security-events.service';
import { RateLimitService } from './services/rate-limit.service';
import { UserRepository } from './repositories/user.repository';
import { SessionRepository } from './repositories/session.repository';
import { OtpRepository } from './repositories/otp.repository';
import { VerificationTokenRepository } from './repositories/verification-token.repository';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    RedisModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '15m' }
    })
  ],
  controllers: [AuthController, VerificationController, PasswordController],
  providers: [
    PrismaService,
    IdentityService,
    AuthenticationService,
    OtpService,
    EmailVerificationService,
    PasswordService,
    SessionService,
    SecurityEventsService,
    RateLimitService,
    UserRepository,
    SessionRepository,
    OtpRepository,
    VerificationTokenRepository,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  exports: [IdentityService, AuthenticationService, SessionService]
})
export class IdentityModule {}
