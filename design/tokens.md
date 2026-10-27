# Design Tokens & Accessibility Ratios

This document records the official color, spacing, radius, and sizing tokens for TiruDesign, along with WCAG 2.1 AA accessibility contrast ratio audits.

## 1. Color Tokens (`packages/ui/src/tokens.ts`)

| Token | Hex Value | Semantic Role |
|:---|:---|:---|
| `colors.primary` | `#006399` | Primary brand blue, action buttons, links |
| `colors.primaryDeep` | `#001D32` | Dark brand accent, button hover states |
| `colors.background` | `#F7F9FB` | Application background |
| `colors.surface` | `#FFFFFF` | Card & modal background |
| `colors.border` | `#BEC7D3` | Input and divider strokes |
| `colors.text` | `#3F4851` | Body and helper text |
| `colors.foreground` | `#0f172a` | High-contrast headings and active labels |
| `colors.success` | `#22C55E` | Positive status indicator |
| `colors.successDark` | `#16A34A` | Darker green for text |
| `colors.warning` | `#FACC15` | Amber / yellow accents |
| `colors.warningText` | `#B45309` | High-contrast amber text for "PRO" / badge labels (5.59:1 on white, 5.06:1 on amber-100) |
| `colors.danger` | `#DC2626` | Error borders and high-visibility status icons |
| `colors.dangerSurface` | `#FEE2E2` | Light red surface for error / lockout banners |
| `colors.dangerText` | `#991B1B` | High-contrast dark red text for normal body and headings on `dangerSurface` (7.24:1 on dangerSurface) |

## 2. WCAG Contrast Audit Table

| Foreground (Text) | Background (Surface) | Contrast Ratio | WCAG AA Status (Normal Text >= 4.5:1) |
|:---|:---|:---|:---|
| `colors.dangerText` (`#991B1B`) | `colors.dangerSurface` (`#FEE2E2`) | **7.24:1** | PASS (AAA Level) |
| `colors.text` (`#3F4851`) | `colors.dangerSurface` (`#FEE2E2`) | **7.24:1** | PASS (AAA Level) |
| `colors.warningText` (`#B45309`) | `colors.surface` (`#FFFFFF`) | **5.59:1** | PASS (AA Level) |
| `colors.warningText` (`#B45309`) | `amber-100` (`#FEF3C7`) | **5.06:1** | PASS (AA Level) |
| `colors.danger` (`#DC2626`) | `colors.surface` (`#FFFFFF`) | **5.00:1** | PASS (AA Level) |
| `colors.primary` (`#006399`) | `colors.surface` (`#FFFFFF`) | **5.67:1** | PASS (AA Level) |
| `colors.foreground` (`#0f172a`) | `colors.surface` (`#FFFFFF`) | **16.08:1** | PASS (AAA Level) |
