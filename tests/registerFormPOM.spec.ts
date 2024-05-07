import { test, expect, Locator } from '@playwright/test';
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

    test.afterEach(async ({ page }) => {
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.nameField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('Name is required', async ({ page }) => {
        const errorMessage = 'Name required';
        signUpForm.fieldValidation(signUpForm.nameField, '', errorMessage);
    });

    test('Name should be greater than 1', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.nameField, 't', errorMessage);
    });

    test('Name should be less than 20', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.nameField, 'qwertyuiopasdfghjklzx', errorMessage);
    });

    test('Name shouldn"t contain space', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        signUpForm.fieldValidation(signUpForm.nameField, 'some name', errorMessage);
    });

    test('Name should be only English alphabet', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        signUpForm.fieldValidation(signUpForm.nameField, 'назва', errorMessage);
    });
});

test.describe('Field Last name validation', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
        await signUpForm.nameField.fill('Test');
    });
    test.afterEach(async ({ page }) => {
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.lastNameField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('Last name is required', async ({ page }) => {
        const errorMessage = 'Last name required';
        signUpForm.fieldValidation(signUpForm.lastNameField, '', errorMessage);
    });

    test('Last name should be greater than 1', async ({ page }) => {
        const errorMessage = 'Last name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.lastNameField, 't', errorMessage);
    });

    test('Last name should be less than 21', async ({ page }) => {
        const errorMessage = 'Last name has to be from 2 to 20 characters long';
        signUpForm.fieldValidation(signUpForm.lastNameField, 'qwertyuiopasdfghjklzx', errorMessage);
    });

    test('Last name shouldn"t contain space', async ({ page }) => {
        const errorMessage = 'Last name is invalid';
        signUpForm.fieldValidation(signUpForm.lastNameField, 'some last name', errorMessage);
    });

    test('Last name should be only English alphabet', async ({ page }) => {
        const errorMessage = 'Last name is invalid';
        signUpForm.fieldValidation(signUpForm.lastNameField, 'фамілія', errorMessage);
    });
});

test.describe('Field Email validation', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
        await signUpForm.nameField.fill('Name');
        await signUpForm.lastNameField.fill('LastName');
    });

    test.afterEach(async ({ page }) => {
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.emailField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    const invalidEmail = 'Email is incorrect';

    test('Email is required', async ({ page }) => {
        const errorMessage = 'Email required';
        signUpForm.fieldValidation(signUpForm.emailField, '', errorMessage);
    });

    test('Email should contain @', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.emailField, 'test.test.test', invalidEmail);
    });

    test('Email shouldn"t contain space', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.emailField, 'some name@gmail.com', invalidEmail);
    });

    test('Email should contain a few symbols and a dot after @', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.emailField, 'name@gmailcom', invalidEmail);
    });
});

test.describe('Field Password validation', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
        await signUpForm.nameField.fill('Name');
        await signUpForm.lastNameField.fill('LastName');
        await signUpForm.emailField.fill(randomEmail);
    });

    test.afterEach(async ({ page }) => {
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.passwordField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    const invalidPassword = 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

    test('Password is required', async ({ page }) => {
        const errorMessage = 'Password required';
        signUpForm.fieldValidation(signUpForm.passwordField, '', errorMessage);
    });

    test('Password should be greater than 7', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.passwordField, 'Passw1@', invalidPassword);
    });

    test('Password should be less than 16', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.passwordField, 'P a s s w o rd1@', invalidPassword);
    });

    test('Password should contain minimun 1 integer', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.passwordField, 'Password@', invalidPassword);
    });

    test('Password should contain minimum 1 capital letter', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.passwordField, 'password1@', invalidPassword);
    });

    test('Password should contain minimum 1 small letter', async ({ page }) => {
        signUpForm.fieldValidation(signUpForm.passwordField, 'PASSWORD1@', invalidPassword);
    });
});

test.describe('Field Re-enter password validation', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
        await signUpForm.nameField.fill('Name');
        await signUpForm.lastNameField.fill('LastName');
        await signUpForm.emailField.fill(randomEmail);
        await signUpForm.passwordField.fill(password);
    });

    test.afterEach(async ({ page }) => {
        await expect(signUpForm.registerButton).toBeDisabled();
        await expect(signUpForm.repeatPasswordField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    });

    test('Re-enter password is required', async ({ page }) => {
        const errorMessage = 'Re-enter password required';
        signUpForm.fieldValidation(signUpForm.repeatPasswordField, '', errorMessage);
    });

    test('Re-entered password doesn"t match the Password', async ({ page }) => {
        const errorMessage = 'Passwords do not match';
        signUpForm.fieldValidation(signUpForm.repeatPasswordField, 'Passwwor1@', errorMessage);
    });
});

test.describe('Negative scenario with all invalid fields', () => {
    let signUpForm: SignUpForm;

    //go to the Register form
    test.beforeEach(async ({ page }) => {
        signUpForm = new SignUpForm(page);
        signUpForm.open();
    });

    test('All fields are invalid', async ({ page }) => {
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
        }
        await expect(signUpForm.registerButton).toBeDisabled();
    });
})