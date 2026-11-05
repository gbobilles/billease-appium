import BasePage from './BasePage.js';
import { sel } from '../utils/selector.js';

/** Dashboard shown after a successful login. Used to assert login worked and to log out. */
class HomePage extends BasePage {
    get screenIdentifier() {
        return this.dashboard;
    }

    get dashboard() {
        return $(sel({ android: '~home_dashboard', ios: '~home_dashboard' }));
    }

    get profileTab() {
        return $(sel({ android: '~tab_profile', ios: '~tab_profile' }));
    }

    get logoutButton() {
        return $(sel({ android: '~profile_logout_button', ios: '~profile_logout_button' }));
    }

    get confirmLogoutButton() {
        return $(sel({ android: '~logout_confirm_button', ios: '~logout_confirm_button' }));
    }

    async logout() {
        await this.tap(this.profileTab);
        await this.scrollTo(() => this.logoutButton);
        await this.tap(this.logoutButton);
        if (await this.isDisplayed(this.confirmLogoutButton, 3000)) {
            await this.tap(this.confirmLogoutButton);
        }
    }
}

export default new HomePage();
