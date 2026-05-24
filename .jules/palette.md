## 2024-05-24 - Add ARIA Labels to Icon-Only Buttons
**Learning:** Icon-only buttons using `lucide-react` icons require explicit `aria-label` on the `<button>` element and `aria-hidden="true"` on the `<Icon />` component to prevent redundant screen reader announcements while providing the necessary context. Focus states like `focus-visible:ring-2 focus-visible:outline-none` are also necessary for proper keyboard navigation visibility.
**Action:** Always verify `aria-label`, `aria-hidden="true"`, and `focus-visible` styles when introducing or modifying icon-only buttons.
