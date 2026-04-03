import {Page,Locator} from '@playwright/test';
import { ElementUtil} from '../utils/ElementUtils';
import { OrangeHRMPIMListpage } from '../pages/OrangeHRMPIMListpage.ts';



export class OrangeHRMEmployeelistpage{
    

    private readonly page:Page;
    private readonly eleUtil;
    private readonly employeelistHeading: Locator;
    private readonly moduleText : (modulename : string) => Locator;


    constructor (page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.employeelistHeading = page.getByRole('heading', { name: 'Personal Details', level: 6 });
        this.moduleText = (modulename :string) => page.locator(`span:has-text("${modulename}")`).nth(0);
    }


    async isemployeelistpageexists(){
        return await this.eleUtil.waitForElementVisibleState(this.employeelistHeading);
    }

    async accessPIM(modulename:string):Promise <OrangeHRMPIMListpage> {
        await this.eleUtil.waitForElementVisibleState(this.moduleText(modulename));
        await this.eleUtil.doclick(this.moduleText(modulename));
        return new OrangeHRMPIMListpage(this.page);
    }

}