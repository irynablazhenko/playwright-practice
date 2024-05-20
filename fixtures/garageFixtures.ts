import { test as base } from '@playwright/test'
import { expect } from '@playwright/test';
import { GaragePage } from '../page-objects/pages/garagePage';

export const test = base.extend({
    //fixture for add car to the garage.
    garagePageAddCar: async ({ page }, use) => {
        let garagePage = new GaragePage(page);
        //Pre-conditions: be on Garage page and Click on Add Car Button
        await page.goto('/');
        await garagePage.open();
        //cars count in the garage
        const carCount = await garagePage.cars.count();
        await garagePage.clickAddCarButton();
        await use(garagePage);
        //Post-conditions: check the validation error if exists, cancel add car process. 
        //If there is no validation error, finish the add car process clicking on Add button
        //await for mileage validation error if it shows
        await garagePage.mileageField.blur();
        const add = await garagePage.addButton.isDisabled();
        //in case when car data filed with error (f.e. mileage is empty or minus), the add car button will be disable.
        //when Add Car button is disabled the validation error the should be visible.
        if (add) {
            await expect(garagePage.validationError).toBeVisible();
        }
        //when Add Car button is enabled, can finish add car process.
        else {
            await garagePage.clickAddButton();
            //if car is added the cars count should be +1 from the initial count.
            await expect(garagePage.cars).toHaveCount(carCount + 1);
            //remove added car, clear test data.
            await garagePage.removeLastCar();
        };
    },
    garagePageEditCar: async ({ page }, use) => {
        //fixture for editing car. 
        let garagePage = new GaragePage(page);
        //Pre-conditions: be on Garage page, add new car Button to the garage.
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        //Save the car name for comparison after edition. 
        const carName = await garagePage.firstCarName.innerText();
        await page.waitForTimeout(1000);
        await use(garagePage);
        //Post-conditions: check the validation error if exists, cancel edit car process. 
        //If there is no validation error, finish the edit car process clicking on save button
        const save = await garagePage.saveButton.isDisabled();
        //if save button is disable we should see validation error if new data is wrong (f.e.the mileage less that it was)
        if (save) {
            //checking the validation error
            if (await garagePage.validationError.isVisible()) {
                await expect(garagePage.validationError).toBeVisible();
            }
            //when the data wasn't change there is no validation error, cancel the edit process clicking on Cancel button.
            else {
                await garagePage.clickCancelButton();
                //remove added car, clear test data.
                await garagePage.removeLastCar();
            }
        }
        //if save button is enable, wq can save the changes and the popup Car Updated is shown
        else {
            await garagePage.clickSaveButton();
            await page.waitForTimeout(1000);
            await expect(garagePage.popupMessage).toHaveText('Car updated');
            //check brand and model changes
            expect(garagePage.firstCarName.innerText()).not.toEqual(carName);
            //remove added car, clear test data.
            await garagePage.removeLastCar();
        };
    },
    garagePageAddFuelExpense: async ({ page }, use) => {
        let garagePage = new GaragePage(page);
        //Pre-conditions: be on Garage page, add new car Button to the garage.
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '10');
        await use(garagePage);
        //Post-conditions: Click on Add button to add the fuel expense, check if there any validation error. 
        //If there is a validation error cancel the adding expense, if not, the popup 'Fuel expense added' should be shown
        await garagePage.clickAddButton();
        await garagePage.page.waitForTimeout(1000);
        //check the error message when there is a validation error (f.e. when the miles doesn"t change) 
        if (await garagePage.fuelErrorMessage.isVisible()) {
            await expect(garagePage.fuelErrorMessage).toContainText('First expense mileage must not be less or equal to car initial mileage. Car initial mileage is');
            await garagePage.clickFuelCancelButton();
            await expect(garagePage.page.locator('h1')).toHaveText('Garage');
        }
        //there is no validation error, check the popup 'Fuel expense added' is shown
        else {
            await expect(garagePage.popupMessage).toHaveText('Fuel expense added');
            await expect(garagePage.page.locator('h1')).toHaveText('Fuel expenses');
        };
        //remove added car, clear test data.
        await garagePage.clickGarageMenu();
        await garagePage.removeLastCar();
    },
    garagePageUpdateMileages: async ({ page }, use) => {
        let garagePage = new GaragePage(page); garagePage
        //Pre-conditions: be on Garage page, add new car Button to the garage, click on miles  field.
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        await garagePage.miles.click();
        await use(garagePage);
        //Post-conditions: If new miles entered is valid and more than it was, click the update button and popup 'Mileage updated' should be shown
        if (await garagePage.updateMileagesButton.isEnabled()) {
            await garagePage.clickUpdateMileagesButton();
            await garagePage.page.waitForTimeout(2000);
            await expect(garagePage.popupMessage).toHaveText('Mileage updated');
        };
        //remove added car, clear test data.
        await garagePage.removeLastCar();
    },
    garagePageDeleteCar: async ({ page }, use) => {
        let garagePage = new GaragePage(page);
        //Pre-conditions: be on Garage page and add new car Button to the garage. Click on Edit car button
        await page.goto('/');
        await garagePage.open();
        await garagePage.AddCar('Ford', 'Focus', '1');
        await garagePage.clickEditCarIcon();
        await use(garagePage);
        //Post-conditions: Garage page is open
        await expect(garagePage.page.locator('h1')).toHaveText('Garage');
        //remove added car, clear test data.
        const carCount = await garagePage.cars.count();
        if (carCount) {
            await garagePage.removeLastCar();
        }
    },
});