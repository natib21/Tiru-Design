# Figma Fixes Checklist for Designer

This to-do list documents design discrepancies identified during the D0/D1 design inventory. Items are grouped by screen flow and identified by file name. Issues are restricted strictly to the required categories:
- **a.** Missing or cut-off Amharic text
- **b.** Developer or documentation artifacts to remove
- **c.** Colors that are not tokens
- **d.** Text under 16px or tap targets under 44px on mobile
- **e.** Mobile and desktop versions that differ in wording or structure
- **f.** Missing desktop or mobile versions

---

## 1. Authentication (`01-auth/`)

### `01-auth/01-login-default-desktop.png` & `01-auth/01-login-default-mobile.png`
- **c. Colors that are not tokens**: Google OAuth button uses `#4285F4` (Google blue). Nearest token is `colors.primary` (`#2563EB`).
- **d. Text under 16px or tap targets under 44px on mobile**:
  - `01-login-default-mobile.png`: Top language switcher (`EN | አማ`) is ~32px tall; below the 44px minimum tap target.
  - `01-login-default-mobile.png`: "Forgot password?" inline text link has a tap height of ~28px (below 44px).
  - `01-login-default-mobile.png`: Password visibility eye icon is ~24x24px without tap padding (below 44px).
- **e. Mobile and desktop versions that differ in wording or structure**:
  - Desktop has a "Remember this device" checkbox.
  - Mobile omits the checkbox and adds an "Ethiopian Creative Suite PRO" promotional banner card.
  - *Recommendation*: Desktop is correct for standard auth; add "Remember this device" to Mobile and move promotional upsells to dashboard or post-login.

### `01-auth/01-login-incorrect-password-mobile.png`
- **d. Text under 16px on mobile**: Draft notification banner text (`"Draft saved 2 hours ago • ..."`) is ~12px; below the 16px minimum to prevent auto-zoom on mobile.

### `01-auth/01-login-account-locked-desktop.png` & `01-auth/01-login-account-locked-mobile.png`
- **b. Developer or documentation artifacts to remove**:
  - `01-login-account-locked-mobile.png`: Title and section headers use raw bilingual slash dividers (`"Welcome back/ እንቋዕ ደህና መጡ"` and `"Why did this happen? / ምክንያቱ ምንድን ነው?"`). Strings should be localized dynamically based on active language, not combined with slashes in design assets.
- **c. Colors that are not tokens**: Error banner background uses a light salmon tint (`#FEE2E2` / `rgba(220, 38, 38, 0.08)`). `tokens.colors` only defines `danger: '#DC2626'`.
- **d. Text under 16px or tap targets under 44px on mobile**:
  - `01-login-account-locked-mobile.png`: "Why did this happen?" explanation is ~12px; lockout subtext is ~11px (under 16px).
  - `01-login-account-locked-mobile.png`: "Login with SMS" and "Telegram ID" buttons have a tap height of ~36px (below 44px).
- **e. Mobile and desktop versions that differ in wording or structure**:
  - Mobile (`395x1340px`) introduces an "ACTIVE SESSION PROTECTION" card with "Login with SMS" and "Telegram ID" buttons.
  - Desktop completely omits these elements, showing only the lockout countdown timer and password reset CTA.
  - *Recommendation*: Backend does not support SMS or Telegram authentication. Drop SMS and Telegram buttons from Mobile to match Desktop.

### `01-auth/02-signup-default-mobile.png` & `01-auth/02-signup-validation-error-mobile.png`
- **c. Colors that are not tokens**:
  - `02-signup-default-mobile.png`: Google button blue `#4285F4` (nearest token: `colors.primary` `#2563EB`).
  - `02-signup-validation-error-mobile.png`: Salmon warning card background `#FEF2F2` (nearest token: `colors.danger` `#DC2626`).
