const BasePage = require('./BasePage');

/**
 * LoginPage - Handles authentication workflow
 * Extends BasePage with login-specific methods
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Open the login page
   */
  async open() {
    console.log('📖 Opening login page...');
    await this.navigate('/', false);
    await this.page.waitForLoadState('domcontentloaded');
    console.log('✓ Login page opened');
  }

  /**
   * Perform complete login workflow
   * @param {string} username - Username (default from CREDENTIALS)
   * @param {string} password - Password (default from CREDENTIALS)
   */
  async login(username, password) {
    console.log('🔐 Starting login workflow...');

    // Fill username field
    console.log(`  → Filling username: ${username}`);
    await this.fill('#username', username, { timeout: 15000 });
    console.log('  ✓ Username filled');

    // Fill password field
    console.log('  → Filling password');
    await this.fill('#password', password, { timeout: 15000 });
    console.log('  ✓ Password filled');

    // Click submit button
    console.log('  → Clicking login button');
    await this.click('button[type="submit"]', { timeout: 15000 });
    console.log('  ✓ Login button clicked');

    // Wait for navigation to complete
    console.log('  → Waiting for navigation...');
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      // Fallback if networkidle times out
      return this.page.waitForLoadState('domcontentloaded');
    });
    console.log('✓ Login completed and navigation successful\n');
  }

  /**
   * Verify we're on the login page
   */
  async isOnLoginPage() {
    const url = await this.getCurrentURL();
    return url.includes('animated-gingersnap-8cf7f2.netlify.app');
  }
}

module.exports = LoginPage;
