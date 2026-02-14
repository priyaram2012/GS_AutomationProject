import { test } from '@playwright/test';
import fs from 'fs';

test('Dump Login HTML', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const content = await page.content();
    fs.writeFileSync('login_page.html', content);
});
