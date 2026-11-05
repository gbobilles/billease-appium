import Gestures from '../utils/gestures.js';

const DEFAULT_TIMEOUT = Number(process.env.WAIT_TIMEOUT || 20000);

/**
 * Parent of every page object. Holds the reusable, platform-safe interactions
 * so page classes only describe locators and user-level actions.
 */
export default class BasePage {
    /**
     * Element that proves this screen is shown. Each page must override it.
     * @returns {ChainablePromiseElement}
     */
    get screenIdentifier() {
        throw new Error(`${this.constructor.name} must define a screenIdentifier getter`);
    }

    /** Wait until the screen is visible. */
    async waitForScreen(timeout = DEFAULT_TIMEOUT) {
        await this.screenIdentifier.waitForDisplayed({
            timeout,
            timeoutMsg: `${this.constructor.name} was not displayed within ${timeout}ms`,
        });
        return this;
    }

    async isScreenDisplayed(timeout = 5000) {
        try {
            await this.screenIdentifier.waitForDisplayed({ timeout });
            return true;
        } catch {
            return false;
        }
    }

    async tap(element, timeout = DEFAULT_TIMEOUT) {
        await element.waitForDisplayed({ timeout });
        await element.click();
    }

    /** Clear then type. Hides the keyboard afterwards so it doesn't cover the next field. */
    async type(element, value, { hideKeyboard = true } = {}) {
        await element.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
        await element.click();
        await element.clearValue();
        if (value !== undefined && value !== null && value !== '') {
            await element.setValue(String(value));
        }
        if (hideKeyboard) await this.hideKeyboard();
    }

    async getText(element) {
        await element.waitForDisplayed({ timeout: DEFAULT_TIMEOUT });
        // iOS text fields expose their content in `value`, labels in `label`
        if (driver.isIOS) {
            return (await element.getAttribute('value')) || (await element.getAttribute('label')) || element.getText();
        }
        return element.getText();
    }

    async isDisplayed(element, timeout = 5000) {
        try {
            await element.waitForDisplayed({ timeout });
            return true;
        } catch {
            return false;
        }
    }

    async isEnabled(element) {
        await element.waitForExist({ timeout: DEFAULT_TIMEOUT });
        return element.isEnabled();
    }

    async hideKeyboard() {
        try {
            if (!(await driver.isKeyboardShown())) return;
            if (driver.isAndroid) {
                await driver.hideKeyboard();
            } else {
                // Presses the first matching dismiss key on the iOS keyboard
                await driver.execute('mobile: hideKeyboard', { keys: ['Done', 'done', 'Return', 'return'] });
            }
        } catch {
            // Keyboard already gone or not dismissible — safe to ignore
        }
    }

    /** Hardware back on Android, the screen's back button on iOS. */
    async goBack(iosBackButton) {
        if (driver.isAndroid) {
            await driver.back();
        } else if (iosBackButton) {
            await this.tap(iosBackButton);
        } else {
            await this.tap($('-ios class chain:**/XCUIElementTypeNavigationBar/XCUIElementTypeButton[1]'));
        }
    }

    async scrollTo(getElement, maxSwipes) {
        await Gestures.scrollUntilDisplayed(getElement, maxSwipes);
    }
}
