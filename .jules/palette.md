## 2024-05-24 - Dynamic Numeric Displays Accessibility
**Learning:** Adding `aria-live="polite"` is crucial for dynamic numeric or status displays (like zoom percentage) controlled by adjacent interactive buttons. Without it, screen readers do not announce the updated value to users when the buttons are clicked.
**Action:** Always add `aria-live="polite"` to dynamic text elements that represent the result of an interaction but don't receive focus themselves.
