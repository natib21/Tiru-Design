# Screen / Route / Layout
- Mobile: /login | Mobile card with disabled inputs, animated circular spinner, and loading copy in button.
- Desktop: /login | Split card with disabled fields and loading text.

## Components used
- Spinner (shared/ui/spinner)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)

## States
- Visible: loading
- Missing: timeout error

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes

## Strings
login.loading.title = "Welcome back"
login.loading.title.am = "TODO_AM (copy from Figma)"
login.loading.subtitle = "Log in to continue designing."
login.loading.button = "Signing in..."
login.loading.button.am = "TODO_AM (copy from Figma)"
login.loading.hint = "Please wait. We're signing you in securely."

## Open questions
- Unclear if user can cancel an in-flight login on mobile.
