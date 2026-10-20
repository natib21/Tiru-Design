# Identity Prisma Plan

## Goal

Add only the minimum database models required for personal identity, authentication, and verification without creating organization/workspace entities.

## Models

### 1. User

Purpose:
- personal account record
- login identity
- verification timestamps
- status tracking

Required fields:
- `id`
- `email`
- `phoneNumber`
- `passwordHash`
- `emailVerifiedAt`
- `phoneVerifiedAt`
- `status`
- `createdAt`
- `updatedAt`
- `lastLoginAt`

Indexes:
- `@@index([email])`
- `@@index([phoneNumber])`
- `@@index([status])`

### 2. Session

Purpose:
- server-side authentication/session tracking
- refresh token validation and rotation
- logout/revocation

Required fields:
- `id`
- `userId`
- `tokenHash` or `refreshTokenId`
- `expiresAt`
- `revokedAt`
- `ipAddress`
- `userAgent`
- `createdAt`
- `updatedAt`

### 3. PhoneVerification

Purpose:
- OTP generation and verification for phone

Required fields:
- `id`
- `userId`
- `otpHash`
- `expiresAt`
- `attempts`
- `consumedAt`
- `createdAt`

### 4. EmailVerification

Purpose:
- email verification token issuance

Required fields:
- `id`
- `userId`
- `tokenHash`
- `expiresAt`
- `consumedAt`
- `createdAt`

### 5. PasswordResetToken

Purpose:
- one-time password reset token

Required fields:
- `id`
- `userId`
- `tokenHash`
- `expiresAt`
- `consumedAt`
- `createdAt`

## Enums

```prisma
enum UserStatus {
  UNVERIFIED
  ACTIVE
  SUSPENDED
  DEACTIVATED
}
```

## Security constraints

- Never store plaintext password
- Never store plaintext refresh token
- Never store plaintext OTP or verification tokens
- Use `hash` plus random token IDs where possible
- Use indexes for email and phone lookups
- Use cascade delete where appropriate

## Migration rules

- Add only new models; do not delete or rewrite existing migration history
- Run `pnpm prisma generate` after schema changes
- Run `pnpm prisma validate` before migration creation
- Use Prisma migration commands for the repo rather than manual DB edits
