/**
 * Test data. Real credentials come from .env — never hard-code them here.
 */
const env = process.env;

export const registeredUser = {
    mobileNumber: env.TEST_MOBILE_NUMBER,
    password: env.TEST_PASSWORD,
};

export const hasRegisteredUser = () => Boolean(registeredUser.mobileNumber && registeredUser.password);

export const testOtp = env.TEST_OTP;

export const unregisteredMobileNumber = env.UNREGISTERED_MOBILE_NUMBER || '09170000000';

/**
 * Mobile number used for sign-up. It must be a number your team controls:
 * sign-up sends a real SMS OTP, so a random number would text a stranger.
 */
export const signUpMobileNumber = env.SIGNUP_TEST_MOBILE_NUMBER;
export const hasSignUpNumber = () => Boolean(signUpMobileNumber);

/** Sign-up data with a unique name/email per run (PH mobile format 09XXXXXXXXX). */
export const newUser = () => {
    const stamp = Date.now().toString().slice(-6);
    return {
        firstName: 'QA',
        lastName: `Auto${stamp}`,
        email: `qa.auto+${stamp}@example.com`,
        mobileNumber: signUpMobileNumber || unregisteredMobileNumber,
        password: 'Test@12345',
        confirmPassword: 'Test@12345',
        acceptTerms: true,
    };
};

export const invalid = {
    mobileNumbers: [
        { label: 'too short', value: '0917123' },
        { label: 'letters', value: '09abcdefghi' },
        { label: 'wrong prefix', value: '12345678901' },
    ],
    emails: [
        { label: 'missing @', value: 'qa.example.com' },
        { label: 'missing domain', value: 'qa@' },
    ],
    weakPassword: '12345',
    wrongPassword: 'WrongPass!999',
    wrongOtp: '000000',
};
