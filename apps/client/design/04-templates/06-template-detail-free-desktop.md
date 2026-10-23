# Screen / Route / Layout
- Mobile: /templates/:id | NO MOBILE DESIGN EXISTS.
- Desktop: /templates/:id | Full-page template showcase (1622px high): navigation breadcrumbs, interactive artboard zoom preview, action panel (price 0 ETB, "Use this template", download, save), specifications grid, interactive Ge'ez type previewer, and similar cultural templates grid.

## Components used
- ClientLayout (apps/client/src/app/layouts/ClientLayout.tsx)
- Button (packages/ui/button)
- Badge (shared/ui/badge)
- Avatar (shared/ui/avatar)
- Card (shared/ui/card)
- TemplateCard (shared/ui/template-card)
- InteractiveFontPreviewer [NOT IMPLEMENTED]

## States
- Visible: default
- Missing: loading skeleton (available in 04-templates/06-template-detail-loading-desktop.png), error state (not found)

## Data and backend
- Endpoints: GET /templates/{id}, POST /templates/{id}/use
- Exists today: partly (implemented in backend templates.service.ts; missing from frontend openapi.json)

## Strings
template.breadcrumb = "Back to Templates / Templates Hub / Adey Abeba Holiday Flyer"
template.badge_community = "Community Pick • Enkutatash"
template.btn_share = "Share"
template.category_badge = "HOLIDAY & CULTURAL"
template.free_badge = "Free /"
template.title = "Adey Abeba Holiday Flyer"
template.subtitle = "• Enkutatash Edition"
template.author_name = "Dawit A."
template.author_stats = "★ 4.9 • 184 templates"
template.btn_follow = "Follow"
template.price = "0 ETB"
template.price_tag = "100% Free /"
template.price_original = "450 ETB Regular"
template.btn_use = "Use this template ( )"
template.btn_download = "Download Files"
template.btn_save = "Save"
template.description = "Celebrate Ethiopian New Year (Enkutatash) with authentic floral Adey Abeba graphics, woven Tibeb motifs, and customizable Ge'ez bilingual typography. Ready for high-resolution print or instant social campaigns."
template.spec_title = "SPECIFICATIONS"
template.spec_dpi = "300 DPI Press-ready precision"
template.spec_color = "CMYK + RGB Universal modes"
template.spec_vector = "Layered Vector 100% scalable"
template.spec_fonts = "Ge'ez Typefaces SIL open fonts"
template.deliverables_title = "INCLUDED DELIVERABLES"
template.deliverables_list = "PNG, PDF, Print-Ready A4"
template.license_note = "Free for personal & commercial client use without attribution fees."
template.previewer_title = "INTERACTIVE GE'EZ TYPE PREVIEW"
template.similar_title = "Similar Cultural Templates"

## Open questions
- Image height is 1622px (exceeds 1500px threshold).
- "Use this template ( )" has empty parentheses where Amharic label was dropped.
