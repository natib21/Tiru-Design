# Screen / Route / Layout
- Mobile: /reset-password | Mobile success screen with green check badge, email readout, and return to login button.
- Desktop: /reset-password | Split layout with checkmark icon, confirmation message, and "Return to Log in" CTA.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- CheckCircleIcon (lucide-react CheckCircle2)
- LanguageSelector (packages/ui)

## States
- Visible: success
- Missing: auto-redirect countdown

## Data and backend
- Endpoint: POST /auth/reset-password
- Exists today: no (stubbed)

## Strings
reset_password.success.title = "Password updated"
reset_password.success.title.am = "TODO_AM (copy from Figma)"
reset_password.success.desc = "Your new password is ready. Return to Log in and use it to access your account."
reset_password.success.account_email_label = "Account email"
reset_password.success.email_value = "alex@example.com"
reset_password.success.status_tag = "Password updated"
reset_password.success.return_button = "Return to Log in"
reset_password.success.return_button.am = "TODO_AM (copy from Figma)"
reset_password.success.security_title = "Keep your account secure"
reset_password.success.security_desc = "Keep your new password private and avoid using it for other accounts. You'll need to log in before returning to your workspace."

## Open questions
- Unclear whether user is automatically logged in with a fresh JWT session or forced to manually re-authenticate.
