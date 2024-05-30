import { test, expect } from '@playwright/test';

test.describe('Add cars API tests', () => {
    let sid: string;

    test.beforeAll(async ({ request }) => {
        //sign in and set authorization cookies
        const authRequest = await request.post('/api/auth/signin', {
            data: {
                "email": process.env.USER_EMAIL,
                "password": process.env.USER_PASSWORD,
                "remember": true
            }
        });
        const cookies = authRequest.headers()['set-cookie'];
        if (cookies) {
            const cookieArray = cookies.split('\n');
            for (const cookie of cookieArray) {
                if (cookie.trim().startsWith('sid=')) {
                    sid = (cookie.trim().split('=')[1]).split(';')[0];
                    break;
                };
            };
        };
    });

    test('Create all models of all brands', async ({ request }) => {
        const getBrandsRequest = await request.get('/api/cars/brands');
        const getBrandsRequestJson = await getBrandsRequest.json();
        const brands = getBrandsRequestJson.data;
        for (const brand of brands) {
            const getModelsRequest = await request.get(`/api/cars/models?carBrandId=${brand.id}`);
            const getModelsRequestJson = await getModelsRequest.json();
            const models = getModelsRequestJson.data;
            for (const model of models) {
                const mileage = Math.floor(Math.random() * 200);
                const createCarRequest = await request.post('/api/cars', {
                    headers: {
                        'Cookie': `sid=${sid}`
                    }, data: {
                        "carBrandId": brand.id,
                        "carModelId": model.id,
                        "mileage": mileage
                    }
                });
                const createCarRequestJson = await createCarRequest.json();

                console.log(await createCarRequest.json());
                expect(createCarRequestJson.status).toBe('ok');
                expect(createCarRequestJson.data.carBrandId).toEqual(brand.id);
                expect(createCarRequestJson.data.carModelId).toEqual(model.id);
                expect(createCarRequestJson.data.initialMileage).toEqual(mileage);
                expect(createCarRequestJson.data.mileage).toEqual(mileage);
                expect(typeof createCarRequestJson.data.mileage).toEqual('number');
            };
        };
    });

    test('Create car with empty brand', async ({ request }) => {
        const getModelsRequest = await request.get(`/api/cars/models?carBrandId=2`);
        const getModelsRequestJson = await getModelsRequest.json();
        const models = getModelsRequestJson.data;
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequest = await request.post('/api/cars', {
            headers: {
                'Cookie': `sid=${sid}`
            }, data: {
                "carBrandId": "",
                "carModelId": models[0].id,
                "mileage": mileage
            }
        });
        const createCarRequestJson = await createCarRequest.json();

        console.log(await createCarRequest.json());
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Invalid car brand type');
    });

    test('Create car with invalid brandId', async ({ request }) => {
        const getModelsRequest = await request.get(`/api/cars/models?carBrandId=2`);
        const getModelsRequestJson = await getModelsRequest.json();
        const models = getModelsRequestJson.data;
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequest = await request.post('/api/cars', {
            headers: {
                'Cookie': `sid=${sid}`
            }, data: {
                "carBrandId": 15,
                "carModelId": models[0].id,
                "mileage": mileage
            }
        });
        const createCarRequestJson = await createCarRequest.json();

        console.log(await createCarRequest.json());
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Brand not found');
    });

    test('Create car with empty model', async ({ request }) => {
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequest = await request.post('/api/cars', {
            headers: {
                'Cookie': `sid=${sid}`
            }, data: {
                "carBrandId": 3,
                "carModelId": "",
                "mileage": mileage
            }
        });
        const createCarRequestJson = await createCarRequest.json();

        console.log(await createCarRequest.json());
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Invalid car model type');
    });

    test('Create car with invalid modelId', async ({ request }) => {
        const mileage = Math.floor(Math.random() * 200);
        const createCarRequest = await request.post('/api/cars', {
            headers: {
                'Cookie': `sid=${sid}`
            }, data: {
                "carBrandId": 3,
                "carModelId": 125,
                "mileage": mileage
            }
        });
        const createCarRequestJson = await createCarRequest.json();

        console.log(await createCarRequest.json());
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Model not found');
    });

    test('Create car with minus mileage', async ({ request }) => {
        const getModelsRequest = await request.get(`/api/cars/models?carBrandId=4`);
        const getModelsRequestJson = await getModelsRequest.json();
        const models = getModelsRequestJson.data;
        const createCarRequest = await request.post('/api/cars', {
            headers: {
                'Cookie': `sid=${sid}`
            }, data: {
                "carBrandId": 4,
                "carModelId": models[0].id,
                "mileage": -5
            }
        });
        const createCarRequestJson = await createCarRequest.json();

        console.log(await createCarRequest.json());
        expect(createCarRequestJson.status).toBe('error');
        expect(createCarRequestJson.message).toBe('Mileage has to be from 0 to 999999');
    });

    test.afterEach(async ({ request }) => {
        const authRequest = await request.post('/api/auth/signin', {
            data: {
                "email": process.env.USER_EMAIL,
                "password": process.env.USER_PASSWORD,
                "remember": true
            }
        });
        const cookies = authRequest.headers()['set-cookie'];
        if (cookies) {
            const cookieArray = cookies.split('\n');
            for (const cookie of cookieArray) {
                if (cookie.trim().startsWith('sid=')) {
                    sid = (cookie.trim().split('=')[1]).split(';')[0];
                    break;
                };
            };
        };

        //delete all cars from garage
        const getCarsRequest = await request.get('/api/cars');
        const getCarsRequestJson = await getCarsRequest.json();
        const cars = getCarsRequestJson.data;
        for (const car of cars) {
            const deleteCarRequest = await request.delete(`/api/cars/${car.id}`, {
                headers: {
                    'Cookie': `sid=${sid}`
                }
            });
            const deleteCarRequestJson = await deleteCarRequest.json();

            console.log(await deleteCarRequest.json());
            expect(deleteCarRequestJson.status).toBe('ok');
            expect(deleteCarRequestJson.data.carId).toEqual(car.id);
            expect(typeof deleteCarRequestJson.data.carId).toEqual('number');
        };
    });
});