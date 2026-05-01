## 2024-05-01 - Dynamic Values Context for Screen Readers
**Learning:** When numeric values (like zoom percentage) change dynamically based on adjacent button controls, screen reader users miss the update unless the changing text region is marked as a live region.
**Action:** Always add `aria-live="polite"` to display elements that update asynchronously due to adjacent interactive controls.