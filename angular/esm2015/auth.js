/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
/** @type {?} */
const ACCESS_TOKEN_COOKIE = 'gpoauth-a';
/**
 * @param {?} url
 * @param {?=} jwt
 * @return {?}
 */
function getJson(url, jwt) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        /** @type {?} */
        const resp = yield axios.get(url, {
            headers: { 'Authorization': jwt ? `Bearer ${jwt}` : '' },
            responseType: 'json'
        });
        return resp.data;
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
     * @param {?} config
     * @param {?} ngMessenger
     */
    constructor(config, ngMessenger) {
        /** @type {?} */
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
     * @return {?}
     */
    getMessenger() {
        return this.messenger;
    }
    /**
     * Retrieve and decode value from localstorage
     *
     * @param {?} key
     * @return {?}
     */
    getFromLocalStorage(key) {
        /** @type {?} */
        const raw = localStorage.getItem(key);
        try {
            return raw ?
                atob(raw) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            // Catch bad encoding or formally not encoded
            return undefined;
        }
    }
    ;
    /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * \@method init
     * @return {?}
     */
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const self = this;
            // Delay init until RPMService is loaded
            if (this.RPMLoaded() && this.config.loadRPM) {
                /** @type {?} */
                const script = document.createElement('script');
                script.onload = function () {
                    //do stuff with the script
                    self.init();
                };
                script.src = `https://s3.amazonaws.com/geoplatform-cdn/gp.rpm/${this.config.RPMVersion || 'stable'}/js/gp.rpm.browser.js`;
                document.head.appendChild(script);
                return; // skip init() till RPM is loaded
            }
            /** @type {?} */
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
            /** @type {?} */
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
     * @return {?}
     */
    checkForLocalToken() {
        /** @type {?} */
        const jwt = this.getJWT();
        /** @type {?} */
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
     * @return {?}
     */
    removeTokenFromUrl() {
        /** @type {?} */
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
     * \@method createIframe
     * @param {?} url
     * @return {?} HTMLIFrameElement
     */
    createIframe(url) {
        /** @type {?} */
        let iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        return iframe;
    }
    ;
    /**
     * Redirects or displays login window the page to the login site
     * @param {?=} path
     * @return {?}
     */
    login(path) {
        /** @type {?} */
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
     * @return {?}
     */
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield getJson(`${this.config.APP_BASE_URL}/revoke`, this.getJWT());
            if (this.config.LOGOUT_URL)
                window.location.href = this.config.LOGOUT_URL;
            if (this.config.FORCE_LOGIN)
                this.forceLogin();
        });
    }
    /**
     * Optional force redirect for non-public services
     * @return {?}
     */
    forceLogin() {
        this.login();
    }
    ;
    /**
     * Get protected user profile
     * @return {?}
     */
    getOauthProfile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
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
     * @param {?} jwt
     * @return {?}
     */
    getUserFromJWT(jwt) {
        /** @type {?} */
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
     * @return {?} object representing current user
     */
    getUserSync() {
        /** @type {?} */
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
     * \@method getUser
     *
     * @return {?} User - the authenticated user resolved via Promise
     */
    getUser() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
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
     * \@method check
     * @return {?} User or null
     */
    check() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const jwt = this.getJWT();
            // If no local JWT
            if (!jwt) {
                /** @type {?} */
                const freshJwt = yield this.checkWithClient();
                return jwt && jwt.length ?
                    this.getUserFromJWT(freshJwt) :
                    null;
            }
            if (!this.isImplicitJWT(jwt)) { // Grant token
                // Grant token
                return this.isExpired(jwt) ?
                    yield this.checkWithClient() // Check with server
                        .then(jwt => jwt && this.getUserFromJWT(jwt)) :
                    this.getUserFromJWT(jwt);
            }
            else { // Implicit JWT
                // Implicit JWT
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
     * \@method checkWithClient
     * @return {?} Promise<jwt>
     */
    checkWithClient() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.config.AUTH_TYPE === 'token' ?
                null :
                axios(`${this.config.APP_BASE_URL}/checktoken`)
                    .then(() => this.getJWTfromLocalStorage());
        });
    }
    /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?} JWT Token (raw string)
     */
    getJWTFromUrl() {
        /** @type {?} */
        const queryString = (window && window.location && window.location.hash) ?
            window.location.hash :
            window.location.toString();
        /** @type {?} */
        const res = queryString.match(/access_token=([^\&]*)/);
        return res && res[1];
    }
    ;
    /**
     * Is RPM library loaded already?
     * @return {?}
     */
    RPMLoaded() {
        return typeof window.RPMService != 'undefined';
    }
    /**
     * Get an associated array of cookies.
     * @return {?}
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
     * @param {?} key
     * @return {?}
     */
    getFromCookie(key) {
        /** @type {?} */
        const raw = this.getCookieObject()[key];
        try {
            return raw ?
                atob(decodeURIComponent(raw)) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            // Catch bad encoding or formally not encoded
            return undefined;
        }
    }
    ;
    /**
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?} JWT Token
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
     * \@method getJWT
     *
     * @return {?} JWT Token
     */
    getJWT() {
        /** @type {?} */
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
     * \@method isExpired
     * @param {?} jwt - A JWT
     *
     * @return {?} Boolean
     */
    isExpired(jwt) {
        /** @type {?} */
        const parsedJWT = this.parseJwt(jwt);
        if (parsedJWT) {
            /** @type {?} */
            const now = (new Date()).getTime() / 1000;
            return now > parsedJWT.exp;
        }
        return true;
    }
    ;
    /**
     * Is the JWT an implicit JWT?
     * @param {?} jwt
     * @return {?}
     */
    isImplicitJWT(jwt) {
        /** @type {?} */
        const parsedJWT = this.parseJwt(jwt);
        return parsedJWT && parsedJWT.implicit;
    }
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {?} token - Access Token (JWT)
     * @return {?} the parsed payload in the JWT
     */
    parseJwt(token) {
        /** @type {?} */
        var parsed;
        if (token) {
            try {
                /** @type {?} */
                var base64Url = token.split('.')[1];
                /** @type {?} */
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                parsed = JSON.parse(atob(base64));
            }
            catch (e) { /* Don't throw parse error */
                /* Don't throw parse error */ 
            }
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
     * @param {?} token
     * @return {?}
     */
    validateJwt(token) {
        /** @type {?} */
        var parsed = this.parseJwt(token);
        /** @type {?} */
        var valid = (parsed && parsed.exp && parsed.exp * 1000 > Date.now()) ? true : false;
        return valid;
    }
    ;
}
if (false) {
    /** @type {?} */
    AuthService.prototype.config;
    /** @type {?} */
    AuthService.prototype.messenger;
    /** @type {?} */
    AuthService.prototype.preveiousTokenPresentCheck;
}
/** @type {?} */
export const DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    // absolute path // use . for relative path
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOztBQUl6QixNQUFNLG1CQUFtQixHQUFJLFdBQVcsQ0FBQTs7Ozs7O0FBRXhDLGlCQUF1QixHQUFXLEVBQUUsR0FBWTs7O1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekQsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFBO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQzs7Q0FDbEI7Ozs7QUFNRCxNQUFNOzs7Ozs7OztJQWFKLFlBQVksTUFBa0IsRUFBRSxXQUF3Qjs7UUFDdEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFBOztRQUc1QixnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFVLEVBQUUsRUFBRTs7WUFFekMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLDBCQUEwQixFQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDWjs7WUFHRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO2dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxT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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEYsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUFBLENBQUM7Q0FDSDs7Ozs7Ozs7OztBQUdELGFBQWEsZUFBZSxHQUFlO0lBQ3pDLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLFlBQVksRUFBRSxFQUFFOztJQUNoQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciB3aW5kb3c6IGFueVxuXG5pbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSwgU3RyaW5nT2JqIH0gZnJvbSAnLi4vc3JjL2F1dGhUeXBlcydcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4vR2VvUGxhdGZvcm1Vc2VyJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG5cblxuY29uc3QgQUNDRVNTX1RPS0VOX0NPT0tJRSAgPSAnZ3BvYXV0aC1hJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgcmV0dXJuIHJlc3AuZGF0YTtcbn1cblxuXG4vKipcbiAqIEF1dGhlbnRpY2F0aW9uIFNlcnZpY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcblxuICBjb25maWc6IEF1dGhDb25maWdcbiAgbWVzc2VuZ2VyOiBuZ01lc3NlbmdlclxuICBwcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjazogYm9vbGVhblxuXG4gIC8qKlxuICAgKlxuICAgKiBBdXRoU2VydmljZVxuICAgKlxuICAgKiBAcGFyYW0gY29uZmlnXG4gICAqIEBwYXJhbVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBdXRoQ29uZmlnLCBuZ01lc3NlbmdlcjogbmdNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIG5nTWVzc2VuZ2VyIHNvIHRoYXQgYXBwbGljdGlvbiBjb2RlIGlzIGFibGUgdG9cbiAgICogc3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbnMgc2VudCBieSBuZy1ncG9hdXRoXG4gICAqL1xuICBnZXRNZXNzZW5nZXIoKTogbmdNZXNzZW5nZXIge1xuICAgIHJldHVybiB0aGlzLm1lc3NlbmdlclxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuZCBkZWNvZGUgdmFsdWUgZnJvbSBsb2NhbHN0b3JhZ2VcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgZ2V0RnJvbUxvY2FsU3RvcmFnZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgIHRyeXtcbiAgICAgIHJldHVybiByYXcgP1xuICAgICAgICAgICAgICBhdG9iKHJhdykgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFdlIGtlZXAgdGhpcyBvdXRzaWRlIHRoZSBjb25zdHJ1Y3RvciBzbyB0aGF0IG90aGVyIHNlcnZpY2VzIGNhbGxcbiAgICogY2FsbCBpdCB0byB0cmlnZ2VyIHRoZSBzaWRlLWVmZmVjdHMuXG4gICAqXG4gICAqIEBtZXRob2QgaW5pdFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBEZWxheSBpbml0IHVudGlsIFJQTVNlcnZpY2UgaXMgbG9hZGVkXG4gICAgaWYodGhpcy5SUE1Mb2FkZWQoKSAmJiB0aGlzLmNvbmZpZy5sb2FkUlBNKXtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL2RvIHN0dWZmIHdpdGggdGhlIHNjcmlwdFxuICAgICAgICAgIHNlbGYuaW5pdCgpO1xuICAgICAgfTtcbiAgICAgIHNjcmlwdC5zcmMgPSBgaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2dlb3BsYXRmb3JtLWNkbi9ncC5ycG0vJHt0aGlzLmNvbmZpZy5SUE1WZXJzaW9uIHx8ICdzdGFibGUnfS9qcy9ncC5ycG0uYnJvd3Nlci5qc2A7XG5cbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgIHJldHVybiAvLyBza2lwIGluaXQoKSB0aWxsIFJQTSBpcyBsb2FkZWRcbiAgICB9XG5cblxuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICAvL2NsZWFuIGhvc3R1cmwgb24gcmVkaXJlY3QgZnJvbSBvYXV0aFxuICAgIGlmICh0aGlzLmdldEpXVEZyb21VcmwoKSkge1xuICAgICAgaWYod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKXtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCB7fSAsICdSZW1vdmUgdG9rZW4gZnJvbSBVUkwnLCB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKlxcJnRva2VuX3R5cGU9QmVhcmVyLywgJycpIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZSgvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LipcXCZ0b2tlbl90eXBlPUJlYXJlci8sICcnKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldHVwIGFjdGl2ZSBzZXNzaW9uIGNoZWNoZXJcbiAgICB0aGlzLnByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrID0gISFqd3RcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7IHNlbGYuY2hlY2tGb3JMb2NhbFRva2VuKCkgfSwgdGhpcy5jb25maWcudG9rZW5DaGVja0ludGVydmFsKVxuXG4gICAgY29uc3QgdXNlciA9IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICAgIGlmKHVzZXIpXG4gICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCB1c2VyKVxuXG4gICAgcmV0dXJuIHVzZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIHRoZSBwcmVzZW5jZSBvZiB0b2tlbiBpbiBjb29raWUuIElmIHRoZXJlIGhhcyBiZWVuIGFcbiAgICogY2hhbmdlIChjb29raWUgYXBwZWFycyBvciBkaXNhcGVhcnMpIHRoZSBmaXJlIGV2ZW50IGhhbmRsZXJzIHRvXG4gICAqIG5vdGlmeSB0aGUgYXBwbGljdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAqL1xuICBwcml2YXRlIGNoZWNrRm9yTG9jYWxUb2tlbigpe1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKClcbiAgICBjb25zdCB0b2tlblByZXNlbnQgPSAhIWp3dFxuICAgIC8vIGNvbXBhcmUgd2l0aCBwcmV2aW91cyBjaGVja1xuICAgIGlmICh0b2tlblByZXNlbnQgIT09IHRoaXMucHJldmVpb3VzVG9rZW5QcmVzZW50Q2hlY2spXG4gICAgICB0b2tlblByZXNlbnQgP1xuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpIDpcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlclNpZ25PdXRcIik7XG5cbiAgICAvLyB1cGRhdGUgcHJldmlvdXMgc3RhdGUgZm9yIG5leHQgY2hlY2tcbiAgICB0aGlzLnByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrID0gdG9rZW5QcmVzZW50XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBhY2Nlc3NfdG9rZW4gcHJvcGVydHkgZnJvbSB0aGUgVVJMLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVUb2tlbkZyb21VcmwoKTogdm9pZCB7XG4gICAgY29uc3QgcmVwbGFjZVJlZ2V4ID0gL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qKFxcJnRva2VuX3R5cGU9QmVhcmVyKT8vXG4gICAgaWYod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKXtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKSApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW52aXNhYmxlIGlmcmFtZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNyZWF0ZUlmcmFtZVxuICAgKiBAcmV0dXJucyBIVE1MSUZyYW1lRWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVJZnJhbWUodXJsOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XG4gICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmcmFtZS5zcmMgPSB1cmxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICByZXR1cm4gaWZyYW1lXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZGlyZWN0cyBvciBkaXNwbGF5cyBsb2dpbiB3aW5kb3cgdGhlIHBhZ2UgdG8gdGhlIGxvZ2luIHNpdGVcbiAgICovXG4gIGxvZ2luKHBhdGg/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBjb25zdCBsb2MgPSBwYXRoID9cbiAgICAgICAgICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7cGF0aH1gIDpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLIDpcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgLy8gZGVmYXVsdFxuXG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLklEUF9CQVNFX1VSTCArXG4gICAgICAgICAgICAgIGAvYXV0aC9hdXRob3JpemU/Y2xpZW50X2lkPSR7dGhpcy5jb25maWcuQVBQX0lEfWAgK1xuICAgICAgICAgICAgICBgJnJlc3BvbnNlX3R5cGU9JHt0aGlzLmNvbmZpZy5BVVRIX1RZUEV9YCArXG4gICAgICAgICAgICAgIGAmcmVkaXJlY3RfdXJpPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyB8fCAnL2xvZ2luJyl9YFxuXG4gICAgLy8gT3RoZXJ3aXNlIHBvcCB1cCB0aGUgbG9naW4gbW9kYWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWZyYW1lIGxvZ2luXG4gICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4pe1xuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ2F1dGg6cmVxdWlyZUxvZ2luJylcblxuICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2VgLCB0aGlzLmdldEpXVCgpKVxuXG4gICAgaWYodGhpcy5jb25maWcuTE9HT1VUX1VSTCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dPVVRfVVJMXG4gICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHRoaXMuZm9yY2VMb2dpbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIGZvcmNlIHJlZGlyZWN0IGZvciBub24tcHVibGljIHNlcnZpY2VzXG4gICAqL1xuICBmb3JjZUxvZ2luKCkge1xuICAgIHRoaXMubG9naW4oKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb3RlY3RlZCB1c2VyIHByb2ZpbGVcbiAgICovXG4gIGFzeW5jIGdldE9hdXRoUHJvZmlsZSgpOiBQcm9taXNlPFVzZXJQcm9maWxlPiB7XG4gICAgY29uc3QgSldUID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIHJldHVybiBKV1QgP1xuICAgICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2FwaS9wcm9maWxlYCwgSldUKSA6XG4gICAgICBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgVXNlciBvYmplY3QgZnJvbSB0aGUgSldULlxuICAgKlxuICAgKiBJZiBubyBKV1QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb29rZWQgZm9yIGF0IHRoZSBub3JtYWwgSldUXG4gICAqIGxvY2F0aW9ucyAobG9jYWxTdG9yYWdlIG9yIFVSTCBxdWVyeVN0cmluZykuXG4gICAqXG4gICAqIEBwYXJhbSBband0XSAtIHRoZSBKV1QgdG8gZXh0cmFjdCB1c2VyIGZyb20uXG4gICAqL1xuICBnZXRVc2VyRnJvbUpXVChqd3Q6IHN0cmluZyk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiB1c2VyID9cbiAgICAgICAgICAgIG5ldyBHZW9QbGF0Zm9ybVVzZXIoT2JqZWN0LmFzc2lnbih7fSwgdXNlciwgeyBpZDogdXNlci5zdWIgfSkpIDpcbiAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSB1c2VyIChvciBudWxsKS5cbiAgICpcbiAgICogU2lkZSBFZmZlY3RzOlxuICAgKiAgLSBXaWxsIHJlZGlyZWN0IHVzZXJzIGlmIG5vIHZhbGlkIEpXVCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGludm9rZSB3aXRoIHRoZSB1c2VyXG4gICAqIEByZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyBjdXJyZW50IHVzZXJcbiAgICovXG4gIGdldFVzZXJTeW5jKCk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAvLyBXZSBhbGxvdyBmcm9udCBlbmQgdG8gZ2V0IHVzZXIgZGF0YSBpZiBncmFudCB0eXBlIGFuZCBleHBpcmVkXG4gICAgLy8gYmVjYXVzZSB0aGV5IHdpbGwgcmVjaWV2ZSBhIG5ldyB0b2tlbiBhdXRvbWF0aWNhbGx5IHdoZW5cbiAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgcmV0dXJuIHRoaXMuaXNJbXBsaWNpdEpXVChqd3QpICYmIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbWlzZSB2ZXJzaW9uIG9mIGdldCB1c2VyLlxuICAgKlxuICAgKiBCZWxvdyBpcyBhIHRhYmxlIG9mIGhvdyB0aGlzIGZ1bmN0aW9uIGhhbmRlbHMgdGhpcyBtZXRob2Qgd2l0aFxuICAgKiBkaWZmZXJudCBjb25maWd1cmF0aW9ucy5cbiAgICogIC0gRk9SQ0VfTE9HSU4gOiBIb3Jpem9udGFsXG4gICAqICAtIEFMTE9XX0lGUkFNRV9MT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XX0lGUkFNRV9MT0dJTilcbiAgICpcbiAgICogQ2FzZXM6XG4gICAqIDEuIERlbGF5IHJlc29sdmUgZnVuY3Rpb24gdGlsbCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgKiAyLiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICogMy4gRm9yY2UgdGhlIHJlZGlyZWN0XG4gICAqIDQuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKlxuICAgKiBOT1RFOlxuICAgKiBDYXNlIDEgYWJvdmUgd2lsbCBjYXVzZSB0aGlzIG1ldGhvZCdzIHByb21pc2UgdG8gYmUgYSBsb25nIHN0YWxsXG4gICAqIHVudGlsIHRoZSB1c2VyIGNvbXBsZXRlcyB0aGUgbG9naW4gcHJvY2Vzcy4gVGhpcyBzaG91bGQgYWxsb3cgdGhlXG4gICAqIGFwcCB0byBmb3JnbyBhIHJlbG9hZCBpcyBpdCBzaG91bGQgaGF2ZSB3YWl0ZWQgdGlsbCB0aGUgZW50aXJlXG4gICAqIHRpbWUgdGlsbCB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRVc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIFVzZXIgLSB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHJlc29sdmVkIHZpYSBQcm9taXNlXG4gICAqL1xuICBhc3luYyBnZXRVc2VyKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgLy8gRm9yIGJhc2ljIHRlc3RpbmdcbiAgICAvLyB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ3VzZXJBdXRoZW50aWNhdGVkJywgeyBuYW1lOiAndXNlcm5hbWUnfSlcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5jaGVjaygpO1xuICAgIGlmKHVzZXIpIHJldHVybiB1c2VyXG5cbiAgICAvLyBDYXNlIDEgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlclxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDMgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbCAvLyBvciByZWplY3Q/XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMgVXNlciBvciBudWxsXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj57XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vIElmIG5vIGxvY2FsIEpXVFxuICAgIGlmKCFqd3QpIHtcbiAgICAgIGNvbnN0IGZyZXNoSnd0ID0gYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoKTtcblxuICAgICAgcmV0dXJuIGp3dCAmJiBqd3QubGVuZ3RoID9cbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChmcmVzaEp3dCkgOlxuICAgICAgICAgICAgICBudWxsO1xuICAgIH1cbiAgICBpZighdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkpeyAvLyBHcmFudCB0b2tlblxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudCgpIC8vIENoZWNrIHdpdGggc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihqd3QgPT4gand0ICYmIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSkgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG5cbiAgICB9IGVsc2UgeyAvLyBJbXBsaWNpdCBKV1RcbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobnVsbCkgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgY2FsbCB0byBhIHNlcnZpY2UgaG9zdGluZyBub2RlLWdwb2F1dGggdG8gYWxsb3cgZm9yIGFcbiAgICogdG9rZW4gcmVmcmVzaCBvbiBhbiBleHBpcmVkIHRva2VuLCBvciBhIHRva2VuIHRoYXQgaGFzIGJlZW5cbiAgICogaW52YWxpZGF0ZWQgdG8gYmUgcmV2b2tlZC5cbiAgICpcbiAgICogTm90ZTogQ2xpZW50IGFzIGluIGhvc3RpbmcgYXBwbGljYXRpb246XG4gICAqICAgIGh0dHBzOi8vd3d3LmRpZ2l0YWxvY2Vhbi5jb20vY29tbXVuaXR5L3R1dG9yaWFscy9hbi1pbnRyb2R1Y3Rpb24tdG8tb2F1dGgtMlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrV2l0aENsaWVudFxuICAgKiBAcGFyYW0gand0IC0gZW5jb2RlZCBhY2Nlc3NUb2tlbi9KV1RcbiAgICpcbiAgICogQHJldHVybiBQcm9taXNlPGp3dD5cbiAgICovXG4gIGFzeW5jIGNoZWNrV2l0aENsaWVudCgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicgP1xuICAgICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICAgIGF4aW9zKGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vY2hlY2t0b2tlbmApXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpKVxuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRva2VuIGZyb20gY3VycmVudCBVUkxcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RGcm9tVXJsXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuIChyYXcgc3RyaW5nKVxuICAgKi9cbiAgZ2V0SldURnJvbVVybCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2gpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcbiAgICBjb25zdCByZXMgPSBxdWVyeVN0cmluZy5tYXRjaCgvYWNjZXNzX3Rva2VuPShbXlxcJl0qKS8pO1xuICAgIHJldHVybiByZXMgJiYgcmVzWzFdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBSUE0gbGlicmFyeSBsb2FkZWQgYWxyZWFkeT9cbiAgICovXG4gIFJQTUxvYWRlZCgpOiAgYm9vbGVhbiB7XG4gICByZXR1cm4gdHlwZW9mIHdpbmRvdy5SUE1TZXJ2aWNlICE9ICd1bmRlZmluZWQnXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGFzc29jaWF0ZWQgYXJyYXkgb2YgY29va2llcy5cbiAgICovXG4gIHByaXZhdGUgZ2V0Q29va2llT2JqZWN0KCk6IFN0cmluZ09iaiAge1xuICAgIHJldHVybiBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGMgPT4gYy50cmltKCkuc3BsaXQoJz0nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjOiBTdHJpbmdPYmosIHBhaXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NbcGFpclswXV0gPSBwYWlyWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSlcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGFuZCBkZWNvZGUgZnJvbSBjb29raWVcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRGcm9tQ29va2llKGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmF3ID0gdGhpcy5nZXRDb29raWVPYmplY3QoKVtrZXldXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IoZGVjb2RlVVJJQ29tcG9uZW50KHJhdykpIDpcbiAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgIH0gY2F0Y2ggKGUpeyAvLyBDYXRjaCBiYWQgZW5jb2Rpbmcgb3IgZm9ybWFsbHkgbm90IGVuY29kZWRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBKV1Qgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZVxuICAgKlxuICAgKiBAcmV0dXJuIEpXVCBUb2tlblxuICAgKi9cbiAgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEZyb21Db29raWUoQUNDRVNTX1RPS0VOX0NPT0tJRSlcbiAgfTtcblxuICAvKipcbiAgICogQXR0ZW1wdCBhbmQgcHVsbCBKV1QgZnJvbSB0aGUgZm9sbG93aW5nIGxvY2F0aW9ucyAoaW4gb3JkZXIpOlxuICAgKiAgLSBVUkwgcXVlcnkgcGFyYW1ldGVyICdhY2Nlc3NfdG9rZW4nIChyZXR1cm5lZCBmcm9tIElEUClcbiAgICogIC0gQnJvd3NlciBsb2NhbCBzdG9yYWdlIChzYXZlZCBmcm9tIHByZXZpb3VzIHJlcXVlc3QpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1QoKTogc3RyaW5nIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVEZyb21VcmwoKSB8fCB0aGlzLmdldEpXVGZyb21Mb2NhbFN0b3JhZ2UoKVxuICAgIC8vIE9ubHkgZGVueSBpbXBsaWNpdCB0b2tlbnMgdGhhdCBoYXZlIGV4cGlyZWRcbiAgICBpZighand0IHx8IChqd3QgJiYgdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gand0O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiBCb29sZWFuXG4gICAqL1xuICBpc0V4cGlyZWQoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICBpZihwYXJzZWRKV1Qpe1xuICAgICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICByZXR1cm4gbm93ID4gcGFyc2VkSldULmV4cDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhlIEpXVCBhbiBpbXBsaWNpdCBKV1Q/XG4gICAqIEBwYXJhbSBqd3RcbiAgICovXG4gIGlzSW1wbGljaXRKV1Qoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gcGFyc2VkSldUICYmIHBhcnNlZEpXVC5pbXBsaWNpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgKHNpZ25hdHVyZSBub3QgY2hlY2tlZCkgdW5wYWNraW5nIG9mIEpXVC5cbiAgICpcbiAgICogQHBhcmFtIHRva2VuIC0gQWNjZXNzIFRva2VuIChKV1QpXG4gICAqIEByZXR1cm4gdGhlIHBhcnNlZCBwYXlsb2FkIGluIHRoZSBKV1RcbiAgICovXG4gIHBhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKV1Qge1xuICAgIHZhciBwYXJzZWQ7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKCctJywgJysnKS5yZXBsYWNlKCdfJywgJy8nKTtcbiAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShhdG9iKGJhc2U2NCkpO1xuICAgICAgfSBjYXRjaChlKSB7IC8qIERvbid0IHRocm93IHBhcnNlIGVycm9yICovIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfTtcblxuICAvKipcbiAgICogU2ltcGxlIGZyb250IGVuZCB2YWxpZGlvbiB0byB2ZXJpZnkgSldUIGlzIGNvbXBsZXRlIGFuZCBub3RcbiAgICogZXhwaXJlZC5cbiAgICpcbiAgICogTm90ZTpcbiAgICogIFNpZ25hdHVyZSB2YWxpZGF0aW9uIGlzIHRoZSBvbmx5IHRydWx5IHNhdmUgbWV0aG9kLiBUaGlzIGlzIGRvbmVcbiAgICogIGF1dG9tYXRpY2FsbHkgaW4gdGhlIG5vZGUtZ3BvYXV0aCBtb2R1bGUuXG4gICAqL1xuICB2YWxpZGF0ZUp3dCh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIHBhcnNlZCA9IHRoaXMucGFyc2VKd3QodG9rZW4pO1xuICAgIHZhciB2YWxpZCA9IChwYXJzZWQgJiYgcGFyc2VkLmV4cCAmJiBwYXJzZWQuZXhwICogMTAwMCA+IERhdGUubm93KCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcbn1cblxuXG5leHBvcnQgY29uc3QgRGVmYXVsdEF1dGhDb25mOiBBdXRoQ29uZmlnID0ge1xuICBBVVRIX1RZUEU6ICdncmFudCcsXG4gIEFQUF9CQVNFX1VSTDogJycsIC8vIGFic29sdXRlIHBhdGggLy8gdXNlIC4gZm9yIHJlbGF0aXZlIHBhdGhcbiAgQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlLFxuICBGT1JDRV9MT0dJTjogZmFsc2UsXG4gIEFMTE9XX0RFVl9FRElUUzogZmFsc2Vcbn1cbiJdfQ==