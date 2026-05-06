import { test, expect } from '@playwright/test';

/**
 * CLI Quote Museum E2E Tests
 * 
 * These tests verify the core functionality of the museum:
 * - Quote display and navigation
 * - Stats panel toggle
 * - Live capture sidebar
 * - Token flow visualization
 * - Keyboard shortcuts
 */

test.describe('CLI Quote Museum', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('.museum');
  });

  test.describe('Core Quote Display', () => {
    test('displays a quote on initial load', async ({ page }) => {
      const quoteText = page.locator('.quote-text');
      await expect(quoteText).toBeVisible();
      await expect(quoteText).not.toBeEmpty();
    });

    test('displays quote metadata (source, date, tags)', async ({ page }) => {
      await expect(page.locator('.source-badge')).toBeVisible();
      await expect(page.locator('.date-badge')).toBeVisible();
      await expect(page.locator('.tags')).toBeVisible();
    });

    test('refresh button loads a new quote', async ({ page }) => {
      const initialQuote = await page.locator('.quote-text').textContent();
      
      await page.click('button:has-text("RANDOM QUOTE")');
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      const newQuote = await page.locator('.quote-text').textContent();
      expect(newQuote).not.toBe(initialQuote);
    });

    test('copy button copies quote to clipboard', async ({ page }) => {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      await page.click('button:has-text("COPY")');
      
      // Check button text changed
      await expect(page.locator('button:has-text("COPIED")')).toBeVisible();
      
      // Verify clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('"');
    });
  });

  test.describe('Stats Panel', () => {
    test('stats panel is hidden by default', async ({ page }) => {
      await expect(page.locator('#stats-panel')).not.toBeVisible();
    });

    test('clicking STATS toggle shows stats panel', async ({ page }) => {
      await page.click('button:has-text("STATS")');
      
      await expect(page.locator('#stats-panel')).toBeVisible();
      await expect(page.locator('.stat-card.total')).toBeVisible();
    });

    test('stats panel shows token count', async ({ page }) => {
      await page.click('button:has-text("STATS")');
      
      const totalTokens = page.locator('.stat-card.total .stat-value');
      await expect(totalTokens).toContainText('M'); // Should show millions
    });
  });

  test.describe('Feature Navigation', () => {
    test('feature toolbar is visible', async ({ page }) => {
      await expect(page.locator('.feature-toolbar')).toBeVisible();
    });

    test('FLOW view shows token visualization', async ({ page }) => {
      await page.click('button:has-text("FLOW")');
      
      await expect(page.locator('.token-flow-container')).toBeVisible();
      await expect(page.locator('canvas.token-canvas')).toBeVisible();
    });

    test('THREADS view shows conversation interface', async ({ page }) => {
      await page.click('button:has-text("THREADS")');
      
      await expect(page.locator('.conversation-thread')).toBeVisible();
    });

    test('MUSEUM view returns to quote display', async ({ page }) => {
      // First go to FLOW
      await page.click('button:has-text("FLOW")');
      await expect(page.locator('.token-flow-container')).toBeVisible();
      
      // Then return to MUSEUM
      await page.click('button:has-text("MUSEUM")');
      await expect(page.locator('.quote-container')).toBeVisible();
    });
  });

  test.describe('Live Capture Sidebar', () => {
    test('sidebar opens with keyboard shortcut', async ({ page }) => {
      await page.keyboard.press('Meta+k');
      
      await expect(page.locator('.live-sidebar')).toBeVisible();
    });

    test('sidebar shows live toggle', async ({ page }) => {
      await page.keyboard.press('Meta+k');
      
      await expect(page.locator('.live-toggle')).toBeVisible();
    });

    test('sidebar closes with escape key', async ({ page }) => {
      await page.keyboard.press('Meta+k');
      await expect(page.locator('.live-sidebar')).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('.live-sidebar')).not.toBeVisible();
    });
  });

  test.describe('Time Machine Modal', () => {
    test('CONTEXT button opens time machine', async ({ page }) => {
      await page.click('button:has-text("CONTEXT")');
      
      await expect(page.locator('.tm-modal')).toBeVisible();
      await expect(page.locator('.tm-title:has-text("Context Time Machine")')).toBeVisible();
    });

    test('time machine has transcript tab', async ({ page }) => {
      await page.click('button:has-text("CONTEXT")');
      
      await expect(page.locator('.tm-tab:has-text("Transcript")')).toBeVisible();
    });

    test('time machine closes with escape', async ({ page }) => {
      await page.click('button:has-text("CONTEXT")');
      await expect(page.locator('.tm-modal')).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('.tm-modal')).not.toBeVisible();
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('space bar refreshes quote', async ({ page }) => {
      const initialQuote = await page.locator('.quote-text').textContent();
      
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      
      const newQuote = await page.locator('.quote-text').textContent();
      expect(newQuote).not.toBe(initialQuote);
    });
  });

  test.describe('Accessibility', () => {
    test('skip link is present', async ({ page }) => {
      await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main-content');
    });

    test('main content has proper role', async ({ page }) => {
      await expect(page.locator('main')).toHaveAttribute('role', 'main');
    });

    test('buttons have accessible labels', async ({ page }) => {
      const randomQuoteBtn = page.locator('button:has-text("RANDOM QUOTE")');
      await expect(randomQuoteBtn).toHaveAttribute('aria-label');
    });
  });
});
