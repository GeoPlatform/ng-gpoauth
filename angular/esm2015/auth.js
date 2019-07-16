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
     * @return {?} User or null
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
     * @param {?} originalJWT
     * @return {?} Promise<jwt>
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
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?} JWT Token
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
    /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {?} jwt - JWT
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOztBQUV6QixNQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQTs7QUFDckMsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDOzs7Ozs7QUFFcEMsaUJBQXVCLEdBQVcsRUFBRSxHQUFZOzs7UUFDOUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNaLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN6RCxZQUFZLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUE7UUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDOztDQUNsQjs7OztBQU1ELE1BQU07Ozs7Ozs7O0lBWUosWUFBWSxNQUFrQixFQUFFLFdBQXdCOztRQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7O1FBRzVCLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFOztZQUV6QyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNaOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUVGLElB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Q0wsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUN4RTs7SUFDRixDQUFDOzs7OztJQUtNLFVBQVU7UUFDaEIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBOztRQUV6QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTs7SUFDeEMsQ0FBQztDQUNIOzs7Ozs7OztBQUdELGFBQWEsZUFBZSxHQUFlO0lBQ3pDLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLFlBQVksRUFBRSxFQUFFOztJQUNoQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLGVBQWUsRUFBRSxJQUFJO0NBQ3RCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSB9IGZyb20gJy4uL3NyYy9hdXRoVHlwZXMnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlcidcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblxuY29uc3QgQVVUSF9TVE9SQUdFX0tFWSA9ICdncG9hdXRoSldUJ1xuY29uc3QgUkVWT0tFX1JFU1BPTlNFID0gJzxSRVZPS0VEPic7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEpzb24odXJsOiBzdHJpbmcsIGp3dD86IHN0cmluZykge1xuICBjb25zdCByZXNwID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbicgOiBqd3QgPyBgQmVhcmVyICR7and0fWAgOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICByZXR1cm4gcmVzcC5kYXRhO1xufVxuXG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG5cbiAgLyoqXG4gICAqXG4gICAqIEF1dGhTZXJ2aWNlXG4gICAqIFxuICAgKiBAcGFyYW0gY29uZmlnXG4gICAqIEBwYXJhbVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBdXRoQ29uZmlnLCBuZ01lc3NlbmdlcjogbmdNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHNlbGYucmVtb3ZlQXV0aCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gICAgICAudGhlbih1c2VyID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfU1NPX0xPR0lOICYmICF1c2VyICYmIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ2dyYW50JylcbiAgICAgICAgICBzZWxmLnNzb0NoZWNrKClcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBuZ01lc3NlbmdlciBzbyB0aGF0IGFwcGxpY3Rpb24gY29kZSBpcyBhYmxlIHRvXG4gICAqIHN1YnNjcmliZSB0byBub3RpZmljYXRpb25zIHNlbnQgYnkgbmctZ3BvYXV0aFxuICAgKi9cbiAgZ2V0TWVzc2VuZ2VyKCk6IG5nTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWN1cml0eSB3cmFwcGVyIGZvciBvYmZ1c2NhdGluZyB2YWx1ZXMgcGFzc2VkIGludG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBzYXZlVG9Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGJ0b2EodmFsdWUpKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmUgYW5kIGRlY29kZSB2YWx1ZSBmcm9tIGxvY2Fsc3RvcmFnZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRGcm9tTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IocmF3KSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlKXsgLy8gQ2F0Y2ggYmFkIGVuY29kaW5nIG9yIGZvcm1hbGx5IG5vdCBlbmNvZGVkXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHNzb0NoZWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNzb1VSTCA9IGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vbG9naW4/c3NvPXRydWUmY2FjaGVidXN0ZXI9JHsobmV3IERhdGUoKSkuZ2V0VGltZSgpfWBcbiAgICBjb25zdCBzc29JZnJhbWUgPSB0aGlzLmNyZWF0ZUlmcmFtZShzc29VUkwpXG5cbiAgICAvLyBTZXR1cCBzc29JZnJhbWUgc3BlY2lmaWMgaGFuZGxlcnNcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICAgIC8vIEZvcmNlIGxvZ2luIG9ubHkgYWZ0ZXIgU1NPIGhhcyBmYWlsZWRcbiAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICAvL2NsZWFuIGhvc3R1cmwgb24gcmVkaXJlY3QgZnJvbSBvYXV0aFxuICAgIGlmICh0aGlzLmdldEpXVEZyb21VcmwoKSkgdGhpcy5yZW1vdmVUb2tlbkZyb21VcmwoKVxuXG4gICAgaWYoand0KSB7XG4gICAgICB0aGlzLnNldEF1dGgoand0KVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjYWxsIHRvIGNoZWNrd2l0aCBTZXJ2ZXJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFVzZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBhY2Nlc3NfdG9rZW4gcHJvcGVydHkgZnJvbSB0aGUgVVJMLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVUb2tlbkZyb21VcmwoKTogdm9pZCB7XG4gICAgY29uc3QgcmVwbGFjZVJlZ2V4ID0gL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qKFxcJnRva2VuX3R5cGU9QmVhcmVyKT8vXG4gICAgaWYod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKXtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKSApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW52aXNhYmxlIGlmcmFtZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNyZWF0ZUlmcmFtZVxuICAgKiBAcmV0dXJucyBIVE1MSUZyYW1lRWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVJZnJhbWUodXJsOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XG4gICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmcmFtZS5zcmMgPSB1cmxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICByZXR1cm4gaWZyYW1lXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZGlyZWN0cyBvciBkaXNwbGF5cyBsb2dpbiB3aW5kb3cgdGhlIHBhZ2UgdG8gdGhlIGxvZ2luIHNpdGVcbiAgICovXG4gIGxvZ2luKHBhdGg/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBjb25zdCBsb2MgPSBwYXRoID9cbiAgICAgICAgICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7cGF0aH1gIDpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLIDpcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgLy8gZGVmYXVsdFxuXG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLklEUF9CQVNFX1VSTCArXG4gICAgICAgICAgICAgIGAvYXV0aC9hdXRob3JpemU/Y2xpZW50X2lkPSR7dGhpcy5jb25maWcuQVBQX0lEfWAgK1xuICAgICAgICAgICAgICBgJnJlc3BvbnNlX3R5cGU9JHt0aGlzLmNvbmZpZy5BVVRIX1RZUEV9YCArXG4gICAgICAgICAgICAgIGAmcmVkaXJlY3RfdXJpPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyB8fCAnL2xvZ2luJyl9YFxuXG4gICAgLy8gT3RoZXJ3aXNlIHBvcCB1cCB0aGUgbG9naW4gbW9kYWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWZyYW1lIGxvZ2luXG4gICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4pe1xuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ2F1dGg6cmVxdWlyZUxvZ2luJylcblxuICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIENyZWF0ZSBpZnJhbWUgdG8gbWFudWFsbHkgY2FsbCB0aGUgbG9nb3V0IGFuZCByZW1vdmUgZ3BvYXV0aCBjb29raWVcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzc1ODIwNy93aHktaXMtcGFzc3BvcnRqcy1pbi1ub2RlLW5vdC1yZW1vdmluZy1zZXNzaW9uLW9uLWxvZ291dCNhbnN3ZXItMzM3ODY4OTlcbiAgICBpZih0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkwpXG4gICAgICB0aGlzLmNyZWF0ZUlmcmFtZShgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2F1dGgvbG9nb3V0YClcblxuICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgIHRoaXMucmVtb3ZlQXV0aCgpIC8vIHB1cmdlIHRoZSBKV1RcblxuICAgIGlmKHRoaXMuY29uZmlnLkxPR09VVF9VUkwpIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HT1VUX1VSTFxuICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSB0aGlzLmZvcmNlTG9naW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBmb3JjZSByZWRpcmVjdCBmb3Igbm9uLXB1YmxpYyBzZXJ2aWNlc1xuICAgKi9cbiAgZm9yY2VMb2dpbigpIHtcbiAgICB0aGlzLmxvZ2luKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBwcm90ZWN0ZWQgdXNlciBwcm9maWxlXG4gICAqL1xuICBhc3luYyBnZXRPYXV0aFByb2ZpbGUoKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICAgIGNvbnN0IEpXVCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICByZXR1cm4gSldUID9cbiAgICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hcGkvcHJvZmlsZWAsIEpXVCkgOlxuICAgICAgbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IFVzZXIgb2JqZWN0IGZyb20gdGhlIEpXVC5cbiAgICpcbiAgICogSWYgbm8gSldUIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgbG9va2VkIGZvciBhdCB0aGUgbm9ybWFsIEpXVFxuICAgKiBsb2NhdGlvbnMgKGxvY2FsU3RvcmFnZSBvciBVUkwgcXVlcnlTdHJpbmcpLlxuICAgKlxuICAgKiBAcGFyYW0gW2p3dF0gLSB0aGUgSldUIHRvIGV4dHJhY3QgdXNlciBmcm9tLlxuICAgKi9cbiAgZ2V0VXNlckZyb21KV1Qoand0OiBzdHJpbmcpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gdXNlciA/XG4gICAgICAgICAgICBuZXcgR2VvUGxhdGZvcm1Vc2VyKE9iamVjdC5hc3NpZ24oe30sIHVzZXIsIHsgaWQ6IHVzZXIuc3ViIH0pKSA6XG4gICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgKiB3aWxsIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSwgaXQgcmV0dXJucyB0aGUgdXNlciAob3IgbnVsbCkuXG4gICAqXG4gICAqIFNpZGUgRWZmZWN0czpcbiAgICogIC0gV2lsbCByZWRpcmVjdCB1c2VycyBpZiBubyB2YWxpZCBKV1Qgd2FzIGZvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayBvcHRpb25hbCBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCB0aGUgdXNlclxuICAgKiBAcmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgY3VycmVudCB1c2VyXG4gICAqL1xuICBnZXRVc2VyU3luYyhjYWxsYmFjaz86ICh1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAgIC8vIGJlY2F1c2UgdGhleSB3aWxsIHJlY2lldmUgYSBuZXcgdG9rZW4gYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbWlzZSB2ZXJzaW9uIG9mIGdldCB1c2VyLlxuICAgKlxuICAgKiBCZWxvdyBpcyBhIHRhYmxlIG9mIGhvdyB0aGlzIGZ1bmN0aW9uIGhhbmRlbHMgdGhpcyBtZXRob2Qgd2l0aFxuICAgKiBkaWZmZXJudCBjb25maWd1cmF0aW9ucy5cbiAgICogIC0gRk9SQ0VfTE9HSU4gOiBIb3Jpem9udGFsXG4gICAqICAtIEFMTE9XX0lGUkFNRV9MT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XX0lGUkFNRV9MT0dJTilcbiAgICpcbiAgICogQ2FzZXM6XG4gICAqIDEuIERlbGF5IHJlc29sdmUgZnVuY3Rpb24gdGlsbCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgKiAyLiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICogMy4gRm9yY2UgdGhlIHJlZGlyZWN0XG4gICAqIDQuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKlxuICAgKiBOT1RFOlxuICAgKiBDYXNlIDEgYWJvdmUgd2lsbCBjYXVzZSB0aGlzIG1ldGhvZCdzIHByb21pc2UgdG8gYmUgYSBsb25nIHN0YWxsXG4gICAqIHVudGlsIHRoZSB1c2VyIGNvbXBsZXRlcyB0aGUgbG9naW4gcHJvY2Vzcy4gVGhpcyBzaG91bGQgYWxsb3cgdGhlXG4gICAqIGFwcCB0byBmb3JnbyBhIHJlbG9hZCBpcyBpdCBzaG91bGQgaGF2ZSB3YWl0ZWQgdGlsbCB0aGUgZW50aXJlXG4gICAqIHRpbWUgdGlsbCB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRVc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIFVzZXIgLSB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHJlc29sdmVkIHZpYSBQcm9taXNlXG4gICAqL1xuICBhc3luYyBnZXRVc2VyKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgLy8gRm9yIGJhc2ljIHRlc3RpbmdcbiAgICAvLyB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ3VzZXJBdXRoZW50aWNhdGVkJywgeyBuYW1lOiAndXNlcm5hbWUnfSlcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5jaGVjaygpO1xuICAgIGlmKHVzZXIpIHJldHVybiB1c2VyXG5cbiAgICAvLyBDYXNlIDEgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlclxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDMgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbCAvLyBvciByZWplY3Q/XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMgVXNlciBvciBudWxsXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj57XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vIElmIG5vIGxvY2FsIEpXVFxuICAgIGlmKCFqd3QpIHtcbiAgICAgIGNvbnN0IGZyZXNoSnd0ID0gYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoXCJcIik7XG5cbiAgICAgIHJldHVybiBqd3QgJiYgand0Lmxlbmd0aCA/XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1QoZnJlc2hKd3QpIDpcbiAgICAgICAgICAgICAgbnVsbDtcbiAgICB9XG4gICAgaWYoIXRoaXMuaXNJbXBsaWNpdEpXVChqd3QpKXsgLy8gR3JhbnQgdG9rZW5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoand0KVxuICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpIDogLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuXG4gICAgfSBlbHNlIHsgLy8gSW1wbGljaXQgSldUXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG51bGwpIDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBzZXJ2aWNlIGhvc3Rpbmcgbm9kZS1ncG9hdXRoIHRvIGFsbG93IGZvciBhXG4gICAqIHRva2VuIHJlZnJlc2ggb24gYW4gZXhwaXJlZCB0b2tlbiwgb3IgYSB0b2tlbiB0aGF0IGhhcyBiZWVuXG4gICAqIGludmFsaWRhdGVkIHRvIGJlIHJldm9rZWQuXG4gICAqXG4gICAqIE5vdGU6IENsaWVudCBhcyBpbiBob3N0aW5nIGFwcGxpY2F0aW9uOlxuICAgKiAgICBodHRwczovL3d3dy5kaWdpdGFsb2NlYW4uY29tL2NvbW11bml0eS90dXRvcmlhbHMvYW4taW50cm9kdWN0aW9uLXRvLW9hdXRoLTJcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1dpdGhDbGllbnRcbiAgICogQHBhcmFtIGp3dCAtIGVuY29kZWQgYWNjZXNzVG9rZW4vSldUXG4gICAqXG4gICAqIEByZXR1cm4gUHJvbWlzZTxqd3Q+XG4gICAqL1xuICBhc3luYyBjaGVja1dpdGhDbGllbnQob3JpZ2luYWxKV1Q6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zKGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vY2hlY2t0b2tlbmAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyA6IG9yaWdpbmFsSldUID8gYEJlYXJlciAke29yaWdpbmFsSldUfWAgOiAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICBjb25zdCBoZWFkZXIgPSByZXNwLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXVxuICAgICAgY29uc3QgbmV3SldUID0gaGVhZGVyICYmIGhlYWRlci5yZXBsYWNlKCdCZWFyZXInLCcnKS50cmltKCk7XG5cbiAgICAgIGlmKGhlYWRlciAmJiBuZXdKV1QubGVuZ3RoKSB0aGlzLnNldEF1dGgobmV3SldUKTtcbiAgICAgIHJldHVybiBuZXdKV1QgPyBuZXdKV1QgOiBvcmlnaW5hbEpXVDtcbiAgICB9XG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZShBVVRIX1NUT1JBR0VfS0VZKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW5cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9TVE9SQUdFX0tFWSlcbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiBCb29sZWFuXG4gICAqL1xuICBpc0V4cGlyZWQoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICBpZihwYXJzZWRKV1Qpe1xuICAgICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICByZXR1cm4gbm93ID4gcGFyc2VkSldULmV4cDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhlIEpXVCBhbiBpbXBsaWNpdCBKV1Q/XG4gICAqIEBwYXJhbSBqd3RcbiAgICovXG4gIGlzSW1wbGljaXRKV1Qoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gcGFyc2VkSldUICYmIHBhcnNlZEpXVC5pbXBsaWNpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgKHNpZ25hdHVyZSBub3QgY2hlY2tlZCkgdW5wYWNraW5nIG9mIEpXVC5cbiAgICpcbiAgICogQHBhcmFtIHRva2VuIC0gQWNjZXNzIFRva2VuIChKV1QpXG4gICAqIEByZXR1cm4gdGhlIHBhcnNlZCBwYXlsb2FkIGluIHRoZSBKV1RcbiAgICovXG4gIHBhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKV1Qge1xuICAgIHZhciBwYXJzZWQ7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKCctJywgJysnKS5yZXBsYWNlKCdfJywgJy8nKTtcbiAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShhdG9iKGJhc2U2NCkpO1xuICAgICAgfSBjYXRjaChlKSB7IC8qIERvbid0IHRocm93IHBhcnNlIGVycm9yICovIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfTtcblxuICAvKipcbiAgICogU2ltcGxlIGZyb250IGVuZCB2YWxpZGlvbiB0byB2ZXJpZnkgSldUIGlzIGNvbXBsZXRlIGFuZCBub3RcbiAgICogZXhwaXJlZC5cbiAgICpcbiAgICogTm90ZTpcbiAgICogIFNpZ25hdHVyZSB2YWxpZGF0aW9uIGlzIHRoZSBvbmx5IHRydWx5IHNhdmUgbWV0aG9kLiBUaGlzIGlzIGRvbmVcbiAgICogIGF1dG9tYXRpY2FsbHkgaW4gdGhlIG5vZGUtZ3BvYXV0aCBtb2R1bGUuXG4gICAqL1xuICB2YWxpZGF0ZUp3dCh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIHBhcnNlZCA9IHRoaXMucGFyc2VKd3QodG9rZW4pO1xuICAgIHZhciB2YWxpZCA9IChwYXJzZWQgJiYgcGFyc2VkLmV4cCAmJiBwYXJzZWQuZXhwICogMTAwMCA+IERhdGUubm93KCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSBKV1QgdG8gbG9jYWxTdG9yYWdlIGFuZCBpbiB0aGUgcmVxdWVzdCBoZWFkZXJzIGZvciBhY2Nlc3NpbmdcbiAgICogcHJvdGVjdGVkIHJlc291cmNlcy5cbiAgICpcbiAgICogQHBhcmFtIGp3dCAtIEpXVFxuICAgKi9cbiAgcHVibGljIHNldEF1dGgoand0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZihqd3QgPT0gUkVWT0tFX1JFU1BPTlNFKXtcbiAgICAgIHRoaXMubG9nb3V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoQVVUSF9TVE9SQUdFX0tFWSwgand0KVxuICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUHVyZ2UgdGhlIEpXVCBmcm9tIGxvY2FsU3RvcmFnZSBhbmQgYXV0aG9yaXphdGlvbiBoZWFkZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVBdXRoKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKEFVVEhfU1RPUkFHRV9LRVkpXG4gICAgLy8gU2VuZCBudWxsIHVzZXIgYXMgd2VsbCAoYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgbnVsbClcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyU2lnbk91dFwiKVxuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZSxcbiAgQUxMT1dfU1NPX0xPR0lOOiB0cnVlXG59XG4iXX0=