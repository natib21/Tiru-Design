# Screen / Route / Layout
- Mobile: /reset-password | Mobile error view with broken link icon, explanation, email echo, and new reset link CTA.
- Desktop: /reset-password | Split screen with broken link illustration and new request form.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- Link2OffIcon (lucide-react)

## States
- Visible: error (expired)
- Missing: loading, resend feedback

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password
- Exists today: no (stubbed)

## Strings
reset_password.expired.title = "Reset link expired"
reset_password.expired.title.am = "TODO_AM (copy from Figma)"
reset_password.expired.desc = "This password reset link has expired or is no longer valid. Request a new one to continue."
reset_password.expired.email_label = "Email address"
reset_password.expired.email_value = "alex@example.com"
reset_password.expired.submit = "Send a new reset link"
reset_password.expired.submit.am = "TODO_AM (copy from Figma)"
reset_password.expired.hint = "Use the most recent email we send. Your password hasn't changed."
reset_password.expired.back = "Back to Log in"
reset_password.expired.back.am = "TODO_AM (copy from Figma)"

## Open questions
- Notice wording discrepancy with Desktop ("Reset link expired" on mobile vs "This reset link isn't valid" on desktop).
