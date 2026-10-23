# Screen / Route / Layout
- Mobile: /verify-email | Mobile view with mail icon, centered title, instructions, email echo, resend CTA, and change email link.
- Desktop: /verify-email | Split layout with brand hero on left and pending card on right.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- MailIcon (lucide-react)
- LanguageSelector (packages/ui)

## States
- Visible: default / pending
- Missing: loading, error

## Data and backend
- Endpoint: POST /auth/resend-email-verification
- Exists today: no (stubbed)

## Strings
verify_email.pending.title = "Verify your email"
verify_email.pending.title.am = "TODO_AM (copy from Figma)"
verify_email.pending.desc = "Thanks for signing up. Open the verification link in your email to finish setting up your account."
verify_email.pending.email_label = "Verification email sent to"
verify_email.pending.email_value = "alex@example.com"
verify_email.pending.note = "No email yet? Check your spam folder, or send another verification email."
verify_email.pending.resend = "Resend verification"
verify_email.pending.resend.am = "TODO_AM (copy from Figma)"
verify_email.pending.change_email = "Change email"
verify_email.pending.change_email.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear how "Change email" handles updating unverified email in backend.
