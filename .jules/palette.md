## 2024-06-25 - Missing ARIA Labels and Focus States on Utility Buttons
**Learning:** Icon-only buttons (like Undo, Redo, Zoom) must have explicit `aria-label`s for screen reader support. Additionally, they require a `focus-visible` state (e.g., `focus-visible:ring-2`) so keyboard users can navigate to them clearly.
**Action:** When adding new interactive components, always ensure icon-only controls have an ARIA label and that all interactive elements show a visible focus ring on keyboard navigation.
