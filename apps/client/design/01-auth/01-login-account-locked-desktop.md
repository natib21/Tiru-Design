# Screen / Route / Layout
- Mobile: /login | Vertically scrolling locked state with timer alert banner, frozen inputs, and password reset CTA.
- Desktop: /login | Two-column split layout: promotional artboard on left, lockout alert card with countdown on right.

## Components used
- AuthCard (packages/ui)
- Alert (packages/ui/alert)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- CountdownTimer [NOT IMPLEMENTED]
- LanguageSelector (packages/ui)

## States
- Visible: error (account locked / security lockout)
- Missing: countdown expiry / auto-unlock state, rate-limit retry state

## Data and backend
- Endpoint: POST /auth/login (returning 401/429 with lockout payload)
- Exists today: partly (login exists, backend rate-limit service tracks failed attempts, but lockout timer payload not in OpenAPI)

## Strings
login.lockout.title = "Account temporarily locked"
login.lockout.title.am = "TODO_AM (copy from Figma)"
login.lockout.desc = "Too many failed login attempts. A 15-minute lockout is in effect. Wait for the remaining time before trying again."
login.lockout.desc.am = "TODO_AM (copy from Figma)"
login.lockout.timer_label = "Try again in"
login.lockout.timer_value = "14:51 remaining"
login.lockout.email_label = "Email address"
login.lockout.email_label.am = "TODO_AM (copy from Figma)"
login.lockout.password_label = "Password"
login.lockout.password_label.am = "TODO_AM (copy from Figma)"
login.lockout.button_unavailable = "Log in unavailable"
login.lockout.button_unavailable.am = "TODO_AM (copy from Figma)"
login.lockout.button_reset = "Reset your password"
login.lockout.button_reset.am = "TODO_AM (copy from Figma)"
login.lockout.why_title = "Why did this happen?"
login.lockout.why_desc = "The temporary lock helps protect your account. You can request a password reset while you wait. Account security checks still apply."
login.lockout.contact_support = "Need help? Contact support"
login.lockout.contact_support.am = "TODO_AM (copy from Figma)"
login.lockout.no_account = "Don't have an account?"
login.lockout.signup_link = "Sign up"
login.lockout.signup_link.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear whether client polls the backend or counts down purely via setInterval.
- Unclear if locked state disables Google login or removes it entirely (Google button is hidden in this state).
