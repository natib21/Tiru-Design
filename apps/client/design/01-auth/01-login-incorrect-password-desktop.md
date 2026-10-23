# Screen / Route / Layout
- Mobile: /login | Mobile form with top failure banner, red-highlighted password input, and helper error text.
- Desktop: /login | Split layout with inline top alert banner, red-bordered password input, and revised CTA.

## Components used
- AuthCard (packages/ui)
- Alert (packages/ui/alert)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput with error border (packages/ui/password-input)
- LanguageSelector (packages/ui)

## States
- Visible: error (credentials rejection)
- Missing: loading, attempt threshold warning

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes (returns 401 Unauthorized with message "Invalid credentials")

## Strings
login.error.auth_failed_title = "Authentication failed"
login.error.auth_failed_desc = "Please check your credentials and try again."
login.error.google_button = "Continue with Google"
login.error.divider = "OR LOG IN WITH EMAIL"
login.error.email_label = "Email address"
login.error.email_label.am = "TODO_AM (copy from Figma)"
login.error.password_label = "Password"
login.error.password_label.am = "TODO_AM (copy from Figma)"
login.error.field_message = "Incorrect password. Please try again."
login.error.field_message.am = "TODO_AM (copy from Figma)"
login.error.remember_device = "Remember this device"
login.error.forgot_password = "Forgot password?"
login.error.submit_button = "Try logging in again"
login.error.submit_button.am = "TODO_AM (copy from Figma)"
login.error.no_account = "Don't have an account?"
login.error.signup_link = "Sign up"
login.error.signup_link.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear whether multiple failures show "X attempts left before lockout".
