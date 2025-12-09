import { test, expect } from '@playwright/test';

test.describe('Almas Equities Login Tests', () => {
  test('should load the login page successfully', async ({ page }) => {
    // Navigate to the login (root) page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait and find a visible input field
    const inputs = page.locator('input:not([type="hidden"])');
    await expect(inputs.first()).toBeVisible({ timeout: 10000 });
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} visible input fields on login page`);

    expect(inputCount).toBeGreaterThan(0);
  });

  test('enter email and wait for 2FA UI to appear (in-place)', async ({ page }) => {
    // Go to the login root
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Find and fill the email input
    const email = page.locator(
      'input[placeholder="Enter your email"], input[type="email"], input[name*="email" i]'
    ).first();
    await expect(email).toBeVisible({ timeout: 10000 });
    await email.fill('test@example.com');

    // Find the submit/continue button and ensure it's enabled
    const submit = page.locator(
      'button:has-text("Continue"), button:has-text("Next"), button:has-text("Login"), button[type="submit"]'
    ).first();
    await expect(submit).toBeVisible({ timeout: 5000 });
    await expect(submit).toBeEnabled({ timeout: 10000 });

    // Click (no navigation expected — the UI updates in-place)
    await submit.click();

    // Reliable 2FA indicators (prefer exact selectors observed in the app)
    const authContainer = page.locator('div[data-visible="true"]');
    const heading = page.locator('h1[data-test="app-sign-in-title"]'); // may be "Check your email"
    const sentText = page.locator('p[data-testid="wf-title"]'); // "We've sent a pin..."
    const pinInput = page.locator('input[data-testid="wf-input"][type="tel"][placeholder="00000"]');

    // Wait for any indicator up to 20s
    try {
      await Promise.race([
        authContainer.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
        heading.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
        sentText.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
        pinInput.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null),
      ]);

      // Verify what is present and assert accordingly
      if (await pinInput.isVisible().catch(() => false)) {
        await expect(pinInput).toBeVisible();
      } else if (await authContainer.isVisible().catch(() => false)) {
        await expect(sentText).toContainText(/We've sent a pin/i);
      } else if (await heading.isVisible().catch(() => false)) {
        // Accept both expected headings while UI transitions
        await expect(heading).toHaveText(/Check your email|Welcome to almasONE!/i);
      } else {
        // Nothing matched — capture diagnostics and fail
        await page.screenshot({ path: `debug-2fa-${Date.now()}.png`, fullPage: true }).catch(() => {});
        const html = await page.content().catch(() => '<unable to read page content>');
        throw new Error('2FA UI did not appear after clicking submit. Page snippet:\n' + html.slice(0, 1500));
      }
    } catch (err) {
      // capture diagnostics and rethrow
      await page.screenshot({ path: `debug-2fa-${Date.now()}.png`, fullPage: true }).catch(() => {});
      const html = await page.content().catch(() => '<unable to read page content>');
      console.error('2FA wait failed. Page HTML snippet:', html.slice(0, 1000));
      throw err;
    }
  });

  test('should verify form elements exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const inputCount = await page.locator('input:not([type="hidden"])').count();
    const buttonCount = await page.locator('button:visible').count();

    console.log(`Found ${inputCount} visible inputs and ${buttonCount} visible buttons`);

    expect(inputCount).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
  });
});