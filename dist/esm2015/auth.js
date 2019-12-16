import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
const ACCESS_TOKEN_COOKIE = 'gpoauth-a';
function getJson(url, jwt) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield axios.get(url, {
                headers: { 'Authorization': jwt ? `Bearer ${jwt}` : '' },
                responseType: 'json'
            });
            return resp.data;
        }
        catch (err) {
            return {
                error: "Error fetching data",
                msg: err,
                url,
            };
        }
    });
}
/**
 * Authentication Service
 */
export class AuthService {
    /**
     *
     * AuthService
     *
     * @param config
     * @param
     */
    constructor(config, ngMessenger) {
        const self = this;
        this.config = config;
        this.messenger = ngMessenger;
        // Setup general event listeners that always run
        addEventListener('message', (event) => {
            // Handle User Authenticated
            if (event.data === 'iframe:userAuthenticated') {
                self.init(); // will broadcast to angular (side-effect)
            }
            // Handle logout event
            if (event.data === 'userSignOut') {
                this.messenger.broadcast("userAuthenticated", null);
                this.messenger.broadcast("userSignOut");
            }
        });
        self.init();
    }
    /**
     * Expose ngMessenger so that appliction code is able to
     * subscribe to notifications sent by ng-gpoauth
     */
    getMessenger() {
        return this.messenger;
    }
    /**
     * Retrieve and decode value from localstorage
     *
     * @param key
     */
    getFromLocalStorage(key) {
        const raw = localStorage.getItem(key);
        try {
            return raw ?
                atob(raw) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            return undefined;
        }
    }
    ;
    /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * @method init
     */
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const self = this;
            // Delay init until RPMService is loaded
            if (this.RPMLoaded() && this.config.loadRPM) {
                const script = document.createElement('script');
                script.onload = function () {
                    //do stuff with the script
                    self.init();
                };
                script.src = `https://s3.amazonaws.com/geoplatform-cdn/gp.rpm/${this.config.RPMVersion || 'stable'}/js/gp.rpm.browser.js`;
                document.head.appendChild(script);
                return; // skip init() till RPM is loaded
            }
            const jwt = this.getJWT();
            //clean hosturl on redirect from oauth
            if (this.getJWTFromUrl()) {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, 'Remove token from URL', window.location.href.replace(/[\?\&]access_token=.*\&token_type=Bearer/, ''));
                }
                else {
                    window.location.search.replace(/[\?\&]access_token=.*\&token_type=Bearer/, '');
                }
            }
            // Setup active session checher
            this.preveiousTokenPresentCheck = !!jwt;
            setInterval(() => { self.checkForLocalToken(); }, this.config.tokenCheckInterval);
            const user = this.getUserFromJWT(jwt);
            if (user)
                this.messenger.broadcast("userAuthenticated", user);
            return user;
        });
    }
    /**
     * Checks for the presence of token in cookie. If there has been a
     * change (cookie appears or disapears) the fire event handlers to
     * notify the appliction of the event.
     */
    checkForLocalToken() {
        const jwt = this.getJWT();
        const tokenPresent = !!jwt;
        // compare with previous check
        if (tokenPresent !== this.preveiousTokenPresentCheck)
            tokenPresent ?
                this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt)) :
                this.messenger.broadcast("userSignOut");
        // update previous state for next check
        this.preveiousTokenPresentCheck = tokenPresent;
    }
    /**
     * Clears the access_token property from the URL.
     */
    removeTokenFromUrl() {
        const replaceRegex = /[\?\&]access_token=.*(\&token_type=Bearer)?/;
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, 'Remove token from URL', window.location.href.replace(replaceRegex, ''));
        }
        else {
            window.location.search.replace(replaceRegex, '');
        }
    }
    /**
     * Create an invisable iframe and appends it to the bottom of the page.
     *
     * @method createIframe
     * @returns HTMLIFrameElement
     */
    createIframe(url) {
        let iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        return iframe;
    }
    ;
    /**
     * Redirects or displays login window the page to the login site
     */
    login(path) {
        // Check implicit we need to actually redirect them
        const loc = path ?
            `${window.location.origin}${path}` :
            this.config.CALLBACK ?
                this.config.CALLBACK :
                window.location.href; // default
        if (this.config.AUTH_TYPE === 'token') {
            window.location.href = this.config.IDP_BASE_URL +
                `/auth/authorize?client_id=${this.config.APP_ID}` +
                `&response_type=${this.config.AUTH_TYPE}` +
                `&redirect_uri=${encodeURIComponent(loc || '/login')}`;
            // Otherwise pop up the login modal
        }
        else {
            // Iframe login
            if (this.config.ALLOW_IFRAME_LOGIN) {
                this.messenger.broadcast('auth:requireLogin');
                // Redirect login
            }
            else {
                window.location.href = this.config.LOGIN_URL
                    || `/login?redirect_url=${encodeURIComponent(loc)}`;
            }
        }
    }
    ;
    /**
     * Performs background logout and requests jwt revokation
     */
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield getJson(`${this.config.APP_BASE_URL}/revoke`, this.getJWT());
            }
            catch (err) {
                console.log(`Error logging out: ${err}`);
            }
            if (this.config.LOGOUT_URL)
                window.location.href = this.config.LOGOUT_URL;
            if (this.config.FORCE_LOGIN)
                this.forceLogin();
        });
    }
    /**
     * Optional force redirect for non-public services
     */
    forceLogin() {
        this.login();
    }
    ;
    /**
     * Get protected user profile
     */
    getOauthProfile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const JWT = this.getJWT();
            return JWT ?
                yield getJson(`${this.config.IDP_BASE_URL}/api/profile`, JWT) :
                null;
        });
    }
    ;
    /**
     * Get User object from the JWT.
     *
     * If no JWT is provided it will be looked for at the normal JWT
     * locations (localStorage or URL queryString).
     *
     * @param [jwt] - the JWT to extract user from.
     */
    getUserFromJWT(jwt) {
        const user = this.parseJwt(jwt);
        return user ?
            new GeoPlatformUser(Object.assign({}, user, { id: user.sub })) :
            null;
    }
    /**
     * If the callback parameter is specified, this method
     * will return undefined. Otherwise, it returns the user (or null).
     *
     * Side Effects:
     *  - Will redirect users if no valid JWT was found
     *
     * @param callback optional function to invoke with the user
     * @return object representing current user
     */
    getUserSync() {
        const jwt = this.getJWT();
        // We allow front end to get user data if grant type and expired
        // because they will recieve a new token automatically when
        // making a call to the client(application)
        return this.isImplicitJWT(jwt) && this.isExpired(jwt) ?
            null :
            this.getUserFromJWT(jwt);
    }
    /**
     * Promise version of get user.
     *
     * Below is a table of how this function handels this method with
     * differnt configurations.
     *  - FORCE_LOGIN : Horizontal
     *  - ALLOW_IFRAME_LOGIN : Vertical
     *
     *
     * getUser  | T | F (FORCE_LOGIN)
     * -----------------------------
     * T        | 1 | 2
     * F        | 3 | 4
     * (ALLOW_IFRAME_LOGIN)
     *
     * Cases:
     * 1. Delay resolve function till user is logged in
     * 2. Return null (if user not authorized)
     * 3. Force the redirect
     * 4. Return null (if user not authorized)
     *
     * NOTE:
     * Case 1 above will cause this method's promise to be a long stall
     * until the user completes the login process. This should allow the
     * app to forgo a reload is it should have waited till the entire
     * time till the user was successfully logged in.
     *
     * @method getUser
     *
     * @returns User - the authenticated user resolved via Promise
     */
    getUser() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // For basic testing
            // this.messenger.broadcast('userAuthenticated', { name: 'username'})
            // return new Promise<GeoPlatformUser>((resolve, reject) => {
            const user = yield this.check();
            if (user)
                return user;
            // Case 1 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: true
            if (this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN) {
                // Resolve with user once they have logged in
                this.messenger.on('userAuthenticated', (event, user) => {
                    return user;
                });
            }
            // Case 2 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: false
            if (this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN) {
                return null;
            }
            // Case 3 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: true
            if (!this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN) {
                return null;
            }
            // Case 4 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: false
            if (!this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN) {
                return null; // or reject?
            }
        });
    }
    ;
    /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * @method check
     * @returns User or null
     */
    check() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const jwt = this.getJWT();
            // If no local JWT
            if (!jwt) {
                const freshJwt = yield this.checkWithClient();
                return jwt && jwt.length ?
                    this.getUserFromJWT(freshJwt) :
                    null;
            }
            if (!this.isImplicitJWT(jwt)) { // Grant token
                return this.isExpired(jwt) ?
                    yield this.checkWithClient() // Check with server
                        .then(jwt => jwt && this.getUserFromJWT(jwt)) :
                    this.getUserFromJWT(jwt);
            }
            else { // Implicit JWT
                return this.isExpired(jwt) ?
                    Promise.reject(null) :
                    this.getUserFromJWT(jwt);
            }
        });
    }
    /**
     * Makes a call to a service hosting node-gpoauth to allow for a
     * token refresh on an expired token, or a token that has been
     * invalidated to be revoked.
     *
     * Note: Client as in hosting application:
     *    https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
     *
     * @method checkWithClient
     * @param jwt - encoded accessToken/JWT
     *
     * @return Promise<jwt>
     */
    checkWithClient() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.config.AUTH_TYPE === 'token' ?
                null :
                axios(`${this.config.APP_BASE_URL}/checktoken`)
                    .then(() => this.getJWTfromLocalStorage());
        });
    }
    //=====================================================
    /**
     * Extract token from current URL
     *
     * @method getJWTFromUrl
     *
     * @return JWT Token (raw string)
     */
    getJWTFromUrl() {
        const queryString = (window && window.location && window.location.hash) ?
            window.location.hash :
            window.location.toString();
        const res = queryString.match(/access_token=([^\&]*)/);
        return res && res[1];
    }
    ;
    /**
     * Is RPM library loaded already?
     */
    RPMLoaded() {
        return typeof window.RPMService != 'undefined';
    }
    /**
     * Get an associated array of cookies.
     */
    getCookieObject() {
        return document.cookie.split(';')
            .map(c => c.trim().split('='))
            .reduce((acc, pair) => {
            acc[pair[0]] = pair[1];
            return acc;
        }, {});
    }
    /**
     * Extract and decode from cookie
     *
     * @param key
     */
    getFromCookie(key) {
        const raw = this.getCookieObject()[key];
        try {
            return raw ?
                atob(decodeURIComponent(raw)) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            return undefined;
        }
    }
    ;
    /**
     * Load the JWT stored in local storage.
     *
     * @method getJWTfromLocalStorage
     *
     * @return JWT Token
     */
    getJWTfromLocalStorage() {
        return this.getFromCookie(ACCESS_TOKEN_COOKIE);
    }
    ;
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * @method getJWT
     *
     * @return JWT Token
     */
    getJWT() {
        const jwt = this.getJWTFromUrl() || this.getJWTfromLocalStorage();
        // Only deny implicit tokens that have expired
        if (!jwt || (jwt && this.isImplicitJWT(jwt) && this.isExpired(jwt))) {
            return null;
        }
        else {
            return jwt;
        }
    }
    ;
    /**
     * Is a token expired.
     *
     * @method isExpired
     * @param jwt - A JWT
     *
     * @return Boolean
     */
    isExpired(jwt) {
        const parsedJWT = this.parseJwt(jwt);
        if (parsedJWT) {
            const now = (new Date()).getTime() / 1000;
            return now > parsedJWT.exp;
        }
        return true;
    }
    ;
    /**
     * Is the JWT an implicit JWT?
     * @param jwt
     */
    isImplicitJWT(jwt) {
        const parsedJWT = this.parseJwt(jwt);
        return parsedJWT && parsedJWT.implicit;
    }
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param token - Access Token (JWT)
     * @return the parsed payload in the JWT
     */
    parseJwt(token) {
        var parsed;
        if (token) {
            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                parsed = JSON.parse(atob(base64));
            }
            catch (e) { /* Don't throw parse error */ }
        }
        return parsed;
    }
    ;
    /**
     * Simple front end validion to verify JWT is complete and not
     * expired.
     *
     * Note:
     *  Signature validation is the only truly save method. This is done
     *  automatically in the node-gpoauth module.
     */
    validateJwt(token) {
        var parsed = this.parseJwt(token);
        var valid = (parsed && parsed.exp && parsed.exp * 1000 > Date.now()) ? true : false;
        return valid;
    }
    ;
}
export const DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNuRCxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUE7QUFHekIsTUFBTSxtQkFBbUIsR0FBSSxXQUFXLENBQUE7QUFFeEMsU0FBZSxPQUFPLENBQUMsR0FBVyxFQUFFLEdBQVk7O1FBQzlDLElBQUc7WUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNaLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDekQsWUFBWSxFQUFFLE1BQU07YUFDckIsQ0FBQyxDQUFBO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQjtRQUFDLE9BQU0sR0FBRyxFQUFFO1lBQ1gsT0FBTztnQkFDTCxLQUFLLEVBQUUscUJBQXFCO2dCQUM1QixHQUFHLEVBQUUsR0FBRztnQkFDUixHQUFHO2FBQ0osQ0FBQTtTQUNGO0lBQ0gsQ0FBQztDQUFBO0FBR0Q7O0dBRUc7QUFDSCxNQUFNLE9BQU8sV0FBVztJQU10Qjs7Ozs7O09BTUc7SUFDSCxZQUFZLE1BQWtCLEVBQUUsV0FBc0I7UUFDcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFBO1FBRTVCLGdEQUFnRDtRQUNoRCxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUN6Qyw0QkFBNEI7WUFDNUIsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLDBCQUEwQixF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LE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3BGLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFBLENBQUM7Q0FDSDtBQUdELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBZTtJQUN6QyxTQUFTLEVBQUUsT0FBTztJQUNsQixZQUFZLEVBQUUsRUFBRTtJQUNoQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciB3aW5kb3c6IGFueVxuXG5pbXBvcnQgeyBNZXNzZW5nZXIsIEF1dGhDb25maWcsIEpXVCwgVXNlclByb2ZpbGUsIFN0cmluZ09iaiB9IGZyb20gJy4vYXV0aFR5cGVzJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi9HZW9QbGF0Zm9ybVVzZXInXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cblxuY29uc3QgQUNDRVNTX1RPS0VOX0NPT0tJRSAgPSAnZ3BvYXV0aC1hJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgdHJ5e1xuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgcmV0dXJuIHJlc3AuZGF0YTtcbiAgfSBjYXRjaChlcnIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IFwiRXJyb3IgZmV0Y2hpbmcgZGF0YVwiLFxuICAgICAgbXNnOiBlcnIsXG4gICAgICB1cmwsXG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbiBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgY29uZmlnOiBBdXRoQ29uZmlnXG4gIG1lc3NlbmdlcjogTWVzc2VuZ2VyXG4gIHByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrOiBib29sZWFuXG5cbiAgLyoqXG4gICAqXG4gICAqIEF1dGhTZXJ2aWNlXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIG5nTWVzc2VuZ2VyIHNvIHRoYXQgYXBwbGljdGlvbiBjb2RlIGlzIGFibGUgdG9cbiAgICogc3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbnMgc2VudCBieSBuZy1ncG9hdXRoXG4gICAqL1xuICBnZXRNZXNzZW5nZXIoKTogTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbmQgZGVjb2RlIHZhbHVlIGZyb20gbG9jYWxzdG9yYWdlXG4gICAqXG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGdldEZyb21Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihyYXcpIDpcbiAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgIH0gY2F0Y2ggKGUpeyAvLyBDYXRjaCBiYWQgZW5jb2Rpbmcgb3IgZm9ybWFsbHkgbm90IGVuY29kZWRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gRGVsYXkgaW5pdCB1bnRpbCBSUE1TZXJ2aWNlIGlzIGxvYWRlZFxuICAgIGlmKHRoaXMuUlBNTG9hZGVkKCkgJiYgdGhpcy5jb25maWcubG9hZFJQTSl7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy9kbyBzdHVmZiB3aXRoIHRoZSBzY3JpcHRcbiAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgIH07XG4gICAgICBzY3JpcHQuc3JjID0gYGh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9nZW9wbGF0Zm9ybS1jZG4vZ3AucnBtLyR7dGhpcy5jb25maWcuUlBNVmVyc2lvbiB8fCAnc3RhYmxlJ30vanMvZ3AucnBtLmJyb3dzZXIuanNgO1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICByZXR1cm4gLy8gc2tpcCBpbml0KCkgdGlsbCBSUE0gaXMgbG9hZGVkXG4gICAgfVxuXG5cbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy9jbGVhbiBob3N0dXJsIG9uIHJlZGlyZWN0IGZyb20gb2F1dGhcbiAgICBpZiAodGhpcy5nZXRKV1RGcm9tVXJsKCkpIHtcbiAgICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LipcXCZ0b2tlbl90eXBlPUJlYXJlci8sICcnKSApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXR1cCBhY3RpdmUgc2Vzc2lvbiBjaGVjaGVyXG4gICAgdGhpcy5wcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjayA9ICEhand0XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4geyBzZWxmLmNoZWNrRm9yTG9jYWxUb2tlbigpIH0sIHRoaXMuY29uZmlnLnRva2VuQ2hlY2tJbnRlcnZhbClcblxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLmdldFVzZXJGcm9tSldUKGp3dClcbiAgICBpZih1c2VyKVxuICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdXNlcilcblxuICAgIHJldHVybiB1c2VyXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciB0aGUgcHJlc2VuY2Ugb2YgdG9rZW4gaW4gY29va2llLiBJZiB0aGVyZSBoYXMgYmVlbiBhXG4gICAqIGNoYW5nZSAoY29va2llIGFwcGVhcnMgb3IgZGlzYXBlYXJzKSB0aGUgZmlyZSBldmVudCBoYW5kbGVycyB0b1xuICAgKiBub3RpZnkgdGhlIGFwcGxpY3Rpb24gb2YgdGhlIGV2ZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBjaGVja0ZvckxvY2FsVG9rZW4oKXtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpXG4gICAgY29uc3QgdG9rZW5QcmVzZW50ID0gISFqd3RcbiAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY2hlY2tcbiAgICBpZiAodG9rZW5QcmVzZW50ICE9PSB0aGlzLnByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrKVxuICAgICAgdG9rZW5QcmVzZW50ID9cbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpO1xuXG4gICAgLy8gdXBkYXRlIHByZXZpb3VzIHN0YXRlIGZvciBuZXh0IGNoZWNrXG4gICAgdGhpcy5wcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjayA9IHRva2VuUHJlc2VudFxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgYWNjZXNzX3Rva2VuIHByb3BlcnR5IGZyb20gdGhlIFVSTC5cbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlVG9rZW5Gcm9tVXJsKCk6IHZvaWQge1xuICAgIGNvbnN0IHJlcGxhY2VSZWdleCA9IC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKihcXCZ0b2tlbl90eXBlPUJlYXJlcik/L1xuICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJykgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGludmlzYWJsZSBpZnJhbWUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBjcmVhdGVJZnJhbWVcbiAgICogQHJldHVybnMgSFRNTElGcmFtZUVsZW1lbnRcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbihwYXRoPzogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gQ2hlY2sgaW1wbGljaXQgd2UgbmVlZCB0byBhY3R1YWxseSByZWRpcmVjdCB0aGVtXG4gICAgY29uc3QgbG9jID0gcGF0aCA/XG4gICAgICAgICAgICAgICAgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3BhdGh9YCA6XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuQ0FMTEJBQ0sgP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA6XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmIC8vIGRlZmF1bHRcblxuICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJykge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkwgK1xuICAgICAgICAgICAgICBgL2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0ke3RoaXMuY29uZmlnLkFQUF9JRH1gICtcbiAgICAgICAgICAgICAgYCZyZXNwb25zZV90eXBlPSR7dGhpcy5jb25maWcuQVVUSF9UWVBFfWAgK1xuICAgICAgICAgICAgICBgJnJlZGlyZWN0X3VyaT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCdhdXRoOnJlcXVpcmVMb2dpbicpXG5cbiAgICAgIC8vIFJlZGlyZWN0IGxvZ2luXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR0lOX1VSTFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgYC9sb2dpbj9yZWRpcmVjdF91cmw9JHtlbmNvZGVVUklDb21wb25lbnQobG9jKX1gXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBiYWNrZ3JvdW5kIGxvZ291dCBhbmQgcmVxdWVzdHMgand0IHJldm9rYXRpb25cbiAgICovXG4gIGFzeW5jIGxvZ291dCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZWAsIHRoaXMuZ2V0SldUKCkpXG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGxvZ2dpbmcgb3V0OiAke2Vycn1gKVxuICAgIH1cbiAgICBpZih0aGlzLmNvbmZpZy5MT0dPVVRfVVJMKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR09VVF9VUkxcbiAgICBpZih0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTikgdGhpcy5mb3JjZUxvZ2luKCk7XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9uYWwgZm9yY2UgcmVkaXJlY3QgZm9yIG5vbi1wdWJsaWMgc2VydmljZXNcbiAgICovXG4gIGZvcmNlTG9naW4oKSB7XG4gICAgdGhpcy5sb2dpbigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvdGVjdGVkIHVzZXIgcHJvZmlsZVxuICAgKi9cbiAgYXN5bmMgZ2V0T2F1dGhQcm9maWxlKCk6IFByb21pc2U8VXNlclByb2ZpbGU+IHtcbiAgICBjb25zdCBKV1QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgcmV0dXJuIEpXVCA/XG4gICAgICBhd2FpdCBnZXRKc29uKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXBpL3Byb2ZpbGVgLCBKV1QpIDpcbiAgICAgIG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBVc2VyIG9iamVjdCBmcm9tIHRoZSBKV1QuXG4gICAqXG4gICAqIElmIG5vIEpXVCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGxvb2tlZCBmb3IgYXQgdGhlIG5vcm1hbCBKV1RcbiAgICogbG9jYXRpb25zIChsb2NhbFN0b3JhZ2Ugb3IgVVJMIHF1ZXJ5U3RyaW5nKS5cbiAgICpcbiAgICogQHBhcmFtIFtqd3RdIC0gdGhlIEpXVCB0byBleHRyYWN0IHVzZXIgZnJvbS5cbiAgICovXG4gIGdldFVzZXJGcm9tSldUKGp3dDogc3RyaW5nKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHVzZXIgP1xuICAgICAgICAgICAgbmV3IEdlb1BsYXRmb3JtVXNlcihPYmplY3QuYXNzaWduKHt9LCB1c2VyLCB7IGlkOiB1c2VyLnN1YiB9KSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyIGlzIHNwZWNpZmllZCwgdGhpcyBtZXRob2RcbiAgICogd2lsbCByZXR1cm4gdW5kZWZpbmVkLiBPdGhlcndpc2UsIGl0IHJldHVybnMgdGhlIHVzZXIgKG9yIG51bGwpLlxuICAgKlxuICAgKiBTaWRlIEVmZmVjdHM6XG4gICAqICAtIFdpbGwgcmVkaXJlY3QgdXNlcnMgaWYgbm8gdmFsaWQgSldUIHdhcyBmb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgb3B0aW9uYWwgZnVuY3Rpb24gdG8gaW52b2tlIHdpdGggdGhlIHVzZXJcbiAgICogQHJldHVybiBvYmplY3QgcmVwcmVzZW50aW5nIGN1cnJlbnQgdXNlclxuICAgKi9cbiAgZ2V0VXNlclN5bmMoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCByZWNpZXZlIGEgbmV3IHRva2VuIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgIC8vIG1ha2luZyBhIGNhbGwgdG8gdGhlIGNsaWVudChhcHBsaWNhdGlvbilcbiAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dfSUZSQU1FX0xPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dfSUZSQU1FX0xPR0lOKVxuICAgKlxuICAgKiBDYXNlczpcbiAgICogMS4gRGVsYXkgcmVzb2x2ZSBmdW5jdGlvbiB0aWxsIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAqIDIuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKiAzLiBGb3JjZSB0aGUgcmVkaXJlY3RcbiAgICogNC4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqXG4gICAqIE5PVEU6XG4gICAqIENhc2UgMSBhYm92ZSB3aWxsIGNhdXNlIHRoaXMgbWV0aG9kJ3MgcHJvbWlzZSB0byBiZSBhIGxvbmcgc3RhbGxcbiAgICogdW50aWwgdGhlIHVzZXIgY29tcGxldGVzIHRoZSBsb2dpbiBwcm9jZXNzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGVcbiAgICogYXBwIHRvIGZvcmdvIGEgcmVsb2FkIGlzIGl0IHNob3VsZCBoYXZlIHdhaXRlZCB0aWxsIHRoZSBlbnRpcmVcbiAgICogdGltZSB0aWxsIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldFVzZXJcbiAgICpcbiAgICogQHJldHVybnMgVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgcmVzb2x2ZWQgdmlhIFByb21pc2VcbiAgICovXG4gIGFzeW5jIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+IHtcbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgLy8gcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLmNoZWNrKCk7XG4gICAgaWYodXNlcikgcmV0dXJuIHVzZXJcblxuICAgIC8vIENhc2UgMSAtIEFMTE9XX0lGUkFNRV9MT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIC8vIFJlc29sdmUgd2l0aCB1c2VyIG9uY2UgdGhleSBoYXZlIGxvZ2dlZCBpblxuICAgICAgdGhpcy5tZXNzZW5nZXIub24oJ3VzZXJBdXRoZW50aWNhdGVkJywgKGV2ZW50OiBFdmVudCwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBDYXNlIDIgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgMyAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgLy8gQ2FzZSA0IC0gQUxMT1dfSUZSQU1FX0xPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiBmYWxzZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsIC8vIG9yIHJlamVjdD9cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGZ1bmN0aW9uIGJlaW5nIHVzZWQgYnkgc29tZSBmcm9udCBlbmQgYXBwcyBhbHJlYWR5LlxuICAgKiAod3JhcHBlciBmb3IgZ2V0VXNlcilcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJucyBVc2VyIG9yIG51bGxcbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgaWYoIWp3dCkge1xuICAgICAgY29uc3QgZnJlc2hKd3QgPSBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudCgpO1xuXG4gICAgICByZXR1cm4gand0ICYmIGp3dC5sZW5ndGggP1xuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGZyZXNoSnd0KSA6XG4gICAgICAgICAgICAgIG51bGw7XG4gICAgfVxuICAgIGlmKCF0aGlzLmlzSW1wbGljaXRKV1Qoand0KSl7IC8vIEdyYW50IHRva2VuXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2hlY2tXaXRoQ2xpZW50KCkgLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiBqd3QgJiYgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcblxuICAgIH0gZWxzZSB7IC8vIEltcGxpY2l0IEpXVFxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdChudWxsKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjYWxsIHRvIGEgc2VydmljZSBob3N0aW5nIG5vZGUtZ3BvYXV0aCB0byBhbGxvdyBmb3IgYVxuICAgKiB0b2tlbiByZWZyZXNoIG9uIGFuIGV4cGlyZWQgdG9rZW4sIG9yIGEgdG9rZW4gdGhhdCBoYXMgYmVlblxuICAgKiBpbnZhbGlkYXRlZCB0byBiZSByZXZva2VkLlxuICAgKlxuICAgKiBOb3RlOiBDbGllbnQgYXMgaW4gaG9zdGluZyBhcHBsaWNhdGlvbjpcbiAgICogICAgaHR0cHM6Ly93d3cuZGlnaXRhbG9jZWFuLmNvbS9jb21tdW5pdHkvdHV0b3JpYWxzL2FuLWludHJvZHVjdGlvbi10by1vYXV0aC0yXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tXaXRoQ2xpZW50XG4gICAqIEBwYXJhbSBqd3QgLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2U8and0PlxuICAgKi9cbiAgYXN5bmMgY2hlY2tXaXRoQ2xpZW50KCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyA/XG4gICAgICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICAgICAgYXhpb3MoYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9jaGVja3Rva2VuYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5nZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCkpXG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIFJQTSBsaWJyYXJ5IGxvYWRlZCBhbHJlYWR5P1xuICAgKi9cbiAgUlBNTG9hZGVkKCk6ICBib29sZWFuIHtcbiAgIHJldHVybiB0eXBlb2Ygd2luZG93LlJQTVNlcnZpY2UgIT0gJ3VuZGVmaW5lZCdcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXNzb2NpYXRlZCBhcnJheSBvZiBjb29raWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDb29raWVPYmplY3QoKTogU3RyaW5nT2JqICB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRyaW0oKS5zcGxpdCgnPScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2M6IFN0cmluZ09iaiwgcGFpcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY1twYWlyWzBdXSA9IHBhaXJbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYW5kIGRlY29kZSBmcm9tIGNvb2tpZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBwcml2YXRlIGdldEZyb21Db29raWUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCByYXcgPSB0aGlzLmdldENvb2tpZU9iamVjdCgpW2tleV1cbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihkZWNvZGVVUklDb21wb25lbnQocmF3KSkgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUNvb2tpZShBQ0NFU1NfVE9LRU5fQ09PS0lFKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW5cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZVxufVxuIl19