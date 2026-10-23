# Screen / Route / Layout
- Mobile: /reset-password?token=... | Mobile card with two password fields, criteria bullet list, and submit CTA.
- Desktop: /reset-password?token=... | Two-column split layout with branded hero and reset password form.

## Components used
- AuthCard (packages/ui)
- PasswordInput (packages/ui/password-input)
- Button (packages/ui/button)
- Label (packages/ui/label)
- LanguageSelector (packages/ui)

## States
- Visible: default
- Missing: loading, mismatch validation error, password complexity failure

## Data and backend
- Endpoint: POST /api/v1/auth/reset-password
- Exists today: no (backend stub exists, missing in OpenAPI types)

## Strings
reset_password.title = "Set a new password"
reset_password.title.am = "TODO_AM (copy from Figma)"
reset_password.subtitle = "Choose a new password for alex@example.com. Use a password you haven't used for this account before."
reset_password.new_password_label = "New password"
reset_password.new_password_label.am = "TODO_AM (copy from Figma)"
reset_password.new_password_placeholder = "Enter a new password"
reset_password.requirements = "8+ characters, including letters, numbers & symbols."
reset_password.confirm_password_label = "Confirm new password"
reset_password.confirm_password_label.am = "TODO_AM (copy from Figma)"
reset_password.confirm_password_placeholder = "Re-enter your new password"
reset_password.submit_button = "Reset password"
reset_password.submit_button.am = "TODO_AM (copy from Figma)"
reset_password.back_to_login = "Back to Log in"
reset_password.back_to_login.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear how user email is obtained (embedded in reset token or decoded from JWT).
