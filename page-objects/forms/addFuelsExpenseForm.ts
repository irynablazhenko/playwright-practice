import { expect, type Locator, type Page } from '@playwright/test';

export class AddFuelExpenseForm {
    readonly page: Page;
    readonly formHeader: Locator;
    readonly vehicleDropdown: Locator;
    readonly expenseMileageField: Locator;
    readonly expenseLitersField: Locator;
    readonly expenseTotalField: Locator;
    readonly alert: Locator;
    readonly cancelButton: Locator;
    readonly addButton: Locator;
    readonly addFuelsExpenseButton: Locator;
    readonly totalValue: Locator;

    constructor(page: Page) {
        this.page = page;
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
    };

    async clickCancelButton() {
        await this.cancelButton.click();
    };

    async selectVehicle(number: number) {
        await this.page.waitForTimeout(1000);
    //    await this.vehicleDropdown.click();
        await this.vehicleDropdown.selectOption({ index: number });
    };

    async selectVehicleModel(model: string) {
        await this.page.waitForTimeout(1000);
     //   await this.vehicleDropdown.click();
        await this.vehicleDropdown.selectOption({ label: model });
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
        await this.enterMileage(mileage);
        await this.expenseLiters(liters);
        await this.expenseTotal(total);
        await this.clickAddButton();
        await expect(this.totalValue).toHaveText(`${total}.00 USD`);
    };

    async fillAddFuelExpenseForm(position: number,  mileage: string, liters: string, total: string) {
        await this.selectVehicle(position);
        await this.enterMileage(mileage);
        await this.expenseLiters(liters);
        await this.expenseTotal(total);
    };
}