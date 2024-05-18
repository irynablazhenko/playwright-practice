import { test as base } from '@playwright/test'
import { expect } from '@playwright/test';
import { GaragePage } from '../page-objects/pages/garagePage';
import { EditCarForm } from '../page-objects/forms/editCarForm';
import { AddFuelExpenseForm } from '../page-objects/forms/addFuelsExpenseForm';


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
        let editCarForm = new EditCarForm(page);

        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        const carName = await garagePage.firstCarName.innerText();

        await garagePage.clickEditCarIcon();
        await page.waitForTimeout(1000);
        await use(garagePage);

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
        let addFuelExpenseForm = new AddFuelExpenseForm(page);
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '100');
        await addFuelExpenseForm.open();
        await use(addFuelExpenseForm);
        await garagePage.removeLastFuelExpenses();
    },
});