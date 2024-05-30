import { request } from "@playwright/test";
let sid: string;


export default async function deleteUser(header) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.delete(`/api/users`, {
        headers: header
    });
    return await response.json();

}