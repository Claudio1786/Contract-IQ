# Contract IQ Testing Strategy

## Overview

This document outlines the comprehensive QA testing approach for Contract IQ, providing automated alternatives to manual testing in the demo environment.

## Testing Pyramid

```
       ┌─────────────────┐
       │  E2E Tests (5%) │  ← Manual/Automated exploratory
       ├─────────────────┤
       │ Integration (15%)│  ← API + Component integration
       ├─────────────────┤
       │ Unit Tests (80%) │  ← Fast, isolated component tests
       └─────────────────┘
```

## 1. Automated Unit Tests (FAST ⚡)

### Current Test Suites

#### Frontend (Vitest)
```bash
# Run all web tests
pnpm --filter @contract-iq/web test

# Run with coverage
pnpm --filter @contract-iq/web test --coverage

# Watch mode for development
pnpm --filter @contract-iq/web test --watch

# Run specific test file
pnpm --filter @contract-iq/web test playbook-generator.test.tsx
```

#### Backend (Pytest)
```bash
# Run all API tests
cd apps/api
poetry run pytest

# Run with coverage
poetry run pytest --cov=contract_iq --cov-report=html

# Run specific test
poetry run pytest tests/test_ai_negotiation.py

# Run verbose
poetry run pytest -v
```

### What's Covered

**Frontend Tests:**
- ✅ Component rendering (contract-detail, contract-skeleton)
- ✅ Error boundaries
- ✅ Library functions (contracts, portfolio)
- ✅ **NEW:** PlaybookGenerator with all templates
- ✅ **NEW:** Template selection crash scenarios
- ✅ **NEW:** Retry logic with exponential backoff
- ✅ **NEW:** Error UI and accessibility

**Backend Tests:**
- ✅ AI negotiation endpoint
- ✅ Alert scheduler
- ✅ Contract ingestion
- ✅ Health checks

## 2. Integration Tests (MEDIUM 🏃)

### Component + API Integration

Create integration test suite:

```typescript
// apps/web/__tests__/integration/playbook-flow.test.ts
describe('Playbook Generation Flow', () => {
  it('should generate SLA playbook end-to-end', async () => {
    // 1. Mount PlaybookGenerator
    // 2. Select SLA template
    // 3. Mock real API response
    // 4. Verify playbook content
    // 5. Check analytics tracking
  });
});
```

**Run Integration Tests:**
```bash
# Run integration tests only
pnpm test:integration

# With real API (requires running backend)
NEXT_PUBLIC_API_URL=http://localhost:8000 pnpm test:integration
```

## 3. E2E Tests with Playwright (COMPREHENSIVE 🐢)

### Setup Playwright

```bash
# Install Playwright
pnpm add -D @playwright/test

# Initialize
pnpm dlx playwright install
```

### E2E Test Scenarios

```typescript
// e2e/playbook-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Playbook Generator E2E', () => {
  test('should generate all 8 template types', async ({ page }) => {
    await page.goto('/playbooks');
    
    const templates = [
      'SaaS Renewal',
      'SLA Enhancement', 
      'GDPR DPA',
      'Liability Caps',
      'Exit Rights',
      'Payment Terms',
      'IP Rights',
      'Volume Discounts'
    ];
    
    for (const template of templates) {
      await page.click(`text=${template}`);
      await page.waitForSelector('[data-testid="objectives-list"]');
      
      // Select first objective
      await page.click('input[type="checkbox"]');
      
      // Generate playbook
      await page.click('button:has-text("Generate Negotiation Strategy")');
      
      // Wait for generation (or error)
      await page.waitForSelector('[data-testid="playbook-result"], [role="alert"]');
      
      // Take screenshot for visual regression
      await page.screenshot({ path: `screenshots/${template}.png` });
    }
  });
  
  test('should handle API errors gracefully', async ({ page }) => {
    // Mock 503 error
    await page.route('**/api/generate-playbook', route => 
      route.fulfill({ status: 503, body: 'Service Unavailable' })
    );
    
    await page.goto('/playbooks');
    await page.click('text=SLA Enhancement');
    await page.click('input[type="checkbox"]');
    await page.click('button:has-text("Generate")');
    
    // Should show retry indicator
    await expect(page.locator('text=Retrying')).toBeVisible();
    
    // Should show error after retries
    await expect(page.locator('text=Contact Support')).toBeVisible({ timeout: 20000 });
  });
});
```

**Run E2E Tests:**
```bash
# Run all E2E tests
pnpm playwright test

# Run in UI mode (visual)
pnpm playwright test --ui

# Run specific test
pnpm playwright test playbook-generation

# Generate HTML report
pnpm playwright show-report
```

## 4. Contract Testing (API CONTRACTS 📄)

Ensure API contracts don't break between frontend/backend:

```typescript
// tests/contracts/ai-negotiation.contract.test.ts
describe('AI Negotiation API Contract', () => {
  it('should match expected request schema', () => {
    const request = {
      context: {
        topic: 'SLA Enhancement',
        contract_id: 'test-123',
        template_id: 'sla_enhancement',
        current_position: '99% uptime',
        target_position: '99.9% uptime'
      }
    };
    
    // Validate against schema
    expect(request).toMatchSchema(negotiationRequestSchema);
  });
  
  it('should match expected response schema', () => {
    const response = {
      guidance_id: 'guid-123',
      summary: 'Test summary',
      talking_points: ['Point 1'],
      // ... full response
    };
    
    expect(response).toMatchSchema(negotiationResponseSchema);
  });
});
```

## 5. Smoke Tests (CRITICAL PATHS 🔥)

