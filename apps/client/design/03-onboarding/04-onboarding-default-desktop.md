# Screen / Route / Layout
- Mobile: /onboarding | NO MOBILE DESIGN EXISTS.
- Desktop: /onboarding | Wizard view (1478px high): top step navigation, header ("What do you want to make?"), 6 format cards (Social post, Flyer/Poster, Invitation, Certificate, Business card, Menu), bottom action dock with format specs and "Continue to Canvas" button.

## Components used
- Card (shared/ui/card)
- Button (packages/ui/button)
- Badge (shared/ui/badge)
- StepIndicator [NOT IMPLEMENTED]
- OnboardingDock [NOT IMPLEMENTED]

## States
- Visible: default (Flyer/Poster card selected)
- Missing: loading, step 2 design

## Data and backend
- Endpoints: POST /projects (creates project initialized with chosen dimensions), GET /auth/me
- Exists today: yes (POST /projects creates project with name and workspaceId)

## Strings
onboarding.badge = "STUDIO ONBOARDING"
onboarding.step = "STEP 1 OF 2 • 1 2 Canvas Preset Initialization"
onboarding.skip = "Skip for now ( ) ->"
onboarding.pill = "Quick Setup •"
onboarding.title = "What do you want to make?"
onboarding.title_am = "?"
onboarding.subtitle = "Choose a starting point (you can always change this later). We'll set up your canvas with the right pixel-perfect dimensions, bleed zones, and Ethiopian font pairings."
onboarding.card_social = "Social post (1:1 Square - 1080×1080px)"
onboarding.card_flyer = "Flyer / Poster (Popular - Events, Church & Promotions A4 / A3 CMYK)"
onboarding.card_invite = "Invitation (Bespoke - Traditional & Modern wedding cards 5×7")"
onboarding.card_cert = "Certificate (Official - Appreciation, Training & Honors A4 Landscape)"
onboarding.card_biz = "Business card (Dual-Side - Standard & Square formats with QR Code)"
onboarding.card_menu = "Menu (Hospitality - Addis cafes, restaurants & fast foods)"
onboarding.dock_selection = "Selected: Flyer / Poster (A4 Print-Ready) • 35+ Ge'ez fonts included"
onboarding.dock_custom = "Custom Size ( )"
onboarding.btn_continue = "Continue to Canvas ( )"
onboarding.feature_fonts = "Includes 30+ Certified Ge'ez Typefaces"
onboarding.feature_telebirr = "Auto-syncs with Ethiopian Telebirr Assets"
onboarding.feature_print = "Direct Addis Print-Shop Export"

## Open questions
- Step 2 is not designed anywhere in the repository.
- Parenthetical Amharic text missing in several spots.
