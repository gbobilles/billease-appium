/**
 * App lifecycle helpers — used to give every test a clean starting screen.
 */
export const appId = () => (driver.isAndroid ? process.env.ANDROID_APP_PACKAGE : process.env.IOS_BUNDLE_ID);

/** Kill and relaunch the app (keeps app data). */
export async function restartApp() {
    const id = appId();
    if (!id) {
        throw new Error('Set ANDROID_APP_PACKAGE / IOS_BUNDLE_ID in .env so the app can be restarted between tests');
    }
    await driver.terminateApp(id);
    await driver.activateApp(id);
}

/** Relaunch with app data cleared so the user is logged out. */
export async function resetApp() {
    const id = appId();
    if (driver.isAndroid) {
        await driver.execute('mobile: clearApp', { appId: id });
        await driver.activateApp(id);
    } else {
        // XCUITest cannot clear data without reinstalling; terminate + relaunch is the closest equivalent.
        // Log out through the UI in tests if a session persists on iOS.
        await restartApp();
    }
}
