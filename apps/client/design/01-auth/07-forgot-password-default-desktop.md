# Screen / Route / Layout
- Mobile: /forgot-password | Centered mobile card layout with back link, single input, and full-width CTA.
- Desktop: /forgot-password | Two-column split layout: brand hero artboard on left, auth card with email input on right.

## Components used
- AuthCard (packages/ui)
- Input (shared/ui/input, packages/ui/input)
- Label (shared/ui/label, packages/ui/label)
- Button (packages/ui/button)
- LanguageSelector (packages/ui)
- EnterpriseBadge (packages/ui) [NOT IMPLEMENTED]
- Link (packages/ui/link)

## States
- Visible: default
- Missing: loading, validation error (empty email / invalid format), rate limit error

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password
- Exists today: no (backend service has empty stub returning { ok: true }, route missing from shared openapi.json)

## Strings
forgot_password.title = "Forgot password?"
forgot_password.title.am = "TODO_AM (copy from Figma)"
forgot_password.description = "Enter your account email. We'll send you a link to reset your password."
forgot_password.email_label = "Email address"
forgot_password.email_label.am = "TODO_AM (copy from Figma)"
forgot_password.email_placeholder = "alex@example.com"
forgot_password.submit_button = "Send reset link"
forgot_password.submit_button.am = "TODO_AM (copy from Figma)"
forgot_password.help_title = "Use your account email"
forgot_password.help_description = "Use the email address you signed up with. You don't need to remember your current password to request a reset link."
forgot_password.back_to_login = "Back to Log in"
forgot_password.back_to_login.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear whether SMS/phone reset is supported from this screen (only email field visible in design).
- Unclear whether error notifications appear inline or via toast.
