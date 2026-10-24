# Figma Fixes Checklist for Designer

This to-do list documents items requiring designer clarification or re-export, updated according to the architecture review:

### Rules & Exemption Clarifications
- **Brand Rules**: The Google Sign-In button (`#4285F4`) is **exempt from design tokens** per official Google brand guidelines.
- **Code Tokens to Add (Not Figma Problems)**:
  - `colors.dangerSurface` (`#FEE2E2` / `#FEF2F2`) for light red/salmon error and warning surfaces.
  - `colors.warningText` / gold badge tones (`#D97706`, `#B45309`) for badges like "PRO", "Community Pick", "Authentic Tibeb".
  These are to be added to code tokens, not flagged as Figma errors.
- **Typography & Tap Target Rules**:
  - **Inputs**: 16px minimum (prevents iOS auto-zoom).
  - **Body text**: 14px minimum.
  - **Helper & metadata text**: 12px is acceptable (captions, character counts, helper labels).
  - **Tap targets**: Sub-44px visual elements are fixed in code by extending the hit area (e.g. touch padding/hit targets), not by bloating visual Figma designs.
- **Amharic Export Note**: Blank parentheses `( )` in Amharic text across designs indicate that the PNG export machine lacked an Ethiopic font (e.g. Noto Sans Ethiopic / Abyssinica SIL). The designer must re-export with the Ethiopic font active and provide the raw Amharic string assets from Figma.

---

## 1. Authentication (`01-auth/`)

### `01-auth/01-login-default-desktop.png` & `01-auth/01-login-default-mobile.png`
- **Brand token exemption**: Google OAuth button (`#4285F4`) is exempt from tokens.
- **Code implementation**: Language toggle, "Forgot password?" link, and password visibility eye icon hit areas will be extended to >=44px in code.
- **e. Mobile and desktop versions that differ in structure**:
  - Desktop has a "Remember this device" checkbox, while Mobile omits it and has a promotional banner.
  - *Resolution*: Backend DTO and refresh logic do not support `rememberMe`; remove the checkbox from desktop. Mobile promotional banner moved post-login.

### `01-auth/01-login-incorrect-password-mobile.png`
- **Helper text**: Helper text at 12px is acceptable. "Draft saved" banner is dropped per DECISIONS.md.

### `01-auth/01-login-account-locked-desktop.png` & `01-auth/01-login-account-locked-mobile.png`
- **b. Developer or documentation artifacts to remove**:
  - `01-login-account-locked-mobile.png`: Title and section headers use raw bilingual slash dividers (`"Welcome back/ እንቋዕ ደህና መጡ"` and `"Why did this happen? / ምክንያቱ ምንድን ነው?"`). Strings should be localized dynamically based on active language (`EN|አማ`), not combined with slashes in assets.
- **Code tokens to add**: Error banner background (`#FEE2E2`) is covered by adding `colors.dangerSurface` in code.
- **e. Mobile and desktop versions that differ in structure**:
  - Mobile includes "Login with SMS" and "Telegram ID" buttons. Drop both buttons from Mobile to align with Desktop (backend has no SMS/Telegram auth).

### `01-auth/02-signup-default-mobile.png` & `01-auth/02-signup-validation-error-mobile.png`
- **Brand token exemption**: Google button is exempt.
- **Code tokens to add**: Warning card background (`#FEF2F2`) is covered by `colors.dangerSurface`.
- **Typography & targets**: Checkbox label (12px), character counter (`"6 / 8 chars"`), and validation helpers (12px) are acceptable helper text. Checkbox hit area will be extended to 44px in code.
- **f. Missing desktop version**:
  - Desktop sign up screen is missing from Figma. As decided, desktop sign up reuses the desktop login layout with the signup fields (Email, Phone with `+251`, Password).

### `01-auth/07-forgot-password-*-mobile.png` & `01-auth/07-forgot-password-*-desktop.png`
- **Typography & targets**: 12px footer links and helper text are acceptable; hit areas extended in code.
- **e. Canonical wording**: Adopt desktop body: `"Check your inbox and spam folder. Open the link in the email to choose a new password."`

### `01-auth/08-reset-password-*-mobile.png` & `01-auth/08-reset-password-*-desktop.png`
- **Typography & targets**: Password criteria checklist at 12px is acceptable helper text.
- **e. Canonical heading**: Adopt desktop heading: `"This reset link isn't valid"`.

