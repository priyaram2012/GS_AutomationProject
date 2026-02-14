import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigates to a specific application board.
     * @param appName The name of the application to navigate to (e.g., "Web Application", "Mobile Application")
     */
    async navigateToProject(appName: string) {
        // Navigate to project by clicking the card/button with the app name.
        // The HTML shows these are buttons containing h2 headings.
        // We use a regex to match the name cleanly.
        await this.page.getByRole('button', { name: appName }).click();
    }
}

