import { test, expect } from '@playwright/test';
import { GaragePage } from '../page-objects/pages/garagePage';
import exp from 'constants';

test.describe('Garage tests as Guest user', () => {
    let garagePage: GaragePage;

    test.describe('Add car as Guest user', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.getByText('Guest log in').click();
            garagePage = new GaragePage(page);
        });

        test('The car can be added to the garage', async ({ page }) => {
            await garagePage.AddCar('BMW', '5', '444');
            await expect(garagePage.carName).toBeVisible();
            const data = await page.evaluate(() => window.sessionStorage.getItem('guestData')) ?? '';
            const parseObject = JSON.parse(data);
            const firstCar = parseObject.cars[0];
            expect(firstCar.brand).toBe('BMW');
            expect(firstCar.model).toBe('5');
            expect(firstCar.initialMileage).toBe(444);
            expect(parseObject.cars).toHaveLength(1);
        });
    });

    test.describe('Change car as Guest user', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            garagePage = new GaragePage(page);
            const testData = {
                "expenses": [],
                "cars": [
                    {
                        "id": 1,
                        "brand": "Audi",
                        "model": "R8",
                        "logo": "audi.png",
                        "initialMileage": 1,
                        "updatedMileageAt": "2024-05-22T19:11:55.997Z",
                        "carCreatedAt": "2024-05-22T19:11:55.997Z",
                        "carBrandId": 1,
                        "carModelId": 1,
                        "mileage": 1
                    }
                ],
                "nextCarId": 3,
                "nextExpenseId": 1
            }
            await page.evaluate((object) => {
                window.sessionStorage.setItem('guestData', JSON.stringify(object))
            }, testData);
            await page.getByText('Guest log in').click();
            await expect(garagePage.carName).toHaveText('Audi R8');
        });

        test('The car can be updated', async ({ page }) => {
            garagePage = new GaragePage(page);
            await garagePage.editCar('Fiat','Ducato','55');
            await expect(garagePage.carName).toHaveText('Fiat Ducato');
        });

        test('The car can be delete', async ({ page }) => {
            garagePage = new GaragePage(page);
            await garagePage.removeLastCar();
            await expect(garagePage.popupMessage).toHaveText('Car removed');
            await expect(garagePage.editCarIcon).toHaveCount(0);
        });
    });
});



