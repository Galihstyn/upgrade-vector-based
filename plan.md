1. **Optimize `getWarpMetrics` in `app32825_FIXED.jsx`**:
   - Locate the `chars.map` loop where `getWarpMetrics` computes text geometry.
   - Replace the array initialization, `.map`, and `.forEach` chain for `corners` with direct mathematical calculations.
   - Hoist the `Math.cos(angle)` and `Math.sin(angle)` computations so they are evaluated only once per character, not per corner.
   - This eliminates multiple object/array allocations per character, reducing GC overhead.

2. **Add entry to `.jules/bolt.md`**:
   - Create or append to `.jules/bolt.md`.
   - Document the learning about array allocation and intermediate `.map` chains within hot calculation loops causing garbage collection spikes.

3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
   - Run formatters.
   - Run linter/type checks/tests.

4. **Submit PR**:
   - Use title "⚡ Bolt: Optimize getWarpMetrics corner calculations".
   - Include description with What, Why, Impact, and Measurement.
