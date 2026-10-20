# Identity Phase 2 — Implementation Guide

## 1. Module boundaries and folder structure

Create the Identity module under:

`apps/api/src/modules/identity`

Use the following internal structure:

- `identity.module.ts`
- `controllers/auth.controller.ts`
- `controllers/verification.controller.ts`
- `controllers/password.controller.ts`
- `services/identity.service.ts`
- `services/authentication.service.ts`
- `services/otp.service.ts`
- `services/email-verification.service.ts`
- `services/password.service.ts`
- `services/session.service.ts`
- `repositories/user.repository.ts`
- `repositories/session.repository.ts`
- `repositories/otp.repository.ts`
- `repositories/verification-token.repository.ts`
- `dto/*.dto.ts`
- `schemas/identity.schemas.ts`
- `guards/authentication.guard.ts`
- `decorators/current-user.decorator.ts`
- `strategies/jwt.strategy.ts`
- `interfaces/identity.interfaces.ts`
- `index.ts`

Rules:
- controllers only marshal HTTP input and output
- services contain logic
- repositories contain Prisma access
- infrastructure concerns stay outside Identity
- no direct Prisma client calls from controllers

## 2. Prisma models to add

### User

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  phoneNumber       String?   @unique
  passwordHash      String
  emailVerifiedAt   DateTime?
  phoneVerifiedAt   DateTime?
  status            UserStatus @default(UNVERIFIED)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?

  sessions          Session[]
  phoneVerifications PhoneVerification[]
  emailVerifications EmailVerification[]
  passwordResetTokens PasswordResetToken[]

  @@index([email])
  @@index([phoneNumber])
  @@index([status])
}
```

### Session

```prisma
model Session {
  id              String    @id @default(cuid())
  userId          String
  tokenHash       String
  refreshTokenId  String?   @unique
  expiresAt       DateTime
  revokedAt       DateTime?
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

### PhoneVerification

```prisma
model PhoneVerification {
  id            String    @id @default(cuid())
  userId        String
  otpHash       String
  attempts      Int       @default(0)
  expiresAt     DateTime
  consumedAt    DateTime?
  createdAt     DateTime  @default(now())

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### EmailVerification

```prisma
model EmailVerification {
  id            String    @id @default(cuid())
  userId        String
  tokenHash     String
  expiresAt     DateTime
  consumedAt    DateTime?
  createdAt     DateTime  @default(now())

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### PasswordResetToken

```prisma
model PasswordResetToken {
  id            String    @id @default(cuid())
  userId        String
  tokenHash     String
  expiresAt     DateTime
  consumedAt    DateTime?
  createdAt     DateTime  @default(now())

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### UserStatus enum

```prisma
enum UserStatus {
  UNVERIFIED
  ACTIVE
  SUSPENDED
  DEACTIVATED
}
```

## 3. Registration flow

### Flow

1. Validate DTO
2. Normalize email and phone number
3. Check for duplicate email and phone
4. Hash password with Argon2
5. Create `User`
6. Set status to `UNVERIFIED` or `ACTIVE` depending on policy
7. Generate phone OTP and email verification token
8. Store secure hashes only
9. Trigger provider adapter
10. Return safe user payload without password hash

### Response shape

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "phoneNumber": "+251911000000",
    "emailVerified": false,
    "phoneVerified": false,
    "status": "UNVERIFIED"
  }
}
```

## 4. Authentication and session design

### Access token

Use JWT with short expiry, minimal claims:
- `sub`
- `sessionId`
- `iat`
- `exp`

Do not place personal info or full refresh token in the JWT.

### Refresh token

Use secure random refresh tokens. Store a hash or identifier. Rotate on each refresh. Revoke on logout/logout-all.

### Login flow

1. Normalize identifier email/phone input
2. find user by email or phone
3. reject suspended/deactivated user
4. validate password
5. create session record
6. issue access token + refresh token
7. update `lastLoginAt`
8. emit audit event

## 5. Verification abstraction

Create interfaces so Identity does not depend on specific providers.

Example:

```ts
export interface PhoneVerificationProvider {
  sendOtp(phoneNumber: string, otp: string): Promise<void>;
}

export interface EmailVerificationProvider {
  sendVerificationEmail(email: string, token: string): Promise<void>;
}

export interface PasswordResetProvider {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
```

Provide local development adapters that log or simulate delivery without exposing values.

## 6. Security controls

Recommended config values:
- accessTokenTtl: 15 minutes
- refreshTokenTtl: 7 days
- otpTtl: 5 minutes
- otpLength: 6
- otpMaxAttempts: 5
- otpResendCooldown: 60 seconds
- passwordResetTtl: 30 minutes
- loginAttempts: 5 per 15 minutes
- registrationAttempts: 5 per hour

Store values in environment/config using Nest `ConfigService` or `@nestjs/config`.

## 7. Guard and decorator pattern

### Guard

- read bearer token
- validate JWT signature / expiration
- resolve session
- verify session active/not revoked
- verify user status not suspended/deactivated
- attach user to request

### Decorator

```ts
export const CurrentUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
```

## 8. Rate limiting and Redis

Use Redis counters for:
- registration
- login attempts
- OTP requests
- verification attempts
- password reset requests

Keep limit logic behind small helper services and configurable windows.

## 9. Error handling rules

The API should avoid leaking:
- password hashes
- OTP values
- reset tokens
- refresh tokens
- internal DB errors
- stack traces

Return consistent resource and validation errors via the existing Nest exception patterns.

## 10. DTO and validation design

Recommended DTOs:
- `RegisterDto`
- `LoginDto`
- `VerifyPhoneDto`
- `VerifyEmailDto`
- `ResendOtpDto`
- `ForgotPasswordDto`
- `ResetPasswordDto`
- `ChangePasswordDto`
- `RefreshTokenDto`

Use `Zod` and `nestjs-zod` or consistent DTO validation pattern already present in the project.

## 11. Swagger requirements

Every endpoint should have:
- summary
- tags
- request body
- successful response description
- error response description
- role/auth requirement if needed

## 12. Testing strategy

Suggested test classes:
- `identity.service.spec.ts`
- `authentication.service.spec.ts`
- `otp.service.spec.ts`
- `password.service.spec.ts`
- `session.service.spec.ts`
- `auth.controller.spec.ts`
- `verification.controller.spec.ts`
- `password.controller.spec.ts`

Focus on behavior, not mocks only. Prefer real Prisma test container patterns if available.

## 13. Recommended implementation order

1. Prisma schema + migration
2. Identity DTOs/schemas
3. repositories
4. providers and adapters
5. JWT strategy + guard
6. services
7. controllers
8. Redis rate limiting
9. Swagger docs
10. tests
11. final verification

## 14. Future module compatibility

This module should only expose public contracts like:
- `IdentityService`
- `AuthenticationService`
- `CurrentUser` contract

Other modules must not import internal secret repositories or OTP internals.

## 15. Delivery status

This is the implementation blueprint for the actual coding phase. The repo foundation has already been checked and the repo architecture remains a modular monolith, not microservices.
