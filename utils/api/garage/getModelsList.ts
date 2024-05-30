import { request } from "@playwright/test";

export default async function getModelsList(carBrandId:number) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.get(`/api/cars/models?carBrandId=${carBrandId}`);
    const responseJson = await response.json();
    return responseJson.data;
}