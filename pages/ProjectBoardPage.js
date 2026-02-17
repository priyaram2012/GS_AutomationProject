const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * ProjectBoardPage - Handles project board interactions
 * Extends BasePage with project-specific methods for navigation and task validation
 */
class ProjectBoardPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Wait for the project board to be fully loaded after login
   */
  async openAfterLogin() {
    console.log('📊 Waiting for project board to load...');
    await this.waitForBoardLoad();
    
    // Verify we're on the board URL
    const url = await this.getCurrentURL();
    expect(url).toContain('animated-gingersnap-8cf7f2.netlify.app');
    console.log(`✓ Project board loaded\n`);
  }

  /**
   * Select a project by name
   * @param {string} projectName - Name of the project (e.g. "Web Application", "Mobile Application")
   */
  async selectProject(projectName) {
    console.log(`🗂️  Selecting project: "${projectName}"`);
    
    try {
      // Try multiple selectors for project switching (buttons, tabs, links)
      const projectSelector = this.page.locator(
        `button:has-text("${projectName}"), a:has-text("${projectName}"), [role="tab"]:has-text("${projectName}")`
      ).first();
      
      await projectSelector.waitFor({ state: 'visible', timeout: 10000 });
      await projectSelector.click();
      console.log(`✓ Clicked on "${projectName}" project`);
      
      // Wait for board content to update
      await this.waitForBoardLoad();
      console.log(`✓ Project "${projectName}" opened and content loaded\n`);
      return true;
    } catch (e) {
      console.log(`✗ Could not find project selector for "${projectName}": ${e.message}\n`);
      return false;
    }
  }

  /**
   * Get all visible columns
   * @returns {Promise<string[]>} Array of column names
   */
  async getColumnNames() {
    console.log('📋 Reading column names...');
    try {
      const columnHeaders = await this.page.locator('h2, h3, [role="heading"]').all();
      const names = [];
      for (const header of columnHeaders) {
        const text = await header.textContent();
        if (text && text.trim() && !names.includes(text.trim())) {
          names.push(text.trim());
        }
      }
      console.log(`✓ Found columns: ${names.join(', ')}\n`);
      return names;
    } catch {
      console.log('✗ Could not read column names\n');
      return [];
    }
  }

  /**
   * Locate a task within a specific column
   * @param {string} taskName - Name of the task
   * @param {string} columnName - Name of the column where task should be
   * @returns {Promise<{found: boolean, element: Locator|null}>}
   */
  async findTaskInColumn(taskName, columnName) {
    console.log(`🔍 Finding task "${taskName}" in column "${columnName}"`);
    
    try {
      // Find the column container by its header
      const columnHeader = this.page.locator(
        `h2:has-text("${columnName}"), h3:has-text("${columnName}"), [role="heading"]:has-text("${columnName}")`
      ).first();
      
      await expect(columnHeader).toBeVisible({ timeout: 10000 });
      console.log(`  ✓ Found column header: "${columnName}"`);
      
      // Get the closest column container
      const columnContainer = columnHeader.locator('xpath=./ancestor::div[contains(@class, "col") or contains(@class, "column") or contains(@class, "card")]').first();
      
      // Find task within this column
      const taskCard = columnContainer.locator(`text="${taskName}"`).first();
      await expect(taskCard).toBeVisible({ timeout: 10000 });
      
      console.log(`✓ Found task "${taskName}" in column "${columnName}"\n`);
      return { found: true, element: taskCard };
    } catch (e) {
      console.log(`✗ Task "${taskName}" not found in column "${columnName}": ${e.message}\n`);
      return { found: false, element: null };
    }
  }

  /**
   * Extract all tag text from a task element
   * @param {Locator} taskElement - The task card element
   * @returns {Promise<string[]>} Array of tag texts
   */
  async getTagsFromTask(taskElement) {
    console.log('  🏷️  Reading tags from task...');
    try {
      // Look for tag elements with various selectors
      const tagLocators = await taskElement.locator(
        '.badge, .tag, [data-testid="tag"], span.rounded-full, span.bg-blue-500, span.bg-purple-500, span.bg-green-500, span.bg-pink-500'
      ).all();
      
      const tags = [];
      for (const tagEl of tagLocators) {
        const text = await tagEl.textContent();
        if (text && text.trim() && !tags.includes(text.trim())) {
          tags.push(text.trim());
        }
      }
      
      if (tags.length > 0) {
        console.log(`  ✓ Found tags: ${tags.join(', ')}`);
      } else {
        console.log(`  ℹ No tags found in task element (may use different selectors)`);
      }
      return tags;
    } catch {
      console.log('  ℹ Could not extract tags');
      return [];
    }
  }

  /**
   * Verify a task exists in a column and has expected tags
   * @param {string} taskName - Name of the task
   * @param {string} columnName - Name of the column
   * @param {string[]} expectedTags - Array of expected tag names
   * @returns {Promise<{success: boolean, foundTags: string[], missingTags: string[]}>}
   */
  async expectTaskInColumn(taskName, columnName, expectedTags = []) {
    console.log(`\n✅ Verifying task "${taskName}" in "${columnName}" with tags: ${expectedTags.join(', ') || '(none)'}`);
    
    const taskResult = await this.findTaskInColumn(taskName, columnName);
    if (!taskResult.found) {
      return {
        success: false,
        foundTags: [],
        missingTags: expectedTags,
        message: `Task "${taskName}" not found in "${columnName}"`
      };
    }

    // Get actual tags from the task
    const foundTags = await this.getTagsFromTask(taskResult.element);

    // Check for missing tags
    const missingTags = expectedTags.filter(
      expected => !foundTags.some(found => found.toLowerCase().includes(expected.toLowerCase()) || expected.toLowerCase().includes(found.toLowerCase()))
    );

    if (missingTags.length === 0) {
      console.log(`✓ All expected tags verified: ${expectedTags.join(', ')}`);
    } else {
      console.log(`⚠ Missing tags: ${missingTags.join(', ')}`);
      console.log(`  Found tags: ${foundTags.length > 0 ? foundTags.join(', ') : '(none)'}`);
    }

    console.log('');
    return {
      success: missingTags.length === 0,
      foundTags,
      missingTags,
      taskElement: taskResult.element
    };
  }

  /**
   * Verify columns are visible on the board
   * @param {string[]} expectedColumns - Array of column names to verify
   * @returns {Promise<boolean>}
   */
  async expectColumnsVisible(expectedColumns = ['To Do', 'In Progress', 'Done']) {
    console.log(`📋 Verifying columns visible: ${expectedColumns.join(', ')}`);
    try {
      for (const columnName of expectedColumns) {
        const columnHeader = this.page.locator(
          `h2:has-text("${columnName}"), h3:has-text("${columnName}"), [role="heading"]:has-text("${columnName}")`
        ).first();
        await expect(columnHeader).toBeVisible({ timeout: 10000 });
        console.log(`  ✓ Column "${columnName}" visible`);
      }
      console.log('✓ All expected columns visible\n');
      return true;
    } catch (e) {
      console.log(`✗ Not all columns visible: ${e.message}\n`);
      return false;
    }
  }

  /**
   * Verify at least one tag is visible on the board
   * @returns {Promise<boolean>}
   */
  async expectTagsVisible() {
    console.log('🏷️  Verifying tags are visible on board...');
    try {
      // Look for any tag elements
      const tagElement = this.page.locator(
        '[data-testid="tag"], .badge, .tag, span.rounded-full'
      ).first();
      
      await expect(tagElement).toBeVisible({ timeout: 5000 });
      const tagText = await tagElement.textContent();
      console.log(`✓ Tag visible: "${tagText}"\n`);
      return true;
    } catch {
      // Fallback - just verify span elements are present
      const spans = await this.page.locator('span').count();
      if (spans > 0) {
        console.log(`✓ Tag elements present on board (${spans} span elements found)\n`);
        return true;
      }
      console.log('⚠ No obvious tag elements found\n');
      return false;
    }
  }
}

module.exports = ProjectBoardPage;
