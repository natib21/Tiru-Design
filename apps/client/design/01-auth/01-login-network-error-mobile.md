# Screen / Route / Layout
- Mobile: /login | Mobile card showing bottom alert box with wifi-off icon and "Try again" CTA.
- Desktop: /login | Split layout with top alert banner for network failure.

## Components used
- Alert (packages/ui/alert)
- Button (packages/ui/button)
- Input (packages/ui/input)
- WifiOffIcon (lucide-react)

## States
- Visible: error (offline)
- Missing: auto-retry countdown

## Data and backend
- Endpoint: POST /auth/login
- Exists today: yes

## Strings
login.net_error.title = "Welcome back"
login.net_error.title.am = "TODO_AM (copy from Figma)"
login.net_error.alert_title = "Couldn't connect"
login.net_error.alert_desc = "Check your internet connection and try again. Your details are still here."
login.net_error.retry_button = "Try again"
login.net_error.retry_button.am = "TODO_AM (copy from Figma)"

## Open questions
- Unclear why alert is placed below the password field on Mobile but above the Google button on Desktop.
