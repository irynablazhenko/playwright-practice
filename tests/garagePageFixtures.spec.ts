import { expect } from '@playwright/test';
import { test } from '../fixtures/garageFixtures';
test.describe('Garage tests', () => {

    test.describe('Add car to the garage validation', () => {

        test('Positive. Add car to the garage', async ({ garagePageAddCar}) => {
            await garagePageAddCar.fillAddCarForm('Audi','A8','222');
        });

        test('Negative. Add car to the garage with invalid mileage', async ({ garagePageAddCar}) => {
            await garagePageAddCar.fillAddCarForm('Audi','A8','-1');
        });

        test('Negative. Add car to the garage with empty mileage', async ({ garagePageAddCar}) => {
            await garagePageAddCar.fillAddCarForm('Audi','A8','');
        });
    });

    test.describe('Edit car tests', () => {

        test('The car can be updated successfully', async ({ garagePageEditCar}) => {
           await garagePageEditCar.fillEditCarForm(3,2,'200');
        //   await garagePageEditCar.brandDropdown.selectOption({ index: 3 });
        //   await garagePageEditCar.selectModel('3');
        //   await garagePageEditCar.enterMileage('200');
        });

        test('Set the mileage less that it was', async ({ garagePageEditCar}) => {
            await garagePageEditCar.fillEditCarForm(1,2,'50');
        });

        test('Cancel edit form without changes', async ({ garagePageEditCar}) => {
            //await garagePageEditCar.fillAddCarForm('BMF','X5','500');
        });

    });

    test.describe('Add fuel expense', () => {

        test('FuelExpense', async ({ garagePageAddFuelExpense}) => {
            await garagePageAddFuelExpense.addFuelExpense('110','3','500');
        //   await garagePageEditCar.selectBrand('BMF');
        //   await garagePageEditCar.selectModel('3');
        //   await garagePageEditCar.enterMileage('200');
        });

  
    });
});