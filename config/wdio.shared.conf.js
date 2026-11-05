import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const screenshotDir = path.resolve('reports/screenshots');

/**
 * Settings shared by the Android and iOS configs.
 * Platform configs spread this object and add their own `capabilities`.
 */
export const config = {
    runner: 'local',

    // Appium server (started automatically by @wdio/appium-service)
    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4723),
    path: '/',

    specs: ['../test/specs/**/*.spec.js'],
    exclude: [],

    // One device per run — mobile sessions should not share a device
    maxInstances: 1,

    logLevel: process.env.LOG_LEVEL || 'info',
    bail: 0,
    waitforTimeout: Number(process.env.WAIT_TIMEOUT || 20000),
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,

    services: [
        [
            'appium',
            {
                command: 'appium',
                args: {
                    address: process.env.APPIUM_HOST || '127.0.0.1',
                    port: Number(process.env.APPIUM_PORT || 4723),
                    relaxedSecurity: true,
                    log: './reports/appium.log',
                },
            },
        ],
    ],

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 180000,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'reports/allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],

    onPrepare() {
        fs.mkdirSync(screenshotDir, { recursive: true });
    },

    /** Capture a screenshot for every failed test (also attached to Allure). */
    async afterTest(test, _context, { passed }) {
        if (passed) return;
        const safeName = `${test.parent}-${test.title}`.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 120);
        const platform = driver.isAndroid ? 'android' : 'ios';
        await driver.saveScreenshot(path.join(screenshotDir, `${platform}_${safeName}_${Date.now()}.png`));
    },
};
