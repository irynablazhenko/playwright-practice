import { expect, type Locator, type Page } from '@playwright/test';
import { SignInForm } from '../forms/signInForm';
import { AddFuelExpenseForm } from '../forms/addFuelsExpenseForm';
import dotenv from 'dotenv';

dotenv.config();

export class GaragePage {
    readonly page: Page;
    readonly settingsMenu: Locator;
    readonly settingsTitle: Locator;
    readonly removeAccButton: Locator;
    readonly removeAccTitle: Locator;
    readonly removeButton: Locator;
    readonly emptyGarageMessage: Locator;
    readonly addCarButton: Locator;
    readonly brandDropdown: Locator;
    readonly modelDropdown: Locator;
    readonly mileageField: Locator;
    readonly addButton: Locator;
    readonly firstCarName: Locator;
    readonly validationError: Locator;
    readonly editCarIcon: Locator;
    readonly removeCarButton: Locator;
    readonly acceptCarRemovingButton: Locator;
    readonly cars: Locator;
    readonly saveButton: Locator;
    readonly alert: Locator;
    readonly cancelButton: Locator;
    readonly deleteFuelExpensesButton: Locator;
    readonly removeFuelButton: Locator;
    readonly miles: Locator;
    readonly fuelErrorMessage: Locator;
    readonly updateMileagesButton: Locator;
    readonly popupMessage: Locator;
    readonly cancelRemovingButton: Locator;
    readonly garageMenu: Locator;
    readonly carName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.settingsMenu = page.locator('a[routerlink="settings"]');
        this.settingsTitle = page.locator('h1');
        this.removeAccButton = page.locator('button', { hasText: 'Remove my account' });
        this.removeAccTitle = page.locator('h4');
        this.removeButton = page.locator('[class="btn btn-danger"]');
        this.emptyGarageMessage = page.locator('[class="panel-empty_message"]');
        this.addCarButton = page.getByText('Add car');
        this.brandDropdown = page.locator('#addCarBrand');
        this.modelDropdown = page.locator('#addCarModel');
        this.mileageField = page.locator('#addCarMileage');
        this.addButton = page.getByText('Add', { exact: true });
        this.firstCarName = page.locator('.car_name').first();
        this.validationError = page.locator('[class="invalid-feedback"]');
        this.editCarIcon = page.locator('.icon-edit').first();
        this.removeCarButton = page.locator('.btn-outline-danger');
        this.acceptCarRemovingButton = page.locator('.btn-danger');
        this.cars = page.locator('[class="car jumbotron"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByText('Cancel');
        this.alert = page.locator('[class="alert alert-danger"]');
        this.deleteFuelExpensesButton = page.locator('[class="btn btn-delete"]');
        this.removeFuelButton = page.locator('[class="btn btn-danger"]', { hasText: 'Remove' });
        this.miles = page.locator('(//li//input)[1]');
        this.fuelErrorMessage = page.locator('[class="alert alert-danger"]');
        this.updateMileagesButton = page.locator('button', { hasText: 'Update' }).first();
        this.popupMessage = page.locator('[class="alert alert-success"]').first();
        this.cancelRemovingButton = page.getByRole('button', { name: 'Cancel' });
        this.garageMenu = page.locator('[routerlink="garage"]');
        this.carName = page.locator('[class="car_name h2"]');
    };

    async openAsLoggedUser() {
        const signInForm = new SignInForm(this.page);
        await signInForm.open();
        await signInForm.loginWithCredentials(process.env.USER_EMAIL ?? 'test', process.env.USER_PASSWORD ?? 'test');
        await expect(this.page.locator('h1')).toHaveText('Garage');
    };

    async open() {
        await this.page.goto('/panel/garage');
    };

    async clickGarageMenu() {
        await this.garageMenu.click();
    };

    async clickAddCarButton() {
        await this.addCarButton.click();
    };

    async clickEditCarIcon() {
        await this.editCarIcon.click();
    };

    async clickSaveButton() {
        await this.saveButton.click();
    };

    async clickCancelButton() {
        await this.cancelButton.click();
    };

    async clickFuelCancelButton() {
        const addFuelExpenseForm = new AddFuelExpenseForm(this.page);
        await addFuelExpenseForm.cancelButton.click();
    };

