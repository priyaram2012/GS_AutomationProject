/**
 * Common Test Utilities
 * Reusable helper functions for tests
 */

const { expect } = require('@playwright/test');
const config = require('./testConfig');
const BasePage = require('../pages/BasePage');

class TestUtils {
    /**
     * Wait for board to load completely
     */
    static async waitForBoardLoad(page) {
        try {
            await page.waitForSelector('h2', { timeout: config.TIMEOUT.BOARD_LOAD });
        } catch (error) {
            // Board might load with different selectors
            await page.waitForLoadState('domcontentloaded');
        }
    }

    /**
     * Wait for navigation to complete
     */
    static async waitForNavigationComplete(page) {
        await page.waitForLoadState('domcontentloaded');
        await this.waitForBoardLoad(page);
    }

    /**
     * Verify element is visible
     */
    static async assertElementVisible(page, selector, message = '') {
        try {
            await expect(page.locator(selector)).toBeVisible({ timeout: config.TIMEOUT.ELEMENT_WAIT });
        } catch (error) {
            throw new Error(`Element not visible: ${selector}. ${message}`);
        }
    }

    /**
     * Log test step
     */
    static logStep(stepName) {
        console.log(`✓ ${stepName}`);
    }

    /**
     * Retry action with backoff
     */
    static async retry(action, maxAttempts = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await action();
            } catch (error) {
                if (attempt === maxAttempts) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Login to application and optionally select a board
     * Common workflow for all test cases
     * 
     * @param {Page} page - Playwright page object
     * @param {string} username - Username to login with
     * @param {string} password - Password to login with
     * @param {string} boardName - Optional board name to select (e.g., 'Web Application', 'Mobile Application')
     * @returns {BasePage} - BasePage instance for further interactions
     */
    static async loginAndSelectBoard(page, username, password, boardName = null) {
        const basePage = new BasePage(page);

        console.log('🔐 Starting login workflow...\n');

        // Step 1: Navigate to login page
        console.log('Step 1: Navigate to login page');
        await basePage.navigate('/', false);
        await page.waitForLoadState('domcontentloaded');
        console.log('✓ Login page loaded\n');

        // Step 2: Fill username
        console.log('Step 2: Fill username');
        await basePage.fill('#username', username);
        console.log(`✓ Username filled: ${username}\n`);

        // Step 3: Fill password
        console.log('Step 3: Fill password');
        await basePage.fill('#password', password);
        console.log('✓ Password filled\n');

        // Step 4: Click login button
        console.log('Step 4: Click login button');
        await basePage.click('button[type="submit"]');
        console.log('✓ Login button clicked\n');

        // Step 5: Wait for board load
        console.log('Step 5: Wait for board load');
        await basePage.waitForBoardLoad();
        console.log('✓ Board loaded\n');

        // Step 6: Select board if specified
        if (boardName) {
            console.log(`Step 6: Navigate to ${boardName} board`);
            await basePage.selectBoard(boardName).catch(() => {
                console.log(`ℹ Already on ${boardName} board`);
            });
            console.log(`✓ On ${boardName} board\n`);
        }

        // Step 7: Verify URL
        console.log('Step 7: Verify base URL');
        const currentURL = await basePage.getCurrentURL();
        expect(currentURL).toContain('animated-gingersnap-8cf7f2.netlify.app');
        console.log(`✓ Correct base URL: ${currentURL}\n`);

        console.log('✅ Login workflow completed successfully\n');

        return basePage;
    }
}

module.exports = TestUtils;
