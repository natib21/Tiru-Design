# Screen / Route / Layout
- Mobile: /dashboard | NO MOBILE DESIGN EXISTS (desktop-only in design folder).
- Desktop: /dashboard | Sidebar navigation (Dashboard, Projects, Templates, Assets, Marketplace, Settings, Cloud Storage gauge), top search/user bar, welcome header, action buttons, category filter pills, recent projects carousel, and recommended templates carousel.

## Components used
- ClientLayout (apps/client/src/app/layouts/ClientLayout.tsx)
- Input (shared/ui/input)
- Button (packages/ui/button)
- Avatar (shared/ui/avatar)
- Card (shared/ui/card)
- Badge (shared/ui/badge)
- ProgressBar (Cloud Storage gauge) [NOT IMPLEMENTED]
- TemplateCard (shared/ui/template-card)
- ProjectCard [NOT IMPLEMENTED]

## States
- Visible: default
- Missing: empty projects, empty recommendations, loading skeleton

## Data and backend
- Endpoints: GET /auth/me, GET /workspaces, GET /projects, GET /templates
- Exists today: yes (GET /auth/me, GET /workspaces, GET /projects in OpenAPI types; GET /templates in backend templates controller)

## Strings
dashboard.welcome = ", Dawit! 👋"
dashboard.welcome_desc = "Welcome back! What would you like to create today?"
dashboard.btn_custom_size = "Custom Size"
dashboard.btn_import = "Import File"
dashboard.btn_create = "Create new design ( )"
dashboard.filter_all = "All"
dashboard.filter_wedding = "Wedding ( )"
dashboard.filter_graduation = "Graduation ( )"
dashboard.filter_church = "Church ( )"
dashboard.filter_business = "Business"
dashboard.filter_events = "Events"
dashboard.filter_restaurant = "Restaurant"
dashboard.filter_holidays = "Holidays"
dashboard.recent_projects = "Recent Projects ( )"
dashboard.view_all_projects = "View all projects"
dashboard.recommended_title = "Recommended for Ethiopian Creators ( )"
dashboard.recommended_subtitle = "Pre-sized, culturally tuned templates with Ge'ez ligature support."
dashboard.explore_templates = "Explore templates"
dashboard.storage_label = "Cloud Storage"
dashboard.storage_usage = "3.4 GB of 5.0 GB used"

## Open questions
- Notice parenthetical labels like "Wedding ( )" and ", Dawit! 👋" have empty spaces where Amharic translations failed to render in the design.
- Mobile layout is not designed.
