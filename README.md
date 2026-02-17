# Playwright Test Framework - Clean Setup

A production-grade Playwright test automation framework using JavaScript.

## 📁 Project Structure

```
PlayWright_Automation/
├── utils/
│   ├── baseTest.js           # Custom Playwright test fixture
│   ├── testConfig.js         # Configuration (credentials, timeouts)
│   └── testUtils.js          # Helper functions (loginAndSelectBoard)
│
├── pages/
│   ├── BasePage.js           # Base page object (core methods)
│   ├── LoginPage.js          # Login workflow
│   └── ProjectBoardPage.js   # Project board interactions
│
├── api/
│   ├── APIClient.js          # HTTP client wrapper
│   ├── BoardAPI.js           # Board API operations
│   └── ProjectBoardAPI.js    # Business-level API methods
│
├── test/
│   └── uitest/
│       ├── testcase1.spec.js # Test Case 1
│       ├── testcase2.spec.js # Test Case 2
│       ├── testcase3.spec.js # Test Case 3
│       ├── testcase4.spec.js # Test Case 4
│       ├── testcase5.spec.js # Test Case 5
│       └── testcase6.spec.js # Test Case 6
│
├── test-data/
│   └── tasks.json            # Test data (6 test scenarios)
│
├── locators/
│   └── locators.js           # UI element locators
│
├── .vscode/                  # VS Code configuration
├── playwright.config.js      # Playwright configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript config
└── jsconfig.json             # JavaScript config
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI Headless
```bash
npm run test:headed
```

### Run Smoke Tests
```bash
npm run test:smoke
```

### Run Specific Test
```bash
npx playwright test test/uitest/testcase1.spec.js --headed
```

### View Test Report
```bash
npm run test:report
```

## 📊 Test Cases

| Test | Project | Task | Column | Tags |
|------|---------|------|--------|------|
| TC1 | - | - | - | Verify board loads |
| TC2 | Web App | Fix navigation bug | To Do | Bug |
| TC3 | Web App | Design system updates | In Progress | Design |
| TC4 | Mobile | Push notification system | To Do | Feature |
| TC5 | Mobile | Offline mode | In Progress | Feature, High Priority |
| TC6 | Mobile | App icon design | Done | Design |

## 🏗️ Framework Architecture

### Layer 1: Shared Test Fixture
**utils/baseTest.js** - Custom Playwright fixture extending @playwright/test

### Layer 2: Page Object Model
- **BasePage.js** - Core utilities (navigate, fill, click, waitForBoardLoad)
- **LoginPage.js** - Login workflow (open, login, isOnLoginPage)
- **ProjectBoardPage.js** - Board operations (selectProject, findTask, expectTaskInColumn)

### Layer 3: Common Helpers
**utils/testUtils.js** - `loginAndSelectBoard()` - eliminates login code duplication

### Layer 4: API Testing
- **APIClient.js** - HTTP wrapper
- **ProjectBoardAPI.js** - Business-level API methods

## 🔑 Key Features

- ✅ **Zero Code Duplication** - Shared login helper used across all tests
- ✅ **Page Object Model** - Clean separation of concerns
- ✅ **Observable Workflows** - Step-by-step console logging
- ✅ **API + UI Testing** - Scenarios tested at both layers
- ✅ **Error Handling** - Graceful fallbacks for API failures
- ✅ **Tagged Tests** - @smoke, @regression tags for selective execution

## 💡 How Tests Work

All tests follow this pattern:

```javascript
const basePage = await TestUtils.loginAndSelectBoard(
  page, 
  username, 
  password, 
  'Web Application' // optional: board name
);

const result = await basePage.expectTaskInColumn(
  'Fix navigation bug',
  'To Do',
  ['Bug']
);
```

1. **Login & Setup** - Handled by shared helper (single line)
2. **Test Logic** - Specific to each test case
3. **Verification** - Asserts expected results

## 🔧 Configuration

### Credentials (utils/testConfig.js)
- Username: `admin`
- Password: `password123`
- Base URL: `https://animated-gingersnap-8cf7f2.netlify.app/`

### Timeouts
- DEFAULT: 30s
- NAVIGATION: 20s
- ELEMENT_WAIT: 15s
- BOARD_LOAD: 10s

## 📝 Running Tests Programmatically

```javascript
// Run all tests
npm test

// Run with specific tag
npx playwright test --grep "@smoke"

// Run in debug mode
npm run test:debug

// Run with reporter
npx playwright test --reporter=html
```

## ✅ Checklist

- [x] All 6 test cases consolidated
- [x] Login/navigation code shared (DRY principle)
- [x] Page Object Model implemented
- [x] API layer with business methods
- [x] Test data centralized in tasks.json
- [x] Error handling and fallbacks
- [x] Workspace configuration in .vscode/
- [x] Clean, production-ready structure

## 🎯 For Interviews

This framework demonstrates:
- Page Object Model best practices
- DRY principle enforcement (shared helpers)
- Proper test organization and scalability
- API and UI testing strategy
- Error handling and resilience
- Professional code structure

**Key talking point:** "The `loginAndSelectBoard()` helper replaces 35+ lines of repeated login code. All 6 tests share this, making the framework highly maintainable."

## 🚀 Ready to Run

Everything is configured and ready. Just run:
```bash
npm test
```

Happy testing! 🎉
