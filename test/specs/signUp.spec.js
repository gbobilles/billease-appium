import { expect } from '@wdio/globals';
import { SignUpPage, OtpPage, LoginPage } from '../../src/pageobjects/index.js';
import {
    registeredUser,
    hasRegisteredUser,
    hasSignUpNumber,
    newUser,
    testOtp,
    invalid,
} from '../../src/data/testData.js';
import { resetApp } from '../../src/utils/app.js';

describe('Sign Up', () => {
    beforeEach(async () => {
        await resetApp();
        await SignUpPage.open();
    });


    it('@regression should not allow submitting an empty form', async () => {
        if (await SignUpPage.isSignUpButtonEnabled()) {
            await SignUpPage.submit();
            await expect(SignUpPage.mobileNumberFieldError).toBeDisplayed();
        } else {
            expect(await SignUpPage.isSignUpButtonEnabled()).toBe(false);
        }
        expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
    });

    for (const { label, value } of invalid.mobileNumbers) {
        it(`@regression should reject an invalid mobile number (${label})`, async () => {
            // Consent left unticked so a number that slips past validation can never trigger a real SMS
            await SignUpPage.signUp({ ...newUser(), mobileNumber: value, acceptTerms: false });

            await expect(SignUpPage.mobileNumberFieldError).toBeDisplayed();
            expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
        });
    }

    for (const { label, value } of invalid.emails) {
        it(`@regression should reject an invalid email (${label})`, async () => {
            await SignUpPage.signUp({ ...newUser(), email: value, acceptTerms: false });

            await expect(SignUpPage.emailFieldError).toBeDisplayed();
            expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
        });
    }

    it('@regression should reject a weak password', async function () {
        if (!SignUpPage.hasPasswordFields()) this.skip(); // Android sets the password after OTP

        await SignUpPage.signUp({ ...newUser(), password: invalid.weakPassword, confirmPassword: invalid.weakPassword });

        await expect(SignUpPage.passwordFieldError).toBeDisplayed();
    });

    it('@regression should reject mismatched passwords', async function () {
        if (!SignUpPage.hasPasswordFields()) this.skip(); // Android sets the password after OTP

        await SignUpPage.signUp({ ...newUser(), confirmPassword: 'Mismatch@999' });

        await expect(SignUpPage.confirmPasswordFieldError).toBeDisplayed();
    });

    it('@regression should require accepting the terms and conditions', async () => {
        await SignUpPage.fillForm({ ...newUser(), acceptTerms: false });

        if (await SignUpPage.isSignUpButtonEnabled()) {
            await SignUpPage.submit();
            await expect(SignUpPage.termsError).toBeDisplayed();
        }
        expect(await OtpPage.isScreenDisplayed(3000)).toBe(false);
    });

    it('@regression should block an already-registered mobile number', async function () {
        if (!hasRegisteredUser()) this.skip();

        await SignUpPage.signUp({ ...newUser(), mobileNumber: registeredUser.mobileNumber });

        const fieldError = await SignUpPage.isDisplayed(SignUpPage.mobileNumberFieldError);
        const generalError = await SignUpPage.isDisplayed(SignUpPage.errorMessage);
        expect(fieldError || generalError).toBe(true);
    });

    it('@smoke should navigate back to Login', async () => {
        await SignUpPage.goToLogin();

        await LoginPage.waitForScreen();
        await expect(LoginPage.mobileNumberInput).toBeDisplayed();
    });
});
