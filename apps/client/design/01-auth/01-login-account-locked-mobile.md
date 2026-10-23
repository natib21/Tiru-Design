# Screen / Route / Layout
- Mobile: /login | Long scrolling mobile view (1340px high) with red banner, security timer progress bar, disabled inputs, reset password CTA, and alternative login options.
- Desktop: /login | Compact split card with countdown and explanation.

## Components used
- Alert (packages/ui/alert)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- ProgressBar [NOT IMPLEMENTED]
- LanguageSelector (packages/ui)

## States
- Visible: error (account locked)
- Missing: expiry state

## Data and backend
- Endpoint: POST /auth/login
- Exists today: partly (lockout payload format not yet in OpenAPI)

## Strings
login.lockout.alert_title = "Account temporarily locked"
login.lockout.alert_title.am = "TODO_AM (copy from Figma)"
login.lockout.alert_desc = "Too many failed login attempts. Please wait 15 minutes before trying again or reset your credentials now."
login.lockout.alert_desc.am = "TODO_AM (copy from Figma)"
login.lockout.security_lockout = "Security Lockout 14:51"
login.lockout.title = "Welcome back/"
login.lockout.title.am = "TODO_AM (copy from Figma)"
login.lockout.subtitle = "Log in to continue designing seamlessly across your workspaces."
login.lockout.session_protection = "ACTIVE SESSION PROTECTION"
login.lockout.session_item = "Addis Brand Kit 2025 • Last saved 42 mins ago"
login.lockout.email_label = "Email Address"
login.lockout.email_label.am = "TODO_AM (copy from Figma)"
login.lockout.verified_id = "Verified ID"
login.lockout.password_label = "Password"
login.lockout.password_label.am = "TODO_AM (copy from Figma)"
login.lockout.account_frozen = "Account Frozen"
login.lockout.try_again_progress = "Try again in 14:51"
login.lockout.try_again_progress.am = "TODO_AM (copy from Figma)"
login.lockout.btn_disabled = "Log in (14:51)"
login.lockout.btn_disabled.am = "TODO_AM (copy from Figma)"
login.lockout.btn_reset = "Reset your password"
login.lockout.btn_reset.am = "TODO_AM (copy from Figma)"
login.lockout.why_title = "Why did this happen? /"
login.lockout.why_title.am = "TODO_AM (copy from Figma)"
login.lockout.why_text = "To protect your Ethiopian fonts, saved brand kits, and payment methods, TiruDesign halts access after 5 incorrect password inputs. You can instantly bypass this freeze by clicking Reset your password above to receive a verification SMS or email link."
login.lockout.need_help = "Need help? Contact support"
login.lockout.need_help.am = "TODO_AM (copy from Figma)"
login.lockout.alt_divider = "ALTERNATIVE /"
login.lockout.alt_divider.am = "TODO_AM (copy from Figma)"
login.lockout.btn_sms = "Login with SMS"
login.lockout.btn_telegram = "Telegram ID"
login.lockout.no_account = "Don't have an account?"
login.lockout.signup = "Sign up"
login.lockout.signup.am = "TODO_AM (copy from Figma)"

## Open questions
- Notice: Mobile screen shows "Login with SMS" and "Telegram ID" options which are completely missing on Desktop! Unclear if backend supports Telegram ID auth.
- Height is 1340px, requiring significant vertical scroll on mobile devices.
