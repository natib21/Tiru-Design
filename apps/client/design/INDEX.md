# Design Folder Inventory & Specification Index

This document provides a comprehensive inventory of all design screens located in `apps/client/design/`, cross-referenced against the existing NestJS backend, the client OpenAPI schema, design tokens, and shared UI components.

---

## 1. Screen Inventory & Backend Readiness

| Screen | Route | Mobile File | Desktop File | Backend Ready? | Endpoint Path in OpenAPI | New Components Needed | Suggested Build Order |
|---|---|---|---|---|---|---|---|
| **Log in** (Default, Loading, Incorrect Pwd, Locked, Network Error) | `/login` | `01-auth/01-login-*-mobile.png` (5 states) | `01-auth/01-login-*-desktop.png` (5 states) | **Yes** | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` | `GoogleSignInButton`, `CountdownTimer`, `ProgressBar` | **1** |
| **Sign up** (Default, Validation Error) | `/signup` | `01-auth/02-signup-*-mobile.png` (2 states) | *None (Missing)* | **Partly** (Endpoint exists in OpenAPI, but backend requires `phoneNumber` while UI only collects `email`). | `POST /auth/register` | `PasswordStrengthBar`, Desktop Sign Up Layout | **2** |
| **Dashboard** | `/dashboard` | *None (Missing)* | `02-dashboard/03-dashboard-default-desktop.png` | **Yes** (All 4 endpoints exist in OpenAPI and backend). | `GET /auth/me`, `GET /workspaces`, `GET /projects`, `GET /templates` | `ProjectCard`, `StorageProgressBar`, Mobile Dashboard Layout | **3** |
| **Onboarding** (Step 1) | `/onboarding` | *None (Missing)* | `03-onboarding/04-onboarding-default-desktop.png` | **Yes** (`POST /projects` creates blank project with chosen dimensions). | `POST /projects` | `StepIndicator`, `PresetFormatCard`, `OnboardingDock` | **4** |
| **Template Gallery** (Default, Empty) | `/templates` | *None (Missing)* | `04-templates/05-template-gallery-default-desktop.png`, `04-templates/05-template-gallery-empty-desktop.png` | **Yes** (Backend template service handles search & listing; endpoint is present in OpenAPI). | `GET /templates` | `PaginationBar`, `CategoryPillGroup`, Mobile Gallery Layout | **5** |
| **Free Template Detail** | `/templates/:id` | *None (Missing)* | `04-templates/06-template-detail-free-desktop.png`, `04-templates/06-template-detail-loading-desktop.png` | **Yes** (Both template retrieval and use/fork endpoints are present in OpenAPI and backend). | `GET /templates/{id}`, `POST /templates/{id}/use` | `InteractiveFontPreviewer`, Mobile Detail Layout | **6** |
| **Forgot password** (Default, Link Sent) | `/forgot-password` | `01-auth/07-forgot-password-*-mobile.png` (2 states) | `01-auth/07-forgot-password-*-desktop.png` (2 states) | **Partly** (Endpoint declared in OpenAPI, but backend `AuthenticationService.forgotPassword` is an un-emailed stub returning `{ ok: true }`). | `POST /auth/forgot-password` | None (uses existing inputs/buttons) | **7** |
| **Reset password** (Default, Expired, Success) | `/reset-password` | `01-auth/08-reset-password-*-mobile.png` (3 states) | `01-auth/08-reset-password-*-desktop.png` (3 states) | **Partly** (Endpoint declared in OpenAPI, but backend `AuthenticationService.resetPassword` is an un-validated stub returning `{ ok: true }`). | `POST /auth/reset-password` | None | **8** |
| **Verify email** (Pending, Expired, Success) | `/verify-email` | `01-auth/09-verify-email-*-mobile.png` (3 states) | `01-auth/09-verify-email-*-desktop.png` (3 states) | **Partly** (Endpoints declared in OpenAPI, but backend verification and email delivery are stubs). | `POST /auth/verify-email`, `POST /auth/resend-email-verification` | None | **9** |
| **Paid Template Detail** | `/templates/:id` | *None (Missing)* | `04-templates/10-template-detail-paid-desktop.png` | **Partly** (`GET /templates/{id}` and `POST /templates/{id}/use` exist; paid returns 402; Telebirr/CBE payment & purchase endpoints not in OpenAPI). | `GET /templates/{id}`, `POST /templates/{id}/use` | `PaymentMethodCard` (exists), `MultiSpreadSelector` | **10** |
| **Canvas Editor** | `/editor/:projectId` | *None (Missing)* | `05-editor/11-canvas-editor-default-desktop.png` | **Partly** (`GET /projects/{id}`, `PUT /projects/{id}/content` autosave, and `POST /projects/{id}/duplicate` exist; asset upload and fonts service not in OpenAPI). | `GET /projects/{id}`, `PUT /projects/{id}/content`, `POST /projects/{id}/duplicate` | `CanvasViewport`, `PropertyInspector`, `Slider`, `ColorPicker`, `FontPicker` | **11** |
| **Export Modal** | `/editor/:projectId` (modal) | *None (Missing)* | `06-export/12-export-default-desktop.png` | **No** (BullMQ processor stub exists, but HTTP export trigger and status polling endpoints are not exposed in OpenAPI). | *None (Missing)* | `FormatRadioCard`, `DpiSelector`, `RenderProgressModal` | **12** |

> **Backend vs OpenAPI Verification Note:**
> The OpenAPI spec at `apps/client/src/shared/api/openapi.json` and TypeScript types at `apps/client/src/shared/api/schema.d.ts` have been regenerated from the NestJS `AppModule`. Public endpoints for `/templates`, `/templates/{id}`, `/templates/{id}/use`, `/admin/templates/*`, `/projects/{id}/content` (autosave), `/projects/{id}/duplicate`, and auth password/verification routes now appear in the schema. Telebirr/CBE payment gateway routes and asynchronous export status endpoints remain to be built in the backend.

---

## 2. Consistency Report

Comparison of all design screens against `packages/ui/src/tokens.ts` and `apps/client/src/shared/ui/`:

### A. Colors & Token Policy
- **Brand Exemption**: The Google Sign-In button (`#4285F4`) is **exempt from design tokens** per official Google brand guidelines.
- **Code Tokens to Add (Not Figma Problems)**:
  - `colors.dangerSurface` (`#FEE2E2` / `#FEF2F2`): Light salmon/red surface tint for error and warning banners (e.g. `01-login-account-locked-desktop.png`, `02-signup-validation-error-mobile.png`).
  - `colors.warningText` / gold badge tones (`#D97706`, `#B45309`): Amber and gold text/border accents for badges ("PRO", "Community Pick", "40% Off", "Authentic Tibeb").
- **Untokenized Colors (Figma Issues)**:
  - `05-editor/11-canvas-editor-default-desktop.png`: Text property inputs display `#0F172A` (slate-900) instead of token `colors.text` (`#3F4851`).
  - `06-export/12-export-default-desktop.png`: "Upgrade to Pro" pill button uses an untokenized deep blue-purple gradient; should map to `colors.primary`.

### B. Typography & Sizing Rules
- **Rule Hierarchy**:
  - **Form Inputs**: 16px minimum (strictly enforced to prevent iOS Safari auto-zoom).
  - **Body Text**: 14px minimum for sustained legibility.
  - **Helper & Secondary Text**: 12px is acceptable (captions, character counters like `"6 / 8 chars"`, validation helper messages, and footer copyright/links).
- **Audit Findings**:
  - `01-auth/02-signup-default-mobile.png`: Terms and Privacy checkbox label is ~12px (acceptable helper text).
  - `01-auth/02-signup-validation-error-mobile.png`: Character counter and helper validation messages are ~12px (acceptable helper text).
  - `01-auth/01-login-account-locked-mobile.png`: Security lockout subtext at ~11px should be raised to 12px minimum.
  - `01-auth/01-login-incorrect-password-mobile.png`: Draft banner text is ~12px; the entire "Draft saved" banner is dropped per DECISIONS.md.
  - `01-auth/07-forgot-password-default-mobile.png` & `09-verify-email-*-mobile.png`: Footer links at ~12px are acceptable.

### C. Tap Targets (Fixed in Code)
- **Policy**: Visual design elements that are under 44px (e.g. 32px language toggles, 20px checkboxes, 24px password show/hide icons, inline links) are **fixed in code by extending the hit area** (via touch target padding and bounding pseudo-elements) to meet WCAG 2.5.5 without altering visual layout proportions.
- Affected components handled in code:
  - Language toggle (`EN | አማ`)
  - Terms checkbox touch hit area
  - Password visibility eye toggle icon button
  - "Forgot password?" and "Back to log in" text links

### D. Buttons that are not one of the 4 defined types (primary, outline, ghost, icon)
- **`01-auth/01-login-account-locked-mobile.png`**: "Login with SMS" and "Telegram ID" use an undocumented light-tinted icon pill style (dropped per DECISIONS.md).
- **`06-export/12-export-default-desktop.png`**: "Upgrade to Pro" button is styled as a saturated gradient pill with mixed Amharic/English text.
- **`02-dashboard/03-dashboard-default-desktop.png` & `04-templates/05-template-gallery-default-desktop.png`**: Filter pills ("Wedding ( )", "Church ( )", etc.) are toggleable tag chips, not standard buttons.
- **`03-onboarding/04-onboarding-default-desktop.png`**: Format selection cards function as interactive selectable tiles with checkmarks.

### E. Mobile and Desktop versions that differ in structure or wording
- **`01-auth/01-login-account-locked-*`**: Mobile introduces SMS and Telegram login; dropped per DECISIONS.md to align with desktop lockout countdown and reset link.
- **`01-auth/01-login-default-*`**: Desktop has "Remember this device" checkbox; dropped per DECISIONS.md because backend has no `rememberMe` DTO or conditional refresh expiry.
- **`01-auth/08-reset-password-link-expired-*`**: Adopt desktop heading: `"This reset link isn't valid"`.
- **`01-auth/07-forgot-password-link-sent-*`**: Adopt desktop body: `"Check your inbox and spam folder. Open the link in the email to choose a new password."`.
- **`01-auth/09-verify-email-link-expired-*`**: Adopt mobile body: `"Send a new link to confirm your email."`.

### F. Amharic Font Rendering & Missing Text
- **Export Font Issue**: Blank parentheses `( )` appearing across Dashboard, Onboarding, and Template Gallery screens indicate that the PNG export machine lacked an Ethiopic font (e.g. Noto Sans Ethiopic / Abyssinica SIL). The designer must re-export with the Ethiopic font active and provide the raw Amharic string assets from Figma.
- Specific instances showing blank `( )`:
  - `02-dashboard/03-dashboard-default-desktop.png`: Heading `", Dawit! 👋"`, category pills `"Wedding ( )"`, button `"Create new design ( )"`.
  - `04-templates/05-template-gallery-default-desktop.png`: Category pills, search placeholder, template card titles, empty state labels.
  - `03-onboarding/04-onboarding-default-desktop.png`: Heading dropped subtitle, navigation buttons `"Skip for now ( ) ->"`, format cards.
  - `04-templates/06-template-detail-free-desktop.png` & `10-template-detail-paid-desktop.png`: Action buttons `"Use this template ( )"`, `"Buy Template ( ) • 150 ETB"`.

### G. Anything that looks like documentation text rather than product text
- **`06-export/12-export-default-desktop.png`**: A developer state switcher bar is embedded across the top of the modal dialog: `"STATE SWITCHER: 1. Default (Configure) 2. Rendering... 3. Done 4. Failed"`.
- **`06-export/12-export-default-desktop.png`**: Sample pricing string displayed as `"ዋጋ: XXX ETB [Sample]"`.
- **`04-templates/06-template-detail-loading-desktop.png`**: Button label literally reads `"Loading template details... / ..."`.
- **`04-templates/05-template-gallery-default-desktop.png`**: Top header displays internal designer state pills: `"Active Gallery (128) Empty State Loading Skeleton"`.
- **`04-templates/05-template-gallery-empty-desktop.png`**: Top breadcrumbs bar displays internal state tabs: `"Active Gallery Empty State (Active) Loading Skeleton"`.
- **`01-auth/01-login-account-locked-mobile.png`**: Title includes raw slash divider `"Welcome back/ እንቋዕ ደህና መጡ"` and `"Why did this happen? / ምክንያቱ ምንድን ነው?"`.

---

## 3. Missing Screens Audit

The following required production screens have **NO design** in `apps/client/design/`:

1. **Sign up - Desktop**: Desktop has zero screens for user registration (only mobile exists).
2. **My Projects (List & Empty State)**: `/projects` has no dedicated screen design (only a 4-item carousel on Dashboard).
3. **My Uploads / Asset Manager**: Tab exists in Canvas Editor sidebar, but no upload management or library screen exists.
4. **Account Settings**: Navigation item exists in sidebar, but no profile/account settings screen exists.
5. **Workspace Settings & Team Management**: Multi-tenancy is in backend, but member invitations, role changes, and workspace switcher screens have no design.
6. **Pricing & Plans**: No pricing tier comparison screen.
7. **Checkout & Payment Gateway**: No checkout modal or Telebirr/CBE Birr payment interaction screen (only "Buy Template" button).
8. **Payment Result**: No payment success or failure confirmation screens.
9. **Billing History**: No invoice/transaction history screen.
10. **404 Not Found**: No customized 404 page.
11. **403 No Permission**: No access denied screen for unauthorized workspace/project actions.
12. **429 Rate Limited (General)**: No general API rate-limiting screen (only auth account lockout exists).
13. **Session Expired Dialog**: No re-authentication or session timeout prompt.
14. **Editor Saving / Offline / Conflict Dialog**: No UI for autosave errors, version mismatch conflicts (which backend returns 409 for), or offline editing.
15. **Read-Only / Viewer Editor**: No UI for members with `VIEWER` role in canvas editor.
16. **Purchase-Required Dialog (402)**: No modal shown when attempting to use a paid template without ownership.
17. **Export Failed State**: No error dialog when background render job fails (only mentioned in developer state switcher).

---

## 4. Synthesis & Recommendations

### Top 5 Best-Defined Screens
1. **Log in (`01-auth/01-login-*`)**: All 5 states (Default, Incorrect Password, Account Locked, Loading, Network Error) are exhaustively designed with clear error alerts and recovery paths.
2. **Reset Password (`01-auth/08-reset-password-*`)**: Clean, unambiguous 3-state flow (Default with password criteria, Link Expired with resend action, and Success confirmation).
3. **Verify Email (`01-auth/09-verify-email-*`)**: High fidelity 3-state flow (Pending verification, Link Expired, and Email Confirmed success).
4. **Forgot Password (`01-auth/07-forgot-password-*`)**: Standard 2-state flow (Email entry card and Link Sent confirmation with resend action).
5. **Free Template Detail (`04-templates/06-template-detail-free-desktop.png`)**: Deeply specified page featuring artboard preview, specifications grid, author badge, deliverables list, and interactive Ge'ez type preview.

### Top 5 Screens Needing the Most Clarification
1. **Sign up (`01-auth/02-signup-*`)**: Completely missing Desktop version. Furthermore, backend `POST /auth/register` requires `phoneNumber`, but the design only collects `email`.
2. **Export Modal (`06-export/12-export-default-desktop.png`)**: Contains developer switcher artifacts and sample text (`XXX ETB [Sample]`). Render progress, completion download, and failure states are completely absent.
3. **Paid Template Detail (`04-templates/10-template-detail-paid-desktop.png`)**: Backend returns 402, but checkout, Telebirr/CBE payment gateway interaction, and purchase verification have no designs.
4. **Canvas Editor (`05-editor/11-canvas-editor-default-desktop.png`)**: Desktop-only with no mobile responsive strategy. Missing conflict resolution dialog (backend 409), asset upload modal, and layer management panel.
5. **Dashboard (`02-dashboard/03-dashboard-default-desktop.png`)**: Missing mobile layout. Widespread font rendering failures leaving blank parentheses `( )` in headings and pills. Links to missing `/projects` and `/assets` pages.

### Recommended Build Order (Backend-Aligned)
1. **Phase 1 — Core Auth & Shell (Backend: 100% Ready)**:
   - Implement `LoginPage` (credentials login, refresh token rotation, error states).
   - Implement `SignupPage` (resolve phone vs email requirement).
   - Implement `ClientLayout` with navigation and session logout.
2. **Phase 2 — Dashboard & Project Management (Backend: 100% Ready)**:
   - Build `DashboardPage` utilizing `GET /workspaces`, `GET /projects`, and `GET /templates`.
   - Build Project creation flow via `Onboarding` and `POST /projects`.
3. **Phase 3 — Template Catalog & Free Usage (Backend: 90% Ready)**:
   - Regenerate OpenAPI types to include `TemplatesController`.
   - Build `Template Gallery` with search and category filtering.
   - Build `Template Detail` (Free) with "Use this template" cloning into project.
4. **Phase 4 — Canvas Editor Foundation (Backend: 80% Ready)**:
   - Wire `EditorPage` with `GET /projects/:id` and autosave `PUT /projects/:id` (with version check handling).
   - Implement property inspector for text styling and positioning.
5. **Phase 5 — Auth Extras & Payments (Backend: Stubs / Needs Build)**:
   - Implement backend email sender and tokens for Forgot/Reset Password and Email Verification.
   - Implement Telebirr/CBE payment gateway for Paid Templates.
   - Implement Render/Export queue endpoints for the Export dialog.
