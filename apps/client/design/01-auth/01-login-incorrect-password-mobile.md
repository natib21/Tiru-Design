# Screen / Route / Layout
- Mobile: /login | Mobile view with top error banner, verified check icon on email, red password field with error badge, helper error text, and draft card.
- Desktop: /login | Split layout with top alert and error message below password field.

## Components used
- Alert (packages/ui/alert)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- Button (packages/ui/button)
- LanguageSelector (packages/ui)

## States
- Visible: error
- Missing: loading, locked

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes

## Strings
login.error.banner_title = "Authentication failed"
login.error.banner_desc = "Please check your credentials."
login.error.banner_desc.am = "TODO_AM (copy from Figma)"
login.error.badge = "WELCOME BACK"
login.error.title = "TODO_AM (copy from Figma)"
login.error.subtitle = "Log in to continue designing your stories & prints"
login.error.google = "Continue with Google"
login.error.divider = "OR •"
login.error.divider.am = "TODO_AM (copy from Figma)"
login.error.email_label = "Email Address"
login.error.email_label.am = "TODO_AM (copy from Figma)"
login.error.email_value = "alex.design@gmail.com"
login.error.password_label = "Password"
login.error.password_label.am = "TODO_AM (copy from Figma)"
login.error.field_error = "Incorrect password. Please try again."
login.error.field_error.am = "TODO_AM (copy from Figma)"
login.error.forgot = "Forgot password?"
login.error.forgot.am = "TODO_AM (copy from Figma)"
login.error.submit = "Log in •"
login.error.submit.am = "TODO_AM (copy from Figma)"
login.error.draft_title = "Meskel Festival Poster"
login.error.draft_subtitle = "Draft saved 2 hours ago •"
login.error.draft_subtitle.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear how draft poster info is fetched prior to authentication.
