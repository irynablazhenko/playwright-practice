import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly signUpButton: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    };

    async open(){
        await this.page.goto('/');
        await expect(this.page.getByRole('heading', { name: 'Do more' })).toBeVisible();
    };

    async clickSignUpButton() {
        await this.signUpButton.click();
        await expect(this.page.getByRole('heading', { name: 'Registration' })).toBeVisible();
    };

    async clickSignInButton() {
        await this.signInButton.click();
        await expect(this.page.getByRole('heading', { name: 'Log in' })).toBeVisible();
    };
}