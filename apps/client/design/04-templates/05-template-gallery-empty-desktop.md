# Screen / Route / Layout
- Mobile: /templates | NO MOBILE DESIGN EXISTS.
- Desktop: /templates | Search empty state view: search input with active query ("XYZ Vintage Jazz Festival"), active tag chips, empty state illustration, "No templates found", recovery action buttons, suggested keyword pills, and recommended category cards.

## Components used
- EmptyState (shared/ui/empty-state)
- Button (packages/ui/button)
- Badge / Tag (shared/ui/badge)
- Input (shared/ui/input)
- Card (shared/ui/card)

## States
- Visible: empty
- Missing: loading

## Data and backend
- Endpoint: GET /templates?search=XYZ+Vintage+Jazz+Festival
- Exists today: partly (empty array [] response supported by backend)

## Strings
gallery.empty.results_count = "0 templates found for "XYZ Vintage Jazz Festival" • Addis Ababa & Regional Repositories"
gallery.empty.active_cat = "Category: Holidays"
gallery.empty.active_script = "Script: Amharic ( )"
gallery.empty.active_tier = "Tier: Pro Paid"
gallery.empty.clear_all = "Clear All Filters"
gallery.empty.title = "No templates found ( )"
gallery.empty.desc = "We couldn't find any templates matching "XYZ Vintage Jazz Festival" under the selected Amharic and Holiday categories. Try refining your keywords, clearing restrictive filters, or commissioning an artist."
gallery.empty.btn_reset = "Reset All Filters ( )"
gallery.empty.btn_request = "Request Custom Template ( )"
gallery.empty.btn_blank = "Start Blank Design ( )"
gallery.empty.alt_title = "POPULAR SEARCH ALTERNATIVES"
gallery.empty.alt_wedding = "Wedding ( )"
gallery.empty.alt_graduation = "Graduation ( )"
gallery.empty.alt_enkutatash = "Enkutatash ( )"
gallery.empty.alt_church = "Church Banner ( )"
gallery.empty.alt_menu = "Restaurant Menu ( )"
gallery.empty.alt_biz = "Business Card ( )"
gallery.empty.browse_title = "Browse Recommended Categories"
gallery.empty.view_all = "View all 48 categories"

## Open questions
- Multiple button labels and filter badges have empty parentheses "( )" where Amharic glyphs are missing.
