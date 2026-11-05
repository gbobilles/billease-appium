import BasePage from './BasePage.js';
import { sel, byTestTag } from '../utils/selector.js';

/**
 * Logged-out entry flow. On Android a fresh launch shows:
 *   1. Splash carousel with "Get started" (btn_continue)
 *   2. Loan calculator with "Log in" (btn_log_in) / "Sign up" (sign_up)
 * If your build opens straight on the login form, LoginPage.open() handles that.
 */
class WelcomePage extends BasePage {
    /** Either step of the entry flow counts as the welcome screen. */
    get screenIdentifier() {
        return $(sel({ android: byTestTag('btn_continue|sign_up'), ios: '~welcome_login_button' }));
    }

    get getStartedButton() {
        return $(sel({ android: byTestTag('btn_continue'), ios: '~welcome_get_started_button' }));
    }

    get loginButton() {
        return $(sel({ android: byTestTag('btn_log_in'), ios: '~welcome_login_button' }));
    }

    get signUpButton() {
        return $(sel({ android: byTestTag('sign_up'), ios: '~welcome_signup_button' }));
    }

    /** Tap "Get started" if the splash carousel is showing. */
    async skipIntro() {
        if (await this.isDisplayed(this.getStartedButton, 2000)) {
            await this.tap(this.getStartedButton);
        }
    }

    async goToLogin() {
        await this.skipIntro();
        await this.tap(this.loginButton);
    }

    async goToSignUp() {
        await this.skipIntro();
        await this.tap(this.signUpButton);
    }
}

export default new WelcomePage();
