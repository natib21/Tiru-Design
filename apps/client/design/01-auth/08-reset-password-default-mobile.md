# Screen / Route / Layout
- Mobile: /reset-password | Mobile form with two password inputs, bulleted criteria list, primary CTA, and back link.
- Desktop: /reset-password | Split screen layout with promotional preview on left.

## Components used
- AuthCard (packages/ui)
- PasswordInput (packages/ui/password-input)
- Button (packages/ui/button)
- LanguageSelector (packages/ui)

## States
- Visible: default
- Missing: loading, validation error

## Data and backend
- Endpoint: POST /api/v1/auth/reset-password
- Exists today: no (stubbed)

## Strings
reset_password.title = "Set a new password"
reset_password.title.am = "TODO_AM (copy from Figma)"
reset_password.subtitle = "Choose a new password for alex@example.com."
reset_password.new_label = "New password"
reset_password.new_label.am = "TODO_AM (copy from Figma)"
reset_password.confirm_label = "Confirm password"
reset_password.confirm_label.am = "TODO_AM (copy from Figma)"
reset_password.req_title = "Your password must include:"
reset_password.req_min = "At least 8 characters"
reset_password.req_types = "Letters, numbers and symbols"
reset_password.submit = "Reset password"
reset_password.submit.am = "TODO_AM (copy from Figma)"
reset_password.back = "Back to Log in"

## Open questions
- Unclear whether password strength meter (like in Sign up) should appear here.
