import { test, expect } from '@playwright/test';
import createUser from '../../utils/api/users/createUser';
test.describe('API Preconditions: Create users', () => {

    test('Create User01', async ({ }) => {
        const response = await createUser('Test', 'Test', process.env.USER_EMAIL ??'', process.env.USER_PASSWORD??'', process.env.USER_PASSWORD??'');
        expect(response.status).toBe('ok');
    })
});