    async clickAddFuelExpenses() {
        const addFuelExpenseForm = new AddFuelExpenseForm(this.page);
        await addFuelExpenseForm.open();
    };

    async addFuelExpense(mileage: string, liters: string, total: string) {
        const addFuelExpenseForm = new AddFuelExpenseForm(this.page);
        await addFuelExpenseForm.addFuelExpense(mileage, liters, total);
    };

    async fillAddFuelExpenseForm(position: number, mileage: string, liters: string, total: string) {
        const addFuelExpenseForm = new AddFuelExpenseForm(this.page);
        await addFuelExpenseForm.fillAddFuelExpenseForm(position, mileage, liters, total);
    };

    async getExpenseTotal() {
        const addFuelExpenseForm = new AddFuelExpenseForm(this.page);
        return addFuelExpenseForm.totalValue;
    };

    async clickDeleteFuelExpenses() {
        this.deleteFuelExpensesButton.click();
    };

    async selectBrand(brand: string) {
        await this.page.waitForTimeout(1000);
        await this.brandDropdown.selectOption({ label: brand });
    };

    async selectModel(model: string) {
        await this.page.waitForTimeout(1000);
        await this.modelDropdown.selectOption({ label: model });
    };

    async enterMileage(mileage: string) {
        await this.mileageField.fill(mileage);
    };

    async clickAddButton() {
        await this.addButton.click();
    };

    async getFirstCarName() {
        return this.firstCarName;
    };

    async fillAddCarForm(brand: string, model: string, mileage: string) {
        await this.selectBrand(brand);
        await this.selectModel(model);
        await this.enterMileage(mileage);
    };

    async fillEditCarForm(brandId: number, modelId: number, mileage: string) {
        await this.brandDropdown.selectOption({ index: brandId });;
        await this.modelDropdown.selectOption({ index: modelId });
        await this.enterMileage(mileage);
    };

    async editCar(brand: string, model: string, mileage: string) {
        await this.clickEditCarIcon();
        await this.selectBrand(brand);
        await this.selectModel(model);
        await this.enterMileage(mileage);
        await this.clickSaveButton();
        await this.page.waitForTimeout(1000);
        await expect(this.popupMessage).toHaveText('Car updated');
    };

    async AddCar(brand: string, model: string, mileage: string) {
        await this.clickAddCarButton();
        await this.fillAddCarForm(brand, model, mileage);
        await this.clickAddButton();
        await expect(this.firstCarName).toHaveText(`${brand} ${model}`);
    };

    async removeLastCar() {
       const carsNumberBefore = await this.page.locator('.icon-edit').count();
        await this.editCarIcon.click();
        await this.removeCarButton.click();
        await this.acceptCarRemovingButton.click();
        if (carsNumberBefore != 0) {
            await expect(this.editCarIcon).toHaveCount(carsNumberBefore - 1);
        };
    };

    async removeLastFuelExpenses() {
        const rowBefore = await this.page.locator('//tbody/tr').count();
        console.log(rowBefore);
        await this.page.locator('//tbody/tr').focus();
        await this.deleteFuelExpensesButton.blur();
        await expect(this.deleteFuelExpensesButton).toBeVisible();
        await this.clickDeleteFuelExpenses();
        await this.removeFuelButton.click();
        console.log(this.page.locator('//tbody/tr'));
        await expect(this.page.locator('//tbody/tr')).toHaveCount(rowBefore - 1);
    };

    async inputNewMileage(miles: string) {
        await this.miles.fill(miles);
    };

    async clickUpdateMileagesButton() {
        await this.updateMileagesButton.click();
    };
    async clickSettingsMenu() {
        await this.settingsMenu.click();
        await expect(this.settingsTitle).toHaveText('Settings');
    };

    async clickRemoveAccButton() {
        await this.removeAccButton.click();
        await expect(this.removeAccTitle).toHaveText('Remove account');
    };

    async clickRemoveButton() {
        await this.removeButton.click();
    };

    async deleteAccount() {
        await this.clickSettingsMenu();
        await this.clickRemoveAccButton();
        await this.clickRemoveButton();
        await expect(this.page.locator('h1')).toContainText('Do more!');
    };

    async getMiles() {
        await this.miles.inputValue();
    };
}