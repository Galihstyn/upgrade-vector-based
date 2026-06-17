## 2024-06-25 - Playwright Class Assertions for Accessibility
**Learning:** When using Playwright Python to test that accessibility classes (like focus-visible:ring-2) are applied, standard `.to_have_class("focus-visible:ring-2")` fails because it expects an exact match of the entire class string.
**Action:** Use `expect(locator).to_have_class(re.compile(r"class-name"))` with the `re` module to test for the presence of specific utility classes within a larger class string.
