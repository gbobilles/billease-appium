/**
 * Platform-neutral gestures built on W3C actions, so they behave the same
 * on UiAutomator2 and XCUITest.
 */
export default class Gestures {
    /**
     * Swipe from one relative point to another (0..1 of screen width/height).
     */
    static async swipe(from, to, durationMs = 600) {
        const { width, height } = await driver.getWindowSize();
        await driver
            .action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ x: Math.round(width * from.x), y: Math.round(height * from.y) })
            .down()
            .pause(100)
            .move({ duration: durationMs, x: Math.round(width * to.x), y: Math.round(height * to.y) })
            .up()
            .perform();
    }

    static async swipeUp() {
        await this.swipe({ x: 0.5, y: 0.75 }, { x: 0.5, y: 0.3 });
    }

    static async swipeDown() {
        await this.swipe({ x: 0.5, y: 0.3 }, { x: 0.5, y: 0.75 });
    }

    /**
     * Scroll down until the element is displayed, up to `maxSwipes` times.
     * @param {() => ChainablePromiseElement} getElement function returning the element (re-queried each swipe)
     */
    static async scrollUntilDisplayed(getElement, maxSwipes = 6) {
        for (let i = 0; i <= maxSwipes; i++) {
            if (await getElement().isDisplayed().catch(() => false)) return true;
            await this.swipeUp();
        }
        throw new Error(`Element not found after ${maxSwipes} swipes`);
    }
}
