# Screen / Route / Layout
- Mobile: /verify-email | Mobile success card with checkmark badge, confirmed email display, and workspace CTA.
- Desktop: /verify-email | Split layout with green checkmark icon, confirmation message, and "Continue to workspace" button.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- CheckCircleIcon (lucide-react)
- LanguageSelector (packages/ui)

## States
- Visible: success
- Missing: auto-transition spinner

## Data and backend
- Endpoint: POST /auth/verify-email
- Exists today: no (backend stub exists, missing in OpenAPI)

## Strings
verify_email.success.title = "Email confirmed"
verify_email.success.title.am = "TODO_AM (copy from Figma)"
verify_email.success.desc = "Your email address has been verified. You can now continue to your TiruDesign workspace."
verify_email.success.email_label = "Verified email address"
verify_email.success.email_value = "alex@example.com"
verify_email.success.status_badge = "Confirmed"
verify_email.success.continue_button = "Continue to workspace"
verify_email.success.continue_button.am = "TODO_AM (copy from Figma)"
verify_email.success.hint_title = "You're ready to continue"
verify_email.success.hint_desc = "Your email confirmation is complete. There's no need to use the verification link again."

## Open questions
- Unclear whether user session is automatically refreshed with emailVerified=true.
