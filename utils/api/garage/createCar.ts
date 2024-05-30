import { request } from "@playwright/test";

export default async function createCar(header, carBrandId:number, carModelId:number, mileage:number) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.post('/api/cars', {
        headers: header,
        data: {
            "carBrandId": carBrandId,
            "carModelId": carModelId,
            "mileage": mileage
        }
    });
    return await response.json();
}