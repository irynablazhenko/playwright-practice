import { request } from "@playwright/test";

export default async function getBrandsList() {
    const contextRequest = await request.newContext();
    const response = await contextRequest.get('/api/cars/brands');
    const responseJson = await response.json();
    return responseJson.data;
}