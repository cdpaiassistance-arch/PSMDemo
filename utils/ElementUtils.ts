import {Page,Locator,FrameLocator, TestInfo} from '@playwright/test';

import fs from 'fs';
import path from 'path';

//#########################################################
//Ctrl + Shift + O to get list of all methods in the class 
//#########################################################

//Locator which can accept string and PW semantic locators
type flexiableLocator = string | Locator;

export class ElementUtil{

//Private variables at class level 
private page:Page;
private defaultTimeOut:number=30000;
private testInfo:TestInfo|undefined;

//Create a constructor
//if we don't pass the timeout it will pick 20,000
constructor(page:Page,timeOut:number=10000,testInfo?:TestInfo) {
    this.page=page;
    this.defaultTimeOut=timeOut;
    this.testInfo=testInfo;
}

/**
 * This method converts string to locator else it will return the semantic locators
 * @param locator 
 * @returns 
 */
private getLocator(locator:flexiableLocator,index?:number):Locator{
    if (typeof locator === 'string') {
        if(index !== undefined) {
           return  this.page.locator(locator).nth(index);
        } else {
            return  this.page.locator(locator);
        }
          
    } else {
         if(index !== undefined) {
            return locator.nth(index);
         } else {
           return locator;
         }

    }
    
}

/**
 * Return the Locator 
 * @param locator 
 * @returns 
 */
  doGetEleLocator(locator:flexiableLocator):Locator {
       return this.getLocator(locator);
}

/**
 * Clicks the element and accepts optional parameters 
 * @param locator 
 * @param options 
 */
async doclick(locator:flexiableLocator,options?: {index?:number,force?: boolean,timeout?: number}):Promise<void> {
    await this.getLocator(locator,options?.index).click({
    force:options?.force,
    timeout:options?.timeout||this.defaultTimeOut});
    console.log(`Clicked on element : ${locator}`);
}

/**
 * Clicks element with optional nth , force , timeout values
 * @param locator 
 * @param options 
 */
async doclicknth(locator: string,options?: { nth?: number; force?: boolean; timeout?: number }): Promise<void> {
  const element = options?.nth !== undefined 
    ? this.getLocator(locator).nth(options.nth): this.getLocator(locator);
  await element.click({
    force: options?.force,
    timeout: options?.timeout || this.defaultTimeOut
  });

  console.log(`Clicked on element: ${locator}${options?.nth !== undefined ? ` [nth=${options.nth}]` : ''}`);
}

/**
 * Mouse hover on an element
 * @param locator 
 */
async doHover(locator:flexiableLocator) {
    await this.getLocator(locator).hover({force:true,timeout:this.defaultTimeOut});
}

/**
 * Get Element Count
 * @param locator 
 * @returns 
 */
async doGetEleCount(locator:flexiableLocator):Promise<number> {
    return await this.getLocator(locator).count();
}

/**
 * Fills text into an input field
 * @param locator 
 * @param text 
 */
async dofill(locator:flexiableLocator,text:string):Promise<void> {
    await this.getLocator(locator).fill(text,{timeout:this.defaultTimeOut});
    console.log(`Filled text :${text} in to element:${locator}`);
}

/**
 * Input values Sequentually
 * @param locator 
 * @param text 
 */
async doInputSequentially(locator:flexiableLocator,text:string):Promise<void> {
    await this.getLocator(locator).pressSequentially(text,{delay:500});
}

/**
 * Input values by keyboard type
 * @param text 
 */
async doInputByKeypress(text:string):Promise<void> {
    await this.page.keyboard.type(text,{delay:300});
}

/**
 * Do Key Tab 
 */
async dokeyTab():Promise<void> {
    await this.page.keyboard.press('Tab');
}

/**
 * Do Key Space
 */
async doKeySpace():Promise<void> {
    await this.page.keyboard.press('Space');
}

async doKeyEnter():Promise<void> {
    await this.page.keyboard.press('Enter');
}

/**
 * Double clicks on element
 * Default nth index is 0 if not specified
 * @param locator 
 */
async dodbclick(locator:flexiableLocator,nthindex:number=0) {
    await this.getLocator(locator).nth(nthindex).dblclick({timeout:this.defaultTimeOut});
    console.log(`Double Clicked on element:${locator}`);
}

/**
 * Right Click on element
 * @param locator 
 */
async dorightclick(locator:flexiableLocator) {
    await this.getLocator(locator).click({button:'right',timeout:this.defaultTimeOut});
    console.log(`Right clicked on element:${locator}`);
}

/**
 * Clears the text from input element
 * @param locator 
 */
async docleartext(locator:flexiableLocator):Promise<void> {
    await this.getLocator(locator).clear({timeout:this.defaultTimeOut});
    console.log(`The text is cleared from input element:${locator}`);
}

/**
 * Get text(Including Hiddentext)
 * @param locator 
 */
async dogettext(locator:flexiableLocator,timeOut:number=5000): Promise<string | null> {
    const text= await this.getLocator(locator).textContent({timeout:timeOut});
    if (text !== null) {
        console.log(`Get text including hiddentext from element:${locator}`);
        return text.trim();
    } else {
        console.log(`No text returns null for element :${locator}`);
        return null;
    }
    
}

/**
 * Get Inner text (Visible text only)
 * @param locator 
 * @returns 
 */
async dogetinnertext(locator:flexiableLocator): Promise<string | null> {
      const text= await this.getLocator(locator).innerText({timeout:this.defaultTimeOut});
    if (text !== null) {
        console.log(`Get visible text from element:${locator}`);
        return text.trim();
    } else {
        console.log(`No visible text returns null for element :${locator}`);
        return null;
    }
}

/**
 * Get the Attribute value for selected Attribute
 * @param locator 
 * @param attributename 
 * @returns 
 */
async dogetattribute(locator:flexiableLocator,attributename:string):Promise<string | null> {
    console.log(`Get attribute value for attribute :${attributename}`);
    return await this.getLocator(locator).getAttribute(attributename);
}

/**
 * The Input value for Input element
 * @param locator 
 * @param options 
 * @returns 
 */
async dogetinputvalue(locator:flexiableLocator,options?: { timeout?: number; }):Promise<string> {
    console.log(`Get the Input value for element:${locator}`);
    return await this.getLocator(locator).inputValue({timeout:options?.timeout || this.defaultTimeOut});
}

/**
 * Get all text visible/hidden  content from multiple elements
 * @param locator 
 * @returns 
 */
async dogetalltextcontents(locator:flexiableLocator):Promise<string[]> {
    return await this.getLocator(locator).allTextContents();
}

/**
 * Get all text visible content from multiple elements
 * @param locator 
 * @returns 
 */
async dogetallinnertexts(locator:flexiableLocator):Promise<string[]> {
    return await this.getLocator(locator).allInnerTexts();
}

/**
 * Click on matching text from the list of strings
 * @param locator 
 * @param expectedtext 
 */
async doclickfromlist(locator:flexiableLocator,expectedtext:string):Promise<void> {
   const textlist:string[]= await this.getLocator(locator).allInnerTexts();
   for (const i of textlist){
    if (i.trim()==expectedtext.trim()){
        await this.page.getByText(i).click();
        break;
    }
   }
}

/**
 * Get the list of all locators
 * @param locator 
 * @returns 
 */
async doGetListOfLocators(locator:flexiableLocator):Promise<Locator[]> {
    return await this.getLocator(locator).all();
}

/**
 * Click on element from the list of locators
 * @param locator 
 * @param expectedtext 
 */
async doClickFromListOfLocators(locator:flexiableLocator,expectedtext:string):Promise<void> {
  const locatorlist:Locator[]= await this.getLocator(locator).all();
  for (const i of locatorlist) {
    if(await this.dogetinnertext(i)===expectedtext.trim()){
        await this.doclick(i);
        break;
    }
  }
}

/**
 * Drags the source element to target
 * @param locator 
 * @param targetlocator 
 * @param timeOut 
 */
async doDragAndDrop(locator:flexiableLocator,targetlocator:Locator,timeOut:number=5000):Promise<void> {
    await this.getLocator(locator).dragTo(targetlocator,{timeout:timeOut});
    console.log(`Drags source locator ${locator} to target:${targetlocator}`);
}


/**
 * Get the Framelocator
 * @param locator 
 * @param framelocator 
 * @returns 
 */
async doGetiframe(framelocator: string):Promise<FrameLocator> {
   return this.page.frameLocator(framelocator);
}

/**
 * Scroll to the element
 * @param locator 
 * @param timeOut 
 */
async doScollIntoView(locator:flexiableLocator,timeOut:number=5000):Promise<void> {
    await this.getLocator(locator).scrollIntoViewIfNeeded({timeout:timeOut});
}

/**
 * Full Page Screenshot (Screenshots saved in Screenshot folder)
 * @param screenshotfilename 
 */
async doGetFullPageScreenshot(screenshotfilename:string) {
    await this.page.screenshot({path:`./screenshots/${screenshotfilename}.png`,fullPage:true});
}

/**
 * Uploads Single file
 * @param locator 
 * @param filepath 
 */
async doUploadFile(locator:flexiableLocator,filepath:string):Promise<void> {
    await this.getLocator(locator).setInputFiles(filepath);
}

/**
 * Uploads multiple files
 * @param locator 
 * @param filepath 
 */
async doUploadFiles(locator:flexiableLocator,filepath1:string,filepath2:string):Promise<void> {
    await this.getLocator(locator).setInputFiles([filepath1,filepath2]);
}

/**
 * Handle JS popups
 */
async doHandleJSAlerts() {
    this.page.on('dialog',async dialog=>{
    console.log(dialog.message());
    await dialog.accept();
    console.log(dialog.type);

    });
}

/**
* Validate the document upload successfully 
* @returns 
*/
async verifyuploadeddocument(locator:flexiableLocator): Promise<string> {
        const [pdfDownload] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.getLocator(locator).click(),
            await this.WaitForSleep(2000)
        ]);
        await pdfDownload.waitForLoadState('load');
        const pdfUrl = pdfDownload.url();
        console.log('PDF URL:', pdfUrl);
        await pdfDownload.close();
        return pdfUrl;
    
    }

