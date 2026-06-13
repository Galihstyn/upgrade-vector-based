## 2024-06-13 - Enhance Utility Controls Accessibility
**Learning:** Dynamic text outputs like zoom percentage updates and icon-only utility controls need proper ARIA annotations. `aria-live="polite"` makes dynamic state changes announceable to screen readers, while adding focus indicators (`focus-visible:ring-2`) and explicit `aria-label`s on icon buttons ensures they are navigable and understandable.
**Action:** Always add `aria-live="polite"` on dynamically updating text indicators and add `aria-label` with `focus-visible` styling on icon-only buttons.
