import axios from 'axios';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Convience class representing a simplified user.
 *
 */
class GeoPlatformUser {
    /**
     * @param {?} opts
     */
    constructor(opts) {
        this.id = opts.sub;
        this.username = opts.username;
        this.name = opts.name;
        this.email = opts.email;
        this.org = opts.orgs[0] && opts.orgs[0].name;
        this.groups = opts.groups;
        this.roles = opts.roles;
        this.exp = opts.exp;
    }
    /**
     * @return {?}
     */
    toJSON() {
        return JSON.parse(JSON.stringify(Object.assign({}, this)));
    }
    ;
    /**
     * @return {?}
     */
    clone() {
        return Object.assign({}, this);
    }
    ;
    /**
     * @param {?} arg
     * @return {?}
     */
    compare(arg) {
        if (arg instanceof GeoPlatformUser) {
            return this.id === arg.id;
        }
        else if (typeof (arg) === 'object') {
            return typeof (arg.id) !== 'undefined' &&
                arg.id === this.id;
        }
        return false;
    }
    ;
    /**
     * @param {?} role
     * @return {?}
     */
    isAuthorized(role) {
        return this.groups &&
            !!this.groups
                .map(g => g.name)
                .filter(n => n === role)
                .length;
    }
    ;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} url
 * @param {?=} jwt
 * @return {?}
 */
function getJson(url, jwt) {
    return axios.get(url, {
        headers: { 'Authorization': jwt ? `Bearer ${jwt}` : '' },
        responseType: 'json'
    })
        .then(r => r.data);
}
/**
 * Authentication Service
 */
