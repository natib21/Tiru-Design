# Screen / Route / Layout
- Mobile: /forgot-password | Mobile confirmation view with mail icon, centered text, resend button, and back link.
- Desktop: /forgot-password | Split layout with brand hero on left and confirmation card on right.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- MailIcon (lucide-react)
- LanguageSelector (packages/ui)

## States
- Visible: success (link sent)
- Missing: loading, error

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password
- Exists today: no (stubbed)

## Strings
forgot_password.sent.title = "Check your email"
forgot_password.sent.title.am = "TODO_AM (copy from Figma)"
forgot_password.sent.notice = "If an account exists for this address, you'll receive a reset link"
forgot_password.sent.email_label = "Email address"
forgot_password.sent.email_value = "alex@example.com"
forgot_password.sent.instructions = "Open the link in your email to choose a new password. If it hasn't arrived, check your spam folder."
forgot_password.sent.resend_button = "Resend reset link"
forgot_password.sent.resend_button.am = "TODO_AM (copy from Figma)"
forgot_password.sent.change_email = "Change email"
forgot_password.sent.change_email.am = "TODO_AM (copy from Figma)"
forgot_password.sent.back_to_login = "Back to Log in"

## Open questions
- Notice discrepancy with Desktop: English text differs slightly ("Open the link in your email..." vs desktop "Check your inbox and spam folder...").
