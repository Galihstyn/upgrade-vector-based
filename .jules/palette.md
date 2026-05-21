
## 2024-05-21 - Canvas Toolbar Accessibility
**Learning:** Icon-only utility buttons in the canvas overlay toolbar (Undo, Redo, Zoom) often rely purely on visual `title` tooltips, missing structural accessible names (`aria-label`) and exposing raw SVG elements to screen readers.
**Action:** Always add `aria-label` to icon-only utility buttons and `aria-hidden="true"` to their inner SVG icons to ensure screen reader users receive concise, announced actions instead of navigating meaningless graphic elements.
