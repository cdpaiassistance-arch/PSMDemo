// import {test,expect} from '@playwright/test';
import { test , expect } from '../fixtures/basefixture.ts';
import {OrangeHRMLoginpage} from '../pages/OrangeHRMLoginpage.ts';
import {OrangeHRMDashboardpage} from '../pages/OrangeHRMDashboardpage.ts';
import {OrangeHRMPIMListpage} from '../pages/OrangeHRMPIMListpage.ts';
import {OrangeHRMAddEmployeepage} from '../pages/OrangeHRMAddEmployeepage.ts'
import {OrangeHRMEmployeelistpage} from '../pages/OrangeHRMEmployeelistpage.ts'


test('OrangeHRM Test',
    {tag:['@RegressionTest','@OrangeHRMTest'],
        annotation: [
            {type : 'epic', description: 'Epic 100-Orange HRM'},
            {type: 'feature', description: 'Get all Data'},
            {type: 'story' , description: 'Submit data successfully'},
            {type: 'Owner' , description: ' QA Team'}
        ]},
    async ({page,orangehrmdashboardpage}) => {
        test.setTimeout(50000);
        //Orange HRM Login Page 
        // const orangehrmloginpage = new OrangeHRMLoginpage(page);
        // await orangehrmloginpage.accessloginurl();
        // await expect(page).toHaveURL(/.*web\/index.php\/auth\/login.*/);
        // await expect.poll(async()=> await orangehrmloginpage.iscompanybrandingexists()).toBeTruthy();
        // const orangehrmdashboardpage:OrangeHRMDashboardpage = await orangehrmloginpage.dologin('Admin','admin123');
        // await expect(page).toHaveURL(/.*dashboard\/index.*/);


        //Orange HRM Dashboard Page
        await expect.poll(async()=> await orangehrmdashboardpage.isDashboardexists()).toContain('Dashboard');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('Time at Work'.trim())).toContain('Time at Work');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('My Actions'.trim())).toContain('My Actions');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('Quick Launch'.trim())).toContain('Quick Launch');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('Employees on Leave Today'.trim())).toContain('Employees on Leave Today');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('Employee Distribution by Sub Unit'.trim())).toContain('Employee Distribution by Sub Unit');
        await expect.poll(async()=> await orangehrmdashboardpage.isContainertextexists('Employee Distribution by Location'.trim())).toContain('Employee Distribution by Location');

        //Orange HRM PIM Page
        let orangehrmpimlistpage:OrangeHRMPIMListpage = await orangehrmdashboardpage.accessPIM('PIM');
        await expect(page).toHaveURL(/.*pim\/viewEmployeeList.*/);
        const organgehrmaddemployeepage:OrangeHRMAddEmployeepage=await orangehrmpimlistpage.addEmployee();
         await expect(page).toHaveURL(/.*pim\/addEmployee.*/);

        //Orange GRM Add Employee Page
        await expect.poll(async()=> await organgehrmaddemployeepage.isaddemployeeexists()).toBeTruthy();
        organgehrmaddemployeepage.addempimage();
        await organgehrmaddemployeepage.addempdetails('First Name','PWUser');
        await organgehrmaddemployeepage.addempdetails('Last Name','Test');
        let empid = await organgehrmaddemployeepage.getempID();

        //Orange GRM Employee List Page
        const organgehrmemployeelistpage:OrangeHRMEmployeelistpage = await organgehrmaddemployeepage.saveempdetails();
        await expect(page).toHaveURL(/.*viewPersonalDetails\/empNumber.*/);
        await expect.poll(async()=> await organgehrmemployeelistpage.isemployeelistpageexists()).toBeTruthy();
         
        orangehrmpimlistpage = await organgehrmemployeelistpage.accessPIM('PIM');
        await expect(page).toHaveURL(/.*pim\/viewEmployeeList.*/);

        await expect.poll(async()=> await orangehrmpimlistpage.isPIMexists()).toBeTruthy();
        await orangehrmpimlistpage.searchemployeeID(empid!);
        await expect.poll(async()=> await orangehrmpimlistpage.isemprecordexists()).toContain(empid!);
        await orangehrmpimlistpage.deleteemprecord();
    });

test('Search Modules Test',
    {tag:['@SearchModulesTest', '@SmokeTest'],
     annotation: [
        { type: 'epic', description: 'Epic 200-Search Modules' },
        { type: 'feature', description: 'Search Modules' },   
        { type: 'story', description: 'Search Modules Using Module Name' },
        { type: 'Owner', description: 'PSM QA Team' }
    ]},

    async ({ page,orangehrmdashboardpage,moduleserchdata }) => {
        //In Progress Proposal Search Test
        await expect.poll(async()=> await orangehrmdashboardpage.isDashboardexists()).toContain('Dashboard');

         //Array Data Provider to serach multiple modules using module name
        for (const data of moduleserchdata) {
             await orangehrmdashboardpage.searchmodule(data.moduletitle);
             await expect.poll(async()=>await orangehrmdashboardpage.issearchmoduledisplayed(data.moduletitle)).toBeTruthy();
              await orangehrmdashboardpage.clearmodulesearch();          
         
        }

    });