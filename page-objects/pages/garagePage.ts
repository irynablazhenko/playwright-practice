import { expect, type Locator, type Page } from '@playwright/test';
import { SignInForm } from '../forms/signInForm';
import { randomEmail, password } from '../../test-data/credentials';
import exp from 'constants';

export class GaragePage {
    readonly page: Page;
    readonly settingsMenu: Locator;
    readonly settingsTitle: Locator;
    readonly removeAccButton: Locator;
    readonly removeAccTitle: Locator;
    readonly removeButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.settingsMenu = page.locator('a[routerlink="settings"]');
        this.settingsTitle = page.locator('h1');
        this.removeAccButton = page.locator('button', { hasText: 'Remove my account' });
        this.removeAccTitle = page.locator('h4');
        this.removeButton = page.locator('[class="btn btn-danger"]');
    };

    async open() {
        const signInForm = new SignInForm(this.page);
        await signInForm.open();
        await signInForm.loginWithCredentials(randomEmail, password);
        await expect(this.page.locator('h1')).toHaveText('Garage');
    };

    async clickSettingsMenu() {
        await this.settingsMenu.click();
        await expect(this.settingsTitle).toHaveText('Settings');
    };

    async clickRemoveAccButton() {
        await this.removeAccButton.click();
        await expect(this.removeAccTitle).toHaveText('Remove account');
    };

    async clickRemoveButton() {
        await this.removeButton.click();
    };

    async deleteAccount(){
        await this.clickSettingsMenu();
        await this.clickRemoveAccButton();
        await this.clickRemoveButton();
        await expect(this.page.locator('h1')).toContainText('Do more!');
    };
}