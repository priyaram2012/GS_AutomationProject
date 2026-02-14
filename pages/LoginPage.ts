import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Updated selectors based on HTML dump
        // The input has id="username" and type="text" (not email)
        this.emailInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        // Button is 'Sign in'
        this.loginButton = page.getByRole('button', { name: 'Sign in' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async login(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }
}
