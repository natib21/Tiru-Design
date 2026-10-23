# Screen / Route / Layout
- Mobile: /verify-email | Mobile card with envelope icon, email echo, resend CTA, and change email link.
- Desktop: /verify-email | Split layout with envelope icon, instructions, sent email readout, and resend button.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- MailIcon (lucide-react)
- LanguageSelector (packages/ui)

## States
- Visible: default / pending
- Missing: loading, resend confirmation toast, polling for verification completion

## Data and backend
- Endpoint: POST /auth/resend-email-verification
- Exists today: no (stubbed in backend, missing in OpenAPI)

## Strings
verify_email.pending.title = "Verify your email"
verify_email.pending.title.am = "TODO_AM (copy from Figma)"
verify_email.pending.desc = "Thanks for signing up. Open the verification link in your email to finish setting up your account."
verify_email.pending.email_label = "Verification email sent to"
verify_email.pending.email_value = "alex@example.com"
verify_email.pending.hint = "No email yet? Check your spam folder, or send another verification email."
verify_email.pending.resend_button = "Resend verification"
verify_email.pending.resend_button.am = "TODO_AM (copy from Figma)"
verify_email.pending.change_email = "Change email"
verify_email.pending.change_email.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear whether client polls /auth/me to automatically progress once verified in another tab.
