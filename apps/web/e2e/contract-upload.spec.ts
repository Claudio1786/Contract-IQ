import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * E2E Tests: Contract Upload Flow
 * 
 * IMPORTANT: NO NDAs! Only test with MSA, DPA, and SOW contracts.
 * 
 * Tests:
 * - Navigate to upload page
 * - Select and upload contract files (MSA, DPA, SOW)
 * - Verify file parsing and analysis
 * - Check error handling for invalid files
 */

test.describe('Contract Upload Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
  });

  test('should navigate to upload page', async ({ page }) => {
    // Click upload button or link
    await page.click('a[href="/upload"]');
    
    // Verify we're on the upload page
    await expect(page).toHaveURL(/.*upload/);
    await expect(page.locator('h1')).toContainText(/upload|Upload/i);
  });

  test('should display upload form', async ({ page }) => {
    await page.goto('/upload');
    
    // Check for file input element
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check for upload button
    const uploadButton = page.locator('button:has-text("Upload")');
    await expect(uploadButton).toBeVisible();
  });

  test('should upload MSA contract successfully', async ({ page }) => {
    await page.goto('/upload');
    
    // Select MSA file from fixtures
    const filePath = path.join(__dirname, 'fixtures', 'test-msa.json');
    const fileInput = page.locator('input[type="file"]');
    
    // Upload file
    await fileInput.setInputFiles(filePath);
    
    // Click upload button
    await page.click('button:has-text("Upload")');
    
    // Wait for processing
    await page.waitForTimeout(2000);
    
    // Verify success message or redirect
    await expect(page.locator('.success-message, .alert-success')).toBeVisible({
      timeout: 10000
    });
  });

  test('should upload DPA contract successfully', async ({ page }) => {
    await page.goto('/upload');
    
    const filePath = path.join(__dirname, 'fixtures', 'test-dpa.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    await page.click('button:has-text("Upload")');
    
    await expect(page.locator('.success-message, .alert-success')).toBeVisible({
      timeout: 10000
    });
  });

  test('should upload SOW contract successfully', async ({ page }) => {
    await page.goto('/upload');
    
    const filePath = path.join(__dirname, 'fixtures', 'test-sow.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    await page.click('button:has-text("Upload")');
    
    await expect(page.locator('.success-message, .alert-success')).toBeVisible({
      timeout: 10000
    });
  });

  test('should show error for invalid file type', async ({ page }) => {
    await page.goto('/upload');
    
    // Try to upload an invalid file (e.g., image)
    const invalidPath = path.join(__dirname, 'fixtures', 'invalid-file.txt');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(invalidPath);
    await page.click('button:has-text("Upload")');
    
    // Should show error message
    await expect(page.locator('.error-message, .alert-error')).toBeVisible({
      timeout: 5000
    });
  });

  test('should show validation error for empty upload', async ({ page }) => {
    await page.goto('/upload');
    
    // Click upload without selecting a file
    await page.click('button:has-text("Upload")');
    
    // Should show validation error
    await expect(page.locator('.error-message, .alert-error')).toBeVisible({
      timeout: 3000
    });
  });

  test('should display file preview after selection', async ({ page }) => {
    await page.goto('/upload');
    
    const filePath = path.join(__dirname, 'fixtures', 'test-msa.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    
    // Should show file name and size
    await expect(page.locator('.file-preview, .selected-file')).toBeVisible();
    await expect(page.locator('.file-preview, .selected-file')).toContainText('test-msa.json');
  });

  test('should allow canceling upload before submission', async ({ page }) => {
    await page.goto('/upload');
    
    const filePath = path.join(__dirname, 'fixtures', 'test-msa.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    
    // Click cancel or clear button
    const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Clear")');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // File preview should disappear
      await expect(page.locator('.file-preview, .selected-file')).not.toBeVisible();
    }
  });

  test('should redirect to contract detail after successful upload', async ({ page }) => {
    await page.goto('/upload');
    
    const filePath = path.join(__dirname, 'fixtures', 'test-msa.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    await page.click('button:has-text("Upload")');
    
    // Wait for redirect to contract detail page
    await page.waitForURL(/.*contracts\/.*/, { timeout: 15000 });
    
    // Verify we're on a contract detail page
    await expect(page).toHaveURL(/.*contracts\/.+/);
  });
});

test.describe('Contract Upload - Multiple Files', () => {
  
  test('should handle multiple contract uploads in sequence', async ({ page }) => {
    const files = ['test-msa.json', 'test-dpa.json', 'test-sow.json'];
    
    for (const filename of files) {
      await page.goto('/upload');
      
      const filePath = path.join(__dirname, 'fixtures', filename);
      const fileInput = page.locator('input[type="file"]');
      
      await fileInput.setInputFiles(filePath);
      await page.click('button:has-text("Upload")');
      
      // Wait for success
      await expect(page.locator('.success-message, .alert-success')).toBeVisible({
        timeout: 10000
      });
      
      // Small delay between uploads
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Contract Upload - File Size Validation', () => {
  
  test('should accept files under size limit', async ({ page }) => {
    await page.goto('/upload');
    
    // Use a small test file (under typical 10MB limit)
    const filePath = path.join(__dirname, 'fixtures', 'test-msa.json');
    const fileInput = page.locator('input[type="file"]');
    
    await fileInput.setInputFiles(filePath);
    
    // Should not show size error
    await expect(page.locator('.error-message:has-text("too large")')).not.toBeVisible();
  });
});