/**
 * Get the list of all CSS Attributes of an element
 * @param locator 
 * @returns 
 */
async doGetCSSProperties(locator:flexiableLocator):Promise<CSSStyleDeclaration> {
   return await this.getLocator(locator).evaluate(ele=>getComputedStyle(ele));
}

//########################## Element Visibility & State Check ###################//

/**
 * Check the element is Hidden
 * true → The element exists in the DOM but is not visible (e.g. display:none, visibility:hidden, or opacity:0 with no clickability).
   false → The element is visible or doesn’t exist
}
 * @param locator 
 * @returns 
 */
async doelementhidden(locator:flexiableLocator):Promise<boolean> {
   return await this.getLocator(locator).isHidden({timeout:this.defaultTimeOut});
}

/**
 * Check the element is isEnabled
 * @param locator 
 * @returns 
 */
async doelementisenabled(locator:flexiableLocator):Promise<boolean> {
   return await this.getLocator(locator).isEnabled({timeout:this.defaultTimeOut});
}

/**
 * Check the element is Disabled
 * @param locator 
 * @returns 
 */

async doelementisdisabled(locator:flexiableLocator):Promise<boolean> {
   return await this.getLocator(locator).isDisabled({timeout:this.defaultTimeOut});
}

/**
 * Check the element is checked
 * @param locator 
 * @returns 
 */

