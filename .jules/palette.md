## 2024-05-24 - Accessible Dynamic Displays Updated via Controls
**Learning:** Screen readers need `aria-live="polite"` on dynamic numeric displays (such as a zoom percentage) that are updated by adjacent interactive controls (like + and - buttons), so users are informed of the new value without having to move their focus from the button.
**Action:** When implementing any dynamic status or numeric display tightly coupled to interactive controls, always add `aria-live="polite"` to the display element wrapper.
