# Screen / Route / Layout
- Mobile: /forgot-password | Centered vertical flow on 390px viewport: header with logo and lang switch, card with email field, CTA, and back link.
- Desktop: /forgot-password | Split screen with marketing preview on left and form on right.

## Components used
- AuthCard (packages/ui)
- Input (packages/ui/input)
- Label (packages/ui/label)
- Button (packages/ui/button)
- LanguageSelector (packages/ui)

## States
- Visible: default
- Missing: loading, validation error, success

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password
- Exists today: no (stubbed)

## Strings
forgot_password.title = "Forgot password?"
forgot_password.title.am = "TODO_AM (copy from Figma)"
forgot_password.description = "Enter your account email. We'll send you a link to reset your password."
forgot_password.email_label = "Email address"
forgot_password.email_label.am = "TODO_AM (copy from Figma)"
forgot_password.email_placeholder = "alex@example.com"
forgot_password.submit_button = "Send reset link"
forgot_password.submit_button.am = "TODO_AM (copy from Figma)"
forgot_password.help_description = "Use the email address you signed up with."
forgot_password.back_to_login = "Back to Log in"
forgot_password.back_to_login.am = "TODO_AM (copy from Figma)"
footer.copyright = "© 2026 TiruDesign"
footer.privacy = "Privacy"
footer.help = "Help"

## Open questions
- Unclear if "Help" leads to live chat or a support email.
