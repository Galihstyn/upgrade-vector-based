## 2024-05-07 - Dynamic Status Values Accessibility
**Learning:** When numeric displays or status values (like zoom percentage) change via adjacent interactive controls, screen readers do not automatically announce the new value, leaving visually impaired users unaware of the state change.
**Action:** Always add `aria-live="polite"` to dynamic text spans (e.g., `<span aria-live="polite">{Math.round(zoom * 100)}%</span>`) so screen readers proactively announce updates when users click nearby increment/decrement buttons.
