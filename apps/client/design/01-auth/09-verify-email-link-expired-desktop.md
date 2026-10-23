# Screen / Route / Layout
- Mobile: /verify-email | Mobile card with expired link icon, email readout, and resend verification button.
- Desktop: /verify-email | Split layout with broken link icon, explanation, email display, and resend action.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- Link2OffIcon (lucide-react)
- LanguageSelector (packages/ui)

## States
- Visible: error (expired verification token)
- Missing: loading, resend success feedback

## Data and backend
- Endpoint: POST /api/v1/auth/resend-email-verification
- Exists today: no (stubbed in backend, missing in OpenAPI)

## Strings
verify_email.expired.title = "Verification link expired"
verify_email.expired.title.am = "TODO_AM (copy from Figma)"
verify_email.expired.desc = "This verification link has expired or is no longer valid. Send a new email to confirm your address."
verify_email.expired.email_label = "Email address to verify"
verify_email.expired.email_value = "alex@example.com"
verify_email.expired.hint = "Open the link in the most recent verification email. Check your spam folder if you can't find it."
verify_email.expired.resend_button = "Resend verification"
verify_email.expired.resend_button.am = "TODO_AM (copy from Figma)"
verify_email.expired.change_email = "Change email"
verify_email.expired.change_email.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear what token expiration window is enforced (e.g. 24h vs 1h).
