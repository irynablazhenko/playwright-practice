import { request } from "@playwright/test";

export default async function deleteCar(header, carId:number) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.delete(`/api/cars/${carId}`, {
        headers: header
    });
    return await response.json();
}