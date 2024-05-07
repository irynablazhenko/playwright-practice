import { expect, type Locator, type Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';

export class SignUpForm {
    readonly page: Page;
    readonly nameField: Locator;
    readonly lastNameField: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly repeatPasswordField: Locator;
    readonly registerButton: Locator;
    readonly errorMessage: Locator;
    readonly formHeader: Locator;
    readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameField = page.locator('#signupName');
        this.lastNameField = page.locator('#signupLastName');
        this.emailField = page.locator('#signupEmail');
        this.passwordField = page.locator('#signupPassword');
        this.repeatPasswordField = page.locator('#signupRepeatPassword');
        this.registerButton = page.locator('button', { hasText: 'Register' });
        this.errorMessage = page.locator('//form/div/div/p');
        this.formHeader = page.getByRole('heading', { name: 'Registration' });
        this.errorMessages = page.locator('//form/div/div');
    };

    async open() {
        const homePage = new HomePage(this.page);
        await homePage.open();
        await homePage.clickSignUpButton();
        await expect(this.formHeader).toBeVisible();
    };

    async register(name: string, lastName: string, email: string, password: string) {
        await this.nameField.fill(name);
        await this.lastNameField.fill(lastName);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.repeatPasswordField.fill(password);
        await expect(this.registerButton).toBeEnabled();
        await this.registerButton.click();
        await expect(this.page.getByRole('heading', { name: 'Garage' })).toBeVisible();
    };

    async fieldValidation(locator: Locator, value: string, errorMessage: string) {
        if (value) {
            await locator.fill(value)
        }
        else {
            await locator.focus();
        }
        await locator.blur();
        await expect(this.errorMessage).toHaveText(errorMessage);
    };
}