class AuthService {
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
        /** @type {?} */
        const user = self.init();
        if (!user && this.config.AUTH_TYPE === 'grant')
            self.ssoCheck();
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
        const ssoURL = `/login?sso=true&cachebuster=${(new Date()).getTime()}`;
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
        /** @type {?} */
        const jwt = this.getJWT();
        if (jwt)
            this.setAuth(jwt);
        //clean hosturl on redirect from oauth
        if (this.getJWTFromUrl()) {
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, 'Remove token from URL', window.location.href.replace(/[\?\&]access_token=.*\&token_type=Bearer/, ''));
            }
            else {
                window.location.search.replace(/[\?\&]access_token=.*\&token_type=Bearer/, '');
            }
        }
        return this.getUserFromJWT(jwt);
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
     * @return {?}
     */
    login() {
        // Check implicit we need to actually redirect them
        if (this.config.AUTH_TYPE === 'token') {
            window.location.href = this.config.IDP_BASE_URL +
                `/auth/authorize?client_id=${this.config.APP_ID}` +
                `&response_type=${this.config.AUTH_TYPE}` +
                `&redirect_uri=${encodeURIComponent(this.config.CALLBACK || '/login')}`;
            // Otherwise pop up the login modal
        }
        else {
            // Iframe login
            if (this.config.ALLOWIFRAMELOGIN) {
                this.messenger.broadcast('auth:requireLogin');
                // Redirect login
            }
            else {
                window.location.href = this.config.LOGIN_URL
                    || `/login?redirect_url=${encodeURIComponent(window.location.href)}`;
            }
        }
    }
    ;
    /**
     * Performs background logout and requests jwt revokation
     * @return {?}
     */
    logout() {
        /** @type {?} */
        const self = this;
        // Create iframe to manually call the logout and remove gpoauth cookie
        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
        // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
        // Save JWT to send with final request to revoke it
        self.removeAuth(); // purge the JWT
        return new Promise((resolve, reject) => {
            getJson(`${this.config.APP_BASE_URL}/revoke?sso=true`, this.getJWT())
                .then(() => {
                if (this.config.LOGOUT_URL)
                    window.location.href = this.config.LOGOUT_URL;
                if (this.config.FORCE_LOGIN)
                    self.forceLogin();
                resolve();
            })
                .catch((err) => {
                console.log('Error logging out: ', err);
                reject(err);
            });
        });
    }
    ;
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
        /** @type {?} */
        const JWT = this.getJWT();
        return new Promise((resolve, reject) => {
            //check to make sure we can make called
            if (JWT) {
                getJson(`${this.config.IDP_BASE_URL}/api/profile`, JWT)
                    .then((response) => resolve(response))
                    .catch(err => reject(err));
            }
            else {
                reject(null);
            }
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
        // If callback provided we can treat async and call server
        if (callback && typeof (callback) === 'function') {
            this.check()
                .then(user => callback(user));
            // If no callback we have to provide a sync response (no network)
        }
        else {
            // We allow front end to get user data if grant type and expired
            // because they will recieve a new token automatically when
            // making a call to the client(application)
            return this.isImplicitJWT(jwt) && this.isExpired(jwt) ?
                null :
                this.getUserFromJWT(jwt);
        }
    }
    /**
     * Promise version of get user.
     *
     * Below is a table of how this function handels this method with
     * differnt configurations.
     *  - FORCE_LOGIN : Horizontal
     *  - ALLOWIFRAMELOGIN : Vertical
     *
     *
     * getUser  | T | F (FORCE_LOGIN)
     * -----------------------------
     * T        | 1 | 2
     * F        | 3 | 4
     * (ALLOWIFRAMELOGIN)
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
        /** @type {?} */
        const self = this;
        // For basic testing
        // this.messenger.broadcast('userAuthenticated', { name: 'username'})
        return new Promise((resolve, reject) => {
            this.check()
                .then(user => {
                if (user) {
                    resolve(user);
                }
                else {
                    // Case 1 - ALLOWIFRAMELOGIN: true | FORCE_LOGIN: true
                    if (this.config.ALLOWIFRAMELOGIN && this.config.FORCE_LOGIN) {
                        // Resolve with user once they have logged in
                        this.messenger.on('userAuthenticated', (event, user) => {
                            resolve(user);
                        });
                    }
                    // Case 2 - ALLOWIFRAMELOGIN: true | FORCE_LOGIN: false
                    if (this.config.ALLOWIFRAMELOGIN && !this.config.FORCE_LOGIN) {
                        resolve(null);
                    }
                    // Case 3 - ALLOWIFRAMELOGIN: false | FORCE_LOGIN: true
                    if (!this.config.ALLOWIFRAMELOGIN && this.config.FORCE_LOGIN) {
                        addEventListener('message', (event) => {
                            // Handle SSO login failure
                            if (event.data === 'iframe:ssoFailed') {
                                resolve(self.getUser());
                            }
                        });
                        resolve(null);
                    }
                    // Case 4 - ALLOWIFRAMELOGIN: false | FORCE_LOGIN: false
                    if (!this.config.ALLOWIFRAMELOGIN && !this.config.FORCE_LOGIN) {
                        resolve(null); // or reject?
                    }
                }
            })
                .catch((err) => console.log(err));
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
        return new Promise((resolve, rej) => {
            /** @type {?} */
            const jwt = this.getJWT();
            // If no local JWT
            if (!jwt)
                return this.checkWithClient("")
                    .then(jwt => jwt.length ? this.getUserFromJWT(jwt) : null);
            if (!jwt)
                return resolve(null);
            if (!this.isImplicitJWT(jwt)) { // Grant token
                // Grant token
                return this.isExpired(jwt) ?
                    this.checkWithClient(jwt)
                        .then(jwt => this.getUserFromJWT(jwt)) : // Check with server
                    resolve(this.getUserFromJWT(jwt));
            }
            else { // Implicit JWT
                // Implicit JWT
                return this.isExpired(jwt) ?
                    Promise.reject(null) :
                    resolve(this.getUserFromJWT(jwt));
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
        return new Promise((resolve, reject) => {
            if (this.config.AUTH_TYPE === 'token') {
                resolve(null);
            }
            else {
                axios(`${this.config.APP_BASE_URL}/checktoken`, {
                    headers: {
                        'Authorization': originalJWT ? `Bearer ${originalJWT}` : '',
                        'Access-Control-Expose-Headers': 'Authorization, WWW-Authorization, content-length'
                    }
                })
                    .then(resp => {
                    /** @type {?} */
                    const header = resp.headers['authorization'];
                    /** @type {?} */
                    const newJWT = header && header.replace('Bearer ', '');
                    if (newJWT)
                        this.setAuth(newJWT);
                    resolve(newJWT ? newJWT : originalJWT);
                })
                    .catch(err => reject(err));
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
/** @type {?} */
const DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    ALLOWIFRAMELOGIN: false,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    APP_BASE_URL: '' // absolute path // use . for relative path
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TokenInterceptor {
    /**
     * @param {?} authService
     */
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    intercept(request, next) {
        /** @type {?} */
        let updatedRequest;
        /** @type {?} */
        const jwt = this.authService.getJWT();
        if (!jwt) {
            // Carry on... nothing to do here
            updatedRequest = request;
        }
        else {
            /** @type {?} */
            let clone = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            updatedRequest = clone;
        }
        /**
         * Handler for successful responses returned from the server.
         * This function must to the following:
         *  - check the URL for a JWT
         *  - check the 'Authorization' header for a JWT
         *  - set a new JWT in AuthService
         *
         * @param {?} event
         * @return {?}
         */
        function responseHandler(event) {
            if (event instanceof HttpResponse) {
                /** @type {?} */
                const urlJwt = this.authService.getJWTFromUrl();
                /** @type {?} */
                const headerJwt = event.headers.get('Authorization')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                const newJwt = urlJwt || headerJwt;
                if (newJwt)
                    this.authService.setAuth(newJwt);
                // TODO: may want to look at revoking if:
                //  'Authorization' : 'Bearer '
                // comes back from server....
            }
        }
        /**
         * The is the error handler when an unauthenticated request
         * comes back from the server...
         *
         * @param {?} err
         * @return {?}
         */
        function responseFailureHandler(err) {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) ;
            }
        }
        // ==============================================//
        // setup and return with handlers
        return next
            .handle(updatedRequest)
            .do(responseHandler, responseFailureHandler);
    }
}
TokenInterceptor.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TokenInterceptor.ctorParameters = () => [
    { type: AuthService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class msgProvider {
    constructor() {
        this.sub = new Subject();
    }
    /**
     * @return {?}
     */
    raw() {
        return this.sub;
    }
    /**
     * @param {?} name
     * @param {?} user
     * @return {?}
     */
    broadcast(name, user) {
        this.sub.next({ name, user });
    }
    /**
     * @param {?} name
     * @param {?} func
     * @return {?}
     */
    on(name, func) {
        this.sub
            .filter(msg => msg.name === name)
            .subscribe(msg => func(new Event(msg.name), msg.user));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 * @param {?=} config
 * @return {?}
 */
function ngGpoauthFactory$1(config) {
    return new AuthService(Object.assign({}, DefaultAuthConf, config), new msgProvider());
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { ngGpoauthFactory$1 as ngGpoauthFactory, AuthService, GeoPlatformUser, TokenInterceptor, msgProvider as ɵd, DefaultAuthConf as ɵa };

//# sourceMappingURL=ng-gpoauth.js.map