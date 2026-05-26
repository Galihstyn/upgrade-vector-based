## 2024-05-26 - Icon-only Buttons Missing Context
**Learning:** Found several top utility icon buttons (`Undo`, `Redo`, `Zoom In`, `Zoom Out`) relying solely on the `title` attribute for accessibility. Tooltips are often insufficient for screen readers without `aria-label`, and the inner SVG needed `aria-hidden="true"` to prevent double-reading.
**Action:** Always pair `title` with explicit `aria-label`s for icon-only buttons, and use `aria-hidden="true"` on their child SVG icons to guarantee concise screen reader announcements.
