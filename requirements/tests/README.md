# Test Suite

This directory contains unit tests for the CalcHowMuch calculator platform.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── core/              # Tests for core utility functions
│   ├── math.test.js       # Math operations (add, subtract, multiply, divide, etc.)
│   ├── validate.test.js   # Input validation (toNumber, clamp)
│   └── format.test.js     # Output formatting (formatNumber, formatCurrency, formatPercent)
└── README.md          # This file
```

## Coverage Requirements

Per CODING_STANDARDS.md, we maintain a minimum of **80% code coverage** for:
- Lines
- Functions
- Branches
- Statements

Coverage is automatically checked when running `npm run test:coverage`.

## Writing Tests

- Use Vitest as the test framework
- Place tests in the same directory structure as the source files
- Name test files with `.test.js` extension
- Group related tests using `describe()` blocks
- Write descriptive test names using `it()` blocks

### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../../public/assets/js/core/myModule.js';

describe('myFunction', () => {
  it('should handle normal case', () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });

  it('should handle edge case', () => {
    expect(myFunction(edgeInput)).toBe(edgeOutput);
  });
});
```

## Test Coverage Goals

### Current Coverage
- Core utilities: ✅ Comprehensive tests added
- Calculator modules: ⏳ To be added

### Next Steps
1. Add tests for calculator modules (basic, percentage-calculator, etc.)
2. Add integration tests for calculator UI interactions
3. Add tests for layout/navigation functionality
