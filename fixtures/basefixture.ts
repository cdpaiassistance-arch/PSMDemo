import {test as base , expect} from '@playwright/test';

import {OrangeHRMLoginpage} from '../pages/OrangeHRMLoginpage.ts'
import {OrangeHRMDashboardpage} from '../pages/OrangeHRMDashboardpage.ts'



//Schema for test data 
type moduleserchdata = {
    moduletitle : string;
}



type MyFixtures = {
    orangehrmdashboardpage : OrangeHRMDashboardpage
    moduleserchdata : moduleserchdata[];
};

//Array of test data for module search
const moduleserchdataArray: moduleserchdata[] = [
    {moduletitle : "PIM"},
    {moduletitle : "Leave"},
    {moduletitle : "Time"},
    {moduletitle : "Recruitment"}
]

// export const test = base.extend <MyFixtures> ({

//     orangehrmdashboardpage : async ({page,baseURL},use,testInfo)=>{
//         const orangehrmloginpage = new OrangeHRMLoginpage(page);
//         await orangehrmloginpage.accessloginurl(baseURL);


export const test = base.extend <MyFixtures> ({

    orangehrmdashboardpage : async ({page,baseURL},use,testInfo)=>{
        const orangehrmloginpage = new OrangeHRMLoginpage(page);
        await orangehrmloginpage.accessloginurl(baseURL);
        expect(await orangehrmloginpage.iscompanybrandingexists()).toBeTruthy();

        const userid = testInfo.project.metadata.appUserid;
        const password = testInfo.project.metadata.appPassword;

        const orangehrmdashboardpage: OrangeHRMDashboardpage=  await orangehrmloginpage.dologin(userid,password);
         await expect(page).toHaveURL(/.*dashboard\/index.*/);  
         await use(orangehrmdashboardpage);

    },

    moduleserchdata : async ({},use) => {
        await use(moduleserchdataArray);
    },
});

export {expect};