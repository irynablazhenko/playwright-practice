import { test, expect } from '@playwright/test';
import getAuthCookies from '../../utils/api/auth/getAuthCookies';
import createCar from '../../utils/api/garage/createCar';
import getBrandsList from '../../utils/api/garage/getBrandsList';
import getModelsList from '../../utils/api/garage/getModelsList';
import getUserCars from '../../utils/api/garage/getUserCars';
import deleteCar from '../../utils/api/garage/deleteCar';
import updateCar from '../../utils/api/garage/updateCar';

test.describe('Add cars API tests', () => {
    let cookiesWithAuth;

    test.beforeAll(async () => {
        cookiesWithAuth = await getAuthCookies(process.env.USER_EMAIL ?? '', process.env.USER_PASSWORD ?? '');
    });

    test('Create cars of all models and all brands', async () => {
        const getBrandsRequestJson = await getBrandsList();
        for (const brand of getBrandsRequestJson) {
            const getModelsRequestJson = await getModelsList(brand.id);
            for (const model of getModelsRequestJson) {
                const mileage = Math.floor(Math.random() * 200);
                const createCarRequestJson = await createCar(cookiesWithAuth, brand.id, model.id, mileage);
                expect(createCarRequestJson.status).toBe('ok');
                expect(createCarRequestJson.data.carBrandId).toEqual(brand.id);
                expect(createCarRequestJson.data.carModelId).toEqual(model.id);
                expect(createCarRequestJson.data.initialMileage).toEqual(mileage);
                expect(createCarRequestJson.data.mileage).toEqual(mileage);
                expect(typeof createCarRequestJson.data.mileage).toEqual('number');
            };
        };
    });

    test('Create car with empty brand', async () => {
        const getModelsRequestJson = await getModelsList(3);
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequestJson = await createCar(cookiesWithAuth, NaN, getModelsRequestJson[0].id, mileage);
        console.log(createCarRequestJson);
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Invalid car brand type');
    });

    test('Create car with invalid brandId', async () => {
        const getModelsRequestJson = await getModelsList(3);
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequestJson = await createCar(cookiesWithAuth, 15, getModelsRequestJson[0].id, mileage);
        console.log(createCarRequestJson);
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Brand not found');
    });

    test('Create car with empty model', async () => {
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequestJson = await createCar(cookiesWithAuth, 3, NaN, mileage);
        console.log(createCarRequestJson);
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Invalid car model type');
    });

    test('Create car with invalid modelId', async () => {
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequestJson = await createCar(cookiesWithAuth, 3, 125, mileage);
        console.log(createCarRequestJson);
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Model not found');
    });

    test('Create car with minus mileage', async () => {
        const getModelsRequestJson = await getModelsList(3);
        const createCarRequestJson = await createCar(cookiesWithAuth, 4, getModelsRequestJson[0].id, -10);
        console.log(createCarRequestJson);
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Mileage has to be from 0 to 999999');
    });

    test('Edit car test', async () => {
        const cars = await getUserCars(cookiesWithAuth);
        console.log('Initial car');
        console.log(cars[0]);
        const getBrandsRequestJson = await getBrandsList();
        const carBrandId = getBrandsRequestJson[3].id;
        const getModelsRequestJson = await getModelsList(carBrandId);
        const mileage = cars[0].initialMileage+10;
        const updateCarRequestJson = await updateCar(cookiesWithAuth, cars[0].id, carBrandId, getModelsRequestJson[2].id, mileage);
        console.log('Updated car');
        console.log(updateCarRequestJson);
        expect(updateCarRequestJson.status).toBe('ok');
        expect(updateCarRequestJson.data.carBrandId).toEqual(carBrandId);
        expect(updateCarRequestJson.data.carModelId).toEqual(getModelsRequestJson[2].id);
        expect(updateCarRequestJson.data.initialMileage).toEqual(cars[0].initialMileage);
        expect(updateCarRequestJson.data.mileage).toEqual(mileage);
        expect(typeof updateCarRequestJson.data.mileage).toEqual('number');
    });

    test.afterAll(async ({ request }) => {
//delete all cars from garage
        const cars = await getUserCars(cookiesWithAuth);
        for (const car of cars) {
            const responseDeleteCar = await deleteCar(cookiesWithAuth, car.id);
            console.log(await responseDeleteCar);
            expect(responseDeleteCar.status).toBe('ok');
            expect(responseDeleteCar.data.carId).toEqual(car.id);
            expect(typeof responseDeleteCar.data.carId).toEqual('number');
        }
    });
});