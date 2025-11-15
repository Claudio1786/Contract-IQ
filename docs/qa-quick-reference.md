# QA Testing Quick Reference

## 🎯 TL;DR - Stop Manual Testing!

**Before:** Click through every template option manually = 1 hour ⏰  
**Now:** Run automated tests = 2-5 minutes ⚡

## Quick Commands

### Test Everything (2-5 minutes)
```bash
# From project root
pnpm test
```

### Test Frontend Only
```bash
pnpm --filter @contract-iq/web test
```

### Test Backend Only
```bash
cd apps/api
poetry run pytest
```

### Test Specific Feature
```bash
# Test playbook generator
pnpm --filter @contract-iq/web test playbook-generator

# Test contract details
pnpm --filter @contract-iq/web test contract-detail

# Test with coverage report
pnpm --filter @contract-iq/web test --coverage
```

### Watch Mode (Development)
```bash
# Auto-rerun tests when files change
pnpm --filter @contract-iq/web test --watch
```

## What Gets Tested Automatically

### ✅ PlaybookGenerator (NEW!)
- All 8 quick template buttons
- Template selection combinations (no crashes!)
- SLA + Liability Caps rapid clicking
- API error handling with retry logic
- Form validation
- Empty state scenarios
- Accessibility (ARIA attributes)
- Error state management

### ✅ Contract Management
- Contract detail rendering
- Contract list display
- Portfolio statistics
- Error boundaries
- Skeleton loaders

### ✅ API Integration
- AI negotiation endpoint
- Retry logic with exponential backoff
- 503 error handling
- Contract ingestion
- Health checks

## Common Use Cases

### Before Committing Code
```bash
pnpm test
# Wait 2-5 minutes
# ✅ All tests pass? Commit!
# ❌ Tests fail? Fix before committing
```

### Before Deploying
```bash
# Run full test suite
pnpm test

# Check backend
cd apps/api && poetry run pytest

# Manual spot check (5 min):
# - Open one template
# - Generate one playbook
# - Verify UI looks correct
```

### Debugging a Specific Issue
```bash
# Run only the relevant test
pnpm --filter @contract-iq/web test playbook-generator --reporter=verbose

# Or run in watch mode and make changes
pnpm --filter @contract-iq/web test --watch
```

### Testing After Fixing a Bug
```bash
# Add test case for the bug
# Run that specific test
pnpm --filter @contract-iq/web test --grep "should handle SLA + Liability Caps"
```

## Test Coverage Reports

### Generate HTML Coverage Report
```bash
pnpm --filter @contract-iq/web test --coverage
# Open apps/web/coverage/index.html in browser
```

### Check Coverage Thresholds
```bash
# See which files need more tests
pnpm --filter @contract-iq/web test --coverage --reporter=verbose
```

## Interpreting Results

### ✅ Success Output
```
✓ PlaybookGenerator > Template Selection > should render without crashing
✓ PlaybookGenerator > Template Selection > should handle SLA Enhancement template
✓ PlaybookGenerator > All Quick Templates > should load SaaS Renewal template
...
Test Files  1 passed (1)
     Tests  23 passed (23)
```

### ❌ Failure Output
```
❌ PlaybookGenerator > Template Selection > should handle multiple clicks
  Expected: "Service Agreement"
  Received: undefined
  
  → This means the template button isn't working correctly
```

## CI/CD Integration

### GitHub Actions (Automatic on PR)
When you push code, tests run automatically:
1. Unit tests (frontend)
2. API tests (backend)
3. Lint checks
4. Build verification

Check status on GitHub PR page.

## When to Use Each Testing Method

| Method | When | Time |
|--------|------|------|
| **Automated Unit Tests** | Every commit, before PR | 2-5 min ⚡ |
| **Manual Spot Check** | Before deployment | 5 min 🏃 |
| **Full Manual Test** | Major releases only | 1 hour 🐢 |
| **E2E Tests (Future)** | Weekly, before prod deploy | 10 min 🏃 |

## Troubleshooting

### Tests Won't Run
```bash
# Install dependencies
pnpm install

# Clear cache
pnpm store prune
pnpm install

# Check Node version (need 18+)
node --version
```

### Tests Pass Locally but Fail in CI
```bash
# Run with same environment as CI
NODE_ENV=test pnpm test

# Check for timezone/locale issues
TZ=UTC pnpm test
```

### Test is Flaky (Sometimes Passes/Fails)
```bash
# Run test multiple times
for i in {1..10}; do pnpm test playbook-generator; done

# Usually indicates timing issue - add proper waitFor()
```

## Adding New Tests

### When You Add a New Feature
1. Create test file: `__tests__/my-feature.test.tsx`
2. Write test cases (see `playbook-generator.test.tsx` as example)
3. Run tests: `pnpm test my-feature`
4. Verify coverage: `pnpm test --coverage`

### Test Structure Template
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      render(<MyComponent />);
      
      // Interact with component
      const button = screen.getByText('Click Me');
      fireEvent.click(button);
      
      // Assert expected behavior
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });
});
```

## Cheat Sheet

```bash
# Most common commands
pnpm test                           # Run all tests
pnpm test --watch                   # Watch mode
pnpm test --coverage                # With coverage
pnpm test playbook-generator        # Specific test
pnpm test --grep "template"         # Tests matching pattern

# Backend tests
cd apps/api && poetry run pytest    # All API tests
poetry run pytest -v                # Verbose
poetry run pytest --cov             # With coverage

# Quality checks
pnpm lint                           # Check code style
pnpm type-check                     # TypeScript validation
pnpm build                          # Verify build works
```

## Next Level Testing (Future)

### Playwright E2E (Recommended Next Step)
```bash
# Install Playwright
pnpm add -D @playwright/test
pnpm dlx playwright install

# Run E2E tests
pnpm playwright test

# Interactive mode
pnpm playwright test --ui
```

### Load Testing
```bash
# Install k6
# Run load test
k6 run scripts/load-test.js
```

## Questions?

### Q: Do I still need to manually test?
**A:** Only quick spot checks (5 min) before deployment. No more clicking every option!

### Q: What if tests fail?
**A:** Fix the bug! Tests caught an issue before users did. 🎉

### Q: How do I test API errors?
**A:** Already covered! See `playbook-generator.test.tsx` → "API Integration" → "should handle 503 errors"

### Q: Can I use another Droid model for testing?
**A:** No need! These automated tests run instantly and catch more issues than manual testing.

### Q: Tests are too slow?
**A:** 2-5 minutes is normal. Still 10x faster than 1 hour of manual clicking!

---

**Remember:** Write tests once, run them forever. Your future self will thank you! 🚀
