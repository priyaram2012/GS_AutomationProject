/**
 * Test Configuration
 * Centralized configuration for test execution
 */

module.exports = {
    // Base URL for the application
    BASE_URL: 'https://animated-gingersnap-8cf7f2.netlify.app/',
    
    // API Base URL (same as BASE_URL for this application)
    API_BASE_URL: 'https://animated-gingersnap-8cf7f2.netlify.app/',
    
    // Timeout configurations
    TIMEOUT: {
        DEFAULT: 30000,
        NAVIGATION: 20000,
        ELEMENT_WAIT: 15000,
        BOARD_LOAD: 10000,
    },
    
    // Login credentials
    CREDENTIALS: {
        username: 'admin',
        password: 'password123',
    },
    
    // Test data grouping
    TEST_GROUPS: {
        smoke: 'smoke',
        regression: 'regression',
        api: 'api',
    },
};
