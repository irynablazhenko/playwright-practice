import { test as base } from '@playwright/test'
import { expect } from '@playwright/test';
import { GaragePage } from '../page-objects/pages/garagePage';

export const test = base.extend({
    garagePageAddCar: async ({ page }, use) => {
        let garagePage = new GaragePage(page);

        await page.goto('/');
        await garagePage.open();
        const carCount = await garagePage.cars.count();
        console.log(carCount);
        await garagePage.clickAddCarButton();
        await use(garagePage);
        await garagePage.mileageField.blur();
        const add = await garagePage.addButton.isDisabled();
        if (add) {
            await expect(garagePage.validationError).toBeVisible();
        }
        else {
            await garagePage.clickAddButton();
            await expect(garagePage.cars).toHaveCount(carCount + 1);
            await garagePage.removeLastCar();
        };
    },
    garagePageEditCar: async ({ page }, use) => {
        let garagePage = new GaragePage(page);

        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        const carName = await garagePage.firstCarName.innerText();
        await page.waitForTimeout(1000);
        await use(garagePage);

        const save = await garagePage.saveButton.isDisabled();
        if (save) {
            if (await garagePage.validationError.isVisible()) {
                await expect(garagePage.validationError).toBeVisible();
            }
            else {
                await garagePage.clickCancelButton();
                await garagePage.removeLastCar();
            }
        }
        else {
            await garagePage.clickSaveButton();
            await page.waitForTimeout(1000);
            if (await garagePage.alert.isVisible()) {
                await expect(garagePage.alert).toBeVisible();
            }
            expect(garagePage.firstCarName.innerText()).not.toEqual(carName);
            await garagePage.removeLastCar();
        };
    },
    garagePageAddFuelExpense: async ({ page }, use) => {
        let garagePage = new GaragePage(page);
        await page.goto('/');
        await garagePage.open();
        await use(garagePage);
        await expect(garagePage.fuelErrorMessage).toHaveText('First expense mileage must not be less or equal to car initial mileage. Car initial mileage is 1');
        await garagePage.clickFuelCancelButton();
        await expect(garagePage.page.locator('h1')).toHaveText('Garage');
        await garagePage.removeLastCar();
        // await garagePage.removeLastFuelExpenses();
    },
    garagePageUpdateMileages: async ({ page }, use) => {
        let garagePage = new GaragePage(page);garagePage
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        await garagePage.miles.click();
        await use(garagePage);
        if (await garagePage.updateMileagesButton.isDisabled()) {

        } else {
            await garagePage.clickUpdateMileagesButton();
            await expect(garagePage.popupMessage).toHaveText('Mileage updated');
        }
        await garagePage.removeLastCar();
    },
    garagePageDeleteCar: async ({ page }, use) => {
        let garagePage = new GaragePage(page);
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        await garagePage.clickEditCarIcon();
        await use(garagePage);
        await expect(garagePage.page.locator('h1')).toHaveText('Garage');
    },
});