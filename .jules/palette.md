## 2024-05-08 - Accessible Dynamic Numeric Displays
**Learning:** When implementing dynamic numeric or status displays that change via adjacent interactive controls (like zoom percentage manipulated by buttons), screen readers may not automatically announce the updated value to users unless explicitly instructed.
**Action:** Always add `aria-live="polite"` to dynamic numeric display elements (like span or div) whose values change based on user interactions, ensuring screen readers announce the updates to the user seamlessly.
