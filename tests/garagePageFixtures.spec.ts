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
            await garagePageEditCar.fillAddCarForm('BMF','3','200');
        });

        test('Set the mileage less that it was', async ({ garagePageEditCar}) => {
            await garagePageEditCar.fillAddCarForm('BMF','5','50');
        });

        test('Cancel edit form without changes', async ({ garagePageEditCar}) => {
            //await garagePageEditCar.fillAddCarForm('BMF','X5','500');
        });

    });
});