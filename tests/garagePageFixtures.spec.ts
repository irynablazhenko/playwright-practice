import { expect } from '@playwright/test';
import { test } from '../fixtures/garageFixtures';

test.describe('Garage tests', () => {

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

    test.describe('Add fuel expense tests', () => {

        test('Negative adding FuelExpense when the miles doesn"t change', async ({ garagePageAddFuelExpense }) => {
            await garagePageAddFuelExpense.AddCar('Ford', 'Focus', '1');
            await garagePageAddFuelExpense.clickAddFuelExpenses();
            await garagePageAddFuelExpense.fillAddFuelExpenseForm('1', '3', '500');
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
            await garagePageDeleteCar.acceptCarRemovingButton.click();
            await expect(garagePageDeleteCar.popupMessage).toHaveText('Car removed');
            await expect(garagePageDeleteCar.editCarIcon).toHaveCount(carsNumberBefore - 1);
        });

        test('Negative. Click Cancel removing', async ({ garagePageDeleteCar }) => {
            await garagePageDeleteCar.removeCarButton.click();
            await garagePageDeleteCar.cancelRemovingButton.click();
        });
    });
});