import {Page,Locator} from '@playwright/test';
import { ElementUtil} from '../utils/ElementUtils';
import {OrangeHRMPIMListpage} from '../pages/OrangeHRMPIMListpage.ts'


export class OrangeHRMDashboardpage{

    private readonly page:Page;
    private readonly eleUtil;
    private readonly TopbarHeaderTitleElement : Locator;
    private readonly ContainerText : (containertext : string) => Locator;
    private readonly moduleText : (modulename : string) => Locator;
    private readonly modulesearchInput : Locator;
    private readonly modulesearchresultText : (moduletext : string) => Locator;
    


    constructor (page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.TopbarHeaderTitleElement = page.locator('.oxd-topbar-header-title');
        this.ContainerText = (containerText : string) => page.locator(`p:has-text("${containerText}")`);
        this.moduleText = (modulename : string) => page.locator(`span:has-text("${modulename}")`);
        this.modulesearchInput = page.getByRole('textbox', { name: 'Search' });
        this.modulesearchresultText = (moduletext : string) => page.locator(`span:has-text("${moduletext}")`);
    }


    async isDashboardexists():Promise<string | null> {
        console.log(`Wait for visibility of Title bar text`);
        await this.eleUtil.waitForElementVisibleState(this.TopbarHeaderTitleElement);
        return await this.eleUtil.dogetinnertext(this.TopbarHeaderTitleElement);
    }

    async isContainertextexists(context:string):Promise<string | null>  {
        console.log(`Wait for visibility of Container Text`);
        await this.eleUtil.waitForElementVisibleState(this.ContainerText(context));
        return await this.eleUtil.dogetinnertext(this.ContainerText(context));
    }

    async accessPIM(modulename:string):Promise<OrangeHRMPIMListpage> {
        console.log(`Access the PIM Module`);
        await this.eleUtil.doclick(this.moduleText(modulename));
        return new OrangeHRMPIMListpage(this.page);

    }

    async searchmodule(moduletext:string) {
        await this.eleUtil.waitForElementVisibleState(this.modulesearchInput);
        await this.eleUtil.dofill(this.modulesearchInput,moduletext);
        console.log(`Search for the module ${moduletext}`);
    }

    async issearchmoduledisplayed(moduletext:string):Promise <boolean> {
        console.log(`Check the search result for the module ${moduletext}`);
        return await this.eleUtil.waitForElementVisibleState(this.modulesearchresultText(moduletext));
    }

    async clearmodulesearch() {
        await this.eleUtil.docleartext(this.modulesearchInput);
        console.log(`Clear the search text`);   
    }


};