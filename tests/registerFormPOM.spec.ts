import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/homePage';
import { randomEmail, password } from '../test-data/credentials';
import { GaragePage } from '../page-objects/pages/garagePage';
import { SignUpForm } from '../page-objects/forms/signUpForm';

/*Використовуйте старий репозиторій, створіть окремий файл і додайте до назви POM.
Перепишіть існуючі тести на реєстрацію користувача та форму реєстрації (створені в попередній домашці)  з використанням Page Objects*/
test.describe('Positive scenario. User can be registered', () => {
    let garagePage: GaragePage;
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
    });

    //delete registered account
    test.afterEach(async ({ page }) => {
        garagePage = new GaragePage(page);
        await garagePage.deleteAccount();
    });

    test('User Registration', async ({ page }) => {
        await signUpForm.register('Test', 'User', randomEmail, password);
    });

});

test.describe('Field Name validation', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
    });

    test('Name is required', async ({ page }) => {
        // const errorMessage = 'Name required';
        // signUpForm.fieldValidation(signUpForm.nameField,'t', errorMessage);
        await signUpForm.nameField.focus();
        await signUpForm.nameField.blur();
        await expect(signUpForm.errorMessage).toHaveText('Name required');
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.nameField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('Name should be greater than 1', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.nameField,'t', errorMessage);
    });

    test('Name should be less than 20', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.nameField,'qwertyuiopasdfghjklzx', errorMessage);
    });

    test('Name shouldn"t contain space', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        signUpForm.fieldValidation(signUpForm.nameField,'some name', errorMessage);
    });

    test('Name should be only English alphabet', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        signUpForm.fieldValidation(signUpForm.nameField,'назва', errorMessage);
    });
});

// test.describe('Field Last name validation', () => {
//     let signUpForm: SignUpForm;

//     //go to the Register form
//     test.beforeEach(async ({ page }) => {
//         signUpForm = new SignUpForm(page);
//         signUpForm.open();
//         await page.locator('#signupName').fill('Test');
//     });

//     test('Last name is required', async ({ page }) => {
//         await page.locator('#signupLastName').focus();
//         await page.locator('#signupLastName').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Last name required');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Last name should be greater than 1', async ({ page }) => {
//         await page.locator('#signupLastName').fill('t');
//         await page.locator('#signupLastName').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Last name has to be from 2 to 20 characters long');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Last name should be less than 21', async ({ page }) => {
//         await page.locator('#signupLastName').fill('qwertyuiopasdfghjklzx');
//         await page.locator('#signupLastName').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Last name has to be from 2 to 20 characters long');
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Last name shouldn"t contain space', async ({ page }) => {
//         await page.locator('#signupLastName').fill('some name');
//         await page.locator('#signupLastName').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Last name is invalid');
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Last name should be only English alphabet', async ({ page }) => {
//         await page.locator('#signupLastName').fill('назва');
//         await page.locator('#signupLastName').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Last name is invalid');
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });
// });

// test.describe('Field Email validation', () => {
//     let signUpForm: SignUpForm;

//     //go to the Register form
//     test.beforeEach(async ({ page }) => {
//         signUpForm = new SignUpForm(page);
//         signUpForm.open();
//         await page.locator('#signupName').fill('Name');
//         await page.locator('#signupLastName').fill('LastName');
//     });

//     const invalidEmail = 'Email is incorrect';
//     test('Email is required', async ({ page }) => {
//         await page.locator('#signupEmail').focus();
//         await page.locator('#signupEmail').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Email required');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Email should contain @', async ({ page }) => {
//         await page.locator('#signupEmail').fill('test.test.test');
//         await page.locator('#signupEmail').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidEmail);
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Email shouldn"t contain space', async ({ page }) => {
//         await page.locator('#signupEmail').fill('some name@gmail.com');
//         await page.locator('#signupEmail').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidEmail);
//         await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Email should contain a few symbols and a dot after @', async ({ page }) => {
//         await page.locator('#signupEmail').fill('name@gmailcom');
//         await page.locator('#signupEmail').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidEmail);
//         await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });
// });

