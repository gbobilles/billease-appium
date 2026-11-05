# BillEase mobile automation

Appium + WebdriverIO (JavaScript) framework for the BillEase app on **Android and iOS**, built with the Page Object Model. It covers **Login**, **Forgot Password** and **Sign Up**.

## Project structure

```
GB-AI/
├── config/
│   ├── wdio.shared.conf.js     # Settings shared by both platforms (Appium service, Mocha, reporters, screenshots)
│   ├── wdio.android.conf.js    # UiAutomator2 capabilities
│   └── wdio.ios.conf.js        # XCUITest capabilities
├── src/
│   ├── pageobjects/
│   │   ├── BasePage.js         # Shared actions: tap, type, waits, keyboard, back, scroll
│   │   ├── WelcomePage.js      # Logged-out landing screen
│   │   ├── LoginPage.js
│   │   ├── ForgotPasswordPage.js
│   │   ├── OtpPage.js          # Shared by Sign Up and Forgot Password
│   │   ├── ResetPasswordPage.js
│   │   ├── SignUpPage.js
│   │   ├── HomePage.js         # Post-login dashboard
│   │   └── index.js
│   ├── utils/
│   │   ├── selector.js         # sel({ android, ios }) + selector builders
│   │   ├── gestures.js         # Swipe / scroll with W3C actions
│   │   └── app.js              # Restart / reset the app between tests
│   └── data/testData.js        # Test data; credentials come from .env
├── test/specs/
│   ├── login.spec.js
│   ├── forgotPassword.spec.js
│   └── signUp.spec.js
├── apps/                       # Put the .apk / .app / .ipa here (git-ignored)
└── .env.example
```

## How it runs on both platforms

Each page object defines one locator per element, with the Android and iOS values side by side:

```js
get loginButton() {
    return $(sel({ android: '~login_submit_button', ios: '~login_submit_button' }));
}
```

`sel()` picks the right value from the running session (`driver.isAndroid`). Specs never contain selectors or platform checks, so the same spec file runs on both platforms. When both platforms share an accessibility id you can pass a single string: `$(sel('~login_submit_button'))`.

## Prerequisites

| | Android | iOS (macOS only) |
|---|---|---|
| Runtime | Node.js 18+ | Node.js 18+ |
| Tooling | Android SDK, `ANDROID_HOME` set, an emulator or a USB-debugging device | Xcode + command line tools, a simulator or a provisioned device |
| Appium driver | `uiautomator2` | `xcuitest` |

## Setup

```bash
npm install
```

```bash
npm run drivers:install
```

```bash
cp .env.example .env
```

Then edit `.env`:
- Set `ANDROID_APP_PACKAGE` / `ANDROID_APP_ACTIVITY` and `IOS_BUNDLE_ID` for the BillEase build you test.
- Put the build in `apps/` and set `ANDROID_APP_PATH` / `IOS_APP_PATH`, or leave them empty to launch an already-installed app.
- Add a QA account in `TEST_MOBILE_NUMBER` / `TEST_PASSWORD`. Use a staging or dedicated test account, never a personal one.

## Important: map the real locators first

The locators in `src/pageobjects/` follow a naming convention (`~login_mobile_input`, `~signup_submit_button`, and so on), but they are **placeholders**. Before the first run:

1. Open the app in [Appium Inspector](https://github.com/appium/appium-inspector) on each platform.
2. For each element, copy the accessibility id (best), Android `resource-id`, or an iOS predicate.
3. Update the getter in the page object. Helpers in `src/utils/selector.js` build the other selector types:

```js
get mobileNumberInput() {
    return $(sel({
        android: byResourceId('et_mobile_number'),            // ph.billease...:id/et_mobile_number
        ios: byPredicate('type == "XCUIElementTypeTextField" AND name == "Mobile number"'),
    }));
}
```

If you can, ask the app developers to add shared `testID` / `accessibilityIdentifier` values. One id then works on both platforms.

## Running tests

| Command | What it runs |
|---|---|
| `npm run test:android` | All specs on Android |
| `npm run test:ios` | All specs on iOS |
| `npm run test:android:smoke` / `test:ios:smoke` | Tests tagged `@smoke` |
| `npm run test:android:login` / `test:ios:login` | Login only |
| `npm run test:android:forgot` / `test:ios:forgot` | Forgot Password only |
| `npm run test:android:signup` / `test:ios:signup` | Sign Up only |
| `npm run report` | Build and open the Allure report |

The Appium server starts automatically through `@wdio/appium-service`. Its log goes to `reports/appium.log`.

## Test coverage

| Feature | Scenarios |
|---|---|
| Login | Valid login · wrong password · unregistered number · empty fields · invalid number formats · password mask/unmask · links to Forgot Password and Sign Up |
| Forgot Password | OTP sent to a registered number · unregistered number · empty field · invalid formats · wrong OTP · mismatched new passwords · back to Login |
| Sign Up | Reaches OTP · wrong OTP · full sign-up with OTP · empty form · invalid number / email · weak password · mismatched passwords · terms not accepted · already-registered number · back to Login |

### Tests that skip on purpose

Some tests need real accounts or real SMS, so they skip until you provide the data in `.env`:

- `TEST_MOBILE_NUMBER` + `TEST_PASSWORD`: valid login, wrong password, Forgot Password OTP, already-registered number.
- `SIGNUP_TEST_MOBILE_NUMBER`: any sign-up test that reaches the OTP screen. Sign-up sends a real SMS, so this must be a number your team controls.
- `TEST_OTP`: completing sign-up and resetting a password. These create or change real accounts, so run them only against staging with a fixed OTP.

## Reports and failures

- Spec reporter output in the console.
- Allure results in `reports/allure-results` (`npm run report`).
- A screenshot of every failed test is saved to `reports/screenshots/` and attached to Allure.

## Adding a new page

1. Create `src/pageobjects/MyPage.js`, extend `BasePage`, and define `screenIdentifier`.
2. Add locators with `sel({ android, ios })` and user-level actions (`fillForm`, `submit`, and so on).
3. Export it from `src/pageobjects/index.js`.
4. Write specs against the page's actions, never against raw selectors.
