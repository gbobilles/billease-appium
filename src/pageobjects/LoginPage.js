import BasePage from './BasePage.js';
import WelcomePage from './WelcomePage.js';
import { sel, byTestTag, byPredicate } from '../utils/selector.js';

class LoginPage extends BasePage {
    // ---------- Locators ----------
    get screenIdentifier() {
        return this.mobileNumberInput;
    }

    get mobileNumberInput() {
        return $(sel({ android: byTestTag('login_input_email_or_phone'), ios: '~login_mobile_input' }));
    }

    get passwordInput() {
        return $(sel({ android: byTestTag('login_input_password'), ios: '~login_password_input' }));
    }

    get showPasswordToggle() {
        return $(sel({ android: '~Show password', ios: '~login_password_toggle' }));
    }

    get loginButton() {
        return $(sel({ android: byTestTag('btn_log_in'), ios: '~login_submit_button' }));
    }

    get forgotPasswordLink() {
        return $(sel({ android: byTestTag('login_link_forgot_password'), ios: '~login_forgot_password_link' }));
    }

    get signUpLink() {
        return $(sel({ android: byTestTag('login_link_sign_up'), ios: '~login_signup_link' }));
    }

    /** Inline / toast / dialog error shown on failed login. */
    get errorMessage() {
        return $(
            sel({
                android: 'android=new UiSelector().textContains("correct username and password")',
                ios: byPredicate('name == "login_error_text" OR type == "XCUIElementTypeAlert"'),
            })
        );
    }

    get mobileNumberFieldError() {
        return $(sel({ android: 'android=new UiSelector().textMatches("This field is required|Invalid email or mobile")', ios: '~login_mobile_error' }));
    }

    get passwordFieldError() {
        return $(sel({ android: '~login_password_error', ios: '~login_password_error' }));
    }

    // ---------- Actions ----------

    /** Navigate to the login form from a fresh launch. */
    async open() {
        if (await this.isScreenDisplayed(3000)) return this;
        await WelcomePage.waitForScreen();
        await WelcomePage.goToLogin();
        return this.waitForScreen();
    }

    async enterMobileNumber(mobileNumber) {
        await this.type(this.mobileNumberInput, mobileNumber);
    }

    async enterPassword(password) {
        await this.type(this.passwordInput, password);
    }

    async submit() {
        await this.tap(this.loginButton);
    }

    /** Full login flow. */
    async login(mobileNumber, password) {
        await this.enterMobileNumber(mobileNumber);
        await this.enterPassword(password);
        await this.submit();
    }

    async togglePasswordVisibility() {
        await this.tap(this.showPasswordToggle);
    }

    async goToForgotPassword() {
        await this.tap(this.forgotPasswordLink);
    }

    async goToSignUp() {
        await this.tap(this.signUpLink);
    }

    async getErrorMessage() {
        return this.getText(this.errorMessage);
    }

    async isLoginButtonEnabled() {
        return this.isEnabled(this.loginButton);
    }
}

export default new LoginPage();
