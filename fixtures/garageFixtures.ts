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
        await garagePage.AddCar('Ford', 'Focus', '100');
        const carName = await garagePage.firstCarName.innerText();
        console.log(carName);
        await garagePage.clickEditCarIcon();
        await use(garagePage);
        //await garagePage.clickSaveButton();
        const save = await garagePage.saveButton.isDisabled();
        if (save) {
            if (await garagePage.validationError.isVisible()) {
                await expect(garagePage.validationError).toBeVisible();
            }
            else {
                await garagePage.clickCancelButton();
            }
        }
        else {
            if (await garagePage.alert.isVisible()) {
                await expect(garagePage.alert).toBeVisible();
                await garagePage.clickSaveButton();
                await expect(garagePage.firstCarName).toHaveText(carName);
            }
            else {
                await garagePage.clickSaveButton();
                await expect(garagePage.firstCarName).toHaveText(carName);
            }
        };
        await garagePage.removeLastCar();
    },
});



//pre-conditions

// await use();

//post-conditions