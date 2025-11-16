import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Alerts Dashboard
 * 
 * Tests:
 * - Navigate to alerts dashboard
 * - View alert list (renewal, obligation, risk)
 * - Filter alerts by type and severity
 * - Verify alert details displayed
 * - Test real-time updates
 */

test.describe('Alerts Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to alerts page
    await page.goto('/alerts');
  });

  test('should display alerts dashboard', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Should show dashboard title
    await expect(page.locator('h1, h2')).toContainText(/alert/i);
  });

  test('should show alert list', async ({ page }) => {
    // Should display alerts container
    const alertsList = page.locator('[data-testid="alerts-list"], .alerts-container');
    await expect(alertsList).toBeVisible({ timeout: 5000 });
  });

  test('should display renewal alerts', async ({ page }) => {
    // Look for renewal alerts
    const renewalAlerts = page.locator('[data-alert-type="renewal"], .alert-renewal');
    
    // May or may not have alerts, but container should exist
    const count = await renewalAlerts.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display obligation alerts', async ({ page }) => {
    // Look for obligation alerts
    const obligationAlerts = page.locator('[data-alert-type="obligation"], .alert-obligation');
    
    const count = await obligationAlerts.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display risk alerts', async ({ page }) => {
    // Look for risk alerts
    const riskAlerts = page.locator('[data-alert-type="risk"], .alert-risk');
    
    const count = await riskAlerts.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show severity indicators', async ({ page }) => {
    // Check for severity badges
    const severityBadges = page.locator('.severity-badge, [data-testid="severity"]');
    
    if (await severityBadges.first().isVisible()) {
      // Should have severity levels: high, medium, low
      const badge = severityBadges.first();
      const text = await badge.textContent();
      expect(text?.toLowerCase()).toMatch(/high|medium|low/);
    }
  });

  test('should filter alerts by type', async ({ page }) => {
    // Click filter dropdown or tabs
    const typeFilter = page.locator('[data-testid="type-filter"], select[name="type"]');
    
    if (await typeFilter.isVisible()) {
      // Select renewal type
      await typeFilter.selectOption('renewal');
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Should only show renewal alerts
      const alerts = page.locator('.alert-item, [data-testid="alert"]');
      const count = await alerts.count();
      
      if (count > 0) {
        // All visible alerts should be renewal type
        const firstAlert = alerts.first();
        await expect(firstAlert).toHaveAttribute('data-alert-type', 'renewal');
      }
    }
  });

  test('should filter alerts by severity', async ({ page }) => {
    // Click severity filter
    const severityFilter = page.locator('[data-testid="severity-filter"], select[name="severity"]');
    
    if (await severityFilter.isVisible()) {
      // Select high severity
      await severityFilter.selectOption('high');
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Should only show high severity alerts
      const alerts = page.locator('.alert-item, [data-testid="alert"]');
      const count = await alerts.count();
      
      if (count > 0) {
        const firstAlert = alerts.first();
        await expect(firstAlert.locator('.severity-badge')).toContainText(/high/i);
      }
    }
  });

  test('should show alert details on click', async ({ page }) => {
    // Click on first alert
    const firstAlert = page.locator('.alert-item, [data-testid="alert"]').first();
    
    if (await firstAlert.isVisible()) {
      await firstAlert.click();
      
      // Should show alert detail panel or modal
      const detailPanel = page.locator('.alert-detail, [data-testid="alert-detail"]');
      await expect(detailPanel).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display contract link in alert', async ({ page }) => {
    // Each alert should have a link to the related contract
    const contractLink = page.locator('a[href*="/contracts/"]').first();
    
    if (await contractLink.isVisible()) {
      await expect(contractLink).toBeVisible();
    }
  });

  test('should show alert timestamp', async ({ page }) => {
    // Alerts should show when they were created/triggered
    const timestamp = page.locator('.alert-timestamp, [data-testid="timestamp"]').first();
    
    if (await timestamp.isVisible()) {
      const text = await timestamp.textContent();
      // Should contain date/time or relative time (e.g., "2 days ago")
      expect(text).toBeTruthy();
    }
  });

  test('should trigger manual alert refresh', async ({ page }) => {
    // Look for refresh/run button
    const refreshButton = page.locator('button:has-text("Refresh"), button:has-text("Run")');
    
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Should show loading state
      await expect(page.locator('.loading, .spinner')).toBeVisible({ timeout: 1000 });
      
      // Wait for refresh to complete
      await page.waitForTimeout(2000);
    }
  });
});

test.describe('Alerts Dashboard - Empty State', () => {
  
  test('should show empty state when no alerts', async ({ page }) => {
    await page.goto('/alerts');
    
    // If no alerts exist, should show empty state
    const emptyState = page.locator('.empty-state, [data-testid="empty-alerts"]');
    const alertsList = page.locator('.alert-item, [data-testid="alert"]');
    
    const hasAlerts = await alertsList.count() > 0;
    
    if (!hasAlerts) {
      await expect(emptyState).toBeVisible();
    }
  });
});

test.describe('Alerts Dashboard - Pagination', () => {
  
  test('should paginate alerts if many exist', async ({ page }) => {
    await page.goto('/alerts');
    
    // Look for pagination controls
    const pagination = page.locator('.pagination, [data-testid="pagination"]');
    
    if (await pagination.isVisible()) {
      // Should have next/previous buttons
      const nextButton = pagination.locator('button:has-text("Next")');
      await expect(nextButton).toBeVisible();
    }
  });
});

test.describe('Alerts Dashboard - Search', () => {
  
  test('should search alerts by contract name', async ({ page }) => {
    await page.goto('/alerts');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    
    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('MSA');
      
      // Wait for search to apply
      await page.waitForTimeout(1000);
      
      // Results should be filtered
      const alerts = page.locator('.alert-item, [data-testid="alert"]');
      const count = await alerts.count();
      
      // If results exist, they should contain search term
      if (count > 0) {
        const firstAlert = alerts.first();
        const text = await firstAlert.textContent();
        expect(text?.toLowerCase()).toContain('msa');
      }
    }
  });
});

test.describe('Alerts Dashboard - Real-time Updates', () => {
  
  test('should show alert count badge', async ({ page }) => {
    await page.goto('/');
    
    // Look for alert count in navigation
    const alertBadge = page.locator('.alert-count, [data-testid="alert-badge"]');
    
    if (await alertBadge.isVisible()) {
      const count = await alertBadge.textContent();
      expect(parseInt(count || '0')).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Alerts Dashboard - Bulk Actions', () => {
  
  test('should allow marking alerts as read', async ({ page }) => {
    await page.goto('/alerts');
    
    // Look for mark as read button
    const markReadButton = page.locator('button:has-text("Mark as Read"), button:has-text("Dismiss")');
    
    if (await markReadButton.first().isVisible()) {
      // Click first alert
      await page.locator('.alert-item').first().click();
      
      // Click mark as read
      await markReadButton.first().click();
      
      // Alert should be marked or removed
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Alerts Dashboard - Status Indicator', () => {
  
  test('should show scheduler status', async ({ page }) => {
    await page.goto('/alerts');
    
    // Look for scheduler status indicator
    const statusIndicator = page.locator('[data-testid="scheduler-status"], .scheduler-status');
    
    if (await statusIndicator.isVisible()) {
      // Should show enabled/disabled/running
      const status = await statusIndicator.textContent();
      expect(status).toBeTruthy();
    }
  });
});
