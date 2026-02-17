const { test, expect } = require('../../utils/baseTest');
const TestUtils = require('../../utils/testUtils');
const tasksData = require('../../test-data/tasks.json');
const { CREDENTIALS } = require('../../utils/testConfig');

test('Test Case 1: Verify the columns @smoke @regression', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    const testData = tasksData.find(t => t.testCase === 'Test Case 1');
    
    console.log('📝 Test Case 1: Implement User Authentication\n');
    
    // Use common login and navigation helper
    const basePage = await TestUtils.loginAndSelectBoard(page, CREDENTIALS.username, CREDENTIALS.password, 'Web Application');
    
    // Verify URL
    console.log('Verify base URL');
    const currentURL = await basePage.getCurrentURL();
    expect(currentURL).toContain('animated-gingersnap-8cf7f2.netlify.app');
    console.log(`✓ Correct base URL: ${currentURL}\n`);
    
    // Verify task and tags
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
    
    console.log('✅ Test Case 1 completed successfully');
});
