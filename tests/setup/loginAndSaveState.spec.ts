import { test, expect } from '@playwright/test';
import { GaragePage } from '../../page-objects/pages/garagePage';


test.describe('Garage tests with POM', () => {
    let garagePage: GaragePage;

    test('Login as user and save state', async ({ page }) => {
        garagePage = new GaragePage(page);
        await page.goto('/');
        await garagePage.openAsLoggedUser();
        await page.context().storageState({
            path: './test-data/states/userState.json'
        })
    })
})