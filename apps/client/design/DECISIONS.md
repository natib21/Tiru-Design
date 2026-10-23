# Architecture & Product Decisions Needed Before Implementation

This document outlines the product and architectural decisions requiring human confirmation before building the frontend application, based on the gap analysis between `apps/client/design/` and the NestJS backend (`apps/api`).

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
- **Recommendation**:
  - **Choose Option A**. In the Ethiopian market, phone numbers are essential for user verification, mobile wallet payments (Telebirr, CBE Birr), and SMS notifications. The frontend should match the backend contract by adding the Phone Number field.

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
- **Recommendation**:
  - **Choose Option A**. Presenting disabled or broken authentication buttons degrades user trust and clutters the UI. When enabled in the backend with client credentials, the button can be revealed automatically.

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
- **Recommendation**:
  - **Choose Option A**. The desktop design is already clean and functional with standard rate-limit recovery. Removing dead buttons eliminates dead-ends for users.

---

## 4. "Remember This Device" Checkbox: Desktop vs Mobile

- **Context**:
  - `01-auth/01-login-default-desktop.png` includes a `"Remember this device"` checkbox above the Sign In button.
  - `01-auth/01-login-default-mobile.png` omits this checkbox and instead includes a promotional upsell banner for "Ethiopian Creative Suite PRO".
  - The backend supports persistent refresh tokens via HTTP cookies and token refresh endpoints.
- **Options**:
  - **Option A (Recommended)**: Add the `"Remember this device"` checkbox to the mobile login screen as well, ensuring platform consistency.
  - **Option B**: Remove the checkbox from desktop and default all successful logins to persistent refresh tokens (30 days).
  - **Option C**: Retain the platform discrepancy as-is.
- **Recommendation**:
  - **Choose Option A**. Giving users explicit control over session persistence is standard security practice across both mobile and desktop browsers.

---

## 5. Account Locked State: Backend Status Code and Error Shape

- **Context**:
  - When a user enters incorrect credentials multiple times, the backend rate limiter triggers.
  - In `apps/api/src/modules/identity/controllers/auth.controller.ts`, `AuthController.login` calls `rateLimitService.enforce('login:${ip}', { maxAttempts: 5, windowSeconds: 900 })`.
- **Backend Behavior**:
  - Status Code: **`429 Too Many Requests`** (`HttpStatus.TOO_MANY_REQUESTS`).
  - Serialized Error Response (formatted by `HttpExceptionFilter`):
    ```json
    {
      "statusCode": 429,
      "message": "Rate limit exceeded. Try again after 2026-10-23T14:35:00.000Z",
      "error": "TOO_MANY_REQUESTS",
      "timestamp": "2026-10-23T14:20:00.000Z",
      "path": "/api/auth/login"
    }
    ```
- **Client Implementation Strategy**:
  - On receiving status `429`, the client extracts the lockout expiration timestamp from the response (or defaults to a 15-minute / 900-second window) and transitions to the `Account Locked` screen (`01-login-account-locked`).
  - The screen runs a dynamic client-side countdown timer matching `remainingSeconds` until re-enabling the form.

---

## 6. Paid Template Detail (402 Payment Required)

- **Context**:
  - In `04-templates/10-template-detail-paid-desktop.png`, paid templates feature a `"Buy Template • 150 ETB"` button.
  - The backend `POST /api/templates/:id/use` explicitly checks `template.priceMinor > 0` and throws:
    ```json
    {
      "statusCode": 402,
      "message": "This template requires purchase. Payment functionality coming soon.",
      "error": "PAYMENT_REQUIRED"
    }
    ```
  - Payment gateway infrastructure (Telebirr, CBE Birr) is not yet implemented.
- **Options**:
  - **Option A (Recommended)**: If a user clicks `"Buy Template"`, display an accessible modal dialog:
    > **"Payment Gateway Coming Soon"**  
    > *"Template purchases with Telebirr and CBE Birr are currently in testing. Free templates can be cloned immediately."*  
    > With a primary CTA: `"Explore Free Templates"`.
  - **Option B**: Disable the `"Buy Template"` button directly on the template detail page with a `"Coming Soon"` pill badge.
  - **Option C**: Provide a sandbox test purchase button that immediately marks the template as owned in local storage.
- **Recommendation**:
  - **Choose Option A** with Option B's badge indicator: clearly mark paid templates as `"Coming Soon"` while gracefully catching any 402 responses with the explanatory modal.

---

## 7. Additional Clarifications from D0 Screen Specs

### A. Onboarding Skip Action (`/onboarding`)
- **Question**: What happens when the user clicks `"Skip for now ( ) ->"`?
- **Recommendation**: Call `POST /api/projects` to initialize a default blank project (Instagram Post format: `1080 x 1080 px`) titled `"Untitled Project"`, then immediately redirect to `/editor/:projectId`.

### B. Concurrent Editor Conflict Resolution (`HTTP 409`)
- **Question**: How should the editor respond if another tab or session updates the project during editing?
- **Backend Fact**: `PUT /api/projects/:id/content` enforces optimistic concurrency control using an integer `version` field. On version mismatch, the backend returns `409 Conflict` with `currentVersion`.
- **Recommendation**: Display a non-blocking toast or modal dialog:
  > *"This design was updated in another window. Would you like to reload the newest version or overwrite?"*

### C. Client-Side Export Fallback
- **Question**: How should Export work given the backend BullMQ rendering queue does not expose an HTTP trigger endpoint in OpenAPI?
- **Recommendation**: Implement direct client-side canvas rasterization via HTML5 Canvas (`toDataURL` / `toBlob`) for PNG and JPEG downloads. When the backend render queue endpoints are exposed in a future sprint, seamlessly swap the handler to server-authoritative rendering.

### D. Ge'ez Font Support
- **Question**: Which Ge'ez fonts should be bundled for preview and canvas rendering?
- **Recommendation**: Bundle `Noto Sans Ethiopic` via `@fontsource/noto-sans-ethiopic` (already installed in client dependencies) and load `Abyssinica SIL` from Google Fonts to power the Ge'ez font selector on both Free and Paid template detail pages.
