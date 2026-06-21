## 2025-01-08 - Accessibility for Toolbar Action Buttons
**Learning:** Icon-only utility buttons (like zoom and history controls) in a canvas editor require explicit ARIA labels and focus indicators to be accessible. Redundant screen reader announcements can be avoided by hiding the inner SVG icon when the parent button holds the aria-label.
**Action:** Always verify that purely visual utility buttons have `aria-label`s on the button element and `aria-hidden="true"` on the SVG, paired with `focus-visible` styling for keyboard navigation.
