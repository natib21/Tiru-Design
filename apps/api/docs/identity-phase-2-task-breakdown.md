# Identity Phase 2 — Task Breakdown

## Scope

This document defines the concrete work required for the Identity & Authentication module in the existing NestJS monolith. It follows the repo’s modular monolith rules and keeps Organizations, Workspaces, Projects, Billing, Marketplace, Templates, Assets, and Notifications out of scope.

## Architectural constraints

- Keep Identity isolated as its own module under `apps/api/src/modules/identity`.
- Do not create an organization during registration.
- Do not create workspaces or memberships in this phase.
- Keep Prisma access inside repositories and services only.
- Keep controllers thin and return safe API responses.
- Use Redis for rate limiting and counters when appropriate.
- Use existing PrismaService, RedisModule, and infrastructure modules wherever possible.

## Workstreams

### 1. Foundation and dependency alignment

Tasks:
- confirm NestJS version compatibility for `@nestjs/config`, `@nestjs/passport`, `@nestjs/jwt`, `@nestjs/swagger`, and `nestjs-zod`.
- ensure `bullmq` and `@nestjs/bullmq` versions match the existing runtime.
- decide whether to use `Zod` directly or `nestjs-zod` for DTO validation.
- confirm `@nestjs/config` usage pattern across the monolith.

Output:
- compatible dependency version set
- config keys defined for auth/security values
- app-level configuration module wired once in the API root

### 2. Prisma schema for Identity

Add minimal models:
- `User`
- `Session`
- `PhoneVerification`
- `EmailVerification`
- `PasswordResetToken`

Important rules:
- no plaintext passwords
- no raw refresh tokens stored in plaintext
- email normalized before storage
- phone stored in normalized international format
- `emailVerifiedAt` and `phoneVerifiedAt` are verification fields, not status fields
- `status` remains separate enum (UNVERIFIED, ACTIVE, SUSPENDED, DEACTIVATED)

### 3. Identity module structure

Create the folder layout:
- `identity.module.ts`
- `controllers/*`
- `services/*`
- `repositories/*`
- `dto/*`
- `schemas/*`
- `guards/*`
- `decorators/*`
- `strategies/*`
- `interfaces/*`
- `index.ts`

### 4. Auth and registration flow

Implement:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/logout-all`

Required behavior:
- email + phone + password registration
- password hashing with Argon2
- duplicate email/phone rejection
- phone OTP generation and email verification token generation
- verification delivery via provider abstractions
- safe registration response without password hashes

### 5. Verification flows

Implement:
- `POST /auth/verify-phone`
- `POST /auth/resend-phone-otp`
- `POST /auth/verify-email`
- `POST /auth/resend-email-verification`

Required behavior:
- secure OTP/token generation
- single-use consumption
- expiration, attempt limits, resend cooldown
- hash storage, never log OTPs or tokens
- provider abstraction for SMS/email delivery adapters

### 6. Password management

Implement:
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`

Required behavior:
- secure reset tokens
- safe account enumeration behavior
- password hashing on reset/change
- session revocation on password reset as appropriate

### 7. JWT and session architecture

Implement:
- access token JWT claims with minimal data only
- refresh token rotation
- session-linked refresh tokens
- revoke on logout/logout-all
- session validity check in guards
- `@CurrentUser()` decorator
- JWT strategy guard for protected routes

### 8. Security controls

Implement/configure:
- registration throttle
- login throttle
- OTP generation rate limits
- OTP verification rate limits
- email verification rate limits
- password reset rate limits
- Redis-based attempt counters where useful
- configurable TTL and length values in Nest config

### 9. Audit event abstraction

Create a simple audit event contract without coupling to a future Audit module implementation.

Examples:
- registration
- login_success
- login_failure
- logout
- phone_verified
- email_verified
- password_reset_requested
- password_reset_completed
- password_changed
- session_revoked

### 10. OpenAPI and API contracts

Document:
- all auth and identity endpoints
- request DTOs
- response DTOs
- auth requirements
- status codes and errors
- Swagger description blocks

### 11. Testing

Write tests for:
- registration
- duplicate email/phone
- invalid weak password
- phone OTP success/failure/expiry/reuse
- email verification success/failure/reuse
- login success/failure
- refresh success/failure/revocation
- logout and logout-all
- password reset flow
- brute-force protection
- rate limiting

### 12. Validation and final quality gate

Run:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm prisma validate`
- `pnpm prisma generate`

Then fix all issues.

## Recommended implementation order

1. Prisma schema models
2. Auth DTOs and schemas
3. Repositories
4. Services
5. JWT guard + strategy + decorator
6. Controller endpoints
7. Rate limiting & security config
8. Swagger docs
9. Tests
10. Full verification

## Expected out-of-scope items

The following are explicitly excluded from this phase:
- Organizations
- Workspaces
- Projects
- Templates
- Marketplace
- Editor
- Billing
- Assets
- Notifications
- Subscription logic
