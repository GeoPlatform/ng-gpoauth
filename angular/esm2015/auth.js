/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
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
        // Create iframe to manually call the logout and remove gpoauth cookie
        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
        // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return this.getFromLocalStorage('gpoauthJWT');
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
        localStorage.removeItem('gpoauthJWT');
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
        this.saveToLocalStorage('gpoauthJWT', jwt);
        this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt));
    }
    ;
    /**
     * Purge the JWT from localStorage and authorization headers.
     * @return {?}
     */
    removeAuth() {
        localStorage.removeItem('gpoauthJWT');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQTs7Ozs7O0FBRXpCLGlCQUF1QixHQUFXLEVBQUUsR0FBWTs7O1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekQsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQyxDQUFBO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQzs7Q0FDbEI7Ozs7QUFLRCxNQUFNOzs7Ozs7O0lBYUosWUFBWSxNQUFrQixFQUFFLFdBQXdCOztRQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7O1FBRzVCLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFOztZQUV6QyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNaOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxJQUFJLEVBQUU7YUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDWCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMs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Q0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztJQUN4QyxDQUFDO0NBQ0g7Ozs7Ozs7O0FBR0QsYUFBYSxlQUFlLEdBQWU7SUFDekMsU0FBUyxFQUFFLE9BQU87SUFDbEIsWUFBWSxFQUFFLEVBQUU7O0lBQ2hCLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsZUFBZSxFQUFFLElBQUk7Q0FDdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBKV1QsIFVzZXJQcm9maWxlIH0gZnJvbSAnLi4vc3JjL2F1dGhUeXBlcydcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4vR2VvUGxhdGZvcm1Vc2VyJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgcmV0dXJuIHJlc3AuZGF0YTtcbn1cblxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbiBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgY29uZmlnOiBBdXRoQ29uZmlnXG4gIG1lc3NlbmdlcjogbmdNZXNzZW5nZXJcblxuICAvKipcbiAgICpcbiAgICogQGNsYXNzIEF1dGhTZXJ2aWNlXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge0F1dGhDb25maWd9IGNvbmZpZ1xuICAgKiBAcGFyYW1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQXV0aENvbmZpZywgbmdNZXNzZW5nZXI6IG5nTWVzc2VuZ2VyKXtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1lc3NlbmdlciA9IG5nTWVzc2VuZ2VyXG5cbiAgICAvLyBTZXR1cCBnZW5lcmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFsd2F5cyBydW5cbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgc2VsZi5pbml0KCkgLy8gd2lsbCBicm9hZGNhc3QgdG8gYW5ndWxhciAoc2lkZS1lZmZlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBsb2dvdXQgZXZlbnRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICd1c2VyU2lnbk91dCcpe1xuICAgICAgICBzZWxmLnJlbW92ZUF1dGgoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBzZWxmLmluaXQoKVxuICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX1NTT19MT0dJTiAmJiAhdXNlciAmJiB0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICdncmFudCcpXG4gICAgICAgICAgc2VsZi5zc29DaGVjaygpXG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgbmdNZXNzZW5nZXIgc28gdGhhdCBhcHBsaWN0aW9uIGNvZGUgaXMgYWJsZSB0b1xuICAgKiBzdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBzZW50IGJ5IG5nLWdwb2F1dGhcbiAgICovXG4gIGdldE1lc3NlbmdlcigpOiBuZ01lc3NlbmdlciB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2VuZ2VyXG4gIH1cblxuICAvKipcbiAgICogU2VjdXJpdHkgd3JhcHBlciBmb3Igb2JmdXNjYXRpbmcgdmFsdWVzIHBhc3NlZCBpbnRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgc2F2ZVRvTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBidG9hKHZhbHVlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuZCBkZWNvZGUgdmFsdWUgZnJvbSBsb2NhbHN0b3JhZ2VcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgZ2V0RnJvbUxvY2FsU3RvcmFnZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgIHRyeXtcbiAgICAgIHJldHVybiByYXcgP1xuICAgICAgICAgICAgICBhdG9iKHJhdykgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBzc29DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzc29VUkwgPSBgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2xvZ2luP3Nzbz10cnVlJmNhY2hlYnVzdGVyPSR7KG5ldyBEYXRlKCkpLmdldFRpbWUoKX1gXG4gICAgY29uc3Qgc3NvSWZyYW1lID0gdGhpcy5jcmVhdGVJZnJhbWUoc3NvVVJMKVxuXG4gICAgLy8gU2V0dXAgc3NvSWZyYW1lIHNwZWNpZmljIGhhbmRsZXJzXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgICAvLyBGb3JjZSBsb2dpbiBvbmx5IGFmdGVyIFNTTyBoYXMgZmFpbGVkXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSBzZWxmLmZvcmNlTG9naW4oKVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV2Uga2VlcCB0aGlzIG91dHNpZGUgdGhlIGNvbnN0cnVjdG9yIHNvIHRoYXQgb3RoZXIgc2VydmljZXMgY2FsbFxuICAgKiBjYWxsIGl0IHRvIHRyaWdnZXIgdGhlIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXQoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+IHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy9jbGVhbiBob3N0dXJsIG9uIHJlZGlyZWN0IGZyb20gb2F1dGhcbiAgICBpZiAodGhpcy5nZXRKV1RGcm9tVXJsKCkpIHRoaXMucmVtb3ZlVG9rZW5Gcm9tVXJsKClcblxuICAgIGlmKGp3dCkge1xuICAgICAgdGhpcy5zZXRBdXRoKGp3dClcbiAgICAgIHJldHVybiB0aGlzLmdldFVzZXJGcm9tSldUKGp3dClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2FsbCB0byBjaGVja3dpdGggU2VydmVyXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRVc2VyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgYWNjZXNzX3Rva2VuIHByb3BlcnR5IGZyb20gdGhlIFVSTC5cbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlVG9rZW5Gcm9tVXJsKCk6IHZvaWQge1xuICAgIGNvbnN0IHJlcGxhY2VSZWdleCA9IC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKihcXCZ0b2tlbl90eXBlPUJlYXJlcik/L1xuICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJykgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGludmlzYWJsZSBpZnJhbWUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBjcmVhdGVJZnJhbWVcbiAgICogQHJldHVybnMge0hUTUxJRnJhbWVFbGVtZW50fVxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVJZnJhbWUodXJsOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XG4gICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmcmFtZS5zcmMgPSB1cmxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICByZXR1cm4gaWZyYW1lXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZGlyZWN0cyBvciBkaXNwbGF5cyBsb2dpbiB3aW5kb3cgdGhlIHBhZ2UgdG8gdGhlIGxvZ2luIHNpdGVcbiAgICovXG4gIGxvZ2luKHBhdGg/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBjb25zdCBsb2MgPSBwYXRoID9cbiAgICAgICAgICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7cGF0aH1gIDpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLIDpcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgLy8gZGVmYXVsdFxuXG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLklEUF9CQVNFX1VSTCArXG4gICAgICAgICAgICAgIGAvYXV0aC9hdXRob3JpemU/Y2xpZW50X2lkPSR7dGhpcy5jb25maWcuQVBQX0lEfWAgK1xuICAgICAgICAgICAgICBgJnJlc3BvbnNlX3R5cGU9JHt0aGlzLmNvbmZpZy5BVVRIX1RZUEV9YCArXG4gICAgICAgICAgICAgIGAmcmVkaXJlY3RfdXJpPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyB8fCAnL2xvZ2luJyl9YFxuXG4gICAgLy8gT3RoZXJ3aXNlIHBvcCB1cCB0aGUgbG9naW4gbW9kYWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWZyYW1lIGxvZ2luXG4gICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4pe1xuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ2F1dGg6cmVxdWlyZUxvZ2luJylcblxuICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIENyZWF0ZSBpZnJhbWUgdG8gbWFudWFsbHkgY2FsbCB0aGUgbG9nb3V0IGFuZCByZW1vdmUgZ3BvYXV0aCBjb29raWVcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzc1ODIwNy93aHktaXMtcGFzc3BvcnRqcy1pbi1ub2RlLW5vdC1yZW1vdmluZy1zZXNzaW9uLW9uLWxvZ291dCNhbnN3ZXItMzM3ODY4OTlcbiAgICAvLyB0aGlzLmNyZWF0ZUlmcmFtZShgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2F1dGgvbG9nb3V0YClcblxuICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgIHRoaXMucmVtb3ZlQXV0aCgpIC8vIHB1cmdlIHRoZSBKV1RcblxuICAgIGlmKHRoaXMuY29uZmlnLkxPR09VVF9VUkwpIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HT1VUX1VSTFxuICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSB0aGlzLmZvcmNlTG9naW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBmb3JjZSByZWRpcmVjdCBmb3Igbm9uLXB1YmxpYyBzZXJ2aWNlc1xuICAgKi9cbiAgZm9yY2VMb2dpbigpIHtcbiAgICB0aGlzLmxvZ2luKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBwcm90ZWN0ZWQgdXNlciBwcm9maWxlXG4gICAqL1xuICBhc3luYyBnZXRPYXV0aFByb2ZpbGUoKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICAgIGNvbnN0IEpXVCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICByZXR1cm4gSldUID9cbiAgICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hcGkvcHJvZmlsZWAsIEpXVCkgOlxuICAgICAgbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IFVzZXIgb2JqZWN0IGZyb20gdGhlIEpXVC5cbiAgICpcbiAgICogSWYgbm8gSldUIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgbG9va2VkIGZvciBhdCB0aGUgbm9ybWFsIEpXVFxuICAgKiBsb2NhdGlvbnMgKGxvY2FsU3RvcmFnZSBvciBVUkwgcXVlcnlTdHJpbmcpLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gW2p3dF0gLSB0aGUgSldUIHRvIGV4dHJhY3QgdXNlciBmcm9tLlxuICAgKi9cbiAgZ2V0VXNlckZyb21KV1Qoand0OiBzdHJpbmcpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gdXNlciA/XG4gICAgICAgICAgICBuZXcgR2VvUGxhdGZvcm1Vc2VyKE9iamVjdC5hc3NpZ24oe30sIHVzZXIsIHsgaWQ6IHVzZXIuc3ViIH0pKSA6XG4gICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgKiB3aWxsIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSwgaXQgcmV0dXJucyB0aGUgdXNlciAob3IgbnVsbCkuXG4gICAqXG4gICAqIFNpZGUgRWZmZWN0czpcbiAgICogIC0gV2lsbCByZWRpcmVjdCB1c2VycyBpZiBubyB2YWxpZCBKV1Qgd2FzIGZvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayBvcHRpb25hbCBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCB0aGUgdXNlclxuICAgKiBAcmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgY3VycmVudCB1c2VyXG4gICAqL1xuICBnZXRVc2VyU3luYyhjYWxsYmFjaz86ICh1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAgIC8vIGJlY2F1c2UgdGhleSB3aWxsIHJlY2lldmUgYSBuZXcgdG9rZW4gYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbWlzZSB2ZXJzaW9uIG9mIGdldCB1c2VyLlxuICAgKlxuICAgKiBCZWxvdyBpcyBhIHRhYmxlIG9mIGhvdyB0aGlzIGZ1bmN0aW9uIGhhbmRlbHMgdGhpcyBtZXRob2Qgd2l0aFxuICAgKiBkaWZmZXJudCBjb25maWd1cmF0aW9ucy5cbiAgICogIC0gRk9SQ0VfTE9HSU4gOiBIb3Jpem9udGFsXG4gICAqICAtIEFMTE9XX0lGUkFNRV9MT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XX0lGUkFNRV9MT0dJTilcbiAgICpcbiAgICogQ2FzZXM6XG4gICAqIDEuIERlbGF5IHJlc29sdmUgZnVuY3Rpb24gdGlsbCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgKiAyLiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICogMy4gRm9yY2UgdGhlIHJlZGlyZWN0XG4gICAqIDQuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKlxuICAgKiBOT1RFOlxuICAgKiBDYXNlIDEgYWJvdmUgd2lsbCBjYXVzZSB0aGlzIG1ldGhvZCdzIHByb21pc2UgdG8gYmUgYSBsb25nIHN0YWxsXG4gICAqIHVudGlsIHRoZSB1c2VyIGNvbXBsZXRlcyB0aGUgbG9naW4gcHJvY2Vzcy4gVGhpcyBzaG91bGQgYWxsb3cgdGhlXG4gICAqIGFwcCB0byBmb3JnbyBhIHJlbG9hZCBpcyBpdCBzaG91bGQgaGF2ZSB3YWl0ZWQgdGlsbCB0aGUgZW50aXJlXG4gICAqIHRpbWUgdGlsbCB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRVc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFVzZXI+fSBVc2VyIC0gdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuICAgKi9cbiAgYXN5bmMgZ2V0VXNlcigpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIC8vIEZvciBiYXNpYyB0ZXN0aW5nXG4gICAgLy8gdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCd1c2VyQXV0aGVudGljYXRlZCcsIHsgbmFtZTogJ3VzZXJuYW1lJ30pXG5cbiAgICAvLyByZXR1cm4gbmV3IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMuY2hlY2soKTtcbiAgICBpZih1c2VyKSByZXR1cm4gdXNlclxuXG4gICAgLy8gQ2FzZSAxIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgLy8gUmVzb2x2ZSB3aXRoIHVzZXIgb25jZSB0aGV5IGhhdmUgbG9nZ2VkIGluXG4gICAgICB0aGlzLm1lc3Nlbmdlci5vbigndXNlckF1dGhlbnRpY2F0ZWQnLCAoZXZlbnQ6IEV2ZW50LCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHVzZXJcbiAgICAgIH0pXG4gICAgfVxuICAgIC8vIENhc2UgMiAtIEFMTE9XX0lGUkFNRV9MT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiBmYWxzZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiAhdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgLy8gQ2FzZSAzIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgLy8gSGFuZGxlIFNTTyBsb2dpbiBmYWlsdXJlXG4gICAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlcigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDQgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiAhdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgcmV0dXJuIG51bGwgLy8gb3IgcmVqZWN0P1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgZnVuY3Rpb24gYmVpbmcgdXNlZCBieSBzb21lIGZyb250IGVuZCBhcHBzIGFscmVhZHkuXG4gICAqICh3cmFwcGVyIGZvciBnZXRVc2VyKVxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrXG4gICAqIEByZXR1cm5zIHtVc2VyfSAtIG5nLWNvbW1vbiB1c2VyIG9iamVjdCBvciBudWxsXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj57XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vIElmIG5vIGxvY2FsIEpXVFxuICAgIGlmKCFqd3QpIHtcbiAgICAgIGNvbnN0IGZyZXNoSnd0ID0gYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoXCJcIik7XG5cbiAgICAgIHJldHVybiBqd3QgJiYgand0Lmxlbmd0aCA/XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1QoZnJlc2hKd3QpIDpcbiAgICAgICAgICAgICAgbnVsbDtcbiAgICB9XG4gICAgaWYoIXRoaXMuaXNJbXBsaWNpdEpXVChqd3QpKXsgLy8gR3JhbnQgdG9rZW5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoand0KVxuICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpIDogLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuXG4gICAgfSBlbHNlIHsgLy8gSW1wbGljaXQgSldUXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG51bGwpIDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBzZXJ2aWNlIGhvc3Rpbmcgbm9kZS1ncG9hdXRoIHRvIGFsbG93IGZvciBhXG4gICAqIHRva2VuIHJlZnJlc2ggb24gYW4gZXhwaXJlZCB0b2tlbiwgb3IgYSB0b2tlbiB0aGF0IGhhcyBiZWVuXG4gICAqIGludmFsaWRhdGVkIHRvIGJlIHJldm9rZWQuXG4gICAqXG4gICAqIE5vdGU6IENsaWVudCBhcyBpbiBob3N0aW5nIGFwcGxpY2F0aW9uOlxuICAgKiAgICBodHRwczovL3d3dy5kaWdpdGFsb2NlYW4uY29tL2NvbW11bml0eS90dXRvcmlhbHMvYW4taW50cm9kdWN0aW9uLXRvLW9hdXRoLTJcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1dpdGhDbGllbnRcbiAgICogQHBhcmFtIHtqd3R9IC0gZW5jb2RlZCBhY2Nlc3NUb2tlbi9KV1RcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxqd3Q+fSAtIHByb21pc2UgcmVzb2x2aW5nIHdpdGggYSBKV1RcbiAgICovXG4gIGFzeW5jIGNoZWNrV2l0aENsaWVudChvcmlnaW5hbEpXVDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpe1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9IGVsc2Uge1xuXG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgYXhpb3MoYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9jaGVja3Rva2VuYCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nIDogb3JpZ2luYWxKV1QgPyBgQmVhcmVyICR7b3JpZ2luYWxKV1R9YCA6ICcnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGhlYWRlciA9IHJlc3AuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXG4gICAgICBjb25zdCBuZXdKV1QgPSBoZWFkZXIgJiYgaGVhZGVyLnJlcGxhY2UoJ0JlYXJlcicsJycpLnRyaW0oKTtcblxuICAgICAgaWYoaGVhZGVyICYmIG5ld0pXVC5sZW5ndGgpIHRoaXMuc2V0QXV0aChuZXdKV1QpO1xuICAgICAgcmV0dXJuIG5ld0pXVCA/IG5ld0pXVCA6IG9yaWdpbmFsSldUO1xuICAgIH1cbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogRXh0cmFjdCB0b2tlbiBmcm9tIGN1cnJlbnQgVVJMXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldURnJvbVVybFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmcgfCB1bmRlZmluZWR9IC0gSldUIFRva2VuIChyYXcgc3RyaW5nKVxuICAgKi9cbiAgZ2V0SldURnJvbVVybCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2gpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcbiAgICBjb25zdCByZXMgPSBxdWVyeVN0cmluZy5tYXRjaCgvYWNjZXNzX3Rva2VuPShbXlxcJl0qKS8pO1xuICAgIHJldHVybiByZXMgJiYgcmVzWzFdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBKV1Qgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZVxuICAgKlxuICAgKiBAcmV0dXJuIHtKV1QgfCB1bmRlZmluZWR9IEFuIG9iamVjdCB3aWggdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSgnZ3BvYXV0aEpXVCcpXG4gIH07XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgYW5kIHB1bGwgSldUIGZyb20gdGhlIGZvbGxvd2luZyBsb2NhdGlvbnMgKGluIG9yZGVyKTpcbiAgICogIC0gVVJMIHF1ZXJ5IHBhcmFtZXRlciAnYWNjZXNzX3Rva2VuJyAocmV0dXJuZWQgZnJvbSBJRFApXG4gICAqICAtIEJyb3dzZXIgbG9jYWwgc3RvcmFnZSAoc2F2ZWQgZnJvbSBwcmV2aW91cyByZXF1ZXN0KVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdGluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICogQHJldHVybiAge3VuZGVmaW5lZH1cbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSB7SldUfSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNFeHBpcmVkKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgaWYocGFyc2VkSldUKXtcbiAgICAgIGNvbnN0IG5vdyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgcmV0dXJuIG5vdyA+IHBhcnNlZEpXVC5leHA7XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoZSBKV1QgYW4gaW1wbGljaXQgSldUP1xuICAgKiBAcGFyYW0gand0XG4gICAqL1xuICBpc0ltcGxpY2l0SldUKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHBhcnNlZEpXVCAmJiBwYXJzZWRKV1QuaW1wbGljaXQ7XG4gIH1cblxuICAvKipcbiAgICogVW5zYWZlIChzaWduYXR1cmUgbm90IGNoZWNrZWQpIHVucGFja2luZyBvZiBKV1QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIEFjY2VzcyBUb2tlbiAoSldUKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBwYXJzZWQgcGF5bG9hZCBpbiB0aGUgSldUXG4gICAqL1xuICBwYXJzZUp3dCh0b2tlbjogc3RyaW5nKTogSldUIHtcbiAgICB2YXIgcGFyc2VkO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGJhc2U2NFVybCA9IHRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgnLScsICcrJykucmVwbGFjZSgnXycsICcvJyk7XG4gICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UoYXRvYihiYXNlNjQpKTtcbiAgICAgIH0gY2F0Y2goZSkgeyAvKiBEb24ndCB0aHJvdyBwYXJzZSBlcnJvciAqLyB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBmcm9udCBlbmQgdmFsaWRpb24gdG8gdmVyaWZ5IEpXVCBpcyBjb21wbGV0ZSBhbmQgbm90XG4gICAqIGV4cGlyZWQuXG4gICAqXG4gICAqIE5vdGU6XG4gICAqICBTaWduYXR1cmUgdmFsaWRhdGlvbiBpcyB0aGUgb25seSB0cnVseSBzYXZlIG1ldGhvZC4gVGhpcyBpcyBkb25lXG4gICAqICBhdXRvbWF0aWNhbGx5IGluIHRoZSBub2RlLWdwb2F1dGggbW9kdWxlLlxuICAgKi9cbiAgdmFsaWRhdGVKd3QodG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciBwYXJzZWQgPSB0aGlzLnBhcnNlSnd0KHRva2VuKTtcbiAgICB2YXIgdmFsaWQgPSAocGFyc2VkICYmIHBhcnNlZC5leHAgJiYgcGFyc2VkLmV4cCAqIDEwMDAgPiBEYXRlLm5vdygpKSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4gdmFsaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgSldUIHRvIGxvY2FsU3RvcmFnZSBhbmQgaW4gdGhlIHJlcXVlc3QgaGVhZGVycyBmb3IgYWNjZXNzaW5nXG4gICAqIHByb3RlY3RlZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBqd3RcbiAgICovXG4gIHB1YmxpYyBzZXRBdXRoKGp3dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoJ2dwb2F1dGhKV1QnLCBqd3QpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKVxuICB9O1xuXG4gIC8qKlxuICAgKiBQdXJnZSB0aGUgSldUIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBhdXRob3JpemF0aW9uIGhlYWRlcnMuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZUF1dGgoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICAgIC8vIFNlbmQgbnVsbCB1c2VyIGFzIHdlbGwgKGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5KVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlclNpZ25PdXRcIilcbiAgfTtcbn1cblxuXG5leHBvcnQgY29uc3QgRGVmYXVsdEF1dGhDb25mOiBBdXRoQ29uZmlnID0ge1xuICBBVVRIX1RZUEU6ICdncmFudCcsXG4gIEFQUF9CQVNFX1VSTDogJycsIC8vIGFic29sdXRlIHBhdGggLy8gdXNlIC4gZm9yIHJlbGF0aXZlIHBhdGhcbiAgQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlLFxuICBGT1JDRV9MT0dJTjogZmFsc2UsXG4gIEFMTE9XX0RFVl9FRElUUzogZmFsc2UsXG4gIEFMTE9XX1NTT19MT0dJTjogdHJ1ZVxufVxuIl19