import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BoardPage } from '../pages/BoardPage';
import testData from '../test-data/tasks.json';

// Define the interface for our test data to ensure type safety
interface TaskData {
    testCase: string;
    application: string;
    task: string;
    column: string;
    tags: string[];
}

test.describe('Kanban Application Tests', () => {
    // Loop through each item in the JSON file using standard loop
    for (const data of testData as TaskData[]) {
        test(`${data.testCase} - Verify task "${data.task}" in ${data.column} with tags ${data.tags.join(', ')}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const dashboardPage = new DashboardPage(page);
            const boardPage = new BoardPage(page);

            // 1. Login
            console.log(`[${data.testCase}] Logging in...`);
            await loginPage.navigate();
            await loginPage.login('admin', 'password123');

            // 2. Navigate to Application
            console.log(`[${data.testCase}] Navigating to project: ${data.application}`);
            await dashboardPage.navigateToProject(data.application);

            // 3. Verify Task in Column
            console.log(`[${data.testCase}] Verifying task "${data.task}" in column "${data.column}"`);
            const taskLocator = await boardPage.verifyTaskInColumn(data.task, data.column);

            // 4. Verify Tags
            if (data.tags && data.tags.length > 0) {
                console.log(`[${data.testCase}] Verifying tags: ${data.tags.join(', ')}`);
                await boardPage.verifyTags(taskLocator, data.tags);
            }
        });
    }
});
