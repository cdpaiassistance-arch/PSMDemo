import {Page,Locator} from '@playwright/test';
import { ElementUtil} from '../utils/ElementUtils';
import {OrangeHRMAddEmployeepage} from '../pages/OrangeHRMAddEmployeepage.ts';


export class OrangeHRMPIMListpage{

    private readonly page:Page;
    private readonly eleUtil;
    private readonly TopbarHeaderTitleElement : Locator;
    private readonly PIMAddButton : Locator;
    private readonly empidInput: Locator;
    private readonly searchButton: Locator;
    private readonly empidcolumn: Locator;
    private readonly deleteempIcon: Locator;
    private readonly confirmdeleteButton : Locator;

  
    constructor (page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.TopbarHeaderTitleElement = page.getByRole('heading', { name: 'PIM', level: 6 });
        this.PIMAddButton = page.getByRole('button', { name: 'Add' });
        this.empidInput = page.locator('div.oxd-input-group > div > input.oxd-input');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.empidcolumn = page.locator('div[role=\'row\'] > div[role=\'cell\']').nth(1);
        this.deleteempIcon = page.locator('.oxd-icon.bi-trash');
        this.confirmdeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    }


    async isPIMexists():Promise<boolean> {
        console.log('Wait for visibility of Title bar text');
        return await this.eleUtil.waitForElementVisibleState(this.TopbarHeaderTitleElement);
    }


    async addEmployee():Promise<OrangeHRMAddEmployeepage> {
        console.log('Click on Add Button PIM List Page');
        await this.eleUtil.waitForElementVisibleState(this.PIMAddButton);
        await this.eleUtil.doclick(this.PIMAddButton);
        return new OrangeHRMAddEmployeepage(this.page);
    }

    async searchemployeeID(empid:string) {
        console.log('Search Employee by ID');
        await this.eleUtil.waitForElementVisibleState(this.empidInput);
        await this.eleUtil.dofill(this.empidInput,empid);
        await this.eleUtil.doclick(this.searchButton);
    }

    async isemprecordexists() {
        console.log('Check the Emp ID ');
        await this.eleUtil.waitForElementVisibleState(this.empidcolumn);
        const empid = await this.eleUtil.dogetinnertext(this.empidcolumn);
        console.log(`The employee ID in the search result is:${empid}`);
        return empid;
    }

    async deleteemprecord () {
        console.log('Delete the employee record');
        await this.eleUtil.waitForElementVisibleState(this.deleteempIcon);
        await this.eleUtil.doclick(this.deleteempIcon);
        await this.eleUtil.waitForElementVisibleState(this.confirmdeleteButton);
        await this.eleUtil.doclick(this.confirmdeleteButton);
    }


}