### `01-auth/09-verify-email-*-mobile.png` & `01-auth/09-verify-email-*-desktop.png`
- **Typography & targets**: 12px footer links are acceptable; hit areas extended in code.
- **e. Canonical body text**: Adopt mobile wording: `"Send a new link to confirm your email."`

---

## 2. Dashboard (`02-dashboard/`)

### `02-dashboard/03-dashboard-default-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Greeting heading displays `", Dawit! 👋"` — preceding Amharic greeting word is missing before comma.
  - Category filter pills display empty parentheses: `"Wedding ( )"`, `"Graduation ( )"`, `"Church ( )"`, `"Bilingual ( )"`.
  - Action button reads `"Create new design ( )"` with empty parentheses.
  - Section headers display empty parentheses: `"Recent Projects ( )"` and `"Recommended for Ethiopian Creators ( )"`.
  - **Action for Designer**: Blank `( )` probably means the PNG export lacked an Ethiopic font. Re-export with Ethiopic font installed and provide Amharic strings from Figma.
- **Code tokens to add**: "PRO" badge amber tone (`#D97706`) is covered by adding `colors.warningText` in code.
- **f. Missing version**: Mobile dashboard layout is missing from Figma.

---

## 3. Onboarding (`03-onboarding/`)

### `03-onboarding/04-onboarding-default-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Heading has an isolated blue `"?"` on a new line below `"Choose a template or set your canvas size"` where Amharic subtitle text was dropped.
  - Navigation buttons and format card labels display empty parentheses: `"Skip for now ( ) ->"`, `"Custom Size ( )"`, `"Continue to Canvas ( )"`.
  - **Action for Designer**: Blank `( )` indicates missing Ethiopic font on export. Designer must re-export and provide Amharic strings.
- **f. Missing version**: Mobile onboarding layout is missing from Figma.

---

## 4. Templates (`04-templates/`)

### `04-templates/05-template-gallery-default-desktop.png` & `04-templates/05-template-gallery-empty-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Category filter pills, search placeholder, template card subtitles, and empty state CTA buttons display empty parentheses `( )`.
  - **Action for Designer**: Blank `( )` indicates missing Ethiopic font on export. Designer must re-export and provide Amharic strings.
- **b. Developer or documentation artifacts to remove**:
  - Top header displays internal designer state tabs: `"Active Gallery (128) Empty State Loading Skeleton"`.
- **f. Missing version**: Mobile gallery layouts are missing from Figma.

### `04-templates/06-template-detail-free-desktop.png` & `04-templates/06-template-detail-loading-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Primary CTA button `"Use this template ( )"` and related section header display empty parentheses.
  - **Action for Designer**: Designer must re-export with Ethiopic font and provide Amharic strings.
- **b. Developer or documentation artifacts to remove**:
  - `06-template-detail-loading-desktop.png`: Button label literally reads `"Loading template details... / ..."`. Replace with animated spinner.
- **Code tokens to add**: "PRO", "Community Pick", and "Authentic Tibeb" amber/gold badges (`#D97706`, `#B45309`) are covered by adding `colors.warningText` in code.
- **f. Missing version**: Mobile free template detail layouts are missing from Figma.

### `04-templates/10-template-detail-paid-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Primary buy button displays empty parentheses: `"Buy Template ( ) • 150 ETB"`.
  - **Action for Designer**: Designer must re-export with Ethiopic font and provide Amharic strings.
- **Code tokens to add**: "40% Off" badge (`#B45309`) covered by `colors.warningText` in code.
- **f. Missing version**: Mobile paid template detail layout is missing from Figma.

---

## 5. Canvas Editor (`05-editor/`)

### `05-editor/11-canvas-editor-default-desktop.png`
- **c. Colors that are not tokens**:
  - Inspector text property inputs display `#0F172A` (slate-900) instead of token `colors.text` (`#3F4851`).
- **f. Missing version**: Mobile editor layout is missing from Figma.

---

## 6. Export Modal (`06-export/`)

### `06-export/12-export-default-desktop.png`
- **b. Developer or documentation artifacts to remove**:
  - Embedded developer state switcher banner: `"STATE SWITCHER: 1. Default (Configure) 2. Rendering... 3. Done 4. Failed"`.
  - Sample pricing string: `"ዋጋ: XXX ETB [Sample]"`.
- **c. Colors that are not tokens**:
  - "Upgrade to Pro" pill button gradient (`#4338CA` -> `#6366F1`) should map to `colors.primary`.
- **f. Missing version**: Mobile export modal layout is missing from Figma.