- **d. Text under 16px or tap targets under 44px on mobile**:
  - `02-signup-default-mobile.png`: Terms of Service and Privacy Policy checkbox label text is ~12px (under 16px).
  - `02-signup-default-mobile.png`: Checkbox tap target is ~20x20px with no touch padding (below 44px).
  - `02-signup-validation-error-mobile.png`: Password character counter (`"6 / 8 chars"`) and validation helper messages are ~12px (under 16px).
- **f. Missing desktop or mobile versions**:
  - **Completely missing Desktop version** (`01-auth/02-signup-default-desktop.png` and validation states).

### `01-auth/07-forgot-password-*-mobile.png` & `01-auth/07-forgot-password-*-desktop.png`
- **d. Text under 16px or tap targets under 44px on mobile**:
  - Language toggle (`EN | አማ`) is ~32px (below 44px).
  - Footer copyright and navigation links ("Privacy", "Help") are ~12px (under 16px).
  - "Back to log in" link has a tap height of ~28px (below 44px).
- **e. Mobile and desktop versions that differ in wording or structure**:
  - `07-forgot-password-link-sent-desktop.png` body text: `"Check your inbox and spam folder. Open the link in the email to choose a new password."`
  - `07-forgot-password-link-sent-mobile.png` body text: `"Open the link in your email to choose a new password. If it hasn't arrived, check your spam folder."`
  - *Recommendation*: Desktop wording is clearer and front-loads the key action. Decision needed for canonical copywriting.

### `01-auth/08-reset-password-*-mobile.png` & `01-auth/08-reset-password-*-desktop.png`
- **d. Text under 16px or tap targets under 44px on mobile**:
  - Password criteria checklist ("At least 8 characters...", "One uppercase...") is ~12px (under 16px).
  - Show/hide password eye icon tap target is ~24x24px (below 44px).
  - Language toggle (`EN | አማ`) is ~32px (below 44px).
- **e. Mobile and desktop versions that differ in wording or structure**:
  - `08-reset-password-link-expired-desktop.png` heading: `"This reset link isn't valid"`
  - `08-reset-password-link-expired-mobile.png` heading: `"Reset link expired"`
  - *Recommendation*: Desktop heading is more accurate because links can be invalid either from expiration or from already being consumed. Decision needed.

### `01-auth/09-verify-email-*-mobile.png` & `01-auth/09-verify-email-*-desktop.png`
- **d. Text under 16px or tap targets under 44px on mobile**:
  - Language toggle (`EN | አማ`) is ~32px (below 44px).
  - Footer links and copyright are ~12px (under 16px).
- **e. Mobile and desktop versions that differ in wording or structure**:
  - `09-verify-email-link-expired-desktop.png` body: `"Send a new email to confirm your address."`
  - `09-verify-email-link-expired-mobile.png` body: `"Send a new link to confirm your email."`
  - *Recommendation*: Mobile wording ("Send a new link...") is more accurate since a link token is what expires. Decision needed.

---

## 2. Dashboard (`02-dashboard/`)

### `02-dashboard/03-dashboard-default-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Greeting heading displays `", Dawit! 👋"` — the preceding Amharic greeting word (e.g. `እንደምን አደርክ` / `ሰላም`) is completely missing before the comma.
  - Category filter pills display empty parentheses: `"Wedding ( )"`, `"Graduation ( )"`, `"Church ( )"`, `"Bilingual ( )"`.
  - Primary action button reads `"Create new design ( )"` with empty parentheses.
  - Section headers display empty parentheses: `"Recent Projects ( )"` and `"Recommended for Ethiopian Creators ( )"`.
- **c. Colors that are not tokens**:
  - "PRO" badge uses amber/gold `#D97706` (nearest token: `colors.warning` `#FACC15`).
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile version** (`02-dashboard/03-dashboard-default-mobile.png`).

---

## 3. Onboarding (`03-onboarding/`)

### `03-onboarding/04-onboarding-default-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Heading has an isolated blue `"?"` on a new line below `"Choose a template or set your canvas size"` where Amharic subtitle text was dropped.
  - Navigation buttons and format card labels display empty parentheses: `"Skip for now ( ) ->"`, `"Custom Size ( )"`, `"Continue to Canvas ( )"`.
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile version** (`03-onboarding/04-onboarding-default-mobile.png`).

