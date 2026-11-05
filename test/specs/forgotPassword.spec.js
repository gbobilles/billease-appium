import { expect } from '@wdio/globals';
import { LoginPage, ForgotPasswordPage, OtpPage, ResetPasswordPage } from '../../src/pageobjects/index.js';
import {
    registeredUser,
    hasRegisteredUser,
    unregisteredMobileNumber,
    testOtp,
    invalid,
} from '../../src/data/testData.js';
import { resetApp } from '../../src/utils/app.js';

describe('Forgot Password', () => {
    beforeEach(async () => {
        await resetApp();
        await LoginPage.open();
        await LoginPage.goToForgotPassword();
        await ForgotPasswordPage.waitForScreen();
    });

    it('@regression should show an error for an unregistered mobile number', async () => {
        await ForgotPasswordPage.requestReset(unregisteredMobileNumber);

        // Android offers "Account recovery" for an unknown number; other builds may show an error
        const recoveryPrompt = await ForgotPasswordPage.isDisplayed(ForgotPasswordPage.accountRecoveryPrompt);
        const error = await ForgotPasswordPage.isDisplayed(ForgotPasswordPage.errorMessage, 1000);
        expect(recoveryPrompt || error).toBe(true);
        expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
    });

    it('@regression should not submit with an empty mobile number', async () => {
        if (await ForgotPasswordPage.isSubmitEnabled()) {
            await ForgotPasswordPage.submit();
            await expect(ForgotPasswordPage.errorMessage).toBeDisplayed();
        } else {
            expect(await ForgotPasswordPage.isSubmitEnabled()).toBe(false);
        }
        expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
    });

    for (const { label, value } of invalid.mobileNumbers) {
        it(`@regression should reject an invalid mobile number (${label})`, async () => {
            await ForgotPasswordPage.requestReset(value);

            await expect(ForgotPasswordPage.errorMessage).toBeDisplayed();
            expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
        });
    }

    it('@regression should reject mismatched new passwords', async function () {
        if (!hasRegisteredUser() || !testOtp) this.skip(); // needs a fixed staging OTP

        await ForgotPasswordPage.requestReset(registeredUser.mobileNumber);
        await OtpPage.waitForScreen();
        await OtpPage.verify(testOtp);
        await ResetPasswordPage.waitForScreen();
        await ResetPasswordPage.setNewPassword('NewPass@123', 'Different@123');

        await expect(ResetPasswordPage.errorMessage).toBeDisplayed();
    });

    it('@smoke should return to the login screen', async () => {
        await ForgotPasswordPage.backToLogin();

        await LoginPage.waitForScreen();
        await expect(LoginPage.mobileNumberInput).toBeDisplayed();
    });
});
