# Architecture & Product Decisions

This document records the official product and architectural decisions for the frontend application, reconciling the design specifications in `apps/client/design/` with the NestJS backend (`apps/api`).

---

## 1. Sign Up Fields: Email Only vs Phone Number Requirement

- **Context**:
  - The design in `01-auth/02-signup-default-mobile.png` only displays two inputs: **Email** and **Password** (plus a Terms checkbox).
  - The backend `POST /api/auth/register` strictly requires three fields validated by `registerSchema` in `apps/api/src/modules/identity/dto/register.dto.ts`:
    ```ts
    export const registerSchema = z.object({
      email: z.string().trim().email(),
      phoneNumber: z.string().trim().min(8),
      password: z.string().min(8).max(128)
    });
    ```
- **Options**:
  - **Option A (Recommended)**: Update frontend signup screens to include a **Phone Number** input field (prefixed with Ethiopian country code `+251` and validation for 9-digit local numbers: `9XXXXXXXX` or `7XXXXXXXX`).
  - **Option B**: Make `phoneNumber` optional in the backend `registerSchema` and Prisma user model.
  - **Option C**: Switch registration entirely to Phone Number + Password (dropping Email as primary identifier).

### Decision
**Option A**. Frontend signup includes **Email + Phone (+251 prefix) + Password**. Phone numbers are essential for Ethiopian market user verification and payment flows.

---

## 2. Google OAuth Button: Backend Disabled

- **Context**:
  - Google OAuth buttons are prominently rendered in the designs (`01-auth/01-login-default-*.png` and `01-auth/02-signup-default-mobile.png`).
  - In `apps/api/src/modules/identity/controllers/auth.controller.ts`, the endpoints `GET /api/auth/google` and `GET /api/auth/google/callback` explicitly check:
    ```ts
    const enabled = this.configService.get<string>('GOOGLE_OAUTH_ENABLED') === 'true';
    if (!enabled) {
      throw new NotFoundException('Google OAuth is not enabled');
    }
    ```
    In development and standard deployment, `GOOGLE_OAUTH_ENABLED` is `false`.
- **Options**:
  - **Option A (Recommended)**: Conditionally hide the Google Sign-In button if Google OAuth is disabled in frontend environment configuration (`VITE_GOOGLE_AUTH_ENABLED !== 'true'`), rendering a clean credentials-only form.
  - **Option B**: Render the Google button in a disabled state with a tooltip (`"Google Sign-In is temporarily unavailable"`).
  - **Option C**: Leave button active and allow it to fail with an error toast on click.

### Decision
**Option A**. Hide behind environment flag (`VITE_GOOGLE_AUTH_ENABLED !== 'true'`). When Google OAuth is disabled, render a clean credentials-only form without dead buttons.

---

## 3. "Login with SMS" and "Telegram ID" in Account Locked

- **Context**:
  - The mobile screen `01-auth/01-login-account-locked-mobile.png` features an "ACTIVE SESSION PROTECTION" card offering alternative unlock methods: `"Login with SMS"` and `"Telegram ID"`.
  - The desktop screen `01-auth/01-login-account-locked-desktop.png` omits these completely.
  - The backend has **zero implementation** for SMS or Telegram authentication (no endpoints, no Telegram Bot integration, and no SMS gateway adapter).
- **Options**:
  - **Option A (Recommended)**: **Drop** both buttons from the mobile UI. Align mobile layout with desktop by displaying only the countdown lockout timer and the `"Reset password"` link.
  - **Option B**: Render the buttons in a disabled state labeled `"Coming Soon"`.
  - **Option C**: Build a new backend SMS/Telegram auth service.

### Decision
**Option A**. Drop SMS and Telegram login options. Align mobile account locked state with desktop, providing the countdown timer and "Reset password" recovery link.

---

## 4. "Remember This Device" Checkbox: Desktop vs Mobile

- **Context**:
  - `01-auth/01-login-default-desktop.png` includes a `"Remember this device"` checkbox above the Sign In button.
  - `01-auth/01-login-default-mobile.png` omits this checkbox.
- **Code Investigation Finding**:
  - Checked `apps/api/src/modules/identity/dto/login.dto.ts`: `loginSchema` only accepts `identifier` and `password`.
  - Checked `apps/api/src/modules/identity/dto/refresh.dto.ts` and token refresh implementation: only `refreshToken` is accepted; token lifespan is fixed on the server with no optional `rememberMe` flag or conditional expiration logic.

### Decision
**Remove the checkbox from desktop**. Since no `rememberMe` option exists in the backend login DTO or refresh-token code, removing the checkbox from desktop avoids offering a non-functional control.

---

## 5. Account Locked State: Backend Status Code and Error Shape

- **Context**:
  - When rate limiting triggers on login attempts, the backend returns status `429 Too Many Requests`.
  - The client needs a deterministic method to determine the lockout countdown duration.

### Decision
Use **HTTP status 429**. Parse the lockout duration by:
1. Reading the `Retry-After` header if present;
2. Falling back to reading the message/timestamp payload from the error response body;
3. Falling back to a 900s (15-minute) default window if neither is specified.

---

## 6. Paid Template Detail (402 Payment Required)

- **Context**:
  - In `04-templates/10-template-detail-paid-desktop.png`, paid templates feature a `"Buy Template • 150 ETB"` button.
  - Payment gateway infrastructure (Telebirr, CBE Birr) is not yet active in the backend (`POST /api/templates/:id/use` returns 402 with `"Payment functionality coming soon"`).

### Decision
**Option A** (display explanatory modal plus `"Coming soon"` badge on paid templates), to be implemented later when the template detail page is built.

---

## 7. Additional Clarifications & New Guidelines

### Decision: Deferred
Clarifications for non-auth workflows (onboarding project generation, concurrent editor 409 conflict modals, client-side canvas rasterization export, and Ge'ez font bundling) are deferred until their respective implementation phases.

### New Guidelines Established:
1. **Language Switcher**: Displays one language at a time via the `EN|አማ` toggle.
2. **"Draft saved" Banner**: Dropped from the login error screen.
3. **Desktop Sign Up Layout**: Reuses the desktop login layout structure populated with the signup input fields (Email, Phone `+251`, Password).
