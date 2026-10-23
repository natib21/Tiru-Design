# Screen / Route / Layout
- Mobile: /login | Mobile card with disabled controls, spinner, and loading label inside button.
- Desktop: /login | Two-column split layout with disabled inputs, loading button spinner, and status hint text.

## Components used
- AuthCard (packages/ui)
- Spinner (shared/ui/spinner)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- LanguageSelector (packages/ui)

## States
- Visible: loading
- Missing: timeout error state

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes (in-flight network request)

## Strings
login.loading.welcome_title = "Welcome back"
login.loading.welcome_title.am = "TODO_AM (copy from Figma)"
login.loading.google_button = "Continue with Google"
login.loading.divider = "OR LOG IN WITH EMAIL"
login.loading.email_label = "Email address"
login.loading.email_label.am = "TODO_AM (copy from Figma)"
login.loading.password_label = "Password"
login.loading.password_label.am = "TODO_AM (copy from Figma)"
login.loading.remember_device = "Remember this device"
login.loading.forgot_password = "Forgot password?"
login.loading.button = "Signing in..."
login.loading.button.am = "TODO_AM (copy from Figma)"
login.loading.hint = "Please wait while we connect to your account."
login.loading.no_account = "Don't have an account?"
login.loading.signup_link = "Sign up"
login.loading.signup_link.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear if cancel button or abort controller is available during long connection latency.
