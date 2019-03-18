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
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var resp;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get(url, {
                        headers: { 'Authorization': jwt ? "Bearer " + jwt : '' },
                        responseType: 'json'
                    })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
            }
        });
    });
}
/**
 * Authentication Service
 */
var /**
 * Authentication Service
 */
AuthService = /** @class */ (function () {
    /**
     *
     * @class AuthService
     * @constructor
     *
     * @param {AuthConfig} config
     * @param
     */
    function AuthService(config, ngMessenger) {
        var _this = this;
        /** @type {?} */
        var self = this;
        this.config = config;
        this.messenger = ngMessenger;
        // Setup general event listeners that always run
        addEventListener('message', function (event) {
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
            .then(function (user) {
            if (_this.config.ALLOW_SSO_LOGIN && !user && _this.config.AUTH_TYPE === 'grant')
                self.ssoCheck();
        });
    }
    /**
     * Expose ngMessenger so that appliction code is able to
     * subscribe to notifications sent by ng-gpoauth
     */
    /**
     * Expose ngMessenger so that appliction code is able to
     * subscribe to notifications sent by ng-gpoauth
     * @return {?}
     */
    AuthService.prototype.getMessenger = /**
     * Expose ngMessenger so that appliction code is able to
     * subscribe to notifications sent by ng-gpoauth
     * @return {?}
     */
    function () {
        return this.messenger;
    };
    /**
     * Security wrapper for obfuscating values passed into local storage
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    AuthService.prototype.saveToLocalStorage = /**
     * Security wrapper for obfuscating values passed into local storage
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        localStorage.setItem(key, btoa(value));
    };
    ;
    /**
     * Retrieve and decode value from localstorage
     *
     * @param key
     */
    /**
     * Retrieve and decode value from localstorage
     *
     * @param {?} key
     * @return {?}
     */
    AuthService.prototype.getFromLocalStorage = /**
     * Retrieve and decode value from localstorage
     *
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var raw = localStorage.getItem(key);
        try {
            return raw ?
                atob(raw) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            // Catch bad encoding or formally not encoded
            return undefined;
        }
    };
    ;
    /**
     * @return {?}
     */
    AuthService.prototype.ssoCheck = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var self = this;
        /** @type {?} */
        var ssoURL = this.config.APP_BASE_URL + "/login?sso=true&cachebuster=" + (new Date()).getTime();
        /** @type {?} */
        var ssoIframe = this.createIframe(ssoURL);
        // Setup ssoIframe specific handlers
        addEventListener('message', function (event) {
            // Handle SSO login failure
            if (event.data === 'iframe:ssoFailed') {
                if (ssoIframe && ssoIframe.remove) // IE 11 - gotcha
                    // IE 11 - gotcha
                    ssoIframe.remove();
                // Force login only after SSO has failed
                if (_this.config.FORCE_LOGIN)
                    self.forceLogin();
            }
            // Handle User Authenticated
            if (event.data === 'iframe:userAuthenticated') {
                if (ssoIframe && ssoIframe.remove) // IE 11 - gotcha
                    // IE 11 - gotcha
                    ssoIframe.remove();
            }
        });
    };
    /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * \@method init
     * @return {?}
     */
    AuthService.prototype.init = /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * \@method init
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jwt;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = this.getJWT();
                        //clean hosturl on redirect from oauth
                        if (this.getJWTFromUrl())
                            this.removeTokenFromUrl();
                        if (!jwt) return [3 /*break*/, 1];
                        this.setAuth(jwt);
                        return [2 /*return*/, this.getUserFromJWT(jwt)];
                    case 1: return [4 /*yield*/, this.getUser()];
                    case 2: 
                    // call to checkwith Server
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Clears the access_token property from the URL.
     * @return {?}
     */
    AuthService.prototype.removeTokenFromUrl = /**
     * Clears the access_token property from the URL.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var replaceRegex = /[\?\&]access_token=.*(\&token_type=Bearer)?/;
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, 'Remove token from URL', window.location.href.replace(replaceRegex, ''));
        }
        else {
            window.location.search.replace(replaceRegex, '');
        }
    };
    /**
     * Create an invisable iframe and appends it to the bottom of the page.
     *
     * \@method createIframe
     * @param {?} url
     * @return {?}
     */
    AuthService.prototype.createIframe = /**
     * Create an invisable iframe and appends it to the bottom of the page.
     *
     * \@method createIframe
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        return iframe;
    };
    ;
    /**
     * Redirects or displays login window the page to the login site
     */
    /**
     * Redirects or displays login window the page to the login site
     * @return {?}
     */
    AuthService.prototype.login = /**
     * Redirects or displays login window the page to the login site
     * @return {?}
     */
    function () {
        // Check implicit we need to actually redirect them
        if (this.config.AUTH_TYPE === 'token') {
            window.location.href = this.config.IDP_BASE_URL +
                ("/auth/authorize?client_id=" + this.config.APP_ID) +
                ("&response_type=" + this.config.AUTH_TYPE) +
                ("&redirect_uri=" + encodeURIComponent(this.config.CALLBACK || '/login'));
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
                    || "/login?redirect_url=" + encodeURIComponent(window.location.href);
            }
        }
    };
    ;
    /**
     * Performs background logout and requests jwt revokation
     */
    /**
     * Performs background logout and requests jwt revokation
     * @return {?}
     */
    AuthService.prototype.logout = /**
     * Performs background logout and requests jwt revokation
     * @return {?}
     */
    function () {
        // Create iframe to manually call the logout and remove gpoauth cookie
        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
        // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create iframe to manually call the logout and remove gpoauth cookie
                    // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
                    // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
                    return [4 /*yield*/, getJson(this.config.APP_BASE_URL + "/revoke?sso=true", this.getJWT())];
                    case 1:
                        // Create iframe to manually call the logout and remove gpoauth cookie
                        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
                        // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
                        _a.sent();
                        this.removeAuth(); // purge the JWT
                        if (this.config.LOGOUT_URL)
                            window.location.href = this.config.LOGOUT_URL;
                        if (this.config.FORCE_LOGIN)
                            this.forceLogin();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Optional force redirect for non-public services
     */
    /**
     * Optional force redirect for non-public services
     * @return {?}
     */
    AuthService.prototype.forceLogin = /**
     * Optional force redirect for non-public services
     * @return {?}
     */
    function () {
        this.login();
    };
    ;
    /**
     * Get protected user profile
     */
    /**
     * Get protected user profile
     * @return {?}
     */
    AuthService.prototype.getOauthProfile = /**
     * Get protected user profile
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var JWT, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        JWT = this.getJWT();
                        if (!JWT) return [3 /*break*/, 2];
                        return [4 /*yield*/, getJson(this.config.IDP_BASE_URL + "/api/profile", JWT)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    ;
    /**
     * Get User object from the JWT.
     *
     * If no JWT is provided it will be looked for at the normal JWT
     * locations (localStorage or URL queryString).
     *
     * @param {JWT} [jwt] - the JWT to extract user from.
     */
    /**
     * Get User object from the JWT.
     *
     * If no JWT is provided it will be looked for at the normal JWT
     * locations (localStorage or URL queryString).
     *
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.getUserFromJWT = /**
     * Get User object from the JWT.
     *
     * If no JWT is provided it will be looked for at the normal JWT
     * locations (localStorage or URL queryString).
     *
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        /** @type {?} */
        var user = this.parseJwt(jwt);
        return user ?
            new GeoPlatformUser(Object.assign({}, user, { id: user.sub })) :
            null;
    };
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
    AuthService.prototype.getUserSync = /**
     * If the callback parameter is specified, this method
     * will return undefined. Otherwise, it returns the user (or null).
     *
     * Side Effects:
     *  - Will redirect users if no valid JWT was found
     *
     * @param {?=} callback optional function to invoke with the user
     * @return {?} object representing current user
     */
    function (callback) {
        /** @type {?} */
        var jwt = this.getJWT();
        // We allow front end to get user data if grant type and expired
        // because they will recieve a new token automatically when
        // making a call to the client(application)
        return this.isImplicitJWT(jwt) && this.isExpired(jwt) ?
            null :
            this.getUserFromJWT(jwt);
    };
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
     * @returns {Promise<User>} User - the authenticated user
     */
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
    AuthService.prototype.getUser = /**
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
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var user;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.check()];
                    case 1:
                        user = _a.sent();
                        if (user)
                            return [2 /*return*/, user];
                        // Case 1 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: true
                        if (this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN) {
                            // Resolve with user once they have logged in
                            this.messenger.on('userAuthenticated', function (event, user) {
                                return user;
                            });
                        }
                        // Case 2 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: false
                        if (this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN) {
                            return [2 /*return*/, null];
                        }
                        // Case 3 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: true
                        if (!this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN) {
                            addEventListener('message', function (event) {
                                // Handle SSO login failure
                                if (event.data === 'iframe:ssoFailed') {
                                    return _this.getUser();
                                }
                            });
                            return [2 /*return*/, null];
                        }
                        // Case 4 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: false
                        if (!this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN) {
                            return [2 /*return*/, null]; // or reject?
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * @method check
     * @returns {User} - ng-common user object or null
     */
    /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * \@method check
     * @return {?}
     */
    AuthService.prototype.check = /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * \@method check
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jwt, freshJwt, _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        jwt = this.getJWT();
                        if (!!jwt) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkWithClient("")];
                    case 1:
                        freshJwt = _b.sent();
                        return [2 /*return*/, jwt && jwt.length ?
                                this.getUserFromJWT(freshJwt) :
                                null];
                    case 2:
                        if (!!this.isImplicitJWT(jwt)) return [3 /*break*/, 6];
                        if (!this.isExpired(jwt)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkWithClient(jwt)
                                .then(function (jwt) { return _this.getUserFromJWT(jwt); })];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = this.getUserFromJWT(jwt);
                        _b.label = 5;
                    case 5: // Grant token
                    return [2 /*return*/, _a];
                    case 6: // Implicit JWT
                    return [2 /*return*/, this.isExpired(jwt) ?
                            Promise.reject(null) :
                            this.getUserFromJWT(jwt)];
                }
            });
        });
    };
    /**
     * Makes a call to a service hosting node-gpoauth to allow for a
     * token refresh on an expired token, or a token that has been
     * invalidated to be revoked.
     *
     * Note: Client as in hosting application:
     *    https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
     *
     * @method checkWithClient
     * @param {jwt} - encoded accessToken/JWT
     *
     * @return {Promise<jwt>} - promise resolving with a JWT
     */
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
    AuthService.prototype.checkWithClient = /**
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
    function (originalJWT) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resp, header, newJWT;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.config.AUTH_TYPE === 'token')) return [3 /*break*/, 1];
                        return [2 /*return*/, null];
                    case 1: return [4 /*yield*/, axios(this.config.APP_BASE_URL + "/checktoken", {
                            headers: {
                                'Authorization': originalJWT ? "Bearer " + originalJWT : ''
                            }
                        })];
                    case 2:
                        resp = _a.sent();
                        header = resp.headers['authorization'];
                        newJWT = header && header.replace('Bearer', '').trim();
                        if (header && newJWT.length)
                            this.setAuth(newJWT);
                        return [2 /*return*/, newJWT ? newJWT : originalJWT];
                }
            });
        });
    };
    //=====================================================
    /**
     * Extract token from current URL
     *
     * @method getJWTFromUrl
     *
     * @return {String | undefined} - JWT Token (raw string)
     */
    /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?}
     */
    AuthService.prototype.getJWTFromUrl = /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?}
     */
    function () {
        /** @type {?} */
        var queryString = (window && window.location && window.location.hash) ?
            window.location.hash :
            window.location.toString();
        /** @type {?} */
        var res = queryString.match(/access_token=([^\&]*)/);
        return res && res[1];
    };
    ;
    /**
     * Load the JWT stored in local storage.
     *
     * @method getJWTfromLocalStorage
     *
     * @return {JWT | undefined} An object wih the following format:
     */
    /**
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?}
     */
    AuthService.prototype.getJWTfromLocalStorage = /**
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?}
     */
    function () {
        return this.getFromLocalStorage('gpoauthJWT');
    };
    ;
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * @method getJWT
     *
     * @return {sting | undefined}
     */
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * \@method getJWT
     *
     * @return {?}
     */
    AuthService.prototype.getJWT = /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * \@method getJWT
     *
     * @return {?}
     */
    function () {
        /** @type {?} */
        var jwt = this.getJWTFromUrl() || this.getJWTfromLocalStorage();
        // Only deny implicit tokens that have expired
        if (!jwt || (jwt && this.isImplicitJWT(jwt) && this.isExpired(jwt))) {
            return null;
        }
        else {
            return jwt;
        }
    };
    ;
    /**
     * Remove the JWT saved in local storge.
     *
     * \@method clearLocalStorageJWT
     *
     * @return {?}
     */
    AuthService.prototype.clearLocalStorageJWT = /**
     * Remove the JWT saved in local storge.
     *
     * \@method clearLocalStorageJWT
     *
     * @return {?}
     */
    function () {
        localStorage.removeItem('gpoauthJWT');
    };
    ;
    /**
     * Is a token expired.
     *
     * @method isExpired
     * @param {JWT} jwt - A JWT
     *
     * @return {boolean}
     */
    /**
     * Is a token expired.
     *
     * \@method isExpired
     *
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.isExpired = /**
     * Is a token expired.
     *
     * \@method isExpired
     *
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        /** @type {?} */
        var parsedJWT = this.parseJwt(jwt);
        if (parsedJWT) {
            /** @type {?} */
            var now = (new Date()).getTime() / 1000;
            return now > parsedJWT.exp;
        }
        return true;
    };
    ;
    /**
     * Is the JWT an implicit JWT?
     * @param jwt
     */
    /**
     * Is the JWT an implicit JWT?
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.isImplicitJWT = /**
     * Is the JWT an implicit JWT?
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        /** @type {?} */
        var parsedJWT = this.parseJwt(jwt);
        return parsedJWT && parsedJWT.implicit;
    };
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {string} token - Access Token (JWT)
     * @return {Object} the parsed payload in the JWT
     */
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {?} token
     * @return {?}
     */
    AuthService.prototype.parseJwt = /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {?} token
     * @return {?}
     */
    function (token) {
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
    };
    ;
    /**
     * Simple front end validion to verify JWT is complete and not
     * expired.
     *
     * Note:
     *  Signature validation is the only truly save method. This is done
     *  automatically in the node-gpoauth module.
     */
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
    AuthService.prototype.validateJwt = /**
     * Simple front end validion to verify JWT is complete and not
     * expired.
     *
     * Note:
     *  Signature validation is the only truly save method. This is done
     *  automatically in the node-gpoauth module.
     * @param {?} token
     * @return {?}
     */
    function (token) {
        /** @type {?} */
        var parsed = this.parseJwt(token);
        /** @type {?} */
        var valid = (parsed && parsed.exp && parsed.exp * 1000 > Date.now()) ? true : false;
        return valid;
    };
    ;
    /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {?} jwt
     * @return {?}
     */
    AuthService.prototype.setAuth = /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {?} jwt
     * @return {?}
     */
    function (jwt) {
        this.saveToLocalStorage('gpoauthJWT', jwt);
        this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt));
    };
    ;
    /**
     * Purge the JWT from localStorage and authorization headers.
     * @return {?}
     */
    AuthService.prototype.removeAuth = /**
     * Purge the JWT from localStorage and authorization headers.
     * @return {?}
     */
    function () {
        localStorage.removeItem('gpoauthJWT');
        // Send null user as well (backwards compatability)
        this.messenger.broadcast("userAuthenticated", null);
        this.messenger.broadcast("userSignOut");
    };
    ;
    return AuthService;
}());
/**
 * Authentication Service
 */
