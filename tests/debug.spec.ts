import { test } from '@playwright/test';
import fs from 'fs';

test('Dump HTML', async ({ page }) => {
    await page.goto('/');
    // Wait for some content to load - generic wait
    await page.waitForTimeout(5000);
    const content = await page.content();
    fs.writeFileSync('page_dump.html', content);

    // Also dump after login if possible
    try {
        await page.fill('input[type="email"], input[name="email"], #email, #username', 'admin');
        await page.fill('input[type="password"], input[name="password"], #password', 'password123');
        await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
        await page.waitForTimeout(5000);
        const contentLoggedIn = await page.content();
        fs.writeFileSync('page_dump_logged_in.html', contentLoggedIn);
    } catch (e) {
        console.log('Login failed in debug step', e);
    }
});
