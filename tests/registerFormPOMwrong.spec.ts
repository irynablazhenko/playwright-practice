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

    test('Name is required', async ({ page }) => {
        const errorMessage = 'Name required';
        await signUpForm.fieldValidation2(signUpForm.nameField, '', errorMessage);
    });

    test('Name should be greater than 1', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        await signUpForm.fieldValidation2(signUpForm.nameField, 't', errorMessage);
    });

    test('Name should be less than 20', async ({ page }) => {
        const errorMessage = 'Name has to be from 2 to 20 characters long';
        await signUpForm.fieldValidation2(signUpForm.nameField, 'qwertyuiopasdfghjklzx', errorMessage);
    });

    test('Name shouldn"t contain space', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        await signUpForm.fieldValidation2(signUpForm.nameField, 'some name', errorMessage);
    });

    test('Name should be only English alphabet', async ({ page }) => {
        const errorMessage = 'Name is invalid';
        await signUpForm.fieldValidation2(signUpForm.nameField, 'назва', errorMessage);
    });
});
