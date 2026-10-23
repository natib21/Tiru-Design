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

### A. Colors that are not tokens
- **`05-editor/11-canvas-editor-default-desktop.png`**: Text property inputs display `#0F172A` (slate-900) instead of the design token `colors.text` (`#3F4851`) or `colors.foreground`.
- **`01-auth/01-login-default-desktop.png` & Mobile**: Google OAuth button uses Google blue `#4285F4`; not in tokens.
- **`01-auth/01-login-account-locked-desktop.png` & `01-auth/02-signup-validation-error-mobile.png`**: Error banner background uses a light salmon tint (`#FEE2E2` or `rgba(220, 38, 38, 0.08)`), but `tokens.colors` only defines `danger: '#DC2626'`.
- **`04-templates/06-template-detail-free-desktop.png`, `04-templates/10-template-detail-paid-desktop.png`, `02-dashboard/03-dashboard-default-desktop.png`**: Golden badge highlights ("PRO", "Community Pick", "40% Off", "Authentic Tibeb") use amber/gold tones (`#D97706`, `#B45309`), whereas `tokens.colors` only provides `warning: '#FACC15'`.
- **`06-export/12-export-default-desktop.png`**: "Upgrade to Pro" pill button uses an untokenized deep blue-purple gradient.

### B. Text that looks under 16px on mobile (< 16px triggers iOS Safari auto-zoom and impairs legibility)
- **`01-auth/02-signup-default-mobile.png`**: Terms of Service and Privacy Policy checkbox label is ~12px.
- **`01-auth/02-signup-validation-error-mobile.png`**: Character counter `"6 / 8 chars"` and helper validation text are ~12px.
- **`01-auth/01-login-account-locked-mobile.png`**: "Why did this happen?" body text is ~12px; security lockout subtext is ~11px.
- **`01-auth/01-login-incorrect-password-mobile.png`**: Draft banner text `"Draft saved 2 hours ago • ..."` is ~12px.
- **`01-auth/07-forgot-password-default-mobile.png` & `01-auth/07-forgot-password-link-sent-mobile.png`**: Footer links ("Privacy", "Help") and copyright text are ~12px.

### C. Tap targets that look under 44px (WCAG 2.5.5 touch target violation)
- **All Mobile screens in `01-auth/`**: The top language toggle (`EN | አማ`) is ~32px tall; below the 44px minimum touch target.
- **`01-auth/02-signup-default-mobile.png`**: Checkbox hit area is ~20px with insufficient clickable padding.
- **`01-auth/01-login-default-mobile.png`**: "Forgot password?" inline link has a target height under 28px.
- **`01-auth/01-login-default-mobile.png` & `01-auth/08-reset-password-default-mobile.png`**: Password show/hide eye icon is ~24x24px without extended tap padding.
- **`01-auth/01-login-account-locked-mobile.png`**: "Telegram ID" and "Login with SMS" buttons have narrow vertical heights (~36px).

### D. Buttons that are not one of the 4 defined types (primary, outline, ghost, icon)
- **`01-auth/01-login-account-locked-mobile.png`**: "Login with SMS" and "Telegram ID" use an undocumented light-tinted icon pill style.
- **`06-export/12-export-default-desktop.png`**: "Upgrade to Pro" button is styled as a saturated gradient pill with mixed Amharic/English text.
- **`02-dashboard/03-dashboard-default-desktop.png` & `04-templates/05-template-gallery-default-desktop.png`**: Filter pills ("Wedding ( )", "Church ( )", etc.) are toggleable tag chips, not standard buttons.
- **`03-onboarding/04-onboarding-default-desktop.png`**: Format selection cards function as interactive selectable tiles with checkmarks, not covered by standard button variants.

### E. Mobile and Desktop versions that differ in structure or wording
- **`01-auth/01-login-account-locked-*`**:
  - *Mobile* (`395x1340px`) introduces an "ACTIVE SESSION PROTECTION" card, "Login with SMS", and "Telegram ID" buttons.
  - *Desktop* completely omits these three elements, displaying only the standard lockout countdown and reset password CTA.
- **`01-auth/01-login-default-*`**:
  - *Desktop* has a "Remember this device" checkbox.
  - *Mobile* omits the checkbox and adds an "Ethiopian Creative Suite PRO" promotional banner.
- **`01-auth/08-reset-password-link-expired-*`**:
  - *Desktop* heading: `"This reset link isn't valid"`.
  - *Mobile* heading: `"Reset link expired"`.
- **`01-auth/07-forgot-password-link-sent-*`**:
  - *Desktop* body: `"Check your inbox and spam folder. Open the link in the email to choose a new password."`.
  - *Mobile* body: `"Open the link in your email to choose a new password. If it hasn't arrived, check your spam folder."`.
- **`01-auth/09-verify-email-link-expired-*`**:
  - *Desktop* body: `"Send a new email to confirm your address."`.
  - *Mobile* body: `"Send a new link to confirm your email."`.

### F. Text that looks cut off or crowded (especially Amharic)
- **`02-dashboard/03-dashboard-default-desktop.png`**:
  - Greeting heading reads `", Dawit! 👋"` — the preceding Amharic greeting word is completely missing.
  - Category filter pills display empty parentheses: `"Wedding ( )"`, `"Graduation ( )"`, `"Church ( )"`.
  - Action button reads `"Create new design ( )"`.
  - Section headers read `"Recent Projects ( )"` and `"Recommended for Ethiopian Creators ( )"`.
- **`04-templates/05-template-gallery-default-desktop.png` & `04-templates/05-template-gallery-empty-desktop.png`**:
  - Filter pills have blank parentheses: `"Wedding ( )"`, `"Graduation ( )"`, `"Church & Faith ( )"`, `"Business ( )"`, `"Events & Concerts ( )"`, `"Bilingual ( )"`, `"Free ( )"`, `"Paid ( )"`.
  - Search bar placeholder: `"Search templates by name, keyword, or Ge'ez tag (e.g., , , )..."`.
  - Template card subtitles under titles have empty parenthetical spaces (e.g. `"Habesha Gold Wedding ( )"`).
  - Empty state title: `"No templates found ( )"`.
  - Buttons: `"Reset All Filters ( )"`, `"Request Custom Template ( )"`, `"Start Blank Design ( )"`.
- **`03-onboarding/04-onboarding-default-desktop.png`**:
  - Heading has a lone blue `"?"` on a new line where Amharic subtitle text was dropped.
  - Buttons and labels display empty parentheses: `"Skip for now ( ) ->"`, `"Custom Size ( )"`, `"Continue to Canvas ( )"`.
- **`04-templates/06-template-detail-free-desktop.png` & `04-templates/10-template-detail-paid-desktop.png`**:
  - Action buttons: `"Use this template ( )"`, `"Buy Template ( ) • 150 ETB"`.
  - Recommended section: `"Similar Wedding Templates ( )"`.

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
