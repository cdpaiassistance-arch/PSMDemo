import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],
    ['playwright-html-reporter',{
      testFolder: 'tests',
      title: 'PSM Playwright HTML Report',
      project: 'PSM Prepare and Submit',
      release: '10.0.0',
      testEnvironment: 'DEV',
      embedAssets: true,
      embedAttachments: true,
      outputFolder: 'playwright-html-report',
      minifyAssets: true,
      startServer: process.env.CI ? false : false, //if local run server for html report, if CI, do not start server and just generate the report files
    }]
  ],

  timeout:90000,
  expect:{
    timeout: 18000
  },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    headless:!!process.env.CI, //If local, run headed, if CI, run headless
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    acceptDownloads: true,
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    navigationTimeout: 40000,
    actionTimeout: 20000
  },

  metadata: {
    appUserid: 'Admin',
    appPassword: 'admin123'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use:{
        channel: 'chrome',
        viewport: process.env.CI? {width: 1920, height: 1080} : null,  //if execution in GIT viewport will be fill screen if local no viewport
        launchOptions: {
          args: ['--start-maximized'],
          ignoreDefaultArgs: ['--window-size=1280,720']
        }
      }
    },

    // {
    //   name: 'Microsoft Edge',
    //   use:{
    //     channel: 'msedge',
    //     viewport: process.env.CI? {width: 1920, height: 1080} : null,  //if execution in GIT viewport will be fill screen if local no viewport
    //     launchOptions: {
    //       args: ['--start-maximized'],
    //       ignoreDefaultArgs: ['--window-size=1280,720']
    //     }
    //   }

    // },
    // {
    //   name: 'Chromium',
    //   use:{
    //     browserName: 'chromium',
    //     viewport: {width: 1920, height: 1080},  
    //     launchOptions: {
    //       args: [],
    //       ignoreDefaultArgs: ['--window-size=1280,720']
    //     }
    //   }
    // },

    // {
    //   name: 'Firefox',
    //   use:{
    //     browserName: 'firefox',
    //     viewport: {width: 1920, height: 1080},  
    //     launchOptions: {
    //       args: [],
    //       ignoreDefaultArgs: ['--window-size=1280,720']
    //     }
    //   }
    // },

    // {
    //   name: 'Webkit',
    //   use:{
    //     browserName: 'webkit',
    //     viewport: {width: 1920, height: 1080},  
    //     launchOptions: {
    //       args: [],
    //       ignoreDefaultArgs: ['--window-size=1280,720']
    //     }
    //   }
    // },
  ],

});
