import {test as base , expect} from '@playwright/test';

import {OrangeHRMLoginpage} from '../pages/OrangeHRMLoginpage.ts';
import {OrangeHRMDashboardpage} from '../pages/OrangeHRMDashboardpage.ts';



//Schema for test data 
type inprogressmoduleserchdata = {
    moduletitle : string;
}

type MyFixtures = {
    orangehrmdashboardpage : OrangeHRMDashboardpage
    moduleserchdata : inprogressmoduleserchdata[];
};

//Array of test data for module search
const moduleserchdataArray: inprogressmoduleserchdata[] = [
    {moduletitle : 'PIM'},
    {moduletitle : 'Leave'},
    {moduletitle : 'Time'},
    {moduletitle : 'My Info'}
];

export const test = base.extend <MyFixtures> ({

    orangehrmdashboardpage : async ({page,baseURL},use,testInfo)=>{

        // const videopath = testInfo.outputPath('screencast.webm');
        // await page.screencast.start({path:videopath});
        // await page.screencast.showActions({position: 'top'});
        await page.screencast.showChapter('Login to Orange HRM',{
              description: 'Logs in to Orange HRM using valid Login credentials',
              duration: 2000,
        });

        const orangehrmloginpage = new OrangeHRMLoginpage(page);
        await orangehrmloginpage.accessloginurl(baseURL);
        expect(await orangehrmloginpage.iscompanybrandingexists()).toBeTruthy();

        const userid = testInfo.project.metadata.appUserid;
        const password = testInfo.project.metadata.appPassword;

        const orangehrmdashboardpage: OrangeHRMDashboardpage=  await orangehrmloginpage.dologin(userid,password);
         await expect(page).toHaveURL(/.*dashboard\/index.*/);  
         await use(orangehrmdashboardpage);

    },

    // eslint-disable-next-line no-empty-pattern
    moduleserchdata : async ({},use) => {
        await use(moduleserchdataArray);
    },
});

export {expect};