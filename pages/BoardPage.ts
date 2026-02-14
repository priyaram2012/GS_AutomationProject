import { Page, Locator, expect } from '@playwright/test';

export class BoardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
   * Verifies that a specific task exists within a specific column.
   * @param taskName Name of the task to verify
   * @param columnName Name of the column ("To Do", "In Progress", "Done")
   * @returns Locator for the task card (the full card container)
   */
    async verifyTaskInColumn(taskName: string, columnName: string): Promise<Locator> {
        // Identify column by heading. Note: Heading text includes count, e.g. "To Do (2)"
        // Use .first() to handle potential duplicates (e.g. mobile/desktop views)
        const columnHeader = this.page.getByRole('heading', { name: new RegExp(`^${columnName}`, 'i') }).first();

        // The column container is the parent of the header.
        const columnContainer = this.page.locator('div').filter({ has: columnHeader }).last();

        await expect(columnContainer).toBeVisible();

        // Find the task card within this column.
        // Use .first() to avoid strict mode violations if duplicates exist
        const taskTitle = columnContainer.getByRole('heading', { name: taskName, exact: true }).first();
        await expect(taskTitle).toBeVisible();

        // Return the Card container (parent of the title) for tag scoping.
        const taskCard = this.page.locator('div').filter({ has: taskTitle }).last();
        return taskCard;
    }

    /**
     * Verifies the tags associated with a specific task.
     * @param taskCardLocator The locator for the task card container
     * @param expectedTags Array of tags to verify
     */
    async verifyTags(taskCardLocator: Locator, expectedTags: string[]) {
        for (const tag of expectedTags) {
            // Locate the tag using span filter to be specific.
            // Use .first() to handle duplicates robustly.
            // We look for a span that contains the exact tag text.
            const tagLocator = taskCardLocator.locator('span').filter({ hasText: new RegExp(`^${tag}$`) }).first();
            await expect(tagLocator).toBeVisible();
        }
    }
}
