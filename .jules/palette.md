## 2024-04-18 - Announcing Dynamic Numeric Displays
**Learning:** Adjacent interactive controls (like zoom in/out buttons) updating a numeric display (like a zoom percentage) are invisible to screen readers unless the display element is announced dynamically.
**Action:** Add `aria-live="polite"` and `aria-atomic="true"` to such dynamic numeric or status displays so screen readers can gracefully announce the updated value to users after interaction. This pattern should be consistently applied across the app for any similar interactive UI components.
