## 2025-05-16 - Make dynamic status and numeric displays accessible with aria-live
**Learning:** Elements that dynamically update via adjacent controls (like zoom level percentages or status notification toasts) must use `aria-live="polite"` (and optionally `aria-atomic="true"`, `role="status"`) so that screen readers proactively announce the changes to users.
**Action:** When adding numeric displays updated via +/- buttons or dynamic toast notifications, always include `aria-live="polite"`. Use `role="status"` for non-interactive alert messages to ensure they are conveyed gracefully.
