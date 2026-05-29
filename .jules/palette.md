## 2025-03-01 - Icon-only Button Accessibility
**Learning:** Icon-only buttons lacking `aria-label`s fail screen readers. Additionally, inner SVG components need `aria-hidden="true"` to prevent redundant/confusing announcements. Keyboard navigation visibility is missing by default and needs explicit `focus-visible` styling.
**Action:** Always add `aria-label` to the parent `<button>`, `aria-hidden="true"` to the inner SVG icon, and apply `focus-visible:ring-2 focus-visible:outline-none` for keyboard support.
