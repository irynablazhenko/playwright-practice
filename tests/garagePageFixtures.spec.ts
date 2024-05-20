import { expect } from '@playwright/test';
import { test } from '../fixtures/garageFixtures';

test.describe('Garage tests', () => {
    test.describe('Add fuel expense tests', () => {

        test('The fuel expenses can be added', async ({ garagePageAddFuelExpense }) => {
            let miles = await garagePageAddFuelExpense.miles.inputValue();
            let newNum = Number(miles);
            newNum += 5;
            await garagePageAddFuelExpense.clickAddFuelExpenses();
            await garagePageAddFuelExpense.page.waitForTimeout(2000);
            await garagePageAddFuelExpense.fillAddFuelExpenseForm(0, newNum.toString(), '3', '500');
        });

        test('Negative adding FuelExpense when the miles doesn"t change', async ({ garagePageAddFuelExpense }) => {
            await garagePageAddFuelExpense.clickAddFuelExpenses();
            await garagePageAddFuelExpense.page.waitForTimeout(2000);
            await garagePageAddFuelExpense.fillAddFuelExpenseForm(0,'1', '3', '250');
        });
    });

    test.describe('Add car to the garage validation', () => {

        test('Positive. Add car to the garage', async ({ garagePageAddCar }) => {
            await garagePageAddCar.fillAddCarForm('Audi', 'A8', '222');
        });

        test('Negative. Add car to the garage with invalid mileage', async ({ garagePageAddCar }) => {
            await garagePageAddCar.fillAddCarForm('Audi', 'A8', '-1');
        });

        test('Negative. Add car to the garage with empty mileage', async ({ garagePageAddCar }) => {
            await garagePageAddCar.fillAddCarForm('Audi', 'A8', '');
        });
    });

    test.describe('Edit car tests', () => {

        test('The car can be updated successfully', async ({ garagePageEditCar }) => {
            await garagePageEditCar.clickEditCarIcon();
            await garagePageEditCar.fillEditCarForm(3, 2, '200');
        });

        test('Set the mileage less that it was', async ({ garagePageEditCar }) => {
            await garagePageEditCar.clickEditCarIcon();
            await garagePageEditCar.fillEditCarForm(1, 2, '50');
        });

        test('Cancel edit form without changes', async ({ garagePageEditCar }) => {
            await garagePageEditCar.clickEditCarIcon();
        });
    });



    test.describe('Update mileages tests', () => {

        test('The mileages can be updated', async ({ garagePageUpdateMileages }) => {
            await garagePageUpdateMileages.inputNewMileage('5');
        });

        test('Negative. Could set mileage less or equal than it was', async ({ garagePageUpdateMileages }) => {
            await garagePageUpdateMileages.inputNewMileage('1');
        });
    });

    test.describe('Delete car tests', () => {

        test('The car can be deleted', async ({ garagePageDeleteCar }) => {
           const carsNumberBefore = await garagePageDeleteCar.page.locator('.icon-edit').count();
            await garagePageDeleteCar.removeCarButton.click();
            await garagePageDeleteCar.page.waitForTimeout(3000);
            await garagePageDeleteCar.acceptCarRemovingButton.click();
            await garagePageDeleteCar.page.waitForTimeout(3000);
            await expect(garagePageDeleteCar.editCarIcon).toHaveCount(carsNumberBefore - 1);
            await expect(garagePageDeleteCar.popupMessage).toHaveText('Car removed');
        });

        test('Negative. Click Cancel removing', async ({ garagePageDeleteCar }) => {
            const carsNumberBefore = await garagePageDeleteCar.page.locator('.icon-edit').count();
            await garagePageDeleteCar.removeCarButton.click();
            await garagePageDeleteCar.cancelRemovingButton.click();
            await expect(garagePageDeleteCar.editCarIcon).toHaveCount(carsNumberBefore);
        });
    });
});