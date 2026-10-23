# Screen / Route / Layout
- Mobile: /templates | NO MOBILE DESIGN EXISTS.
- Desktop: /templates | Full catalog view: search bar with shortcut key (⌘K), category pills with counters ("All Templates (128)"), sub-filters (Bilingual, All Prices, Style), template cards grid (Free and Paid cards with price tags, bookmarks, author info), pagination bar.

## Components used
- ClientLayout (apps/client/src/app/layouts/ClientLayout.tsx)
- Input (shared/ui/input)
- Button (packages/ui/button)
- Badge (shared/ui/badge)
- TemplateCard (shared/ui/template-card)
- Pagination [NOT IMPLEMENTED in shared/ui]

## States
- Visible: default
- Missing: loading skeleton (state switcher pill visible in header: "Loading Skeleton")

## Data and backend
- Endpoint: GET /templates (query params: category, search, page, limit)
- Exists today: partly (backend templates service handles listing; frontend openapi.json does not declare GET /templates)

## Strings
gallery.title = "Template Gallery"
gallery.subtitle = "Browse and customize authentic handcrafted Ethiopian templates with native Ge'ez typography support, print-ready standard formats, and digital-first dimensions."
gallery.badge_glyphs = "100% Ge'ez Glyphs Verified"
gallery.badge_calendar = "Ethiopian Calendar Ready"
gallery.search_placeholder = "Search templates by name, keyword, or Ge'ez tag (e.g., , , )..."
gallery.filter_all = "All Templates (128)"
gallery.filter_wedding = "Wedding ( )"
gallery.filter_graduation = "Graduation ( )"
gallery.filter_church = "Church & Faith ( )"
gallery.filter_business = "Business ( )"
gallery.filter_events = "Events & Concerts ( )"
gallery.filter_bilingual = "Bilingual ( )"
gallery.filter_prices = "All Prices"
gallery.filter_free = "Free ( )"
gallery.filter_paid = "Paid ( )"
gallery.filter_style = "Style: Traditional Tibeb"
gallery.showing_count = "Showing 8 of 128 templates"
gallery.sort_label = "Sort: Most Popular"
gallery.pagination_info = "Page 1 of 16 • 128 Curated Ethiopian Templates"

## Open questions
- Search placeholder and category filter counters have empty parentheses where Amharic tags were omitted.
