# Lessons Learned

> **Read before building. Keep under 100 lines.**

---

## Build Failures (Lint)

| Error | Fix |
|-------|-----|
| `unused variable 'x'` | Remove or prefix with `_` |
| `missing semicolon` | Add semicolon |
| `'any' type not allowed` | Add explicit type |
| `import not found` | Check path, add `export` |

---

## Build Failures (TypeScript)

| Error | Fix |
|-------|-----|
| `Type 'X' not assignable to 'Y'` | Check signature, add type guard |
| `Property does not exist` | Add to interface or use `?.` |
| `Object possibly undefined` | Add `if (x)` guard |

---

## Test Failures (Unit)

| Error | Fix |
|-------|-----|
| `Expected 100, got 99.99` | Use `toBeCloseTo()` or round |
| `Expected X, got undefined` | Check return path |
| `Timeout exceeded` | Add `await` |

---

## Test Failures (E2E)

| Error | Fix |
|-------|-----|
| `Element not found` | Use `waitForSelector()` |
| `Click intercepted` | Close modal first |
| `Assertion failed after click` | Add `waitFor()` |

---

## Calculator-Specific

| Issue | Fix |
|-------|-----|
| Rounding errors | `toFixed(2)` or decimal lib |
| Mode switch no update | Reset state on mode change |

---

## Anti-Patterns (Waste Iterations)

| Bad | Good |
|-----|------|
| Fix 3 things at once | Fix ONE, verify, next |
| Guess from "TypeError" | Read full stack trace |
| See "12 tests failed" | Find common pattern |

---

## Strategies (Save Iterations)

1. Run `npm run format` first (kills 50% lint errors)
2. Fix errors top-to-bottom (cascade effect)
3. If stuck 3+ iterations → step back, re-read REQ

---

*Add new patterns. Remove outdated ones. Keep under 100 lines.*
