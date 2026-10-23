# Screen / Route / Layout
- Mobile: /reset-password | Mobile error card with expired link icon, email input, and request new link button.
- Desktop: /reset-password | Split layout with broken link icon, explanation, and new reset request form.

## Components used
- AuthCard (packages/ui)
- Input (packages/ui/input)
- Button (packages/ui/button)
- Link2OffIcon (lucide-react Link2Off / Unlink)
- LanguageSelector (packages/ui)

## States
- Visible: error (expired or invalid token)
- Missing: loading (requesting fresh link), fresh link sent confirmation

## Data and backend
- Endpoint: POST /api/v1/auth/forgot-password (to request fresh link)
- Exists today: no (stubbed in backend, missing in OpenAPI)

## Strings
reset_password.expired.title = "This reset link isn't valid"
reset_password.expired.title.am = "TODO_AM (copy from Figma)"
reset_password.expired.desc = "This link has expired or is no longer valid. Request a fresh link to reset your password."
reset_password.expired.email_label = "Email address"
reset_password.expired.email_label.am = "TODO_AM (copy from Figma)"
reset_password.expired.email_value = "alex@example.com"
reset_password.expired.submit_button = "Request a fresh link"
reset_password.expired.submit_button.am = "TODO_AM (copy from Figma)"
reset_password.expired.hint = "Use the most recent reset email. Older links may no longer work after you request a new one."
reset_password.expired.back_to_login = "Back to Log in"
reset_password.expired.back_to_login.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear whether clicking "Request a fresh link" automatically transitions to Link Sent screen.
