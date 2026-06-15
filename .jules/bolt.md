## 2024-06-15 - Optimize array lookup inside loops
**Learning:** O(N) array `.includes()` lookups nested inside other O(N) loops (`.filter()` or `.map()`) can cause O(N^2) time complexity. Using `useMemo` to memoize the array as a `Set` allows O(1) `.has()` lookups, drastically reducing complexity to O(N).
**Action:** Always inspect array `.includes()` lookups within rendering loops, `filter`, or `map` operations in React components, and memoize them into a `Set` if the array elements are used across multiple iterations or dependencies.
