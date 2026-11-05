/**
 * Cross-platform selector helpers.
 *
 * Every page object defines ONE locator per element, with the Android and iOS
 * variants side by side. At runtime the right one is chosen from the session.
 *
 *   get loginButton() { return $(sel({ android: '~login_button', ios: '~Log in' })); }
 *
 * Selector strategy (most to least preferred):
 *   1. Accessibility id  ->  '~my_id'   (content-desc on Android, accessibilityIdentifier on iOS)
 *   2. Android resource-id -> byResourceId('submit_btn')
 *   3. iOS predicate / class chain -> byPredicate('label == "Log in"')
 *   4. Visible text (last resort, breaks with copy/localisation changes)
 */

/** Pick the selector for the current platform. Pass a string to share one selector. */
export const sel = (selectors) => {
    if (typeof selectors === 'string') return selectors;
    const value = driver.isAndroid ? selectors.android : selectors.ios;
    if (!value) {
        throw new Error(`No ${driver.isAndroid ? 'android' : 'ios'} selector defined: ${JSON.stringify(selectors)}`);
    }
    return value;
};

/** Accessibility id, works on both platforms. */
export const byA11y = (id) => `~${id}`;

/** Android resource-id. Pass a full id (pkg:id/name) or just the name. */
export const byResourceId = (id) => {
    const pkg = process.env.ANDROID_APP_PACKAGE;
    const fullId = id.includes(':id/') || !pkg ? id : `${pkg}:id/${id}`;
    return `android=new UiSelector().resourceId("${fullId}")`;
};

/**
 * Jetpack Compose testTag. With testTagsAsResourceId enabled, Compose exposes the tag as a
 * resource-id WITHOUT the package prefix (e.g. "btn_log_in"), so byResourceId() and '~id' miss it.
 * Pass several tags separated by "|" to match any of them.
 */
export const byTestTag = (tag) =>
    tag.includes('|')
        ? `android=new UiSelector().resourceIdMatches("^(${tag})$")`
        : `android=new UiSelector().resourceId("${tag}")`;

/** Android visible text (exact or contains). */
export const byAndroidText = (text, contains = false) =>
    `android=new UiSelector().${contains ? 'textContains' : 'text'}("${text}")`;

/** iOS NSPredicate string. */
export const byPredicate = (predicate) => `-ios predicate string:${predicate}`;

/** iOS class chain. */
export const byClassChain = (chain) => `-ios class chain:${chain}`;

/** iOS element whose label/name/value contains text. */
export const byIosText = (text) =>
    byPredicate(`label CONTAINS "${text}" OR name CONTAINS "${text}" OR value CONTAINS "${text}"`);