---

## 4. Templates (`04-templates/`)

### `04-templates/05-template-gallery-default-desktop.png` & `04-templates/05-template-gallery-empty-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Category filter pills display empty parentheses: `"Wedding ( )"`, `"Graduation ( )"`, `"Church & Faith ( )"`, `"Business ( )"`, `"Events & Concerts ( )"`, `"Bilingual ( )"`, `"Free ( )"`, `"Paid ( )"`.
  - Search input placeholder: `"Search templates by name, keyword, or Ge'ez tag (e.g., , , )..."`.
  - Template card subtitles under titles have empty parenthetical spaces (e.g. `"Habesha Gold Wedding ( )"`).
  - Empty state title: `"No templates found ( )"`.
  - Empty state CTA buttons: `"Reset All Filters ( )"`, `"Request Custom Template ( )"`, `"Start Blank Design ( )"`.
- **b. Developer or documentation artifacts to remove**:
  - `05-template-gallery-default-desktop.png`: Top header displays internal designer state tabs: `"Active Gallery (128) Empty State Loading Skeleton"`.
  - `05-template-gallery-empty-desktop.png`: Header displays internal designer state tabs: `"Active Gallery Empty State (Active) Loading Skeleton"`.
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile versions** (`04-templates/05-template-gallery-default-mobile.png`, `04-templates/05-template-gallery-empty-mobile.png`).

### `04-templates/06-template-detail-free-desktop.png` & `04-templates/06-template-detail-loading-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Primary CTA button displays empty parentheses: `"Use this template ( )"`.
  - Related templates section header displays empty parentheses: `"Similar Wedding Templates ( )"`.
- **b. Developer or documentation artifacts to remove**:
  - `06-template-detail-loading-desktop.png`: Primary button label literally reads `"Loading template details... / ..."`. Replace with an animated spinner and standard localized label.
- **c. Colors that are not tokens**:
  - "PRO", "Community Pick", and "Authentic Tibeb" badges use amber/gold `#D97706` and `#B45309` (nearest token: `colors.warning` `#FACC15`).
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile versions** (`04-templates/06-template-detail-free-mobile.png`, `04-templates/06-template-detail-loading-mobile.png`).

### `04-templates/10-template-detail-paid-desktop.png`
- **a. Missing or cut-off Amharic text**:
  - Primary buy button displays empty parentheses: `"Buy Template ( ) • 150 ETB"`.
  - Related section header displays empty parentheses: `"Similar Wedding Templates ( )"`.
- **c. Colors that are not tokens**:
  - "40% Off" discount badge uses `#B45309` (nearest token: `colors.warning` `#FACC15`).
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile version** (`04-templates/10-template-detail-paid-mobile.png`).

---

## 5. Canvas Editor (`05-editor/`)

### `05-editor/11-canvas-editor-default-desktop.png`
- **c. Colors that are not tokens**:
  - Inspector text property inputs display `#0F172A` (slate-900) instead of token `colors.text` (`#3F4851`) or `colors.foreground`.
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile version** (`05-editor/11-canvas-editor-default-mobile.png`).

---

## 6. Export Modal (`06-export/`)

### `06-export/12-export-default-desktop.png`
- **b. Developer or documentation artifacts to remove**:
  - Embedded developer state switcher banner across the top of the modal dialog: `"STATE SWITCHER: 1. Default (Configure) 2. Rendering... 3. Done 4. Failed"`.
  - Sample pricing string inside option description: `"ዋጋ: XXX ETB [Sample]"`.
- **c. Colors that are not tokens**:
  - "Upgrade to Pro" pill button uses an untokenized deep blue-purple gradient (`#4338CA` -> `#6366F1`). Nearest token is `colors.primary` (`#2563EB`).
- **f. Missing desktop or mobile versions**:
  - **Completely missing Mobile version** (`06-export/12-export-default-mobile.png`).
