/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
/** @type {?} */
const AUTH_STORAGE_KEY = 'gpoauthJWT';
/** @type {?} */
const REVOKE_RESPONSE = '<REVOKED>';
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
                self.removeAuth();
            }
        });
        self.init()
            .then(user => {
            if (this.config.ALLOW_SSO_LOGIN && !user && this.config.AUTH_TYPE === 'grant')
                self.ssoCheck();
        });
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
     * Security wrapper for obfuscating values passed into local storage
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    saveToLocalStorage(key, value) {
        localStorage.setItem(key, btoa(value));
    }
    ;
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
     * @return {?}
     */
    ssoCheck() {
        /** @type {?} */
        const self = this;
        /** @type {?} */
        const ssoURL = `${this.config.APP_BASE_URL}/login?sso=true&cachebuster=${(new Date()).getTime()}`;
        /** @type {?} */
        const ssoIframe = this.createIframe(ssoURL);
        // Setup ssoIframe specific handlers
        addEventListener('message', (event) => {
            // Handle SSO login failure
            if (event.data === 'iframe:ssoFailed') {
                if (ssoIframe && ssoIframe.remove) // IE 11 - gotcha
                    // IE 11 - gotcha
                    ssoIframe.remove();
                // Force login only after SSO has failed
                if (this.config.FORCE_LOGIN)
                    self.forceLogin();
            }
            // Handle User Authenticated
            if (event.data === 'iframe:userAuthenticated') {
                if (ssoIframe && ssoIframe.remove) // IE 11 - gotcha
                    // IE 11 - gotcha
                    ssoIframe.remove();
            }
        });
    }
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
            const jwt = this.getJWT();
            //clean hosturl on redirect from oauth
            if (this.getJWTFromUrl())
                this.removeTokenFromUrl();
            if (jwt) {
                this.setAuth(jwt);
                return this.getUserFromJWT(jwt);
            }
            else {
                // call to checkwith Server
                return yield this.getUser();
            }
        });
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
     * @return {?}
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
            // Create iframe to manually call the logout and remove gpoauth cookie
            // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
            if (this.config.IDP_BASE_URL)
                this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`);
            yield getJson(`${this.config.APP_BASE_URL}/revoke?sso=true`, this.getJWT());
            this.removeAuth(); // purge the JWT
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
     * @param {?=} callback optional function to invoke with the user
     * @return {?} object representing current user
     */
    getUserSync(callback) {
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
     * @return {?}
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
                addEventListener('message', (event) => {
                    // Handle SSO login failure
                    if (event.data === 'iframe:ssoFailed') {
                        return this.getUser();
                    }
                });
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
     * @return {?}
     */
    check() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const jwt = this.getJWT();
            // If no local JWT
            if (!jwt) {
                /** @type {?} */
                const freshJwt = yield this.checkWithClient("");
                return jwt && jwt.length ?
                    this.getUserFromJWT(freshJwt) :
                    null;
            }
            if (!this.isImplicitJWT(jwt)) { // Grant token
                // Grant token
                return this.isExpired(jwt) ?
                    yield this.checkWithClient(jwt)
                        .then(jwt => this.getUserFromJWT(jwt)) : // Check with server
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
     *
     * @param {?} originalJWT
     * @return {?}
     */
    checkWithClient(originalJWT) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.config.AUTH_TYPE === 'token') {
                return null;
            }
            else {
                /** @type {?} */
                const resp = yield axios(`${this.config.APP_BASE_URL}/checktoken`, {
                    headers: {
                        'Authorization': originalJWT ? `Bearer ${originalJWT}` : ''
                    }
                });
                /** @type {?} */
                const header = resp.headers['authorization'];
                /** @type {?} */
                const newJWT = header && header.replace('Bearer', '').trim();
                if (header && newJWT.length)
                    this.setAuth(newJWT);
                return newJWT ? newJWT : originalJWT;
            }
        });
    }
    /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?}
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
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?}
     */
    getJWTfromLocalStorage() {
        return this.getFromLocalStorage(AUTH_STORAGE_KEY);
    }
    ;
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * \@method getJWT
     *
     * @return {?}
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
     * Remove the JWT saved in local storge.
     *
     * \@method clearLocalStorageJWT
     *
     * @return {?}
     */
    clearLocalStorageJWT() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    ;
    /**
     * Is a token expired.
     *
     * \@method isExpired
     *
     * @param {?} jwt
     * @return {?}
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
     * @param {?} token
     * @return {?}
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
    /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {?} jwt
     * @return {?}
     */
    setAuth(jwt) {
        if (jwt == REVOKE_RESPONSE) {
            this.logout();
        }
        else {
            this.saveToLocalStorage(AUTH_STORAGE_KEY, jwt);
            this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt));
        }
    }
    ;
    /**
     * Purge the JWT from localStorage and authorization headers.
     * @return {?}
     */
    removeAuth() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        // Send null user as well (backwards compatability)
        this.messenger.broadcast("userAuthenticated", null);
        this.messenger.broadcast("userSignOut");
    }
    ;
}
if (false) {
    /** @type {?} */
    AuthService.prototype.config;
    /** @type {?} */
    AuthService.prototype.messenger;
}
/** @type {?} */
export const DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    // absolute path // use . for relative path
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    ALLOW_SSO_LOGIN: true
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQTs7QUFFekIsTUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUE7O0FBQ3JDLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQzs7Ozs7O0FBRXBDLGlCQUF1QixHQUFXLEVBQUUsR0FBWTs7O1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekQsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFBO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQzs7Q0FDbEI7Ozs7QUFNRCxNQUFNOzs7Ozs7O0lBYUosWUFBWSxNQUFrQixFQUFFLFdBQXdCOztRQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7O1FBRzVCLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFOztZQUV6QyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNaOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxJQUFJ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QyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDeEU7O0lBQ0YsQ0FBQzs7Ozs7SUFLTSxVQUFVO1FBQ2hCLFlBQVksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7UUFFekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7O0lBQ3hDLENBQUM7Q0FDSDs7Ozs7Ozs7QUFHRCxhQUFhLGVBQWUsR0FBZTtJQUN6QyxTQUFTLEVBQUUsT0FBTztJQUNsQixZQUFZLEVBQUUsRUFBRTs7SUFDaEIsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixXQUFXLEVBQUUsS0FBSztJQUNsQixlQUFlLEVBQUUsS0FBSztJQUN0QixlQUFlLEVBQUUsSUFBSTtDQUN0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmdNZXNzZW5nZXIsIEF1dGhDb25maWcsIEpXVCwgVXNlclByb2ZpbGUgfSBmcm9tICcuLi9zcmMvYXV0aFR5cGVzJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi9HZW9QbGF0Zm9ybVVzZXInXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cbmNvbnN0IEFVVEhfU1RPUkFHRV9LRVkgPSAnZ3BvYXV0aEpXVCdcbmNvbnN0IFJFVk9LRV9SRVNQT05TRSA9ICc8UkVWT0tFRD4nO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgcmV0dXJuIHJlc3AuZGF0YTtcbn1cblxuXG4vKipcbiAqIEF1dGhlbnRpY2F0aW9uIFNlcnZpY2VcbiAqL1xuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcblxuICBjb25maWc6IEF1dGhDb25maWdcbiAgbWVzc2VuZ2VyOiBuZ01lc3NlbmdlclxuXG4gIC8qKlxuICAgKlxuICAgKiBAY2xhc3MgQXV0aFNlcnZpY2VcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB7QXV0aENvbmZpZ30gY29uZmlnXG4gICAqIEBwYXJhbVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBdXRoQ29uZmlnLCBuZ01lc3NlbmdlcjogbmdNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHNlbGYucmVtb3ZlQXV0aCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gICAgICAudGhlbih1c2VyID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfU1NPX0xPR0lOICYmICF1c2VyICYmIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ2dyYW50JylcbiAgICAgICAgICBzZWxmLnNzb0NoZWNrKClcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBuZ01lc3NlbmdlciBzbyB0aGF0IGFwcGxpY3Rpb24gY29kZSBpcyBhYmxlIHRvXG4gICAqIHN1YnNjcmliZSB0byBub3RpZmljYXRpb25zIHNlbnQgYnkgbmctZ3BvYXV0aFxuICAgKi9cbiAgZ2V0TWVzc2VuZ2VyKCk6IG5nTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWN1cml0eSB3cmFwcGVyIGZvciBvYmZ1c2NhdGluZyB2YWx1ZXMgcGFzc2VkIGludG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBzYXZlVG9Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGJ0b2EodmFsdWUpKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmUgYW5kIGRlY29kZSB2YWx1ZSBmcm9tIGxvY2Fsc3RvcmFnZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRGcm9tTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IocmF3KSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlKXsgLy8gQ2F0Y2ggYmFkIGVuY29kaW5nIG9yIGZvcm1hbGx5IG5vdCBlbmNvZGVkXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHNzb0NoZWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNzb1VSTCA9IGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vbG9naW4/c3NvPXRydWUmY2FjaGVidXN0ZXI9JHsobmV3IERhdGUoKSkuZ2V0VGltZSgpfWBcbiAgICBjb25zdCBzc29JZnJhbWUgPSB0aGlzLmNyZWF0ZUlmcmFtZShzc29VUkwpXG5cbiAgICAvLyBTZXR1cCBzc29JZnJhbWUgc3BlY2lmaWMgaGFuZGxlcnNcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICAgIC8vIEZvcmNlIGxvZ2luIG9ubHkgYWZ0ZXIgU1NPIGhhcyBmYWlsZWRcbiAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICAvL2NsZWFuIGhvc3R1cmwgb24gcmVkaXJlY3QgZnJvbSBvYXV0aFxuICAgIGlmICh0aGlzLmdldEpXVEZyb21VcmwoKSkgdGhpcy5yZW1vdmVUb2tlbkZyb21VcmwoKVxuXG4gICAgaWYoand0KSB7XG4gICAgICB0aGlzLnNldEF1dGgoand0KVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjYWxsIHRvIGNoZWNrd2l0aCBTZXJ2ZXJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFVzZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBhY2Nlc3NfdG9rZW4gcHJvcGVydHkgZnJvbSB0aGUgVVJMLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVUb2tlbkZyb21VcmwoKTogdm9pZCB7XG4gICAgY29uc3QgcmVwbGFjZVJlZ2V4ID0gL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qKFxcJnRva2VuX3R5cGU9QmVhcmVyKT8vXG4gICAgaWYod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKXtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKSApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW52aXNhYmxlIGlmcmFtZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNyZWF0ZUlmcmFtZVxuICAgKiBAcmV0dXJucyB7SFRNTElGcmFtZUVsZW1lbnR9XG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZUlmcmFtZSh1cmw6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHtcbiAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJylcblxuICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgaWZyYW1lLnNyYyA9IHVybFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgIHJldHVybiBpZnJhbWVcbiAgfTtcblxuICAvKipcbiAgICogUmVkaXJlY3RzIG9yIGRpc3BsYXlzIGxvZ2luIHdpbmRvdyB0aGUgcGFnZSB0byB0aGUgbG9naW4gc2l0ZVxuICAgKi9cbiAgbG9naW4ocGF0aD86IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIENoZWNrIGltcGxpY2l0IHdlIG5lZWQgdG8gYWN0dWFsbHkgcmVkaXJlY3QgdGhlbVxuICAgIGNvbnN0IGxvYyA9IHBhdGggP1xuICAgICAgICAgICAgICAgIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHtwYXRofWAgOlxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLID9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuQ0FMTEJBQ0sgOlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiAvLyBkZWZhdWx0XG5cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQobG9jIHx8ICcvbG9naW4nKX1gXG5cbiAgICAvLyBPdGhlcndpc2UgcG9wIHVwIHRoZSBsb2dpbiBtb2RhbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZnJhbWUgbG9naW5cbiAgICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTil7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgnYXV0aDpyZXF1aXJlTG9naW4nKVxuXG4gICAgICAvLyBSZWRpcmVjdCBsb2dpblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dJTl9VUkxcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IGAvbG9naW4/cmVkaXJlY3RfdXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyl9YFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYmFja2dyb3VuZCBsb2dvdXQgYW5kIHJlcXVlc3RzIGp3dCByZXZva2F0aW9uXG4gICAqL1xuICBhc3luYyBsb2dvdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB0byBtYW51YWxseSBjYWxsIHRoZSBsb2dvdXQgYW5kIHJlbW92ZSBncG9hdXRoIGNvb2tpZVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNzU4MjA3L3doeS1pcy1wYXNzcG9ydGpzLWluLW5vZGUtbm90LXJlbW92aW5nLXNlc3Npb24tb24tbG9nb3V0I2Fuc3dlci0zMzc4Njg5OVxuICAgIGlmKHRoaXMuY29uZmlnLklEUF9CQVNFX1VSTClcbiAgICAgIHRoaXMuY3JlYXRlSWZyYW1lKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXV0aC9sb2dvdXRgKVxuXG4gICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZT9zc289dHJ1ZWAsIHRoaXMuZ2V0SldUKCkpXG4gICAgdGhpcy5yZW1vdmVBdXRoKCkgLy8gcHVyZ2UgdGhlIEpXVFxuXG4gICAgaWYodGhpcy5jb25maWcuTE9HT1VUX1VSTCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dPVVRfVVJMXG4gICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHRoaXMuZm9yY2VMb2dpbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIGZvcmNlIHJlZGlyZWN0IGZvciBub24tcHVibGljIHNlcnZpY2VzXG4gICAqL1xuICBmb3JjZUxvZ2luKCkge1xuICAgIHRoaXMubG9naW4oKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb3RlY3RlZCB1c2VyIHByb2ZpbGVcbiAgICovXG4gIGFzeW5jIGdldE9hdXRoUHJvZmlsZSgpOiBQcm9taXNlPFVzZXJQcm9maWxlPiB7XG4gICAgY29uc3QgSldUID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIHJldHVybiBKV1QgP1xuICAgICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2FwaS9wcm9maWxlYCwgSldUKSA6XG4gICAgICBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgVXNlciBvYmplY3QgZnJvbSB0aGUgSldULlxuICAgKlxuICAgKiBJZiBubyBKV1QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb29rZWQgZm9yIGF0IHRoZSBub3JtYWwgSldUXG4gICAqIGxvY2F0aW9ucyAobG9jYWxTdG9yYWdlIG9yIFVSTCBxdWVyeVN0cmluZykuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBband0XSAtIHRoZSBKV1QgdG8gZXh0cmFjdCB1c2VyIGZyb20uXG4gICAqL1xuICBnZXRVc2VyRnJvbUpXVChqd3Q6IHN0cmluZyk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiB1c2VyID9cbiAgICAgICAgICAgIG5ldyBHZW9QbGF0Zm9ybVVzZXIoT2JqZWN0LmFzc2lnbih7fSwgdXNlciwgeyBpZDogdXNlci5zdWIgfSkpIDpcbiAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSB1c2VyIChvciBudWxsKS5cbiAgICpcbiAgICogU2lkZSBFZmZlY3RzOlxuICAgKiAgLSBXaWxsIHJlZGlyZWN0IHVzZXJzIGlmIG5vIHZhbGlkIEpXVCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGludm9rZSB3aXRoIHRoZSB1c2VyXG4gICAqIEByZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyBjdXJyZW50IHVzZXJcbiAgICovXG4gIGdldFVzZXJTeW5jKGNhbGxiYWNrPzogKHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgICAgLy8gV2UgYWxsb3cgZnJvbnQgZW5kIHRvIGdldCB1c2VyIGRhdGEgaWYgZ3JhbnQgdHlwZSBhbmQgZXhwaXJlZFxuICAgICAgLy8gYmVjYXVzZSB0aGV5IHdpbGwgcmVjaWV2ZSBhIG5ldyB0b2tlbiBhdXRvbWF0aWNhbGx5IHdoZW5cbiAgICAgIC8vIG1ha2luZyBhIGNhbGwgdG8gdGhlIGNsaWVudChhcHBsaWNhdGlvbilcbiAgICAgIHJldHVybiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dfSUZSQU1FX0xPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dfSUZSQU1FX0xPR0lOKVxuICAgKlxuICAgKiBDYXNlczpcbiAgICogMS4gRGVsYXkgcmVzb2x2ZSBmdW5jdGlvbiB0aWxsIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAqIDIuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKiAzLiBGb3JjZSB0aGUgcmVkaXJlY3RcbiAgICogNC4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqXG4gICAqIE5PVEU6XG4gICAqIENhc2UgMSBhYm92ZSB3aWxsIGNhdXNlIHRoaXMgbWV0aG9kJ3MgcHJvbWlzZSB0byBiZSBhIGxvbmcgc3RhbGxcbiAgICogdW50aWwgdGhlIHVzZXIgY29tcGxldGVzIHRoZSBsb2dpbiBwcm9jZXNzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGVcbiAgICogYXBwIHRvIGZvcmdvIGEgcmVsb2FkIGlzIGl0IHNob3VsZCBoYXZlIHdhaXRlZCB0aWxsIHRoZSBlbnRpcmVcbiAgICogdGltZSB0aWxsIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldFVzZXJcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8VXNlcj59IFVzZXIgLSB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAqL1xuICBhc3luYyBnZXRVc2VyKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgLy8gRm9yIGJhc2ljIHRlc3RpbmdcbiAgICAvLyB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ3VzZXJBdXRoZW50aWNhdGVkJywgeyBuYW1lOiAndXNlcm5hbWUnfSlcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5jaGVjaygpO1xuICAgIGlmKHVzZXIpIHJldHVybiB1c2VyXG5cbiAgICAvLyBDYXNlIDEgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlclxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDMgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbCAvLyBvciByZWplY3Q/XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMge1VzZXJ9IC0gbmctY29tbW9uIHVzZXIgb2JqZWN0IG9yIG51bGxcbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgaWYoIWp3dCkge1xuICAgICAgY29uc3QgZnJlc2hKd3QgPSBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudChcIlwiKTtcblxuICAgICAgcmV0dXJuIGp3dCAmJiBqd3QubGVuZ3RoID9cbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChmcmVzaEp3dCkgOlxuICAgICAgICAgICAgICBudWxsO1xuICAgIH1cbiAgICBpZighdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkpeyAvLyBHcmFudCB0b2tlblxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudChqd3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oand0ID0+IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSkgOiAvLyBDaGVjayB3aXRoIHNlcnZlclxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG5cbiAgICB9IGVsc2UgeyAvLyBJbXBsaWNpdCBKV1RcbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobnVsbCkgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgY2FsbCB0byBhIHNlcnZpY2UgaG9zdGluZyBub2RlLWdwb2F1dGggdG8gYWxsb3cgZm9yIGFcbiAgICogdG9rZW4gcmVmcmVzaCBvbiBhbiBleHBpcmVkIHRva2VuLCBvciBhIHRva2VuIHRoYXQgaGFzIGJlZW5cbiAgICogaW52YWxpZGF0ZWQgdG8gYmUgcmV2b2tlZC5cbiAgICpcbiAgICogTm90ZTogQ2xpZW50IGFzIGluIGhvc3RpbmcgYXBwbGljYXRpb246XG4gICAqICAgIGh0dHBzOi8vd3d3LmRpZ2l0YWxvY2Vhbi5jb20vY29tbXVuaXR5L3R1dG9yaWFscy9hbi1pbnRyb2R1Y3Rpb24tdG8tb2F1dGgtMlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrV2l0aENsaWVudFxuICAgKiBAcGFyYW0ge2p3dH0gLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGp3dD59IC0gcHJvbWlzZSByZXNvbHZpbmcgd2l0aCBhIEpXVFxuICAgKi9cbiAgYXN5bmMgY2hlY2tXaXRoQ2xpZW50KG9yaWdpbmFsSldUOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyl7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBheGlvcyhgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2NoZWNrdG9rZW5gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbicgOiBvcmlnaW5hbEpXVCA/IGBCZWFyZXIgJHtvcmlnaW5hbEpXVH1gIDogJydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgY29uc3QgaGVhZGVyID0gcmVzcC5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cbiAgICAgIGNvbnN0IG5ld0pXVCA9IGhlYWRlciAmJiBoZWFkZXIucmVwbGFjZSgnQmVhcmVyJywnJykudHJpbSgpO1xuXG4gICAgICBpZihoZWFkZXIgJiYgbmV3SldULmxlbmd0aCkgdGhpcy5zZXRBdXRoKG5ld0pXVCk7XG4gICAgICByZXR1cm4gbmV3SldUID8gbmV3SldUIDogb3JpZ2luYWxKV1Q7XG4gICAgfVxuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRva2VuIGZyb20gY3VycmVudCBVUkxcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RGcm9tVXJsXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZyB8IHVuZGVmaW5lZH0gLSBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4ge0pXVCB8IHVuZGVmaW5lZH0gQW4gb2JqZWN0IHdpaCB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICovXG4gIGdldEpXVGZyb21Mb2NhbFN0b3JhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGcm9tTG9jYWxTdG9yYWdlKEFVVEhfU1RPUkFHRV9LRVkpXG4gIH07XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgYW5kIHB1bGwgSldUIGZyb20gdGhlIGZvbGxvd2luZyBsb2NhdGlvbnMgKGluIG9yZGVyKTpcbiAgICogIC0gVVJMIHF1ZXJ5IHBhcmFtZXRlciAnYWNjZXNzX3Rva2VuJyAocmV0dXJuZWQgZnJvbSBJRFApXG4gICAqICAtIEJyb3dzZXIgbG9jYWwgc3RvcmFnZSAoc2F2ZWQgZnJvbSBwcmV2aW91cyByZXF1ZXN0KVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdGluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICogQHJldHVybiAge3VuZGVmaW5lZH1cbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9TVE9SQUdFX0tFWSlcbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0ge0pXVH0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIEpXVCB0byBsb2NhbFN0b3JhZ2UgYW5kIGluIHRoZSByZXF1ZXN0IGhlYWRlcnMgZm9yIGFjY2Vzc2luZ1xuICAgKiBwcm90ZWN0ZWQgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gand0XG4gICAqL1xuICBwdWJsaWMgc2V0QXV0aChqd3Q6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmKGp3dCA9PSBSRVZPS0VfUkVTUE9OU0Upe1xuICAgICAgdGhpcy5sb2dvdXQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZShBVVRIX1NUT1JBR0VfS0VZLCBqd3QpXG4gICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpXG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQdXJnZSB0aGUgSldUIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBhdXRob3JpemF0aW9uIGhlYWRlcnMuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZUF1dGgoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9TVE9SQUdFX0tFWSlcbiAgICAvLyBTZW5kIG51bGwgdXNlciBhcyB3ZWxsIChiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSlcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCBudWxsKVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gIH07XG59XG5cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRBdXRoQ29uZjogQXV0aENvbmZpZyA9IHtcbiAgQVVUSF9UWVBFOiAnZ3JhbnQnLFxuICBBUFBfQkFTRV9VUkw6ICcnLCAvLyBhYnNvbHV0ZSBwYXRoIC8vIHVzZSAuIGZvciByZWxhdGl2ZSBwYXRoXG4gIEFMTE9XX0lGUkFNRV9MT0dJTjogdHJ1ZSxcbiAgRk9SQ0VfTE9HSU46IGZhbHNlLFxuICBBTExPV19ERVZfRURJVFM6IGZhbHNlLFxuICBBTExPV19TU09fTE9HSU46IHRydWVcbn1cbiJdfQ==