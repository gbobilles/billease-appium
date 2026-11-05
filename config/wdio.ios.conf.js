import path from 'node:path';
import { config as shared } from './wdio.shared.conf.js';

const env = process.env;

const iosCaps = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': env.IOS_DEVICE_NAME || 'iPhone 15',
    'appium:platformVersion': env.IOS_PLATFORM_VERSION || '17.5',
    'appium:udid': env.IOS_UDID || undefined,
    'appium:bundleId': env.IOS_BUNDLE_ID,
    'appium:autoAcceptAlerts': true,
    'appium:noReset': env.NO_RESET === 'true',
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240,
    'appium:wdaLaunchTimeout': 120000,
    // Needed only for real devices
    'appium:xcodeOrgId': env.IOS_XCODE_ORG_ID || undefined,
    'appium:xcodeSigningId': env.IOS_XCODE_ORG_ID ? 'iPhone Developer' : undefined,
};

// Prefer installing from a .app/.ipa when one is supplied; otherwise launch the installed app.
if (env.IOS_APP_PATH) {
    iosCaps['appium:app'] = path.resolve(env.IOS_APP_PATH);
}

Object.keys(iosCaps).forEach((k) => iosCaps[k] === undefined && delete iosCaps[k]);

export const config = {
    ...shared,
    capabilities: [iosCaps],
};
