import { expect, type Locator, type Page } from '@playwright/test';
import { GaragePage } from '../pages/garagePage';

export class EditCarForm {
    readonly page: Page;
    readonly formHeader: Locator;
    readonly brandDropdown: Locator;
    readonly modelDropdown: Locator;
    readonly mileageField: Locator;
    readonly saveButton: Locator;
    readonly alert: Locator;
    readonly cancelButton: Locator;
    readonly firstCarName: Locator;
    readonly editCarIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formHeader = page.getByRole('heading', { name: 'Edit a car' });
        this.brandDropdown = page.locator('#addCarBrand');
        this.modelDropdown = page.locator('#addCarModel');
        this.mileageField = page.locator('#addCarMileage');
        this.saveButton = page.getByText('Save');
        this.cancelButton = page.getByText('Cancel');
        this.alert = page.locator('[class="alert alert-danger"]');
        this.firstCarName = page.locator('.car_name').first();
        this.editCarIcon = page.locator('.icon-edit').first();
    };
    async clickEditCarIcon() {
        await this.editCarIcon.click();
    };

    async open() {
        await this.clickEditCarIcon();
        await expect(this.formHeader).toBeVisible();
    };

    async clickSaveButton() {
        await this.saveButton.click();
    };

    async clickCancelButton() {
        await this.cancelButton.click();
    };
   
    async selectBrand(brand: string) {
        await this.page.waitForTimeout(1000);
        await this.brandDropdown.click();
        await this.brandDropdown.selectOption({ value: brand });
    };

    async selectModel(model: string) {
        await this.page.waitForTimeout(1000);
        await this.modelDropdown.click();
        await this.modelDropdown.selectOption({ value: model });
    };

    async enterMileage(mileage: string) {
        await this.mileageField.fill(mileage);
    };
    async getFirstCarName() {
        return this.firstCarName;
    };

    async editCar(brand: string, model: string, mileage: string) {
        await this.selectBrand(brand);
        await this.selectModel(model);
        await this.enterMileage(mileage);
        await this.clickSaveButton();
        await expect(this.firstCarName).toHaveText(`${brand} ${model}`);
    };
}