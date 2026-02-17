const { test, expect } = require('../../utils/baseTest');
const TestUtils = require('../../utils/testUtils');
const tasksData = require('../../test-data/tasks.json');
const { CREDENTIALS } = require('../../utils/testConfig');

test('Test Case 5: Offline mode in Mobile Application @regression', { tag: ['@regression'] }, async ({ page }) => {
    const testData = tasksData.find(t => t.testCase === 'Test Case 5');
    
    console.log('📝 Test Case 5: Offline Mode\n');
    
    // Use common login and navigation helper
    const basePage = await TestUtils.loginAndSelectBoard(page, CREDENTIALS.username, CREDENTIALS.password, 'Mobile Application');
    
    // Verify task and tags (multiple tags: Feature & High Priority)
    console.log('Verify task and tags');
    if (testData) {
        const result = await basePage.verifyTaskAndTags(
            testData.task,
            testData.column,
            testData.tags
        );
        
        expect(result.success).toBe(true);
        console.log(`✓ Task verified: "${testData.task}"`);
        console.log(`✓ Column verified: "${testData.column}"`);
        console.log(`✓ Tags verified: ${testData.tags.join(', ')}\n`);
    }
    
    console.log('✅ Test Case 5 completed successfully');
});
