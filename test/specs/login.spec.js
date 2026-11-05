import { expect } from '@wdio/globals';
import { LoginPage, HomePage, ForgotPasswordPage, SignUpPage } from '../../src/pageobjects/index.js';
import { registeredUser, hasRegisteredUser, unregisteredMobileNumber, invalid } from '../../src/data/testData.js';
import { resetApp } from '../../src/utils/app.js';

describe('Login', () => {
    beforeEach(async () => {
        await resetApp();
        await LoginPage.open();
    });

    it('@smoke should log in with a valid mobile number and password', async function () {
        if (!hasRegisteredUser()) this.skip(); // set TEST_MOBILE_NUMBER / TEST_PASSWORD in .env

        await LoginPage.login(registeredUser.mobileNumber, registeredUser.password);

        await HomePage.waitForScreen();
        await expect(HomePage.dashboard).toBeDisplayed();
    });

    it('@regression should show an error for a wrong password', async function () {
        if (!hasRegisteredUser()) this.skip();

        await LoginPage.login(registeredUser.mobileNumber, invalid.wrongPassword);

        await expect(LoginPage.errorMessage).toBeDisplayed();
        await expect(HomePage.dashboard).not.toBeDisplayed();
    });

    it('@regression should show an error for an unregistered mobile number', async () => {
        await LoginPage.login(unregisteredMobileNumber, invalid.wrongPassword);

        await expect(LoginPage.errorMessage).toBeDisplayed();
        await expect(HomePage.dashboard).not.toBeDisplayed();
    });

    it('@regression should not allow login with empty fields', async () => {
        const enabled = await LoginPage.isLoginButtonEnabled();
        if (enabled) {
            // Some builds keep the button enabled and validate on tap instead
            await LoginPage.submit();
            await expect(LoginPage.mobileNumberFieldError).toBeDisplayed();
        } else {
            expect(enabled).toBe(false);
        }
        await expect(LoginPage.mobileNumberInput).toBeDisplayed();
    });

    for (const { label, value } of invalid.mobileNumbers) {
        it(`@regression should reject an invalid mobile number (${label})`, async () => {
            await LoginPage.login(value, invalid.wrongPassword);

            const fieldError = await LoginPage.isDisplayed(LoginPage.mobileNumberFieldError);
            const generalError = await LoginPage.isDisplayed(LoginPage.errorMessage);
            expect(fieldError || generalError).toBe(true);
            await expect(HomePage.dashboard).not.toBeDisplayed();
        });
    }

    it('@regression should mask the password and reveal it with the toggle', async () => {
        await LoginPage.enterPassword(invalid.wrongPassword);
        // Check the field's text, not the `password` attribute: Compose keeps password="true"
        // even when revealed. Masked fields expose bullets/asterisks instead of the real value.
        expect(await LoginPage.getText(LoginPage.passwordInput)).not.toBe(invalid.wrongPassword);
        await LoginPage.togglePasswordVisibility();
        expect(await LoginPage.getText(LoginPage.passwordInput)).toBe(invalid.wrongPassword);
    });

    it('@smoke should open Forgot Password from the login screen', async () => {
        await LoginPage.goToForgotPassword();
        await ForgotPasswordPage.waitForScreen();
        await expect(ForgotPasswordPage.mobileNumberInput).toBeDisplayed();
    });

    it('@smoke should open Sign Up from the login screen', async () => {
        await LoginPage.goToSignUp();
        await SignUpPage.waitForScreen();
        await expect(SignUpPage.mobileNumberInput).toBeDisplayed();
    });
});
