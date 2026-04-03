import {Page,Locator} from '@playwright/test';
import { ElementUtil} from '../utils/ElementUtils';
import {OrangeHRMEmployeelistpage} from '../pages/OrangeHRMEmployeelistpage'
import path from 'path';

let filepath : string;


export class OrangeHRMAddEmployeepage{
    

    private readonly page:Page;
    private readonly eleUtil;
    private readonly addemployeeHeading: Locator;
    private readonly empimgaltText: Locator;
    private readonly empImage: Locator;
    private readonly empfieldsInput:(fieldname:string)=>Locator ;
    private readonly empidInput: Locator;
    private readonly saveButton: Locator;

    constructor (page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.addemployeeHeading = page.locator(`//h6[normalize-space()='Add Employee']`);
        this.empimgaltText = page.locator('.employee-image');
        this.empImage = page.locator('.oxd-file-input');
        this.empfieldsInput = (fieldname:string) => page.getByRole('textbox', { name: fieldname  });
        this.empidInput = page.locator(`(//input[@class='oxd-input oxd-input--active'])[2]`);
        this.saveButton = page.getByRole('button', { name: 'Save' });
   

    }


    async isaddemployeeexists():Promise<boolean> {
        return await this.eleUtil.waitForElementVisibleState(this.addemployeeHeading);
    }


    async addempimage() {
        // await this.eleUtil.WaitForSleep(3000);
        await this.eleUtil.waitForElementVisibleState(this.empimgaltText);
        filepath = path.resolve(process.cwd(), 'image', 'pwimage.png');
        await this.eleUtil.doUploadFile(this.empImage, filepath);
    }

    async addempdetails(fieldname:string,value:string) {
        await this.eleUtil.waitForElementVisibleState(this.empfieldsInput(fieldname));
        await this.eleUtil.dofill(this.empfieldsInput(fieldname),`${value}-${new Date().toLocaleString('sv-SE').replace(' ', '-')}`);
    }

    async getempID():Promise<string | null> {
       const empid  = await this.eleUtil.dogetinputvalue(this.empidInput);
       console.log(`The empID is:`+empid);
       return empid
    }
    

    async saveempdetails():Promise<OrangeHRMEmployeelistpage> {
        await this.eleUtil.waitForElementVisibleState(this.saveButton);
        await this.eleUtil.doclick(this.saveButton);
        await this.eleUtil.WaitForSleep(5000);
        return new OrangeHRMEmployeelistpage(this.page);
    }


    

};