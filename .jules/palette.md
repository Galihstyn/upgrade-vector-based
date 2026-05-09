## 2026-05-09 - Accessible interactive numeric displays
**Learning:** For dynamic numeric displays that change via adjacent interactive controls (e.g. zoom percentage text adjacent to plus/minus buttons), screen readers need to proactively announce updates. This codebase currently lacks this proactive notification for the zoom control.
**Action:** Always add `aria-live="polite"` to such displays so screen readers can announce the updated value to users seamlessly as they use the controls. Ensure that adjacent icon-only controls also have appropriate `aria-label`s and `focus-visible` styling.
