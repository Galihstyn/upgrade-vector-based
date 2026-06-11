## 2024-06-11 - Dynamic ARIA Announcements for Zoom Percentage
**Learning:** For dynamic UI components like zoom percentages that are controlled by buttons but only visually update, a visually impaired user won't know the state change has succeeded.
**Action:** Always wrap dynamic visual readouts like `<span className="...">{zoom}%</span>` with an `aria-live="polite"` attribute so the screen reader natively tracks changes without needing to announce state directly via the control button's JavaScript.
