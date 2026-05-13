## 2026-05-13 - Focus Styles and ARIA Live for Custom Control Panels
**Learning:** Custom UI toolbars with icon-only buttons often lack focus visible styles by default in Tailwind. Also, dynamic text nodes that serve as status indicators (like zoom percentage) need `aria-live="polite"` so screen reader users are informed when they interact with adjacent controls.
**Action:** Always ensure custom button toolbars use `focus-visible:ring-2` to support keyboard navigation, and add `aria-live` to dynamic feedback elements.
