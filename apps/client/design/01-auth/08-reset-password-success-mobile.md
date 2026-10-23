# Screen / Route / Layout
- Mobile: /reset-password | Mobile success view with checkmark badge, email display, return to login button, and helper note.
- Desktop: /reset-password | Split screen with confirmation card and security advisory box.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- CheckCircleIcon (lucide-react)

## States
- Visible: success
- Missing: auto-redirect

## Data and backend
- Endpoint: POST /auth/reset-password
- Exists today: no (stubbed)

## Strings
reset_password.success.title = "Password updated"
reset_password.success.title.am = "TODO_AM (copy from Figma)"
reset_password.success.desc = "Your new password is ready. Log in again to access your workspace."
reset_password.success.email_label = "Email address"
reset_password.success.email_value = "alex@example.com"
reset_password.success.return_button = "Return to Log in"
reset_password.success.return_button.am = "TODO_AM (copy from Figma)"
reset_password.success.note = "You haven't been signed in automatically. Use your new password on the login screen."

## Open questions
- Unclear why desktop has a "Password updated" tag and "Keep your account secure" block while mobile omits both.
