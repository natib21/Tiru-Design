# Screen / Route / Layout
- Mobile: /signup | Mobile registration page (967px height) with community banner, Google CTA, email/password form, strength meter, terms checkbox, and font promo card.
- Desktop: /signup | NO DESKTOP DESIGN EXISTS (mobile-only screen in design folder).

## Components used
- AuthCard (packages/ui)
- Button (packages/ui/button)
- Input (packages/ui/input)
- PasswordInput (packages/ui/password-input)
- Checkbox (packages/ui/checkbox)
- PasswordStrengthBar [NOT IMPLEMENTED in shared/ui]
- LanguageSelector (packages/ui)

## States
- Visible: default
- Missing: loading, validation error (handled in separate screen)

## Data and backend
- Endpoint: POST /auth/register
- Exists today: yes (user registration with personal workspace creation)

## Strings
signup.hub_badge = "ADDIS CREATIVE HUB"
signup.hub_title = "Design localized. Create freely."
signup.hub_subtitle = "Join over 14,000+ creators across Ethiopia."
signup.title = "Create your account"
signup.title.am = "TODO_AM (copy from Figma)"
signup.subtitle = "Start designing in Amharic & English"
signup.subtitle.am = "TODO_AM (copy from Figma)"
signup.google_button = "Continue with Google"
signup.divider = "OR •"
signup.divider.am = "TODO_AM (copy from Figma)"
signup.email_label = "Email address"
signup.email_label.am = "TODO_AM (copy from Figma)"
signup.email_placeholder = "alex@example.com"
signup.password_label = "Password"
signup.password_label.am = "TODO_AM (copy from Figma)"
signup.password_placeholder = "Create a password (min. 8 characters)"
signup.password_hint = "At least 8 characters with letters & numbers"
signup.terms_agree = "I agree to the"
signup.terms_link = "Terms of Service"
signup.and = "and"
signup.privacy_link = "Privacy Policy"
signup.terms.am = "TODO_AM (copy from Figma)"
signup.submit = "Create account |"
signup.submit.am = "TODO_AM (copy from Figma)"
signup.promo_tag = "Ethiopian Font Studio"
signup.promo_title = "300+ Ge'ez & Latin Fonts"
signup.promo_desc = "Included free with every new creator account"
signup.already_account = "Already have an account?"
signup.login_link = "Log in"
signup.login_link.am = "TODO_AM (copy from Figma)"

## Open questions
- Desktop counterpart is completely missing from design folder.
- Backend register endpoint requires phoneNumber ('phoneNumber: string'), but the UI only contains an email address field! Critical mismatch.
