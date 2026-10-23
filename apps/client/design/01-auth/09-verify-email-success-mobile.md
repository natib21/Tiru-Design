# Screen / Route / Layout
- Mobile: /verify-email | Mobile success card with checkmark badge, confirmed email display, and workspace CTA.
- Desktop: /verify-email | Split layout with green checkmark icon, confirmation message, and "Continue to workspace" button.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- CheckCircleIcon (lucide-react)

## States
- Visible: success
- Missing: auto-redirect

## Data and backend
- Endpoint: POST /auth/verify-email
- Exists today: no (stubbed)

## Strings
verify_email.success.title = "Email confirmed"
verify_email.success.title.am = "TODO_AM (copy from Figma)"
verify_email.success.desc = "Your email address is verified. You can now continue to your TiruDesign workspace."
verify_email.success.email_label = "Verified email"
verify_email.success.email_value = "alex@example.com"
verify_email.success.continue = "Continue to workspace"
verify_email.success.continue.am = "TODO_AM (copy from Figma)"
verify_email.success.note = "You're all set. No further email verification is needed."

## Open questions
- Unclear whether token is read from URL search query (?token=...) or body.
