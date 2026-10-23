# Screen / Route / Layout
- Mobile: /forgot-password | Centered mobile card layout showing confirmation icon, email echo, and resend action.
- Desktop: /forgot-password | Two-column split layout: brand marketing hero on left, confirmation card on right.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- MailIcon (lucide-react Mail)
- LanguageSelector (packages/ui)
- Link (packages/ui/link)

## States
- Visible: success (link sent confirmation)
- Missing: loading (on clicking resend), error (resend failed), rate-limited cooldown state

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password (resend)
- Exists today: no (stubbed in backend, missing in OpenAPI types)

## Strings
forgot_password.sent.title = "Check your email"
forgot_password.sent.title.am = "TODO_AM (copy from Figma)"
forgot_password.sent.notice = "If an account exists for this address, you'll receive a reset link"
forgot_password.sent.email_label = "Email address entered"
forgot_password.sent.email_value = "alex@example.com"
forgot_password.sent.instructions = "Check your inbox and spam folder. Open the link in the email to choose a new password."
forgot_password.sent.resend_button = "Resend reset link"
forgot_password.sent.resend_button.am = "TODO_AM (copy from Figma)"
forgot_password.sent.change_email = "Change email"
forgot_password.sent.change_email.am = "TODO_AM (copy from Figma)"
forgot_password.sent.back_to_login = "Back to Log in"
forgot_password.sent.back_to_login.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear cooldown duration before "Resend reset link" can be clicked again.
- Unclear if "Change email" redirects to default forgot password or clears form state.
