# Playwright Kanban Automation Framework

This project is a robust, data-driven automation framework built with Playwright and TypeScript for testing a Kanban application.

## 🚀 Features

- **Data-Driven Testing**: Test scenarios are loaded dynamically from `test-data/tasks.json`.
- **Page Object Model (POM)**: specific classes for Login, Dashboard, and Board interactions.
- **Cross-Browser & Mobile**: Configured to run on Desktop (Chrome, Firefox, Safari) and Mobile (Pixel 7, iPhone 14).
- **TypeScript**: Fully typed for better maintainability and code safety.

## 📂 Project Structure

```text
PlayWright_Automation/
├── pages/                  # Page Object Models
│   ├── LoginPage.ts        # Login interactions
│   ├── DashboardPage.ts    # Dashboard navigation
│   └── BoardPage.ts        # Kanban board verification logic
├── tests/                  # Test Specifications
│   └── kanban.spec.ts      # Main test runner
├── test-data/              # Data Files
│   └── tasks.json          # Test case data
├── utils/                  # Shared utilities
├── playwright.config.ts    # Playwright configuration
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

## 🏃 Execution

### Run all tests (Headless)
```bash
npm test
```

### Run tests with visible browser (Headed)
```bash
npm run test:headed
```

### Run mobile tests only
```bash
npm run test:mobile
```

### View HTML Report
```bash
npm run test:report
```

## 📊 Test Data

To add new validations, simply edit `test-data/tasks.json`. No code changes are required!

Example Entry:
```json
{
  "testCase": "New Test",
  "application": "Web Application",
  "task": "New Feature Task",
  "column": "To Do",
  "tags": ["Feature"]
}
```

## 📝 Demo Recording Logic
The framework is set to capture traces on the first retry of a failure, and screenshots only on failure. This keeps execution fast while providing debugging info when needed.
