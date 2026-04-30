## 2024-05-24 - Dynamic Status Displays Updates
**Learning:** When numeric or status displays (like zoom percentage) change via adjacent interactive controls (like buttons), screen reader users are not automatically notified of the updated value, resulting in poor feedback for their actions.
**Action:** Always add `aria-live="polite"` to the display element so that screen readers can announce the updated value to users seamlessly as they interact with the adjacent controls.
