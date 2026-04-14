## 2026-04-14 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Icon-only action buttons (Undo, Redo, Zoom In, Zoom Out) in the top utility panel lacked ARIA labels and focus indicators, making them inaccessible for screen readers and keyboard navigation. This seems to be a common pattern for icon-only utility components in this project.
**Action:** Always ensure icon-only buttons have an `aria-label` and use `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none` styling for proper keyboard accessibility.
