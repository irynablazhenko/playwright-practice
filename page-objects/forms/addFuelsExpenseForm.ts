import { expect, type Locator, type Page } from '@playwright/test';
import { GaragePage } from '../pages/garagePage';

export class AddFuelExpenseForm {
    readonly page: Page;
    // readonly nameField: Locator;
    // readonly lastNameField: Locator;
    // readonly emailField: Locator;
    // readonly passwordField: Locator;
    // readonly repeatPasswordField: Locator;
    // readonly registerButton: Locator;
    // readonly errorMessage: Locator;
    readonly formHeader: Locator;
    readonly vehicleDropdown: Locator;
    readonly expenseMileageField: Locator;
    readonly expenseLitersField: Locator;
    readonly expenseTotalField: Locator;
    readonly alert: Locator;
    readonly cancelButton: Locator;
    readonly addButton: Locator;
    readonly addFuelsExpenseButton: Locator;
    readonly totalValue:Locator;

    
    //readonly errorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        // this.nameField = page.locator('#signupName');
        // this.lastNameField = page.locator('#signupLastName');
        // this.emailField = page.locator('#signupEmail');
        // this.passwordField = page.locator('#signupPassword');
        // this.repeatPasswordField = page.locator('#signupRepeatPassword');
        // this.registerButton = page.locator('button', { hasText: 'Register' });
        // this.errorMessage = page.locator('//form/div/div/p');
        this.formHeader = page.getByRole('heading', { name: 'Add an expense' });
        this.vehicleDropdown = page.locator('#addExpenseCar');
        this.expenseMileageField = page.locator('#addExpenseMileage');
        this.expenseLitersField = page.locator('#addExpenseLiters');
        this.expenseTotalField = page.locator('#addExpenseTotalCost');
        this.cancelButton = page.getByText('Cancel');
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.addFuelsExpenseButton = page.locator('[class="car_add-expense btn btn-success"]').first();
        this.totalValue = page.locator('td:nth-child(4)');

    };
    async open() {
        await this.addFuelsExpenseButton.click();
        await expect(this.formHeader).toBeVisible();
    };

    async clickAddButton() {
        await this.addButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.page.locator('h1')).toHaveText('Fuel expenses');
    };

    async clickCancelButton() {
        await this.cancelButton.click();
    };
   

    async selectVehicle(number: number) {
        await this.page.waitForTimeout(1000);
        await this.vehicleDropdown.click();
        await this.vehicleDropdown.selectOption({index: number});
    };

    async enterMileage(mileage: string) {
        await this.expenseMileageField.fill(mileage);
    };
    async expenseLiters(liters: string) {
        return this.expenseLitersField.fill(liters);
    };
    async expenseTotal(total: string) {
        return this.expenseTotalField.fill(total);
    };

    async addFuelExpense(mileage: string, liters: string, total: string) {
       // await this.selectVehicle(1);
        await this.enterMileage(mileage);
        await this.expenseLiters(liters);
        await this.expenseTotal(total);
        await this.clickAddButton();
        await expect(this.totalValue).toHaveText(`${total}.00 USD`);
    };

    // async fieldValidation(locator: Locator, value: string, errorMessage: string) {
    //     if (value) {
    //         await locator.fill(value)
    //     }
    //     else {
    //         await locator.focus();
    //     }
    //     await locator.blur();
    //     await expect(this.errorMessage).toHaveText(errorMessage);
    //     await expect(locator).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    // };
}