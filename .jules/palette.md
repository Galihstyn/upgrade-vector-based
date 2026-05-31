## 2025-02-12 - Added ARIA labels and focus states to utility panel buttons
**Learning:** Found several icon-only buttons (Undo, Redo, Zoom In, Zoom Out) that lacked `aria-label` attributes and focus styling.
**Action:** Always verify `aria-label` on icon-only buttons and add `aria-hidden="true"` to inner SVGs to prevent duplicate announcements. Ensure `focus-visible` classes are included for keyboard accessibility.
