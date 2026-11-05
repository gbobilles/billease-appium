import path from 'node:path';
import { config as shared } from './wdio.shared.conf.js';

const env = process.env;

const androidCaps = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': env.ANDROID_PLATFORM_VERSION || undefined,
    'appium:udid': env.ANDROID_UDID || undefined,
    'appium:appPackage': env.ANDROID_APP_PACKAGE,
    'appium:appActivity': env.ANDROID_APP_ACTIVITY || undefined,
    'appium:appWaitActivity': '*',
    'appium:autoGrantPermissions': true,
    'appium:noReset': env.NO_RESET === 'true',
    'appium:fullReset': false,
    'appium:newCommandTimeout': 240,
    'appium:disableWindowAnimation': true,
};

// Prefer installing from an APK when one is supplied; otherwise launch the installed app.
if (env.ANDROID_APP_PATH) {
    androidCaps['appium:app'] = path.resolve(env.ANDROID_APP_PATH);
}

// Strip undefined values so Appium does not receive empty capabilities
Object.keys(androidCaps).forEach((k) => androidCaps[k] === undefined && delete androidCaps[k]);

export const config = {
    ...shared,
    capabilities: [androidCaps],
};