// test.describe('Field Password validation', () => {
//     let signUpForm: SignUpForm;

//     //go to the Register form
//     test.beforeEach(async ({ page }) => {
//         signUpForm = new SignUpForm(page);
//         signUpForm.open();
//         await page.locator('#signupName').fill('Name');
//         await page.locator('#signupLastName').fill('LastName');
//         const randomEmail = () => {
//             return 'iryna.blazhenko+aqa' + Math.floor(Math.random() * 500).toString() + '@email.com';
//         };
//         const rEmail = randomEmail();
//         await page.locator('#signupEmail').fill(rEmail);
//     });

//     const invalidPassword = 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

//     test('Password is required', async ({ page }) => {
//         await page.locator('#signupPassword').focus();
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Password required');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Password should be greater than 7', async ({ page }) => {
//         await page.locator('#signupPassword').fill('Passw1@');
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidPassword);
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Password should be less than 16', async ({ page }) => {
//         await page.locator('#signupPassword').fill('P a s s w o rd1@');
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidPassword);
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Password should contain minimun 1 integer', async ({ page }) => {
//         await page.locator('#signupPassword').fill('Password@');
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidPassword);
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Password should contain minimum 1 capital letter', async ({ page }) => {
//         await page.locator('#signupPassword').fill('password1@');
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidPassword);
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Password should contain minimum 1 small letter', async ({ page }) => {
//         await page.locator('#signupPassword').fill('PASSWORD1@');
//         await page.locator('#signupPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidPassword);
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });
// });

// test.describe('Field Re-enter password validation', () => {
//     let signUpForm: SignUpForm;

//     //go to the Register form
//     test.beforeEach(async ({ page }) => {
//         signUpForm = new SignUpForm(page);
//         signUpForm.open();
//         await page.locator('#signupName').fill('Name');
//         await page.locator('#signupLastName').fill('LastName');
//         const randomEmail = () => {
//             return 'iryna.blazhenko+aqa' + Math.floor(Math.random() * 500).toString() + '@email.com';
//         };
//         const rEmail = randomEmail();
//         await page.locator('#signupEmail').fill(rEmail);
//         await page.locator('#signupPassword').fill('Password1@');
//     });

//     const invalidRePassword = 'Passwords do not match';

//     test('Re-enter password is required', async ({ page }) => {
//         await page.locator('#signupRepeatPassword').focus();
//         await page.locator('#signupRepeatPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText('Re-enter password required');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });

//     test('Re-entered password doesn"t match the Password', async ({ page }) => {
//         await page.locator('#signupRepeatPassword').fill('Passwwor1@');
//         await page.locator('#signupRepeatPassword').blur();
//         await expect(page.locator('//form/div/div/p')).toHaveText(invalidRePassword);
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//         await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//     });
// });

// test.describe('Negative scenario with all invalid fields', () => {
//     let signUpForm: SignUpForm;

//     //go to the Register form
//     test.beforeEach(async ({ page }) => {
//         signUpForm = new SignUpForm(page);
//         signUpForm.open();
//     });

//     test('All fields are invalid', async ({ page }) => {
//         await page.locator('#signupName').fill('Te st');
//         await page.locator('#signupLastName').fill(' User');
//         await page.locator('#signupEmail').fill('Email');
//         await page.locator('#signupPassword').fill('password1!');
//         await page.locator('#signupRepeatPassword').fill('Password1!');
//         await page.locator('#signupRepeatPassword').blur();
//         await expect(page.locator('(//form/div/div)[1]/p')).toHaveText('Name is invalid');
//         await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//         await expect(page.locator('(//form/div/div)[2]/p')).toHaveText('Last name is invalid');
//         await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//         await expect(page.locator('(//form/div/div)[3]/p')).toHaveText('Email is incorrect');
//         await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//         await expect(page.locator('(//form/div/div)[4]/p')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
//         await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//         await expect(page.locator('(//form/div/div)[5]/p')).toHaveText('Passwords do not match');
//         await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
//         await expect(page.locator('button', { hasText: 'Register' })).toBeDisabled();
//     });

// })