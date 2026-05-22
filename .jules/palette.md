## 2024-05-24 - Interactive Notifications
**Learning:** Toast notifications and alert messages injected dynamically into the DOM are generally invisible to screen readers unless specifically marked.
**Action:** Always apply `role="status"` and `aria-live="polite"` (or `aria-live="assertive"` for critical errors) to dynamically appearing status messages/toasts so they are announced.

## 2024-05-24 - Icon-only Buttons
**Learning:** Icon-only buttons lack an accessible name by default. Screen readers may read the underlying SVG code or just announce "button", which is unhelpful. Also, custom-styled icon buttons often lack clear focus indicators for keyboard users.
**Action:** Always provide an `aria-label` for icon-only buttons, hide the inner SVG icon using `aria-hidden="true"`, and ensure visible focus styling (e.g., Tailwind's `focus-visible:ring-2 focus-visible:outline-none`).
