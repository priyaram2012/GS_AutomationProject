/**
 * Centralized Locator File
 * Stores all application locators in one place for easy maintenance.
 */

module.exports = {
    LoginPage: {
        usernameInput: 'input#username, input[autocomplete="username"]',
        passwordInput: 'input#password, input[autocomplete="current-password"]',
        loginButton: 'button:has-text("Sign in"), button[type="submit"]',
    },
    DashboardPage: {
        // Dynamic locator key for project selection - use button with specific text
        projectButton: (appName) => `button:has-text("${appName}"), text="${appName}"`,
        header: 'h1',
    },
    BoardPage: {
        // Using structural locators where possible
        column: 'div.column', // Assuming some class or structure, but we might rely on text
        columnHeader: 'h2',
        taskTitle: 'h3',
        tag: 'span.tag', // Hypothetical class, will use text matching in page object
    }
};
