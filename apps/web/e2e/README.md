# E2E Tests - Contract IQ

## Overview

This directory contains end-to-end (E2E) tests for the Contract IQ web application using Playwright.

**IMPORTANT:** These tests follow the project rule: **NO NDAs!** All tests use MSA, DPA, and SOW contracts only.

## Test Suites

### 1. Contract Upload Flow (`contract-upload.spec.ts`)
Tests the contract upload functionality:
- Navigate to upload page
- Upload MSA, DPA, and SOW contracts
- Validate file selection and preview
- Error handling for invalid files
- Redirect to contract detail page after upload

**13 tests covering:**
- Basic upload flow (3 contract types)
- Validation and error states
- File preview and cancellation
- Multiple file uploads in sequence

### 2. Negotiation Guidance Flow (`negotiation-flow.spec.ts`)
Tests AI-powered negotiation guidance generation:
- Navigate to contract detail pages
- Select negotiation topics/clauses
- Generate AI guidance
- Display talking points and recommendations
- Test with MSA, DPA, and SOW contracts

**15 tests covering:**
- Guidance generation for different topics
- Talking points and fallback recommendations
- Risk callouts and confidence scores
- Regeneration and loading states
- Contract-specific guidance (DPA compliance, SOW deliverables)

### 3. Alerts Dashboard (`alerts-dashboard.spec.ts`)
Tests the contract alerts dashboard:
- View renewal, obligation, and risk alerts
- Filter by type and severity
- Search and pagination
- Real-time updates and manual refresh
- Alert detail views

**15 tests covering:**
- Alert display and filtering
- Severity indicators
- Empty states and pagination
- Search functionality
- Bulk actions and scheduler status

## Test Fixtures

Located in `e2e/fixtures/`:

| File | Description | Size |
|------|-------------|------|
| `test-msa.json` | Master Service Agreement test data | ~800 bytes |
| `test-dpa.json` | Data Processing Agreement test data | ~1.2 KB |
| `test-sow.json` | Statement of Work test data | ~1.5 KB |
| `invalid-file.txt` | Invalid file for error testing | ~150 bytes |

**Note:** These are simplified test fixtures based on the full fixtures in `/fixtures/contracts/`.

## Running Tests

### Prerequisites

1. **Install Playwright:**
   ```bash
   cd apps/web
   npm install -D @playwright/test
   npx playwright install chromium
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   (Playwright config will auto-start dev server if not running)

### Run Commands

```bash
# Run all E2E tests
npx playwright test

# Run specific test suite
npx playwright test contract-upload
npx playwright test negotiation-flow
npx playwright test alerts-dashboard

# Run with UI mode (interactive)
npx playwright test --ui

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode
npx playwright test --debug

# Run tests in headed mode (visible browser)
npx playwright test --headed
```

### Generate Report

```bash
# Run tests and generate HTML report
npx playwright test --reporter=html

# View report
npx playwright show-report
```

## Configuration

Playwright configuration is in `playwright.config.ts`:

- **Test directory:** `./e2e`
- **Base URL:** `http://localhost:3000`
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries:** 2 on CI, 0 locally
- **Trace:** On first retry
- **Screenshot:** Only on failure
- **Video:** Retain on failure

## Best Practices

### 1. NO NDAs Rule
✅ **DO:** Test with MSA, DPA, SOW contracts  
❌ **DON'T:** Create or reference NDA test data

### 2. Locator Strategy
Prefer in order:
1. `data-testid` attributes
2. User-facing text (`:has-text()`)
3. CSS classes (as fallback)

### 3. Wait Strategies
- Use `waitForLoadState('networkidle')` for page loads
- Use `waitForTimeout()` sparingly (only for animations)
- Prefer `expect().toBeVisible({ timeout })` over manual waits

### 4. Test Independence
- Each test should be independent
- Use `beforeEach` for common setup
- Don't rely on test execution order

### 5. Assertions
- Use specific assertions (`toContainText`, `toBeVisible`)
- Add timeout for async operations
- Test both positive and negative cases

## CI/CD Integration

Add to CI pipeline:

```yaml
- name: Install Playwright
  run: |
    cd apps/web
    npm install -D @playwright/test
    npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: |
    cd apps/web
    npx playwright test --reporter=json

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: apps/web/playwright-report/
```

## Troubleshooting

### Tests Failing Locally
1. Ensure dev server is running (`npm run dev`)
2. Check if port 3000 is available
3. Clear browser cache: `npx playwright clean`

### Slow Tests
1. Run tests in parallel: already enabled in config
2. Reduce `waitForTimeout` usage
3. Use `--project=chromium` to test single browser

### Flaky Tests
1. Increase timeout values
2. Add explicit waits for network requests
3. Use `test.fail()` to mark known flaky tests

## Test Coverage

| Feature | Tests | Coverage |
|---------|-------|----------|
| Contract Upload | 13 | ✅ High |
| Negotiation Flow | 15 | ✅ High |
| Alerts Dashboard | 15 | ✅ High |
| **TOTAL** | **43** | **✅ Comprehensive** |

## Next Steps

- [ ] Add visual regression tests (Playwright screenshots)
- [ ] Add performance tests (Lighthouse integration)
- [ ] Add accessibility tests (axe-core integration)
- [ ] Add API mocking for consistent test data
- [ ] Add multi-user collaboration tests

## Links

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Contract IQ API Docs](../../apps/api/README.md)
- [Contract Fixtures Guide](../../fixtures/contracts/README.md)
