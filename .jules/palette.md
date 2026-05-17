## $(date +%Y-%m-%d) - Dynamic Status Announcement
**Learning:** When adding dynamic adjoining controls (like Zoom In/Out) next to a status indicator, standard `aria-label`s on the buttons aren't enough. Screen readers need to be explicitly told to announce the updated status.
**Action:** Always add `aria-live="polite"` (and consider `role="status"`) to the element displaying dynamic, inline values so they are actively announced to assistive technologies when adjacent controls are triggered.
