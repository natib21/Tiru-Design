# Screen / Route / Layout
- Mobile: /verify-email | Mobile card with broken link icon, explanation, email echo, and resend CTA.
- Desktop: /verify-email | Split layout with broken link icon and resend form.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- Link2OffIcon (lucide-react)

## States
- Visible: error (expired)
- Missing: loading, success

## Data and backend
- Endpoint: POST /auth/resend-email-verification
- Exists today: no (stubbed)

## Strings
verify_email.expired.title = "Verification link expired"
verify_email.expired.title.am = "TODO_AM (copy from Figma)"
verify_email.expired.desc = "This verification link has expired or is no longer valid. Send a new link to confirm your email."
verify_email.expired.email_label = "Email to verify"
verify_email.expired.email_value = "alex@example.com"
verify_email.expired.note = "Your account is still waiting for verification. Open the link in the newest email."
verify_email.expired.resend = "Resend verification"
verify_email.expired.resend.am = "TODO_AM (copy from Figma)"
verify_email.expired.change_email = "Change email"
verify_email.expired.change_email.am = "TODO_AM (copy from Figma)"

## Open questions
- Minor wording difference from desktop ("Send a new link to confirm your email" vs "Send a new email to confirm your address").
