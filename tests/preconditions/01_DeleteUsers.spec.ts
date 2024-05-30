import { test, expect } from '@playwright/test';
import deleteUser from '../../utils/api/users/deleteUser';
import getAuthCookies from '../../utils/api/auth/getAuthCookies';

test.describe('API Preconditions: Delete All users', () => {

    test('Delete User01', async ({ }) => {
        const cookiesWithAuth = await getAuthCookies(process.env.USER_EMAIL ??'', process.env.USER_PASSWORD??'');
        const response = await deleteUser(cookiesWithAuth);
        expect(response.status).toBe('ok');
    })
});