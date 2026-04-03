import {Page,Locator} from '@playwright/test';
import { ElementUtil} from '../utils/ElementUtils';
import {OrangeHRMDashboardpage} from '../pages/OrangeHRMDashboardpage.ts'

export class OrangeHRMLoginpage{

    private readonly page:Page;
    private readonly eleUtil;
    private readonly companybrandingImage;
    private readonly loginHeading;
    private readonly userdetailsField : (userdetails:string) => Locator;
    private readonly loginButton;

    constructor (page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.companybrandingImage = page.getByRole('img', { name: 'company-branding' });
        this.loginHeading = page.getByRole('heading', { name: 'Login', level: 5 });
        this.userdetailsField = (userdetails:string) => page.getByRole('textbox', { name: userdetails });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async accessloginurl(baseURL : string | undefined) {
        await this.page.goto(baseURL+'/web/index.php/auth/login');
        await this.eleUtil.WaitForPageLoad('load');
        console.log(`User access URL`);
    }

    async iscompanybrandingexists() : Promise<boolean>{
        console.log(`Wait for visibility of company branding logo`);
        return await this.eleUtil.waitForElementVisibleState(this.companybrandingImage);
    }

    async dologin(username:string,password:string):Promise <OrangeHRMDashboardpage> {
        await this.eleUtil.waitForElementVisibleState(this.loginHeading);
        await this.eleUtil.dofill(this.userdetailsField('Username'),username);
        await this.eleUtil.dofill(this.userdetailsField('Password'),password);
        await this.eleUtil.doclick(this.loginButton);
        console.log(`User details entered and login button clicked`);
        return new OrangeHRMDashboardpage(this.page);
    }
}
