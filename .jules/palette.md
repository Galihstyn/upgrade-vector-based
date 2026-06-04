## 2024-06-04 - Improve Form Input Feedback
**Learning:** Found several color swatches and inputs that are dynamically generated and could benefit from ARIA labels for accessibility, but `app32825_FIXED.jsx` contains multiple toolbars and bottom sheets that do use proper `aria-label`s.
**Action:** Let's look for elements missing helpful ARIA or visual cues.
## 2024-06-04 - Adding ARIA labels to Icon-only Action Buttons
**Learning:** Top utility action buttons (Undo, Redo, Zoom In, Zoom Out) only have `title` attributes and are missing `aria-label`s for screen reader support. Wait, `title` can act as an accessible name, but `aria-label` is much preferred for icon-only buttons as it guarantees reliable screen-reader announcements without relying on tooltip hover text logic, and it meets proper a11y standards.
**Action:** Let's add ARIA labels to icon-only buttons like Undo, Redo, Zoom In, Zoom Out, and ensure they have `focus-visible` styles for keyboard navigation.
## 2024-06-04 - Status Notifications A11y
**Learning:** Found `<div ...>{statusMsg}</div>` used for status toasts, but it lacks `role="status"` and `aria-live="polite"`. Screen readers won't announce these dynamic updates automatically.
**Action:** Let's also add `role="status" aria-live="polite"` to the Toast element to improve a11y for blind users, and add `aria-label` to Undo/Redo/Zoom-In/Zoom-Out. Wait, "Keep changes under 50 lines", maybe adding `aria-label`s to the missing utility buttons is exactly what the user needs. Let's do that!
