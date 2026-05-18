## 2024-05-18 - Toolbars Need ARIA
**Learning:** Toolbars containing primarily icon-only action buttons (undo, redo, zoom) lack ARIA labels and focus visibility by default, making them inaccessible to keyboard and screen reader users. Additionally, dynamic percentage readouts (like zoom percentage) are silent unless explicitly marked with aria-live="polite".
**Action:** When working with toolbars in this app, ensure all icon-only buttons receive an `aria-label` and `focus-visible:ring-2` class. Dynamic numbers updated by these controls must have `aria-live="polite"`.
