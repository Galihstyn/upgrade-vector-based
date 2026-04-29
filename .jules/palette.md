## 2024-04-29 - Screen Reader Announcements for Dynamic Numeric Displays
**Learning:** Dynamic numeric displays adjacent to interactive controls (like zoom percentage manipulated by +/- buttons) are not automatically announced by screen readers when they update.
**Action:** Add `aria-live="polite"` to the display element so screen readers can gracefully announce the updated value to users without interrupting them.
