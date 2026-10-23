# Screen / Route / Layout
- Mobile: /login | 390px mobile view with app bar, studio badge, welcome text, Google auth button, email/password form, promo card, and footer.
- Desktop: /login | Split layout with left preview and right form card.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- LanguageSelector (packages/ui)
- Badge (shared/ui/badge)

## States
- Visible: default
- Missing: empty submission errors, loading

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes

## Strings
login.version_badge = "Tiru Studio v2.4"
login.title = "Welcome back"
login.title.am = "TODO_AM (copy from Figma)"
login.subtitle = "Log in to continue designing •"
login.subtitle.am = "TODO_AM (copy from Figma)"
login.google_button = "Continue with Google"
login.divider = "OR •"
login.divider.am = "TODO_AM (copy from Figma)"
login.email_label = "Email address"
login.email_label.am = "TODO_AM (copy from Figma)"
login.password_label = "Password"
login.password_label.am = "TODO_AM (copy from Figma)"
login.password_placeholder = "Enter your password"
login.forgot_password = "Forgot password?"
login.forgot_password.am = "TODO_AM (copy from Figma)"
login.submit_button = "Log in •"
login.submit_button.am = "TODO_AM (copy from Figma)"
login.promo_title = "Ethiopian Creative Suite"
login.promo_badge = "PRO"
login.promo_desc = "Native Ge'ez typography • 80+"
login.promo_desc.am = "TODO_AM (copy from Figma)"
login.no_account = "Don't have an account?"
login.signup = "Sign up •"
login.signup.am = "TODO_AM (copy from Figma)"
login.footer_security = "256-bit Secure • Addis Ababa, ET"

## Open questions
- Unclear why "Remember this device" checkbox present on Desktop is omitted on Mobile Default.
