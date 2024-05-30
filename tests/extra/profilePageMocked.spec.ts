import { test, expect } from '@playwright/test';
import { GaragePage } from '../../page-objects/pages/garagePage';

test.describe('Garage tests with mocking API', () => {
    let garagePage: GaragePage;

    test.beforeEach(async ({ page }) => {
        garagePage = new GaragePage(page);
        await page.goto('/');
    })

    test('Mock profile name', async ({ page }) => {
        const resp = {
            "status": "ok",
            "data": {
                "userId": 126015,
                "photoFilename": "default-user.png",
                "name": "Joe",
                "lastName": "Biden"
            }
        }
        await page.route('**/api/users/profile', route => route.fulfill({
            status: 200,
            body: JSON.stringify(resp),
        }));
        await garagePage.openAsLoggedUser();
        await page.goto('/panel/profile');
        await expect(page.locator('[class="profile_name display-4"]')).toHaveText('Joe Biden');
    });
});