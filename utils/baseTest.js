/**
 * Base Test Setup and Fixtures
 * Common setup, teardown, and fixtures for all tests
 */

const { test: baseTest, expect } = require('@playwright/test');
const config = require('./testConfig');

const test = baseTest.extend({
    // Page fixture with proper configuration
    page: async ({ page }, use) => {
        // Set default navigation timeout
        page.setDefaultTimeout(config.TIMEOUT.DEFAULT);
        page.setDefaultNavigationTimeout(config.TIMEOUT.NAVIGATION);
        
        await use(page);
        
        // Cleanup
        await page.close();
    },
});

module.exports = { test, expect };
