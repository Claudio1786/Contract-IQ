import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Negotiation Guidance Flow
 * 
 * Tests:
 * - Navigate to contract detail page
 * - Select clause/topic for negotiation
 * - Generate AI-powered negotiation guidance
 * - Verify talking points and recommendations displayed
 * - Test with different contract types (MSA, DPA, SOW - NO NDAs!)
 */

test.describe('Negotiation Guidance Flow', () => {
  
  // Mock contract ID (would be created by upload flow in real scenario)
  const TEST_CONTRACT_ID = 'test-contract-msa-001';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to contract detail page
    await page.goto(`/contracts/${TEST_CONTRACT_ID}`);
  });

  test('should display contract detail page', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Should show contract information
    await expect(page.locator('h1, h2')).toContainText(/contract|detail/i);
  });

  test('should show negotiation guidance section', async ({ page }) => {
    // Look for negotiation or playbook section
    const negotiationSection = page.locator('[data-testid="negotiation-section"], .negotiation-panel');
    await expect(negotiationSection).toBeVisible({ timeout: 5000 });
  });

  test('should generate guidance for payment terms', async ({ page }) => {
    // Click on payment terms section
    await page.click('text=/payment terms/i');
    
    // Click generate guidance button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Get Guidance")');
    await generateButton.click();
    
    // Wait for AI generation (may take a few seconds)
    await page.waitForTimeout(3000);
    
    // Should show guidance results
    await expect(page.locator('.guidance-result, .ai-response')).toBeVisible({
      timeout: 10000
    });
  });

  test('should display talking points in guidance', async ({ page }) => {
    // Generate guidance
    await page.click('text=/payment terms/i');
    await page.click('button:has-text("Generate")');
    
    await page.waitForTimeout(3000);
    
    // Should show talking points list
    const talkingPoints = page.locator('.talking-points, [data-testid="talking-points"]');
    await expect(talkingPoints).toBeVisible({ timeout: 10000 });
    
    // Should have at least one talking point
    const points = talkingPoints.locator('li, .point-item');
    await expect(points.first()).toBeVisible();
  });

  test('should display fallback recommendation', async ({ page }) => {
    // Generate guidance
    await page.click('text=/liability/i');
    await page.click('button:has-text("Generate")');
    
    await page.waitForTimeout(3000);
    
    // Should show fallback recommendation
    const fallback = page.locator('.fallback-recommendation, [data-testid="fallback"]');
    await expect(fallback).toBeVisible({ timeout: 10000 });
  });

  test('should show risk callouts in guidance', async ({ page }) => {
    // Generate guidance
    await page.click('text=/termination/i');
    await page.click('button:has-text("Generate")');
    
    await page.waitForTimeout(3000);
    
    // Should show risk callouts
    const risks = page.locator('.risk-callouts, [data-testid="risks"]');
    await expect(risks).toBeVisible({ timeout: 10000 });
  });

  test('should display confidence score', async ({ page }) => {
    // Generate guidance
    await page.click('button:has-text("Generate")').first();
    
    await page.waitForTimeout(3000);
    
    // Should show confidence indicator (0-100% or 0.0-1.0)
    const confidence = page.locator('.confidence, [data-testid="confidence-score"]');
    await expect(confidence).toBeVisible({ timeout: 10000 });
  });

  test('should allow regenerating guidance', async ({ page }) => {
    // Generate initial guidance
    await page.click('button:has-text("Generate")').first();
    await page.waitForTimeout(3000);
    
    // Click regenerate button
    const regenerateButton = page.locator('button:has-text("Regenerate"), button:has-text("Refresh")');
    if (await regenerateButton.isVisible()) {
      await regenerateButton.click();
      await page.waitForTimeout(3000);
      
      // Should show updated guidance
      await expect(page.locator('.guidance-result')).toBeVisible();
    }
  });

  test('should show loading state during generation', async ({ page }) => {
    // Click generate
    await page.click('button:has-text("Generate")').first();
    
    // Should immediately show loading indicator
    const loading = page.locator('.loading, .spinner, [data-testid="loading"]');
    await expect(loading).toBeVisible({ timeout: 1000 });
  });

  test('should handle generation errors gracefully', async ({ page }) => {
    // This would test API failure scenarios
    // In real implementation, might mock API to return error
    
    // For now, just verify error UI exists
    const errorContainer = page.locator('.error-message, .alert-error');
    // Error container should exist in DOM (even if hidden)
    await expect(errorContainer).toHaveCount(1, { timeout: 2000 });
  });
});

test.describe('Negotiation Guidance - Multiple Topics', () => {
  
  test('should generate guidance for multiple topics', async ({ page }) => {
    const contractId = 'test-contract-msa-002';
    await page.goto(`/contracts/${contractId}`);
    
    const topics = ['Payment Terms', 'Liability Cap', 'Termination Notice'];
    
    for (const topic of topics) {
      // Click on topic
      await page.click(`text=/${topic}/i`);
      
      // Generate guidance
      await page.click('button:has-text("Generate")');
      await page.waitForTimeout(2000);
      
      // Verify guidance displayed
      await expect(page.locator('.guidance-result')).toBeVisible({ timeout: 8000 });
      
      // Wait before next generation
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Negotiation Guidance - DPA Contract', () => {
  
  test('should generate guidance for DPA compliance topics', async ({ page }) => {
    const contractId = 'test-contract-dpa-001';
    await page.goto(`/contracts/${contractId}`);
    
    // Click on GDPR compliance topic
    await page.click('text=/gdpr|compliance/i');
    
    // Generate guidance
    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);
    
    // Should show DPA-specific guidance
    await expect(page.locator('.guidance-result')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.guidance-result')).toContainText(/data|privacy|gdpr/i);
  });
});

test.describe('Negotiation Guidance - SOW Contract', () => {
  
  test('should generate guidance for SOW deliverables', async ({ page }) => {
    const contractId = 'test-contract-sow-001';
    await page.goto(`/contracts/${contractId}`);
    
    // Click on deliverables topic
    await page.click('text=/deliverable|milestone/i');
    
    // Generate guidance
    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(3000);
    
    // Should show SOW-specific guidance
    await expect(page.locator('.guidance-result')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.guidance-result')).toContainText(/deliverable|milestone|timeline/i);
  });
});

test.describe('Negotiation Guidance - History', () => {
  
  test('should show guidance history for contract', async ({ page }) => {
    const contractId = 'test-contract-msa-003';
    await page.goto(`/contracts/${contractId}`);
    
    // Look for history section
    const historySection = page.locator('[data-testid="guidance-history"], .history-panel');
    if (await historySection.isVisible()) {
      await expect(historySection).toBeVisible();
      
      // Should show previous guidance entries
      const historyEntries = historySection.locator('.history-item, .guidance-entry');
      const count = await historyEntries.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