export { AuthService };
if (false) {
    /** @type {?} */
    AuthService.prototype.config;
    /** @type {?} */
    AuthService.prototype.messenger;
}
/** @type {?} */
export var DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    // absolute path // use . for relative path
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    ALLOW_SSO_LOGIN: true
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQTs7Ozs7O0FBRXpCLGlCQUF1QixHQUFXLEVBQUUsR0FBWTs7Ozs7d0JBQ2pDLHFCQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNaLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVUsR0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ3pELFlBQVksRUFBRSxNQUFNO3FCQUNyQixDQUFDLEVBQUE7O29CQUhoQixJQUFJLEdBQUcsU0FHUztvQkFDdEIsc0JBQU8sSUFBSSxDQUFDLElBQUksRUFBQzs7OztDQUNsQjs7OztBQUtEOzs7QUFBQTtJQUtFOzs7Ozs7O09BT0c7SUFDSCxxQkFBWSxNQUFrQixFQUFFLFdBQXdCO1FBQXhELGlCQXVCQzs7UUF0QkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFBOztRQUc1QixnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFVOztZQUVyQyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNaOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUNsQjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxJQUFJLEVBQUU7YUFDUixJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ1Is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LENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSB9IGZyb20gJy4uL3NyYy9hdXRoVHlwZXMnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlcidcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblxuYXN5bmMgZnVuY3Rpb24gZ2V0SnNvbih1cmw6IHN0cmluZywgand0Pzogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJyA6IGp3dCA/IGBCZWFyZXIgJHtqd3R9YCA6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gIHJldHVybiByZXNwLmRhdGE7XG59XG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG5cbiAgLyoqXG4gICAqXG4gICAqIEBjbGFzcyBBdXRoU2VydmljZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtBdXRoQ29uZmlnfSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBuZ01lc3Nlbmdlcil7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tZXNzZW5nZXIgPSBuZ01lc3NlbmdlclxuXG4gICAgLy8gU2V0dXAgZ2VuZXJhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCBhbHdheXMgcnVuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIHNlbGYuaW5pdCgpIC8vIHdpbGwgYnJvYWRjYXN0IHRvIGFuZ3VsYXIgKHNpZGUtZWZmZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgbG9nb3V0IGV2ZW50XG4gICAgICBpZihldmVudC5kYXRhID09PSAndXNlclNpZ25PdXQnKXtcbiAgICAgICAgc2VsZi5yZW1vdmVBdXRoKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2VsZi5pbml0KClcbiAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19TU09fTE9HSU4gJiYgIXVzZXIgJiYgdGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAnZ3JhbnQnKVxuICAgICAgICAgIHNlbGYuc3NvQ2hlY2soKVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIG5nTWVzc2VuZ2VyIHNvIHRoYXQgYXBwbGljdGlvbiBjb2RlIGlzIGFibGUgdG9cbiAgICogc3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbnMgc2VudCBieSBuZy1ncG9hdXRoXG4gICAqL1xuICBnZXRNZXNzZW5nZXIoKTogbmdNZXNzZW5nZXIge1xuICAgIHJldHVybiB0aGlzLm1lc3NlbmdlclxuICB9XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IHdyYXBwZXIgZm9yIG9iZnVzY2F0aW5nIHZhbHVlcyBwYXNzZWQgaW50byBsb2NhbCBzdG9yYWdlXG4gICAqL1xuICBwcml2YXRlIHNhdmVUb0xvY2FsU3RvcmFnZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgYnRvYSh2YWx1ZSkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbmQgZGVjb2RlIHZhbHVlIGZyb20gbG9jYWxzdG9yYWdlXG4gICAqXG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGdldEZyb21Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihyYXcpIDpcbiAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgIH0gY2F0Y2ggKGUpeyAvLyBDYXRjaCBiYWQgZW5jb2Rpbmcgb3IgZm9ybWFsbHkgbm90IGVuY29kZWRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgc3NvQ2hlY2soKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc3NvVVJMID0gYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9sb2dpbj9zc289dHJ1ZSZjYWNoZWJ1c3Rlcj0keyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCl9YFxuICAgIGNvbnN0IHNzb0lmcmFtZSA9IHRoaXMuY3JlYXRlSWZyYW1lKHNzb1VSTClcblxuICAgIC8vIFNldHVwIHNzb0lmcmFtZSBzcGVjaWZpYyBoYW5kbGVyc1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFNTTyBsb2dpbiBmYWlsdXJlXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnNzb0ZhaWxlZCcpe1xuICAgICAgICBpZihzc29JZnJhbWUgJiYgc3NvSWZyYW1lLnJlbW92ZSkgLy8gSUUgMTEgLSBnb3RjaGFcbiAgICAgICAgICBzc29JZnJhbWUucmVtb3ZlKClcbiAgICAgICAgLy8gRm9yY2UgbG9naW4gb25seSBhZnRlciBTU08gaGFzIGZhaWxlZFxuICAgICAgICBpZih0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTikgc2VsZi5mb3JjZUxvZ2luKClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBpZihzc29JZnJhbWUgJiYgc3NvSWZyYW1lLnJlbW92ZSkgLy8gSUUgMTEgLSBnb3RjaGFcbiAgICAgICAgICBzc29JZnJhbWUucmVtb3ZlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFdlIGtlZXAgdGhpcyBvdXRzaWRlIHRoZSBjb25zdHJ1Y3RvciBzbyB0aGF0IG90aGVyIHNlcnZpY2VzIGNhbGxcbiAgICogY2FsbCBpdCB0byB0cmlnZ2VyIHRoZSBzaWRlLWVmZmVjdHMuXG4gICAqXG4gICAqIEBtZXRob2QgaW5pdFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vY2xlYW4gaG9zdHVybCBvbiByZWRpcmVjdCBmcm9tIG9hdXRoXG4gICAgaWYgKHRoaXMuZ2V0SldURnJvbVVybCgpKSB0aGlzLnJlbW92ZVRva2VuRnJvbVVybCgpXG5cbiAgICBpZihqd3QpIHtcbiAgICAgIHRoaXMuc2V0QXV0aChqd3QpXG4gICAgICByZXR1cm4gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNhbGwgdG8gY2hlY2t3aXRoIFNlcnZlclxuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0VXNlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGFjY2Vzc190b2tlbiBwcm9wZXJ0eSBmcm9tIHRoZSBVUkwuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZVRva2VuRnJvbVVybCgpOiB2b2lkIHtcbiAgICBjb25zdCByZXBsYWNlUmVnZXggPSAvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LiooXFwmdG9rZW5fdHlwZT1CZWFyZXIpPy9cbiAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCB7fSAsICdSZW1vdmUgdG9rZW4gZnJvbSBVUkwnLCB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKHJlcGxhY2VSZWdleCwgJycpIClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKHJlcGxhY2VSZWdleCwgJycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZpc2FibGUgaWZyYW1lIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY3JlYXRlSWZyYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MSUZyYW1lRWxlbWVudH1cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbigpIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jb25maWcuQ0FMTEJBQ0sgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCdhdXRoOnJlcXVpcmVMb2dpbicpXG5cbiAgICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZil9YFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYmFja2dyb3VuZCBsb2dvdXQgYW5kIHJlcXVlc3RzIGp3dCByZXZva2F0aW9uXG4gICAqL1xuICBhc3luYyBsb2dvdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB0byBtYW51YWxseSBjYWxsIHRoZSBsb2dvdXQgYW5kIHJlbW92ZSBncG9hdXRoIGNvb2tpZVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNzU4MjA3L3doeS1pcy1wYXNzcG9ydGpzLWluLW5vZGUtbm90LXJlbW92aW5nLXNlc3Npb24tb24tbG9nb3V0I2Fuc3dlci0zMzc4Njg5OVxuICAgIC8vIHRoaXMuY3JlYXRlSWZyYW1lKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXV0aC9sb2dvdXRgKVxuXG4gICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZT9zc289dHJ1ZWAsIHRoaXMuZ2V0SldUKCkpXG4gICAgdGhpcy5yZW1vdmVBdXRoKCkgLy8gcHVyZ2UgdGhlIEpXVFxuXG4gICAgaWYodGhpcy5jb25maWcuTE9HT1VUX1VSTCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dPVVRfVVJMXG4gICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHRoaXMuZm9yY2VMb2dpbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIGZvcmNlIHJlZGlyZWN0IGZvciBub24tcHVibGljIHNlcnZpY2VzXG4gICAqL1xuICBmb3JjZUxvZ2luKCkge1xuICAgIHRoaXMubG9naW4oKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb3RlY3RlZCB1c2VyIHByb2ZpbGVcbiAgICovXG4gIGFzeW5jIGdldE9hdXRoUHJvZmlsZSgpOiBQcm9taXNlPFVzZXJQcm9maWxlPiB7XG4gICAgY29uc3QgSldUID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIHJldHVybiBKV1QgP1xuICAgICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2FwaS9wcm9maWxlYCwgSldUKSA6XG4gICAgICBudWxsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgVXNlciBvYmplY3QgZnJvbSB0aGUgSldULlxuICAgKlxuICAgKiBJZiBubyBKV1QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb29rZWQgZm9yIGF0IHRoZSBub3JtYWwgSldUXG4gICAqIGxvY2F0aW9ucyAobG9jYWxTdG9yYWdlIG9yIFVSTCBxdWVyeVN0cmluZykuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBband0XSAtIHRoZSBKV1QgdG8gZXh0cmFjdCB1c2VyIGZyb20uXG4gICAqL1xuICBnZXRVc2VyRnJvbUpXVChqd3Q6IHN0cmluZyk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiB1c2VyID9cbiAgICAgICAgICAgIG5ldyBHZW9QbGF0Zm9ybVVzZXIoT2JqZWN0LmFzc2lnbih7fSwgdXNlciwgeyBpZDogdXNlci5zdWIgfSkpIDpcbiAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSB1c2VyIChvciBudWxsKS5cbiAgICpcbiAgICogU2lkZSBFZmZlY3RzOlxuICAgKiAgLSBXaWxsIHJlZGlyZWN0IHVzZXJzIGlmIG5vIHZhbGlkIEpXVCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGludm9rZSB3aXRoIHRoZSB1c2VyXG4gICAqIEByZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyBjdXJyZW50IHVzZXJcbiAgICovXG4gIGdldFVzZXJTeW5jKGNhbGxiYWNrPzogKHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgICAgLy8gV2UgYWxsb3cgZnJvbnQgZW5kIHRvIGdldCB1c2VyIGRhdGEgaWYgZ3JhbnQgdHlwZSBhbmQgZXhwaXJlZFxuICAgICAgLy8gYmVjYXVzZSB0aGV5IHdpbGwgcmVjaWV2ZSBhIG5ldyB0b2tlbiBhdXRvbWF0aWNhbGx5IHdoZW5cbiAgICAgIC8vIG1ha2luZyBhIGNhbGwgdG8gdGhlIGNsaWVudChhcHBsaWNhdGlvbilcbiAgICAgIHJldHVybiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dfSUZSQU1FX0xPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dfSUZSQU1FX0xPR0lOKVxuICAgKlxuICAgKiBDYXNlczpcbiAgICogMS4gRGVsYXkgcmVzb2x2ZSBmdW5jdGlvbiB0aWxsIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAqIDIuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKiAzLiBGb3JjZSB0aGUgcmVkaXJlY3RcbiAgICogNC4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqXG4gICAqIE5PVEU6XG4gICAqIENhc2UgMSBhYm92ZSB3aWxsIGNhdXNlIHRoaXMgbWV0aG9kJ3MgcHJvbWlzZSB0byBiZSBhIGxvbmcgc3RhbGxcbiAgICogdW50aWwgdGhlIHVzZXIgY29tcGxldGVzIHRoZSBsb2dpbiBwcm9jZXNzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGVcbiAgICogYXBwIHRvIGZvcmdvIGEgcmVsb2FkIGlzIGl0IHNob3VsZCBoYXZlIHdhaXRlZCB0aWxsIHRoZSBlbnRpcmVcbiAgICogdGltZSB0aWxsIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldFVzZXJcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8VXNlcj59IFVzZXIgLSB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAqL1xuICBhc3luYyBnZXRVc2VyKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgLy8gRm9yIGJhc2ljIHRlc3RpbmdcbiAgICAvLyB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ3VzZXJBdXRoZW50aWNhdGVkJywgeyBuYW1lOiAndXNlcm5hbWUnfSlcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5jaGVjaygpO1xuICAgIGlmKHVzZXIpIHJldHVybiB1c2VyXG5cbiAgICAvLyBDYXNlIDEgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlclxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDMgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbCAvLyBvciByZWplY3Q/XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMge1VzZXJ9IC0gbmctY29tbW9uIHVzZXIgb2JqZWN0IG9yIG51bGxcbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgaWYoIWp3dCkge1xuICAgICAgY29uc3QgZnJlc2hKd3QgPSBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudChcIlwiKTtcblxuICAgICAgcmV0dXJuIGp3dCAmJiBqd3QubGVuZ3RoID9cbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChmcmVzaEp3dCkgOlxuICAgICAgICAgICAgICBudWxsO1xuICAgIH1cbiAgICBpZighdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkpeyAvLyBHcmFudCB0b2tlblxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudChqd3QpXG4gICAgICAgICAgICAgICAgLnRoZW4oand0ID0+IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSkgOiAvLyBDaGVjayB3aXRoIHNlcnZlclxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG5cbiAgICB9IGVsc2UgeyAvLyBJbXBsaWNpdCBKV1RcbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobnVsbCkgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgY2FsbCB0byBhIHNlcnZpY2UgaG9zdGluZyBub2RlLWdwb2F1dGggdG8gYWxsb3cgZm9yIGFcbiAgICogdG9rZW4gcmVmcmVzaCBvbiBhbiBleHBpcmVkIHRva2VuLCBvciBhIHRva2VuIHRoYXQgaGFzIGJlZW5cbiAgICogaW52YWxpZGF0ZWQgdG8gYmUgcmV2b2tlZC5cbiAgICpcbiAgICogTm90ZTogQ2xpZW50IGFzIGluIGhvc3RpbmcgYXBwbGljYXRpb246XG4gICAqICAgIGh0dHBzOi8vd3d3LmRpZ2l0YWxvY2Vhbi5jb20vY29tbXVuaXR5L3R1dG9yaWFscy9hbi1pbnRyb2R1Y3Rpb24tdG8tb2F1dGgtMlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrV2l0aENsaWVudFxuICAgKiBAcGFyYW0ge2p3dH0gLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGp3dD59IC0gcHJvbWlzZSByZXNvbHZpbmcgd2l0aCBhIEpXVFxuICAgKi9cbiAgYXN5bmMgY2hlY2tXaXRoQ2xpZW50KG9yaWdpbmFsSldUOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyl7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBheGlvcyhgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2NoZWNrdG9rZW5gLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbicgOiBvcmlnaW5hbEpXVCA/IGBCZWFyZXIgJHtvcmlnaW5hbEpXVH1gIDogJydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgY29uc3QgaGVhZGVyID0gcmVzcC5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cbiAgICAgIGNvbnN0IG5ld0pXVCA9IGhlYWRlciAmJiBoZWFkZXIucmVwbGFjZSgnQmVhcmVyJywnJykudHJpbSgpO1xuXG4gICAgICBpZihoZWFkZXIgJiYgbmV3SldULmxlbmd0aCkgdGhpcy5zZXRBdXRoKG5ld0pXVCk7XG4gICAgICByZXR1cm4gbmV3SldUID8gbmV3SldUIDogb3JpZ2luYWxKV1Q7XG4gICAgfVxuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRva2VuIGZyb20gY3VycmVudCBVUkxcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RGcm9tVXJsXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZyB8IHVuZGVmaW5lZH0gLSBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4ge0pXVCB8IHVuZGVmaW5lZH0gQW4gb2JqZWN0IHdpaCB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICovXG4gIGdldEpXVGZyb21Mb2NhbFN0b3JhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGcm9tTG9jYWxTdG9yYWdlKCdncG9hdXRoSldUJylcbiAgfTtcblxuICAvKipcbiAgICogQXR0ZW1wdCBhbmQgcHVsbCBKV1QgZnJvbSB0aGUgZm9sbG93aW5nIGxvY2F0aW9ucyAoaW4gb3JkZXIpOlxuICAgKiAgLSBVUkwgcXVlcnkgcGFyYW1ldGVyICdhY2Nlc3NfdG9rZW4nIChyZXR1cm5lZCBmcm9tIElEUClcbiAgICogIC0gQnJvd3NlciBsb2NhbCBzdG9yYWdlIChzYXZlZCBmcm9tIHByZXZpb3VzIHJlcXVlc3QpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUXG4gICAqXG4gICAqIEByZXR1cm4ge3N0aW5nIHwgdW5kZWZpbmVkfVxuICAgKi9cbiAgZ2V0SldUKCk6IHN0cmluZyB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1RGcm9tVXJsKCkgfHwgdGhpcy5nZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKClcbiAgICAvLyBPbmx5IGRlbnkgaW1wbGljaXQgdG9rZW5zIHRoYXQgaGF2ZSBleHBpcmVkXG4gICAgaWYoIWp3dCB8fCAoand0ICYmIHRoaXMuaXNJbXBsaWNpdEpXVChqd3QpICYmIHRoaXMuaXNFeHBpcmVkKGp3dCkpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGp3dDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgSldUIHNhdmVkIGluIGxvY2FsIHN0b3JnZS5cbiAgICpcbiAgICogQG1ldGhvZCBjbGVhckxvY2FsU3RvcmFnZUpXVFxuICAgKlxuICAgKiBAcmV0dXJuICB7dW5kZWZpbmVkfVxuICAgKi9cbiAgcHJpdmF0ZSBjbGVhckxvY2FsU3RvcmFnZUpXVCgpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnZ3BvYXV0aEpXVCcpXG4gIH07XG5cbiAgLyoqXG4gICAqIElzIGEgdG9rZW4gZXhwaXJlZC5cbiAgICpcbiAgICogQG1ldGhvZCBpc0V4cGlyZWRcbiAgICogQHBhcmFtIHtKV1R9IGp3dCAtIEEgSldUXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0V4cGlyZWQoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICBpZihwYXJzZWRKV1Qpe1xuICAgICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICByZXR1cm4gbm93ID4gcGFyc2VkSldULmV4cDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhlIEpXVCBhbiBpbXBsaWNpdCBKV1Q/XG4gICAqIEBwYXJhbSBqd3RcbiAgICovXG4gIGlzSW1wbGljaXRKV1Qoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gcGFyc2VkSldUICYmIHBhcnNlZEpXVC5pbXBsaWNpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgKHNpZ25hdHVyZSBub3QgY2hlY2tlZCkgdW5wYWNraW5nIG9mIEpXVC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gQWNjZXNzIFRva2VuIChKV1QpXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHBhcnNlZCBwYXlsb2FkIGluIHRoZSBKV1RcbiAgICovXG4gIHBhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKV1Qge1xuICAgIHZhciBwYXJzZWQ7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKCctJywgJysnKS5yZXBsYWNlKCdfJywgJy8nKTtcbiAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShhdG9iKGJhc2U2NCkpO1xuICAgICAgfSBjYXRjaChlKSB7IC8qIERvbid0IHRocm93IHBhcnNlIGVycm9yICovIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfTtcblxuICAvKipcbiAgICogU2ltcGxlIGZyb250IGVuZCB2YWxpZGlvbiB0byB2ZXJpZnkgSldUIGlzIGNvbXBsZXRlIGFuZCBub3RcbiAgICogZXhwaXJlZC5cbiAgICpcbiAgICogTm90ZTpcbiAgICogIFNpZ25hdHVyZSB2YWxpZGF0aW9uIGlzIHRoZSBvbmx5IHRydWx5IHNhdmUgbWV0aG9kLiBUaGlzIGlzIGRvbmVcbiAgICogIGF1dG9tYXRpY2FsbHkgaW4gdGhlIG5vZGUtZ3BvYXV0aCBtb2R1bGUuXG4gICAqL1xuICB2YWxpZGF0ZUp3dCh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIHBhcnNlZCA9IHRoaXMucGFyc2VKd3QodG9rZW4pO1xuICAgIHZhciB2YWxpZCA9IChwYXJzZWQgJiYgcGFyc2VkLmV4cCAmJiBwYXJzZWQuZXhwICogMTAwMCA+IERhdGUubm93KCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSBKV1QgdG8gbG9jYWxTdG9yYWdlIGFuZCBpbiB0aGUgcmVxdWVzdCBoZWFkZXJzIGZvciBhY2Nlc3NpbmdcbiAgICogcHJvdGVjdGVkIHJlc291cmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtKV1R9IGp3dFxuICAgKi9cbiAgcHVibGljIHNldEF1dGgoand0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZSgnZ3BvYXV0aEpXVCcsIGp3dClcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpXG4gIH07XG5cbiAgLyoqXG4gICAqIFB1cmdlIHRoZSBKV1QgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIGF1dGhvcml6YXRpb24gaGVhZGVycy5cbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlQXV0aCgpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnZ3BvYXV0aEpXVCcpXG4gICAgLy8gU2VuZCBudWxsIHVzZXIgYXMgd2VsbCAoYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgbnVsbClcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyU2lnbk91dFwiKVxuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZSxcbiAgQUxMT1dfU1NPX0xPR0lOOiB0cnVlXG59XG4iXX0=