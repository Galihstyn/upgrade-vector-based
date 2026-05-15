## 2024-05-23 - Dynamic Display Accessibility
**Learning:** Dynamic numeric or status displays that change via adjacent interactive controls (like the zoom percentage manipulated by +/- buttons in the canvas toolbar) need proactive screen reader announcements.
**Action:** When implementing similar dynamic text elements, explicitly add `aria-live="polite"` and `aria-atomic="true"` to ensure changes are announced correctly without interrupting the user.
