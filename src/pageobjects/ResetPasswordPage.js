import BasePage from './BasePage.js';
import { sel } from '../utils/selector.js';

/** Step 3 of password recovery: set a new password after OTP verification. */
class ResetPasswordPage extends BasePage {
    get screenIdentifier() {
        return this.newPasswordInput;
    }

    get newPasswordInput() {
        return $(sel({ android: '~reset_new_password_input', ios: '~reset_new_password_input' }));
    }

    get confirmPasswordInput() {
        return $(sel({ android: '~reset_confirm_password_input', ios: '~reset_confirm_password_input' }));
    }

    get submitButton() {
        return $(sel({ android: '~reset_submit_button', ios: '~reset_submit_button' }));
    }

    get errorMessage() {
        return $(sel({ android: '~reset_password_error', ios: '~reset_password_error' }));
    }

    get successMessage() {
        return $(sel({ android: '~reset_password_success', ios: '~reset_password_success' }));
    }

    async setNewPassword(password, confirmPassword = password) {
        await this.type(this.newPasswordInput, password);
        await this.type(this.confirmPasswordInput, confirmPassword);
        await this.tap(this.submitButton);
    }

    async getErrorMessage() {
        return this.getText(this.errorMessage);
    }
}

export default new ResetPasswordPage();
