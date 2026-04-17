## 2024-05-24 - Dynamic Value Announcements
**Learning:** Discovered that icon-only buttons controlling a dynamic numeric value (like zoom percentage) need to be paired with an `aria-live` region on the display element, otherwise screen reader users have no feedback on what the buttons actually did.
**Action:** Always add `aria-live="polite"` to numeric or status displays that change as a direct result of user interaction with adjacent controls.
