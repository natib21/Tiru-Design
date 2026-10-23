# Screen / Route / Layout
- Mobile: /login | Full-screen vertical stack with logo, language selector, Google OAuth CTA, email/password form, and footer.
- Desktop: /login | Two-column split layout: enterprise creative suite artwork on left, authentication card on right.

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- GoogleSignInButton [NOT IMPLEMENTED]
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- Checkbox (packages/ui/checkbox)
- LanguageSelector (packages/ui)
- Badge (shared/ui/badge)

## States
- Visible: default
- Missing: empty submission validation errors

## Data and backend
- Endpoint: POST /auth/login, POST /auth/google
- Exists today: yes (credentials login exists; Google login implemented on backend but GOOGLE_OAUTH_ENABLED is false)

## Strings
login.pill_suite = "CREATIVE SUITE"
login.pill_welcome = "Welcome Back"
login.welcome_title = "Welcome back"
login.welcome_title.am = "TODO_AM (copy from Figma)"
login.subtitle = "Log in to continue designing — access your templates, assets, and Ethiopian font libraries."
login.google_button = "Continue with Google"
login.divider_text = "OR LOG IN WITH EMAIL"
login.email_label = "Email address"
login.email_label.am = "TODO_AM (copy from Figma)"
login.password_label = "Password"
login.password_label.am = "TODO_AM (copy from Figma)"
login.remember_device = "Remember this device"
login.forgot_password = "Forgot password?"
login.forgot_password.am = "TODO_AM (copy from Figma)"
login.submit_button = "Log in"
login.submit_button.am = "TODO_AM (copy from Figma)"
login.no_account = "Don't have an account?"
login.signup_link = "Sign up"
login.signup_link.am = "TODO_AM (copy from Figma)"
login.security_footer = "Enterprise 256-bit SSL encrypted • Protected by reCAPTCHA"

## Open questions
- Unclear whether login accepts phone number on desktop (backend supports phone, but desktop UI label is "Email address").
- Unclear if reCAPTCHA is active or purely a badge display.
