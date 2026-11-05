# BillEase mobile automation

Appium + WebdriverIO (JavaScript) framework for the BillEase app on **Android and iOS**.

## Project structure

```
Billease/
├── config/
│   ├── wdio.shared.conf.js     # Settings shared by both platforms (Appium service, Mocha, reporters, screenshots)
│   ├── wdio.android.conf.js    # UiAutomator2 capabilities
│   └── wdio.ios.conf.js        # XCUITest capabilities
├── src/
│   ├── pageobjects/
│   ├── utils/
│   └── data/testData.js        # Test data; credentials come from .env
├── test/specs/
│   ├── login.spec.js
│   ├── forgotPassword.spec.js
│   └── signUp.spec.js
├── apps/                       # Put the .apk / .app / .ipa here (git-ignored)
└── .env.example
```

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

## Reports and failures

- Spec reporter output in the console.
- Allure results in `reports/allure-results` (`npm run report`).
- A screenshot of every failed test is saved to `reports/screenshots/` and attached to Allure.
