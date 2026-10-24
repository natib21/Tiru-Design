# Backend API To-Do Items

This document tracks required backend API improvements identified during frontend integration and architecture review:

## 1. Rate Limit Response Enhancement (HTTP 429)
- **Retry-After Header**: The `429 Too Many Requests` response on authentication endpoints should include a standard `Retry-After: <seconds>` HTTP header.
- **Payload Field**: Include a numeric `retryAfterSeconds` integer field in the JSON response body alongside `statusCode`, `error`, `message`, and `timestamp` to simplify countdown handling on client devices.

## 2. Login Rate Limiting Strategy (IP + Email)
- **Carrier IP Sharing**: The current login rate limiting enforces thresholds strictly per client IP (`login:${ip}`). In Ethiopia, mobile telecom carriers (Ethio Telecom, Safaricom Ethiopia) employ carrier-grade NAT (CGNAT), resulting in large cohorts of mobile subscribers sharing identical public IP addresses.
- **Composite Key**: Update the rate limiter to use a composite key combining IP and normalized email/identifier (`login:${ip}:${identifier}`) to prevent legitimate users on shared mobile networks from being blocked by an unrelated user's failed attempts.

## 3. Ethiopian Phone Number Validation & Normalization
- **Format Enforcement**: Enforce strict validation in `registerSchema` (and any future phone-based identity endpoints) for valid Ethiopian phone number formats:
  - International format: `+2519XXXXXXXX` or `+2517XXXXXXXX`
  - Domestic format: `09XXXXXXXX` or `07XXXXXXXX`
- **Canonical Storage**: Automatically normalize all incoming phone numbers to the E.164 canonical format (`+2519XXXXXXXX` / `+2517XXXXXXXX`) before persisting in the database or checking uniqueness.