async doelementischecked(locator:flexiableLocator):Promise<boolean> {
   return await this.getLocator(locator).isChecked({timeout:this.defaultTimeOut});
}

/**
 * Check the element is editable
 * @param locator 
 * @returns 
 */
async doelementiseditable(locator:flexiableLocator):Promise<boolean> {
   return await this.getLocator(locator).isEditable({timeout:this.defaultTimeOut});
}

//##########################Select Based Dropdowns#############################

/**
 * Select by visible text
 * @param locator 
 * @param selecttext 
 */
async doSelectByText(locator:flexiableLocator,selecttext:string) {
    await this.getLocator(locator).selectOption({label:selecttext},{timeout:this.defaultTimeOut});
    console.log(`Selected ${selecttext} from dropdown ${locator}`);
}


/**
 * Select by value text
 * @param locator 
 * @param valuetext 
 */
async doSelectByValue(locator:flexiableLocator,valuetext:string) {
    await this.getLocator(locator).selectOption(valuetext,{timeout:this.defaultTimeOut});
    console.log(`Selected ${valuetext} from dropdown ${locator}`); 
}

/**
 * Select by index
 * @param locator 
 * @param index 
 */
async doSelectByIndex(locator:flexiableLocator,index:number) {
    await this.getLocator(locator).selectOption({index:index},{timeout:this.defaultTimeOut});
     console.log(`Selected index : ${index} from dropdown ${locator}`); 
}

/**
 * Select multiple options from dropdown
 * @param locator 
 * @param item1 
 * @param item2 
 * @param item3 
 */
