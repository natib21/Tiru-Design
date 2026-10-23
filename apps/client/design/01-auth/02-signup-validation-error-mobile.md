# Screen / Route / Layout
- Mobile: /signup | Mobile registration error view (990px height) with summary error card, invalid email alert, weak password indicator, and unchecked terms error.
- Desktop: /signup | NO DESKTOP DESIGN EXISTS.

## Components used
- Alert (packages/ui/alert)
- Input with error state (packages/ui/input)
- PasswordInput with error border (packages/ui/password-input)
- PasswordStrengthBar [NOT IMPLEMENTED]
- Checkbox with error border (packages/ui/checkbox)
- Button (packages/ui/button)

## States
- Visible: error (form validation errors)
- Missing: loading, success

## Data and backend
- Endpoint: POST /auth/register
- Exists today: yes (client-side zod validation and backend 400 Bad Request)

## Strings
signup.error.banner_title = "Please fix the errors below"
signup.error.banner_desc = "3 validation items require your attention before continuing."
signup.error.email_label = "Email address *"
signup.error.email_tag = "Invalid format"
signup.error.email_field_msg = "Please enter a valid email address"
signup.error.email_field_msg.am = "TODO_AM (copy from Figma)"
signup.error.password_label = "Password *"
signup.error.password_tag = "Too weak"
signup.error.password_tag.am = "TODO_AM (copy from Figma)"
signup.error.strength = "Strength: Critical"
signup.error.char_count = "6 / 8 chars"
signup.error.password_field_msg = "Password must be at least 8 characters and include a number"
signup.error.password_field_msg.am = "TODO_AM (copy from Figma)"
signup.error.terms_msg = "You must accept the Terms of Service to continue"
signup.error.submit = "Create account"

## Open questions
- Unclear how backend phone number requirement is handled when only email is collected.
