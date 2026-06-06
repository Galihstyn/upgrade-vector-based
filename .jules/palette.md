## 2024-06-06 - Accessible Icon-Only Toolbar Buttons
**Learning:** Icon-only utility buttons in the canvas toolbar (Undo, Redo, Zoom) completely lacked ARIA attributes, making them invisible to screen readers, and had no clear focus indicators for keyboard users.
**Action:** Always add `aria-label` to icon-only buttons, `aria-hidden="true"` to their internal SVG components to avoid redundant announcements, and use Tailwind's `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none` for standard keyboard focus visibility.
