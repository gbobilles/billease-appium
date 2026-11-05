import BasePage from './BasePage.js';
import { sel } from '../utils/selector.js';

/** OTP verification screen shared by Sign Up and Forgot Password. */
class OtpPage extends BasePage {
    get screenIdentifier() {
        return this.otpInput;
    }

    /** Single OTP field. If your build uses one box per digit, use otpDigitInputs instead. */
    get otpInput() {
        return $(sel({ android: '~otp_input', ios: '~otp_input' }));
    }

    get otpDigitInputs() {
        return $$(
            sel({
                android: 'android=new UiSelector().className("android.widget.EditText")',
                ios: '-ios class chain:**/XCUIElementTypeTextField',
            })
        );
    }

    get verifyButton() {
        return $(sel({ android: '~otp_verify_button', ios: '~otp_verify_button' }));
    }

    get resendLink() {
        return $(sel({ android: '~otp_resend_link', ios: '~otp_resend_link' }));
    }

    get errorMessage() {
        return $(sel({ android: '~otp_error', ios: '~otp_error' }));
    }

    async enterOtp(otp) {
        if (await this.isDisplayed(this.otpInput, 3000)) {
            await this.type(this.otpInput, otp);
        } else {
            const boxes = await this.otpDigitInputs;
            for (let i = 0; i < String(otp).length && i < boxes.length; i++) {
                await boxes[i].setValue(String(otp)[i]);
            }
            await this.hideKeyboard();
        }
    }

    async verify(otp) {
        await this.enterOtp(otp);
        // Some builds auto-submit once all digits are in
        if (await this.isDisplayed(this.verifyButton, 2000)) {
            await this.tap(this.verifyButton);
        }
    }

    async getErrorMessage() {
        return this.getText(this.errorMessage);
    }
}

export default new OtpPage();
