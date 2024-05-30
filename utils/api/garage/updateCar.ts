import { request } from "@playwright/test";

export default async function updateCar(header, carId: number, carBrandId:number, carModelId:number, mileage:number) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.put(`/api/cars/${carId}`, {
        headers: header,
        data: {
            "carBrandId": carBrandId,
            "carModelId": carModelId,
            "mileage": mileage
        }
    });
    return await response.json();
}