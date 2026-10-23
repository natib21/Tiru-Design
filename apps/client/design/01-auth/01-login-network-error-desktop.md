# Screen / Route / Layout
- Mobile: /login | Mobile form displaying inline connectivity banner with preserved input values and retry CTA.
- Desktop: /login | Split layout with alert banner for network failure above preserved credentials.

## Components used
- AuthCard (packages/ui)
- Alert (packages/ui/alert)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- WifiOffIcon (lucide-react)

## States
- Visible: error (network / offline)
- Missing: auto-reconnect spinner, offline banner

## Data and backend
- Endpoint: POST /auth/login (fails at transport layer or 503 Service Unavailable)
- Exists today: yes (handled via client error boundary/interceptor)

## Strings
login.network_error.welcome_title = "Welcome back"
login.network_error.welcome_title.am = "TODO_AM (copy from Figma)"
login.network_error.alert_title = "Couldn't connect"
login.network_error.alert_desc = "Check your internet connection and try again. Your email and password are still here."
login.network_error.google_button = "Continue with Google"
login.network_error.email_label = "Email address"
login.network_error.email_label.am = "TODO_AM (copy from Figma)"
login.network_error.password_label = "Password"
login.network_error.password_label.am = "TODO_AM (copy from Figma)"
login.network_error.remember_device = "Remember this device"
login.network_error.forgot_password = "Forgot password?"
login.network_error.submit_button = "Try again"
login.network_error.submit_button.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear if password field should retain value upon network errors (security vs UX trade-off).
