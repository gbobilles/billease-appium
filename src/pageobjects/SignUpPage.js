import BasePage from './BasePage.js';
import WelcomePage from './WelcomePage.js';
import LoginPage from './LoginPage.js';
import { sel, byTestTag } from '../utils/selector.js';

/** Android UiSelector matching a TextView by visible text (regex). Compose error texts have no ids. */
const textMatching = (regex) => `android=new UiSelector().textMatches("${regex}")`;

/**
 * Sign-up form.
 *
 * Android ("Let's get started") only asks for Mobile, Email and a consent checkbox; the password
 * is set later in the flow. Fields a platform does not have return `null` (see `optional`), and
 * fillForm() skips them, so the same test data works on every build.
 */
class SignUpPage extends BasePage {
    /** Element for the current platform, or null when this platform's form has no such field. */
    optional(selectors) {
        const value = driver.isAndroid ? selectors.android : selectors.ios;
        return value ? $(value) : null;
    }

    // ---------- Locators ----------
    get screenIdentifier() {
        return this.mobileNumberInput;
    }

    get firstNameInput() {
        return this.optional({ ios: '~signup_first_name_input' });
    }

    get lastNameInput() {
        return this.optional({ ios: '~signup_last_name_input' });
    }

    get emailInput() {
        return $(sel({ android: byTestTag('signup_email_text'), ios: '~signup_email_input' }));
    }

    get mobileNumberInput() {
        return $(sel({ android: byTestTag('sign_up_mobile_text'), ios: '~signup_mobile_input' }));
    }

    get passwordInput() {
        return this.optional({ ios: '~signup_password_input' });
    }

    get confirmPasswordInput() {
        return this.optional({ ios: '~signup_confirm_password_input' });
    }

    get termsCheckbox() {
        return $(sel({ android: byTestTag('checkBox'), ios: '~signup_terms_checkbox' }));
    }

    get signUpButton() {
        return $(sel({ android: byTestTag('sign_up'), ios: '~signup_submit_button' }));
    }

    get backButton() {
        return $(sel({ android: byTestTag('back_btn'), ios: '~signup_back_button' }));
    }

    /** Direct "Log in" link. Android has none: goToLogin() goes back to the entry screen instead. */
    get loginLink() {
        return this.optional({ ios: '~signup_login_link' });
    }

    get mobileNumberFieldError() {
        return $(sel({ android: textMatching('Please enter mobile number|Invalid number'), ios: '~signup_mobile_error' }));
    }

    get emailFieldError() {
        return $(sel({ android: textMatching('Please enter email|Invalid email address'), ios: '~signup_email_error' }));
    }

    get passwordFieldError() {
        return this.optional({ ios: '~signup_password_error' });
    }

    get confirmPasswordFieldError() {
        return this.optional({ ios: '~signup_confirm_password_error' });
    }

    get termsError() {
        return $(sel({ android: textMatching('Please tick checkbox.*'), ios: '~signup_terms_error' }));
    }

    /** Form-level error: the unticked-consent message, or a server error such as "already registered". */
    get errorMessage() {
        return $(
            sel({
                android: textMatching('(?i).*(tick checkbox|already|registered|exist).*'),
                ios: '~signup_error',
            })
        );
    }

    /** True when this platform's sign-up form asks for a password. */
    hasPasswordFields() {
        return this.passwordInput !== null;
    }

    // ---------- Actions ----------

    /** Navigate to sign up from a fresh launch (welcome screen, or the login screen link). */
    async open() {
        if (await this.isScreenDisplayed(3000)) return this;
        if (await WelcomePage.isScreenDisplayed(5000)) {
            await WelcomePage.goToSignUp();
        } else {
            await LoginPage.waitForScreen();
            await LoginPage.goToSignUp();
        }
        return this.waitForScreen();
    }

    /**
     * Fill any subset of the form. Only keys that are present in `data` AND exist on this
     * platform's form are typed, so the same method covers happy-path and validation tests.
     * @param {{firstName?, lastName?, email?, mobileNumber?, password?, confirmPassword?, acceptTerms?}} data
     */
    async fillForm(data) {
        const fields = [
            ['firstName', this.firstNameInput],
            ['lastName', this.lastNameInput],
            ['mobileNumber', this.mobileNumberInput],
            ['email', this.emailInput],
            ['password', this.passwordInput],
            ['confirmPassword', this.confirmPasswordInput],
        ];
        for (const [key, element] of fields) {
            if (data[key] === undefined || element === null) continue;
            if (!(await this.isDisplayed(element, 1000))) {
                await this.scrollTo(() => element);
            }
            await this.type(element, data[key]);
        }
        if (data.acceptTerms) {
            await this.scrollTo(() => this.termsCheckbox);
            await this.tap(this.termsCheckbox);
        }
    }

    async submit() {
        await this.scrollTo(() => this.signUpButton);
        await this.tap(this.signUpButton);
    }

    async signUp(data) {
        await this.fillForm(data);
        await this.submit();
    }

    async isSignUpButtonEnabled() {
        await this.scrollTo(() => this.signUpButton);
        return this.isEnabled(this.signUpButton);
    }

    async goToLogin() {
        const link = this.loginLink;
        if (link) {
            await this.scrollTo(() => link);
            await this.tap(link);
            return;
        }
        await this.goBack(this.backButton);
        await WelcomePage.goToLogin();
    }

    async getFieldError(field) {
        const map = {
            mobileNumber: this.mobileNumberFieldError,
            email: this.emailFieldError,
            password: this.passwordFieldError,
            confirmPassword: this.confirmPasswordFieldError,
        };
        return this.getText(map[field]);
    }
}

export default new SignUpPage();
