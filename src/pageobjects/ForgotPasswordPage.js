import BasePage from './BasePage.js';
import { sel, byTestTag } from '../utils/selector.js';

/** Step 1 of password recovery: request an OTP for a registered mobile number. */
class ForgotPasswordPage extends BasePage {
    get screenIdentifier() {
        return this.title;
    }

    get title() {
        return $(sel({ android: byTestTag('ComposeHost_ResetPassword_title'), ios: '~forgot_password_title' }));
    }

    get mobileNumberInput() {
        return $(sel({ android: byTestTag('text_field_contact_to_reset'), ios: '~forgot_password_mobile_input' }));
    }

    get submitButton() {
        return $(sel({ android: byTestTag('btn_reset'), ios: '~forgot_password_submit_button' }));
    }

    get backButton() {
        return $(sel({ android: byTestTag('back_btn'), ios: '~forgot_password_back_button' }));
    }

    /** Inline validation error under the field (empty or badly formatted mobile/email). */
    get errorMessage() {
        return $(
            sel({
                android: 'android=new UiSelector().textContains("valid email or mobile number")',
                ios: '~forgot_password_error',
            })
        );
    }

    /**
     * "Account recovery" prompt (CONTINUE / CANCEL). Android shows this instead of an error
     * when a well-formed number has no account.
     */
    get accountRecoveryPrompt() {
        return $(
            sel({
                android: byTestTag('ComposeHost_WelcomeScreen_userEmail_btn_continue'),
                ios: '~account_recovery_continue_button',
            })
        );
    }

    get accountRecoveryCancelButton() {
        return $(
            sel({
                android: byTestTag('ComposeHost_WelcomeScreen_userEmail_btn_cancel'),
                ios: '~account_recovery_cancel_button',
            })
        );
    }

    async enterMobileNumber(mobileNumber) {
        await this.type(this.mobileNumberInput, mobileNumber);
    }

    async submit() {
        await this.tap(this.submitButton);
    }

    async requestReset(mobileNumber) {
        await this.enterMobileNumber(mobileNumber);
        await this.submit();
    }

    async getErrorMessage() {
        return this.getText(this.errorMessage);
    }

    async isSubmitEnabled() {
        return this.isEnabled(this.submitButton);
    }

    /**
     * Tap the on-screen back arrow. Hardware back is not used: the field auto-focuses,
     * so the first back press only closes the keyboard.
     */
    async backToLogin() {
        await this.hideKeyboard();
        await this.tap(this.backButton);
    }
}

export default new ForgotPasswordPage();
