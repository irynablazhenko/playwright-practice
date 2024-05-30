import { request } from "@playwright/test";
let sid: string;


export default async function createUser(userName, lastName, email, password, repeatPassword) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.post('/api/auth/signup', {
        data: {

            "name": userName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "repeatPassword": repeatPassword

        }
    })


    return await response.json();

}