Quick sanity checks before deployment:

```bash
# Create smoke test script
# scripts/smoke-test.sh

#!/bin/bash
set -e

echo "🔥 Running smoke tests..."

# 1. Health check
curl -f http://localhost:8000/health || exit 1

# 2. Generate one playbook
curl -f -X POST http://localhost:8000/ai/negotiation \
  -H "Content-Type: application/json" \
  -d '{"context": {"topic": "test", "contract_id": "test", "template_id": "sla_enhancement", "current_position": "99%", "target_position": "99.9%"}}' \
  || exit 1

# 3. List negotiation history
curl -f http://localhost:8000/ai/negotiation/history || exit 1

echo "✅ Smoke tests passed!"
```

**Run Smoke Tests:**
```bash
chmod +x scripts/smoke-test.sh
./scripts/smoke-test.sh
```

## 6. Property-Based Testing (EDGE CASES 🎲)

Test with random/generated inputs to find edge cases:

```typescript
import { fc, test } from '@fast-check/vitest';

test.prop([
  fc.string(), // contractType
  fc.constantFrom('sla_enhancement', 'saas_renewal_price_increase'), // scenario
  fc.array(fc.string(), { minLength: 1 }) // objectives
])('should handle any valid input combination', async (contractType, scenario, objectives) => {
  const result = await generatePlaybook({ contractType, scenario, objectives });
  
  // Should never throw
  expect(result).toBeDefined();
  expect(result.playbook).toBeDefined();
});
```

## 7. Visual Regression Testing (UI CONSISTENCY 🎨)

Catch unintended UI changes:

```bash
# Install Percy
pnpm add -D @percy/cli @percy/playwright

# Take visual snapshots
pnpm percy exec -- playwright test
```

## 8. Performance Testing (LOAD & STRESS 📊)

### Load Test with k6

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  duration: '30s',
};

export default function() {
  const payload = JSON.stringify({
    context: {
      topic: 'SLA Enhancement',
      contract_id: 'load-test',
      template_id: 'sla_enhancement',
      current_position: '99%',
      target_position: '99.9%'
    }
  });

  const res = http.post('http://localhost:8000/ai/negotiation', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(1);
}
```

**Run Load Tests:**
```bash
k6 run k6/load-test.js
```

## Quick QA Testing Checklist

### Before Every Release

```bash
# 1. Run all unit tests (2-5 minutes)
pnpm test

# 2. Run API tests (30 seconds)
cd apps/api && poetry run pytest

# 3. Run smoke tests (1 minute)
./scripts/smoke-test.sh

# 4. Run E2E critical paths (5 minutes)
pnpm playwright test tests/critical

# 5. Manual spot check (5 minutes)
# - Open /playbooks
# - Click 3 different templates
# - Generate 1 playbook
# - Check error handling (disconnect network)
```

**Total Time: ~15 minutes vs. ~1 hour manual testing**

## Continuous Integration

### GitHub Actions / GitLab CI

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test
      
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd apps/api && poetry install
      - run: poetry run pytest
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm playwright install
      - run: pnpm playwright test
```

## Test Data Management

### Use Fixtures for Consistent Testing

```typescript
// __tests__/fixtures/playbook-requests.ts
export const testRequests = {
  slaEnhancement: {
    contractType: 'Service Contract',
    scenario: 'sla_enhancement',
    objectives: ['uptime_guarantee', 'response_times'],
    currentTerms: '99% uptime, 4hr response',
    desiredOutcome: '99.9% uptime, 1hr response'
  },
  saasRenewal: {
    contractType: 'SaaS Agreement',
    scenario: 'saas_renewal_price_increase',
    objectives: ['cap_increase', 'right_size'],
    currentTerms: '$50K, 10% increase',
    desiredOutcome: 'Cap at 5%, multi-year lock'
  }
  // ... all 8 templates
};
```

## Monitoring & Alerts

### Track Test Metrics

```typescript
// Track test execution time
test('playbook generation performance', async () => {
  const start = performance.now();
  
  await generatePlaybook(testRequests.slaEnhancement);
  
  const duration = performance.now() - start;
  
  // Alert if too slow
  expect(duration).toBeLessThan(5000); // 5 seconds
});
```

## Summary: Your QA Testing Workflow

### Development (Every Commit)
```bash
pnpm test --watch
```

### Before PR
```bash
pnpm test && cd apps/api && poetry run pytest
```

### Before Deployment
```bash
./scripts/smoke-test.sh && pnpm playwright test
```

### Weekly/Monthly
```bash
pnpm test:load  # Load testing
pnpm test:visual  # Visual regression
```

## Tools Summary

| Tool | Purpose | Speed | Coverage |
|------|---------|-------|----------|
| **Vitest** | Unit tests | ⚡ Fast | Components, libs |
| **Pytest** | API tests | ⚡ Fast | Backend logic |
| **Playwright** | E2E tests | 🐢 Slow | Full user flows |
| **k6** | Load tests | 🏃 Medium | Performance |
| **Percy** | Visual tests | 🐢 Slow | UI consistency |
| **Fast-check** | Property tests | 🏃 Medium | Edge cases |

## Next Steps

1. ✅ **Immediate:** Run `pnpm test` to execute existing tests
2. 📝 **This Week:** Add playbook-generator.test.tsx (already created above)
3. 🎭 **Next Week:** Set up Playwright for E2E tests
4. 🔄 **Ongoing:** Add tests for each new feature

---

**No more manual testing every option!** Run `pnpm test` in 2 minutes instead of 1 hour of clicking. 🚀
