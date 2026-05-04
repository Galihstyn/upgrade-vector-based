
## $(date +%Y-%m-%d) - Dynamic Accessibility Indicators
**Learning:** Adding `aria-live="polite"` directly to dynamic numeric displays (like zoom percentage) and `role="status"` with `aria-live="polite"` to notification toasts ensures screen readers announce important state changes without disrupting the user's current flow.
**Action:** Always verify dynamic text elements and temporary notifications have proper ARIA live region attributes to keep screen reader users informed.
