import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { GaragePage } from '../../page-objects/pages/garagePage';
import { SignUpForm } from '../../page-objects/forms/signUpForm';

dotenv.config();

/*Використовуйте старий репозиторій, створіть окремий файл і додайте до назви POM.
Перепишіть існуючі тести на реєстрацію користувача та форму реєстрації (створені в попередній домашці)  з використанням Page Objects*/
test.describe('Registration form tests', () => {
    let garagePage: GaragePage;
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        await signUpForm.open();
    });

    test.describe('Positive scenario. User can be registered', () => {
        //delete registered account
        test.afterEach(async ({ page }) => {
            garagePage = new GaragePage(page);
            await garagePage.deleteAccount();
        });

        test('User Registration', async () => {
            await signUpForm.register('Test', 'User', process.env.USER_EMAIL ?? 'test', process.env.USER_PASSWORD ?? 'test');
        });
    });

    test.describe('Fields validation', () => {
        test.afterEach(async () => {
            await expect(signUpForm.registerButton).toBeDisabled();
        });

        test.describe('Field Name validation', () => {
            let errorMessage = 'Name is invalid';
            test('Name is required', async () => {
                const errorMessage = 'Name required';
                await signUpForm.fieldValidation(signUpForm.nameField, '', errorMessage);
            });

            test('Name should be greater than 1', async () => {
                const errorMessage = 'Name has to be from 2 to 20 characters long';
                await signUpForm.fieldValidation(signUpForm.nameField, 't', errorMessage);
            });

            test('Name should be less than 20', async () => {
                const errorMessage = 'Name has to be from 2 to 20 characters long';
                await signUpForm.fieldValidation(signUpForm.nameField, 'qwertyuiopasdfghjklzx', errorMessage);
            });


            test('Name shouldn"t contain space', async () => {
                await signUpForm.fieldValidation(signUpForm.nameField, 'some name', errorMessage);
            });

            test('Name should be only English alphabet', async () => {
                await signUpForm.fieldValidation(signUpForm.nameField, 'назва', errorMessage);
            });
        });

        test.describe('Field Last name validation', () => {
            const errorMessage = 'Last name is invalid';
            test.beforeEach(async () => {
                await signUpForm.nameField.fill('Test');
            });

            test('Last name is required', async () => {
                const errorMessage = 'Last name required';
                await signUpForm.fieldValidation(signUpForm.lastNameField, '', errorMessage);
            });

            test('Last name should be greater than 1', async () => {
                const errorMessage = 'Last name has to be from 2 to 20 characters long';
                await signUpForm.fieldValidation(signUpForm.lastNameField, 't', errorMessage);
            });

            test('Last name should be less than 21', async () => {
                const errorMessage = 'Last name has to be from 2 to 20 characters long';
                await signUpForm.fieldValidation(signUpForm.lastNameField, 'qwertyuiopasdfghjklzx', errorMessage);
            });

            test('Last name shouldn"t contain space', async () => {
                await signUpForm.fieldValidation(signUpForm.lastNameField, 'some last name', errorMessage);
            });

            test('Last name should be only English alphabet', async () => {
                await signUpForm.fieldValidation(signUpForm.lastNameField, 'фамілія', errorMessage);
            });
        });

        test.describe('Field Email validation', () => {
            const errorMessage = 'Email is incorrect';
            test.beforeEach(async () => {
                await signUpForm.nameField.fill('Name');
                await signUpForm.lastNameField.fill('LastName');
            });

            test('Email is required', async () => {
                const errorMessage = 'Email required';
                await signUpForm.fieldValidation(signUpForm.emailField, '', errorMessage);
            });

            test('Email should contain @', async () => {
                await signUpForm.fieldValidation(signUpForm.emailField, 'test.test.test', errorMessage);
            });

            test('Email shouldn"t contain space', async () => {
                await signUpForm.fieldValidation(signUpForm.emailField, 'some name@gmail.com', errorMessage);
            });

            test('Email should contain a few symbols and a dot after @', async () => {
                await signUpForm.fieldValidation(signUpForm.emailField, 'name@gmailcom', errorMessage);
            });
        });

        test.describe('Field Password validation', () => {
            const invalidPassword = 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';
            test.beforeEach(async () => {
                await signUpForm.nameField.fill('Name');
                await signUpForm.lastNameField.fill('LastName');
                await signUpForm.emailField.fill(process.env.USER_EMAIL ?? 'test');
            });

            test('Password is required', async () => {
                const errorMessage = 'Password required';
                await signUpForm.fieldValidation(signUpForm.passwordField, '', errorMessage);
            });

            test('Password should be greater than 7', async () => {
                await signUpForm.fieldValidation(signUpForm.passwordField, 'Passw1@', invalidPassword);
            });

            test('Password should be less than 16', async () => {
                await signUpForm.fieldValidation(signUpForm.passwordField, 'P a s s w o rd1@', invalidPassword);
            });

            test('Password should contain minimun 1 integer', async () => {
                await signUpForm.fieldValidation(signUpForm.passwordField, 'Password@', invalidPassword);
            });

            test('Password should contain minimum 1 capital letter', async () => {
                await signUpForm.fieldValidation(signUpForm.passwordField, 'password1@', invalidPassword);
            });

            test('Password should contain minimum 1 small letter', async () => {
                await signUpForm.fieldValidation(signUpForm.passwordField, 'PASSWORD1@', invalidPassword);
            });
        });

        test.describe('Field Re-enter password validation', () => {
            test.beforeEach(async () => {
                await signUpForm.nameField.fill('Name');
                await signUpForm.lastNameField.fill('LastName');
                await signUpForm.emailField.fill(process.env.USER_EMAIL ?? 'test');
                await signUpForm.passwordField.fill(process.env.USER_PASSWORD ?? 'test');
            });

            test('Re-enter password is required', async () => {
                const errorMessage = 'Re-enter password required';
                await signUpForm.fieldValidation(signUpForm.repeatPasswordField, '', errorMessage);
            });

            test('Re-entered password doesn"t match the Password', async () => {
                const errorMessage = 'Passwords do not match';
                await signUpForm.fieldValidation(signUpForm.repeatPasswordField, 'Passwwor1@', errorMessage);
            });
        });
    });

    test('Negative scenario with all invalid fields', async ({ page }) => {
        await signUpForm.nameField.fill('Te st');
        await signUpForm.lastNameField.fill(' User');
        await signUpForm.emailField.fill('Email');
        await signUpForm.passwordField.fill('password1!');
        await signUpForm.repeatPasswordField.fill('Password1!');
        await signUpForm.repeatPasswordField.blur();
        const errors = ['Name is invalid',
            'Last name is invalid',
            'Email is incorrect',
            'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
            'Passwords do not match'];
        const fields = [signUpForm.nameField,
        signUpForm.lastNameField,
        signUpForm.emailField,
        signUpForm.passwordField,
        signUpForm.repeatPasswordField];
        for (let i = 1; i <= 5; i++) {
            await expect(page.locator(`(//form/div/div)[${i}]/p`)).toHaveText(errors[i - 1]);
            await expect(fields[i - 1]).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        };
    });
});