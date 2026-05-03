## 2024-05-03 - Dynamic Numeric Value Accessibility
**Learning:** When numeric displays (like zoom percentage) change via adjacent interactive buttons, screen readers will not announce the updated value by default, leaving non-visual users unaware of the new state.
**Action:** Add `aria-live="polite"` to dynamic numeric displays or status elements that update via adjacent controls so screen readers announce the new value automatically without interrupting the user.
