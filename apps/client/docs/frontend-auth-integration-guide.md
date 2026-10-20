# Client Frontend Authentication Integration Guide

## Goal

This guide explains how the existing client and backoffice apps should integrate with the Identity API during Phase 2 without redesigning the current frontend structure.

## Current frontend state

The current client app already contains:
- `apps/client/src/features/auth` with login/signup/reset/verify flows
- `apps/client/src/lib/api/client.ts` for API requests
- `apps/client/src/constants/app.ts` for endpoint constants
- auth form schemas under `apps/client/src/features/auth/schemas/auth.ts`

This means the backend should fit the existing front-end conventions instead of inventing a new shape.

## Current client assumptions

The client expects auth endpoints under a pattern similar to:

```ts
export const AUTH_ENDPOINTS = {
  session: '/api/v1/auth/session',
  login: '/api/v1/auth/login',
  signup: '/api/v1/auth/signup',
  logout: '/api/v1/auth/logout',
  verifyPhone: '/api/v1/auth/verify-phone',
  verifyEmail: '/api/v1/auth/verify-email',
  forgotPassword: '/api/v1/auth/forgot-password',
  resetPassword: '/api/v1/auth/reset-password',
};
```

This is close to the backend design direction, but the actual API is currently mounted under the Nest global prefix `api`, and the app exposes health endpoints as unprefixed endpoints.

## Recommended backend route design

To keep the client flow predictable, the Identity routes should be defined in the API as:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/verify-phone`
- `POST /api/auth/resend-phone-otp`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-email-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`

For compatibility with the existing client structure, the backend can also expose a consistent session contract:

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "phoneNumber": "+251911234567",
    "emailVerified": false,
    "phoneVerified": false,
    "status": "UNVERIFIED"
  },
  "accessToken": "...",
  "refreshToken": "...",
  "expiresAt": "2026-01-01T00:00:00.000Z"
}
```

## Response contract guidance

The client already expects a `Session`-like object. Keep responses predictable and consistent:

- `login` -> return session payload plus token metadata
- `signup` -> return user payload, not raw DB rows
- `verifyPhone` -> return updated user/session state
- `verifyEmail` -> return updated user/session state
- `forgotPassword` -> return success/no-sensitive-data message
- `resetPassword` -> return success message only

## Token handling

The frontend already likely stores session data in its query cache and uses route guards.

For the backend, follow this pattern:
- access token: short-lived JWT, sent in `Authorization: Bearer ...`
- refresh token: longer-lived, stored as secure hashed server-side value, rotated on use
- logout: revoke server-side session
- refresh endpoint: rotates refresh token and returns a new access token pair

## Payload shapes to keep stable

### Register

```json
{
  "email": "user@example.com",
  "phoneNumber": "+251911234567",
  "password": "StrongPass123!"
}
```

### Login

```json
{
  "identifier": "user@example.com",
  "password": "StrongPass123!"
}
```

or:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

The client currently uses a generic `loginSchema` but the backend should still support a clean form that is easy to consume on the front end.

### Verify phone

```json
{
  "phoneNumber": "+251911234567",
  "otp": "123456"
}
```

### Verify email

```json
{
  "token": "..."
}
```

### Forgot password

```json
{
  "email": "user@example.com"
}
```

### Reset password

```json
{
  "token": "...",
  "password": "NewStrongPass123!"
}
```

## Recommended client integration notes

### For existing auth pages

The current client pages in `apps/client/src/features/auth/pages` already map to the flows needed by the backend:
- SignupPage
- LoginPage
- VerifyPhonePage
- VerifyEmailPage
- ForgotPasswordPage
- ResetPasswordPage

The backend should align to these page semantics rather than inventing a different user flow.

### For API client code

The current abstraction in `apps/client/src/lib/api/client.ts` is the right place for auth-aware requests. The backend should return consistent error codes and payload shapes so the UI can handle:
- unauthorized
- validation
- forbidden
- not_found
- rate_limited

### For session state

The client store/hook pattern in `apps/client/src/features/auth/hooks/use-auth.ts` should remain valid if the backend returns a consistent `Session` object.

## Frontend integration checklist

- confirm endpoint URLs follow `/api/auth/...`
- ensure the backend returns `user` and token metadata
- ensure the app handles failed login without revealing account existence
- ensure verification pages use OTP/token flows that match API contracts
- ensure reset flows only return success messages without exposing token values

## Important non-goals for this phase

- no redesign of the client app structure
- no organization creation in signup
- no workspace or project creation in auth flow
- no backend UI work
- no unrelated client route rewrites

## Summary

The existing client architecture is already aligned with a modular auth feature. The backend should support that same flow with predictable naming, session semantics, and error behavior, while keeping Identity isolated from organization and workspace logic.