async doSelectMultipleByText(locator:flexiableLocator,item1:string,item2:string,item3:string) {
    await this.getLocator(locator).selectOption([item1,item2,item3]);
    console.log(`Selected items : ${item1},${item2},${item3} from dropdown ${locator}`); 
}

//##################### Waits Utilities ########################

/**
 * Wait for element visible
 * @param locator 
 * @param timeOut 
 * @returns 
 */
async waitForElementVisible(locator:flexiableLocator,timeOut:number=4000):Promise<boolean> {
   return await this.getLocator(locator).isVisible({timeout:timeOut});
}


/**
 * Waited for element state is visible.
 * @param locator 
 * @param timeOut 
 * @returns when element specified by locator satisfies the state option. 
 */
async waitForElementVisibleState(locator:flexiableLocator,timeOut:number=20000) {
    try {
       await this.getLocator(locator).waitFor({state:'visible',timeout:timeOut});
       console.log('Waited for the element to be visible');
       return true;
    } catch{
        console.log('Element Not visible');
        return false;
    }
    
}

/**
 * Wait for element with specific text to be visible
 * @param locator 
 * @param expectedtext 
 * @param timeOut 
 * @returns 
 */

async waitForVisibilityOfFilteredElement(locator:flexiableLocator,expectedtext:string | RegExp):Promise<boolean> {
    try {
         await this.getLocator(locator).filter({ hasText:expectedtext}).waitFor({ state: 'visible', timeout: 20000 });
        console.log(`Waited for the filtered element with text '${expectedtext}' to be visible`);
        return true;
    } catch {
        console.log(`Element with text '${expectedtext}' not visible`);
        return false;
    }
}


/**
 * Waited for element state is Attached.
 * @param locator 
 * @param timeOut 
 * @returns when element specified by locator satisfies the state option. 
 */
async waitForElementAttachedState(locator:flexiableLocator,timeOut:number=10000) {
    try {
       await this.getLocator(locator).waitFor({state:'attached',timeout:timeOut});
       console.log('Waited for the element to be attached to DOM');
       return true;
    } catch{
        console.log('Element Not Attached to DOM');
        return false;
    }
    
}

/**
 * Waited for element state is Hidden.
 * @param locator 
 * @param timeOut 
 * @returns when element specified by locator satisfies the state option. 
 */
async waitForElementHiddenState(locator:flexiableLocator,timeOut:number=20000) {
    try {
       await this.getLocator(locator).waitFor({state:'hidden',timeout:timeOut});
       console.log('Waited for the element to be Hidden in DOM');
       return true;
    } catch{
        console.log('Element Not Hidden to DOM');
        return false;
    }
    
}

/**
 * Wait for loader to disapper
 * @param locator 
 * @param timeout 
 */

async waitforLoader(locator:flexiableLocator) {
    if (await this.getLocator(locator).isVisible({timeout:2000}).catch(() => false)) {
        await this.getLocator(locator).waitFor({state:'hidden',timeout:30000});
    }
}

/**
 * Waited for element state is Detached.
 * @param locator 
 * @param timeOut 
 * @returns when element specified by locator satisfies the state option. 
 */
async waitForElementDetachedState(locator:flexiableLocator,timeOut:number=20000) {
    try {
       await this.getLocator(locator).waitFor({state:'detached',timeout:timeOut});
       console.log('Waited for the element to be Detached in DOM');
       return true;
    } catch{
        console.log('Element Not Detached in DOM');
        return false;
    }
    
}

/**
 * Wait for page loadstate
 * @param state 
 * @returns 
 */
async WaitForPageLoad(state:'load'|'domcontentloaded'|'networkidle'='load'):Promise<void> {
  return await this.page.waitForLoadState(state,{timeout:50000});
}

/**
 * Wait for Page specific timeout (static)
 * @param timeoutms 
 */
async WaitForSleep(timeoutms:number):Promise<void> {
    await this.page.waitForTimeout(timeoutms);
}

/**
 * Returns a clean, unique path for a download.
 */

async getDownloadPath(filename: string): Promise<string> {
  const downloadsDir = path.resolve(process.cwd(), 'downloads');

  // Clean/create folder if it doesn't exist
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // Make filename unique per test
  const uniqueName = `${this.testInfo?.title?.replace(/\s+/g, '_') || 'test'}-${Date.now()}-${filename}`;
  return path.join(downloadsDir, uniqueName);
}


}