import { request } from "@playwright/test";
let sid: string;

export default async function createAuthCookies(email: string, password: string) {
    const contextRequest = await request.newContext();
    const response = await contextRequest.post('/api/auth/signin', {
        data: {
            "email": email,
            "password": password,
            "remember": true
        }
    });
    const cookies = response.headers()['set-cookie'];

    if (cookies) {
        const cookieArray = cookies.split('\n');
        for (const cookie of cookieArray) {
            if (cookie.trim().startsWith('sid=')) {
                sid = (cookie.trim().split('=')[1]).split(';')[0];
                break;
            }
        }
    }
    return sid;
}