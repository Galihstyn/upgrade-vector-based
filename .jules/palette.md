## 2024-05-27 - Toolbar Icon Buttons Accessibility
**Learning:** The main utility panel containing Undo, Redo, Zoom In, and Zoom Out buttons relies solely on `title` attributes for tooltips, which are often not announced reliably by all screen readers and are inaccessible to keyboard users.
**Action:** Always ensure icon-only buttons have explicit `aria-label` attributes to guarantee screen reader accessibility, even if a `title` attribute is present.
