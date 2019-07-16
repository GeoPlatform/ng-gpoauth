/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
/** @type {?} */
var AUTH_STORAGE_KEY = 'gpoauthJWT';
/** @type {?} */
var REVOKE_RESPONSE = '<REVOKED>';
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
     * AuthService
     *
     * @param config
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
     * @return {?} HTMLIFrameElement
     */
    AuthService.prototype.createIframe = /**
     * Create an invisable iframe and appends it to the bottom of the page.
     *
     * \@method createIframe
     * @param {?} url
     * @return {?} HTMLIFrameElement
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
     * @param {?=} path
     * @return {?}
     */
    AuthService.prototype.login = /**
     * Redirects or displays login window the page to the login site
     * @param {?=} path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var loc = path ?
            "" + window.location.origin + path :
            this.config.CALLBACK ?
                this.config.CALLBACK :
                window.location.href; // default
        if (this.config.AUTH_TYPE === 'token') {
            window.location.href = this.config.IDP_BASE_URL +
                ("/auth/authorize?client_id=" + this.config.APP_ID) +
                ("&response_type=" + this.config.AUTH_TYPE) +
                ("&redirect_uri=" + encodeURIComponent(loc || '/login'));
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
                    || "/login?redirect_url=" + encodeURIComponent(loc);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Create iframe to manually call the logout and remove gpoauth cookie
                        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
                        if (this.config.IDP_BASE_URL)
                            this.createIframe(this.config.IDP_BASE_URL + "/auth/logout");
                        return [4 /*yield*/, getJson(this.config.APP_BASE_URL + "/revoke?sso=true", this.getJWT())];
                    case 1:
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
     * @param [jwt] - the JWT to extract user from.
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
     * @returns User - the authenticated user resolved via Promise
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
     * @return {?} User - the authenticated user resolved via Promise
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
     * @return {?} User - the authenticated user resolved via Promise
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
     * @returns User or null
     */
    /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * \@method check
     * @return {?} User or null
     */
    AuthService.prototype.check = /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * \@method check
     * @return {?} User or null
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
     * @param jwt - encoded accessToken/JWT
     *
     * @return Promise<jwt>
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
     * @param {?} originalJWT
     * @return {?} Promise<jwt>
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
     * @param {?} originalJWT
     * @return {?} Promise<jwt>
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
     * @return JWT Token (raw string)
     */
    /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?} JWT Token (raw string)
     */
    AuthService.prototype.getJWTFromUrl = /**
     * Extract token from current URL
     *
     * \@method getJWTFromUrl
     *
     * @return {?} JWT Token (raw string)
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
     * @return JWT Token
     */
    /**
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?} JWT Token
     */
    AuthService.prototype.getJWTfromLocalStorage = /**
     * Load the JWT stored in local storage.
     *
     * \@method getJWTfromLocalStorage
     *
     * @return {?} JWT Token
     */
    function () {
        return this.getFromLocalStorage(AUTH_STORAGE_KEY);
    };
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
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * \@method getJWT
     *
     * @return {?} JWT Token
     */
    AuthService.prototype.getJWT = /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * \@method getJWT
     *
     * @return {?} JWT Token
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
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };
    ;
    /**
     * Is a token expired.
     *
     * @method isExpired
     * @param jwt - A JWT
     *
     * @return Boolean
     */
    /**
     * Is a token expired.
     *
     * \@method isExpired
     * @param {?} jwt - A JWT
     *
     * @return {?} Boolean
     */
    AuthService.prototype.isExpired = /**
     * Is a token expired.
     *
     * \@method isExpired
     * @param {?} jwt - A JWT
     *
     * @return {?} Boolean
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
     * @param token - Access Token (JWT)
     * @return the parsed payload in the JWT
     */
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {?} token - Access Token (JWT)
     * @return {?} the parsed payload in the JWT
     */
    AuthService.prototype.parseJwt = /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {?} token - Access Token (JWT)
     * @return {?} the parsed payload in the JWT
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
     * @param {?} jwt - JWT
     * @return {?}
     */
    AuthService.prototype.setAuth = /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {?} jwt - JWT
     * @return {?}
     */
    function (jwt) {
        if (jwt == REVOKE_RESPONSE) {
            this.logout();
        }
        else {
            this.saveToLocalStorage(AUTH_STORAGE_KEY, jwt);
            this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt));
        }
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
        localStorage.removeItem(AUTH_STORAGE_KEY);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOztBQUV6QixJQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQTs7QUFDckMsSUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDOzs7Ozs7QUFFcEMsaUJBQXVCLEdBQVcsRUFBRSxHQUFZOzs7Ozt3QkFDakMscUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7d0JBQ1osT0FBTyxFQUFFLEVBQUUsZUFBZSxFQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBVSxHQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDekQsWUFBWSxFQUFFLE1BQU07cUJBQ3JCLENBQUMsRUFBQTs7b0JBSGhCLElBQUksR0FBRyxTQUdTO29CQUN0QixzQkFBTyxJQUFJLENBQUMsSUFBSSxFQUFDOzs7O0NBQ2xCOzs7O0FBTUQ7OztBQUFBO0lBS0U7Ozs7OztPQU1HO0lBQ0gscUJBQVksTUFBa0IsRUFBRSxXQUF3QjtRQUF4RCxpQkF1QkM7O1FBdEJDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQTs7UUFHNUIsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBVTs7WUFFckMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLDBCQUEwQixFQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDWjs7WUFHRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO2dCQUM5QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7YUFDbEI7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsSUFBSSxFQUFFO2FBQ1IsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUNSLElBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssT0FBTztnQkFDMUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1NBQ2xCLENBQUMsQ0FBQztLQUNOO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSCxrQ0FBWTs7Ozs7SUFBWjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtLQUN0Qjs7Ozs7OztJQUtPLHdDQUFrQjs7Ozs7O2NBQUMsR0FBVyxFQUFFLEtBQVU7UUFDaEQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0lBQ3hDLENBQUM7SUFFRjs7OztPQUlHOzs7Ozs7O0lBQ0gseUNBQW1COzs7Ozs7SUFBbkIsVUFBb0IsR0FBVzs7UUFDN0IsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQyxJQUFHO1lBQ0QsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxTQUFTLENBQUM7U0FDbkI7UUFBQyxPQUFPLENBQUMsRUFBQyxFQUFFLDZDQUE2Qzs7WUFDeEQsT0FBTyxTQUFTLENBQUM7U0FDbEI7S0FDRjtJQUFBLENBQUM7Ozs7SUFFTSw4QkFBUTs7Ozs7O1FBQ2QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQUNsQixJQUFNLE1BQU0sR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksb0NBQStCLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBSSxDQUFBOztRQUNqRyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBOztRQUczQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFVOztZQUVyQyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssa0JBQWtCLEVBQUM7Z0JBQ25DLElBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCOztvQkFDakQsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFBOztnQkFFcEIsSUFBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7b0JBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO2FBQzlDOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSywwQkFBMEIsRUFBQztnQkFDM0MsSUFBRyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSxpQkFBaUI7O29CQUNqRCxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUE7YUFDckI7U0FDRixDQUFDLENBQUE7Ozs7Ozs7OztJQVNVLDBCQUFJOzs7Ozs7Ozs7Ozs7O3dCQUNWLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O3dCQUcxQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7NEJBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7NkJBRWhELEdBQUcsRUFBSCx3QkFBRzt3QkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUNqQixzQkFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFBOzRCQUd4QixxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O29CQUQzQiwyQkFBMkI7b0JBQzNCLHNCQUFPLFNBQW9CLEVBQUM7Ozs7Ozs7OztJQU94Qix3Q0FBa0I7Ozs7OztRQUN4QixJQUFNLFlBQVksR0FBRyw2Q0FBNkMsQ0FBQTtRQUNsRSxJQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUM7WUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUUsRUFBRSxFQUFHLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUUsQ0FBQTtTQUM1RzthQUFNO1lBQ0wsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQTtTQUNqRDs7Ozs7Ozs7O0lBU0ssa0NBQVk7Ozs7Ozs7Y0FBQyxHQUFXOztRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxPQUFPLE1BQU0sQ0FBQTs7SUFDZCxDQUFDO0lBRUY7O09BRUc7Ozs7OztJQUNILDJCQUFLOzs7OztJQUFMLFVBQU0sSUFBYTs7UUFFakIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO1FBRXBDLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFO1lBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWTtpQkFDdkMsK0JBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBUSxDQUFBO2lCQUNqRCxvQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFXLENBQUE7aUJBQ3pDLG1CQUFpQixrQkFBa0IsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFHLENBQUEsQ0FBQTs7U0FHL0Q7YUFBTTs7WUFFTCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUM7Z0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUE7O2FBRzlDO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUzt1QkFDekIseUJBQXVCLGtCQUFrQixDQUFDLEdBQUcsQ0FBRyxDQUFBO2FBQ3BFO1NBQ0Y7S0FDRjtJQUFBLENBQUM7SUFFRjs7T0FFRzs7Ozs7SUFDRyw0QkFBTTs7OztJQUFaOzs7Ozs7O3dCQUdFLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZOzRCQUN6QixJQUFJLENBQUMsWUFBWSxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxpQkFBYyxDQUFDLENBQUE7d0JBRTlELHFCQUFNLE9BQU8sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVkscUJBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUE7O3dCQUEzRSxTQUEyRSxDQUFBO3dCQUMzRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7d0JBRWpCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVOzRCQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFBO3dCQUN4RSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVzs0QkFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Ozs7O0tBQy9DO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsZ0NBQVU7Ozs7SUFBVjtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkO0lBQUEsQ0FBQztJQUVGOztPQUVHOzs7OztJQUNHLHFDQUFlOzs7O0lBQXJCOzs7Ozs7d0JBQ1EsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs2QkFFbkIsR0FBRyxFQUFILHdCQUFHO3dCQUNSLHFCQUFNLE9BQU8sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksaUJBQWMsRUFBRSxHQUFHLENBQUMsRUFBQTs7d0JBQTdELEtBQUEsU0FBNkQsQ0FBQTs7O3dCQUM3RCxLQUFBLElBQUksQ0FBQTs7NEJBRk4sMEJBRU87Ozs7S0FDUjtJQUFBLENBQUM7SUFFRjs7Ozs7OztPQU9HOzs7Ozs7Ozs7O0lBQ0gsb0NBQWM7Ozs7Ozs7OztJQUFkLFVBQWUsR0FBVzs7UUFDeEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQixPQUFPLElBQUksQ0FBQyxDQUFDO1lBQ0wsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUM7S0FDZDtJQUVEOzs7Ozs7Ozs7T0FTRzs7Ozs7Ozs7Ozs7SUFDSCxpQ0FBVzs7Ozs7Ozs7OztJQUFYLFVBQVksUUFBeUM7O1FBQ25ELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7OztRQUl4QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNwQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4Qkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ0csNkJBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBYjs7Ozs7OzRCQUtlLHFCQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQTs7d0JBQXpCLElBQUksR0FBRyxTQUFrQjt3QkFDL0IsSUFBRyxJQUFJOzRCQUFFLHNCQUFPLElBQUksRUFBQTs7d0JBR3BCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQzs7NEJBRTNELElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsS0FBWSxFQUFFLElBQXFCO2dDQUN6RSxPQUFPLElBQUksQ0FBQTs2QkFDWixDQUFDLENBQUE7eUJBQ0g7O3dCQUVELElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDOzRCQUM1RCxzQkFBTyxJQUFJLEVBQUE7eUJBQ1o7O3dCQUVELElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDOzRCQUM1RCxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxLQUFVOztnQ0FFckMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGtCQUFrQixFQUFDO29DQUNuQyxPQUFPLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtpQ0FDdEI7NkJBQ0YsQ0FBQyxDQUFBOzRCQUNGLHNCQUFPLElBQUksRUFBQTt5QkFDWjs7d0JBRUQsSUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQzs0QkFDN0Qsc0JBQU8sSUFBSSxFQUFBLENBQUMsYUFBYTt5QkFDMUI7Ozs7O0tBQ0Y7SUFBQSxDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNHLDJCQUFLOzs7Ozs7O0lBQVg7Ozs7Ozs7d0JBQ1EsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs2QkFHdkIsQ0FBQyxHQUFHLEVBQUosd0JBQUk7d0JBQ1kscUJBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsRUFBQTs7d0JBQXpDLFFBQVEsR0FBRyxTQUE4Qjt3QkFFL0Msc0JBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dDQUMvQixJQUFJLEVBQUM7OzZCQUVaLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBeEIsd0JBQXdCOzZCQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFuQix3QkFBbUI7d0JBQ2xCLHFCQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO2lDQUM1QixJQUFJLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUF4QixDQUF3QixDQUFDLEVBQUE7O3dCQUR4QyxLQUFBLFNBQ3dDLENBQUE7Ozt3QkFDeEMsS0FBQSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzs0QkFKSixjQUFjO29CQUMxQywwQkFHaUM7NEJBRTFCLGVBQWU7b0JBQ3RCLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDcEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFDOzs7O0tBRXBDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHOzs7Ozs7Ozs7Ozs7O0lBQ0cscUNBQWU7Ozs7Ozs7Ozs7OztJQUFyQixVQUFzQixXQUFtQjs7Ozs7OzZCQUNwQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQSxFQUFqQyx3QkFBaUM7d0JBQ2xDLHNCQUFPLElBQUksRUFBQTs0QkFHRSxxQkFBTSxLQUFLLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLGdCQUFhLEVBQUU7NEJBQ3JELE9BQU8sRUFBRTtnQ0FDUCxlQUFlLEVBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFVLFdBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRTs2QkFDN0Q7eUJBQ0YsQ0FBQyxFQUFBOzt3QkFKUixJQUFJLEdBQUcsU0FJQzt3QkFFUixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTt3QkFDdEMsTUFBTSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFFNUQsSUFBRyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU07NEJBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDakQsc0JBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBQzs7OztLQUV4QztJQUVELHVEQUF1RDtJQUV2RDs7Ozs7O09BTUc7Ozs7Ozs7O0lBQ0gsbUNBQWE7Ozs7Ozs7SUFBYjs7UUFDRSxJQUFNLFdBQVcsR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7O1FBQ2pELElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFBQSxDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNILDRDQUFzQjs7Ozs7OztJQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUE7S0FDbEQ7SUFBQSxDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7Ozs7Ozs7Ozs7SUFDSCw0QkFBTTs7Ozs7Ozs7O0lBQU47O1FBQ0UsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFBOztRQUVqRSxJQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2xFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTTtZQUNMLE9BQU8sR0FBRyxDQUFDO1NBQ1o7S0FDRjtJQUFBLENBQUM7Ozs7Ozs7O0lBUU0sMENBQW9COzs7Ozs7OztRQUMxQixZQUFZLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0lBQzFDLENBQUM7SUFFRjs7Ozs7OztPQU9HOzs7Ozs7Ozs7SUFDSCwrQkFBUzs7Ozs7Ozs7SUFBVCxVQUFVLEdBQVc7O1FBQ25CLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEMsSUFBRyxTQUFTLEVBQUM7O1lBQ1gsSUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzFDLE9BQU8sR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7U0FDNUI7UUFDRCxPQUFPLElBQUksQ0FBQTtLQUNaO0lBQUEsQ0FBQztJQUVGOzs7T0FHRzs7Ozs7O0lBQ0gsbUNBQWE7Ozs7O0lBQWIsVUFBYyxHQUFXOztRQUN2QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BDLE9BQU8sU0FBUyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUM7S0FDeEM7SUFFRDs7Ozs7T0FLRzs7Ozs7OztJQUNILDhCQUFROzs7Ozs7SUFBUixVQUFTLEtBQWE7O1FBQ3BCLElBQUksTUFBTSxDQUFDO1FBQ1gsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJOztnQkFDRixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFDcEMsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDbkM7WUFBQyxPQUFNLENBQUMsRUFBRSxFQUFFLDZCQUE2Qjs7YUFBRTtTQUM3QztRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7SUFBQSxDQUFDO0lBRUY7Ozs7Ozs7T0FPRzs7Ozs7Ozs7Ozs7SUFDSCxpQ0FBVzs7Ozs7Ozs7OztJQUFYLFVBQVksS0FBYTs7UUFDdkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7UUFDbEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEYsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUFBLENBQUM7Ozs7Ozs7O0lBUUssNkJBQU87Ozs7Ozs7Y0FBQyxHQUFXO1FBQ3hCLElBQUcsR0FBRyxJQUFJLGVBQWUsRUFBQztZQUN4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDZDthQUFNO1lBQ0wsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUN4RTs7SUFDRixDQUFDOzs7OztJQUtNLGdDQUFVOzs7OztRQUNoQixZQUFZLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUE7O1FBRXpDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztJQUN4QyxDQUFDO3NCQTlnQko7SUErZ0JDLENBQUE7Ozs7QUE1ZkQsdUJBNGZDOzs7Ozs7OztBQUdELFdBQWEsZUFBZSxHQUFlO0lBQ3pDLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLFlBQVksRUFBRSxFQUFFOztJQUNoQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLGVBQWUsRUFBRSxJQUFJO0NBQ3RCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSB9IGZyb20gJy4uL3NyYy9hdXRoVHlwZXMnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlcidcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblxuY29uc3QgQVVUSF9TVE9SQUdFX0tFWSA9ICdncG9hdXRoSldUJ1xuY29uc3QgUkVWT0tFX1JFU1BPTlNFID0gJzxSRVZPS0VEPic7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEpzb24odXJsOiBzdHJpbmcsIGp3dD86IHN0cmluZykge1xuICBjb25zdCByZXNwID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbicgOiBqd3QgPyBgQmVhcmVyICR7and0fWAgOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICByZXR1cm4gcmVzcC5kYXRhO1xufVxuXG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG5cbiAgLyoqXG4gICAqXG4gICAqIEF1dGhTZXJ2aWNlXG4gICAqIFxuICAgKiBAcGFyYW0gY29uZmlnXG4gICAqIEBwYXJhbVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBBdXRoQ29uZmlnLCBuZ01lc3NlbmdlcjogbmdNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHNlbGYucmVtb3ZlQXV0aCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gICAgICAudGhlbih1c2VyID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfU1NPX0xPR0lOICYmICF1c2VyICYmIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ2dyYW50JylcbiAgICAgICAgICBzZWxmLnNzb0NoZWNrKClcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBuZ01lc3NlbmdlciBzbyB0aGF0IGFwcGxpY3Rpb24gY29kZSBpcyBhYmxlIHRvXG4gICAqIHN1YnNjcmliZSB0byBub3RpZmljYXRpb25zIHNlbnQgYnkgbmctZ3BvYXV0aFxuICAgKi9cbiAgZ2V0TWVzc2VuZ2VyKCk6IG5nTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWN1cml0eSB3cmFwcGVyIGZvciBvYmZ1c2NhdGluZyB2YWx1ZXMgcGFzc2VkIGludG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBzYXZlVG9Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGJ0b2EodmFsdWUpKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmUgYW5kIGRlY29kZSB2YWx1ZSBmcm9tIGxvY2Fsc3RvcmFnZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRGcm9tTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IocmF3KSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlKXsgLy8gQ2F0Y2ggYmFkIGVuY29kaW5nIG9yIGZvcm1hbGx5IG5vdCBlbmNvZGVkXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHNzb0NoZWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNzb1VSTCA9IGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vbG9naW4/c3NvPXRydWUmY2FjaGVidXN0ZXI9JHsobmV3IERhdGUoKSkuZ2V0VGltZSgpfWBcbiAgICBjb25zdCBzc29JZnJhbWUgPSB0aGlzLmNyZWF0ZUlmcmFtZShzc29VUkwpXG5cbiAgICAvLyBTZXR1cCBzc29JZnJhbWUgc3BlY2lmaWMgaGFuZGxlcnNcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICAgIC8vIEZvcmNlIGxvZ2luIG9ubHkgYWZ0ZXIgU1NPIGhhcyBmYWlsZWRcbiAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICAvL2NsZWFuIGhvc3R1cmwgb24gcmVkaXJlY3QgZnJvbSBvYXV0aFxuICAgIGlmICh0aGlzLmdldEpXVEZyb21VcmwoKSkgdGhpcy5yZW1vdmVUb2tlbkZyb21VcmwoKVxuXG4gICAgaWYoand0KSB7XG4gICAgICB0aGlzLnNldEF1dGgoand0KVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjYWxsIHRvIGNoZWNrd2l0aCBTZXJ2ZXJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFVzZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBhY2Nlc3NfdG9rZW4gcHJvcGVydHkgZnJvbSB0aGUgVVJMLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVUb2tlbkZyb21VcmwoKTogdm9pZCB7XG4gICAgY29uc3QgcmVwbGFjZVJlZ2V4ID0gL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qKFxcJnRva2VuX3R5cGU9QmVhcmVyKT8vXG4gICAgaWYod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKXtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKSApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZShyZXBsYWNlUmVnZXgsICcnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW52aXNhYmxlIGlmcmFtZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNyZWF0ZUlmcmFtZVxuICAgKiBAcmV0dXJucyBIVE1MSUZyYW1lRWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVJZnJhbWUodXJsOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XG4gICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmcmFtZS5zcmMgPSB1cmxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICByZXR1cm4gaWZyYW1lXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZGlyZWN0cyBvciBkaXNwbGF5cyBsb2dpbiB3aW5kb3cgdGhlIHBhZ2UgdG8gdGhlIGxvZ2luIHNpdGVcbiAgICovXG4gIGxvZ2luKHBhdGg/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBjb25zdCBsb2MgPSBwYXRoID9cbiAgICAgICAgICAgICAgICBgJHt3aW5kb3cubG9jYXRpb24ub3JpZ2lufSR7cGF0aH1gIDpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLIDpcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgLy8gZGVmYXVsdFxuXG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLklEUF9CQVNFX1VSTCArXG4gICAgICAgICAgICAgIGAvYXV0aC9hdXRob3JpemU/Y2xpZW50X2lkPSR7dGhpcy5jb25maWcuQVBQX0lEfWAgK1xuICAgICAgICAgICAgICBgJnJlc3BvbnNlX3R5cGU9JHt0aGlzLmNvbmZpZy5BVVRIX1RZUEV9YCArXG4gICAgICAgICAgICAgIGAmcmVkaXJlY3RfdXJpPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyB8fCAnL2xvZ2luJyl9YFxuXG4gICAgLy8gT3RoZXJ3aXNlIHBvcCB1cCB0aGUgbG9naW4gbW9kYWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWZyYW1lIGxvZ2luXG4gICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4pe1xuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ2F1dGg6cmVxdWlyZUxvZ2luJylcblxuICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIENyZWF0ZSBpZnJhbWUgdG8gbWFudWFsbHkgY2FsbCB0aGUgbG9nb3V0IGFuZCByZW1vdmUgZ3BvYXV0aCBjb29raWVcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzc1ODIwNy93aHktaXMtcGFzc3BvcnRqcy1pbi1ub2RlLW5vdC1yZW1vdmluZy1zZXNzaW9uLW9uLWxvZ291dCNhbnN3ZXItMzM3ODY4OTlcbiAgICBpZih0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkwpXG4gICAgICB0aGlzLmNyZWF0ZUlmcmFtZShgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2F1dGgvbG9nb3V0YClcblxuICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgIHRoaXMucmVtb3ZlQXV0aCgpIC8vIHB1cmdlIHRoZSBKV1RcblxuICAgIGlmKHRoaXMuY29uZmlnLkxPR09VVF9VUkwpIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HT1VUX1VSTFxuICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSB0aGlzLmZvcmNlTG9naW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBmb3JjZSByZWRpcmVjdCBmb3Igbm9uLXB1YmxpYyBzZXJ2aWNlc1xuICAgKi9cbiAgZm9yY2VMb2dpbigpIHtcbiAgICB0aGlzLmxvZ2luKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBwcm90ZWN0ZWQgdXNlciBwcm9maWxlXG4gICAqL1xuICBhc3luYyBnZXRPYXV0aFByb2ZpbGUoKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICAgIGNvbnN0IEpXVCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICByZXR1cm4gSldUID9cbiAgICAgIGF3YWl0IGdldEpzb24oYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hcGkvcHJvZmlsZWAsIEpXVCkgOlxuICAgICAgbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IFVzZXIgb2JqZWN0IGZyb20gdGhlIEpXVC5cbiAgICpcbiAgICogSWYgbm8gSldUIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgbG9va2VkIGZvciBhdCB0aGUgbm9ybWFsIEpXVFxuICAgKiBsb2NhdGlvbnMgKGxvY2FsU3RvcmFnZSBvciBVUkwgcXVlcnlTdHJpbmcpLlxuICAgKlxuICAgKiBAcGFyYW0gW2p3dF0gLSB0aGUgSldUIHRvIGV4dHJhY3QgdXNlciBmcm9tLlxuICAgKi9cbiAgZ2V0VXNlckZyb21KV1Qoand0OiBzdHJpbmcpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gdXNlciA/XG4gICAgICAgICAgICBuZXcgR2VvUGxhdGZvcm1Vc2VyKE9iamVjdC5hc3NpZ24oe30sIHVzZXIsIHsgaWQ6IHVzZXIuc3ViIH0pKSA6XG4gICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgKiB3aWxsIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSwgaXQgcmV0dXJucyB0aGUgdXNlciAob3IgbnVsbCkuXG4gICAqXG4gICAqIFNpZGUgRWZmZWN0czpcbiAgICogIC0gV2lsbCByZWRpcmVjdCB1c2VycyBpZiBubyB2YWxpZCBKV1Qgd2FzIGZvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayBvcHRpb25hbCBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCB0aGUgdXNlclxuICAgKiBAcmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgY3VycmVudCB1c2VyXG4gICAqL1xuICBnZXRVc2VyU3luYyhjYWxsYmFjaz86ICh1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAgIC8vIGJlY2F1c2UgdGhleSB3aWxsIHJlY2lldmUgYSBuZXcgdG9rZW4gYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbWlzZSB2ZXJzaW9uIG9mIGdldCB1c2VyLlxuICAgKlxuICAgKiBCZWxvdyBpcyBhIHRhYmxlIG9mIGhvdyB0aGlzIGZ1bmN0aW9uIGhhbmRlbHMgdGhpcyBtZXRob2Qgd2l0aFxuICAgKiBkaWZmZXJudCBjb25maWd1cmF0aW9ucy5cbiAgICogIC0gRk9SQ0VfTE9HSU4gOiBIb3Jpem9udGFsXG4gICAqICAtIEFMTE9XX0lGUkFNRV9MT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XX0lGUkFNRV9MT0dJTilcbiAgICpcbiAgICogQ2FzZXM6XG4gICAqIDEuIERlbGF5IHJlc29sdmUgZnVuY3Rpb24gdGlsbCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgKiAyLiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICogMy4gRm9yY2UgdGhlIHJlZGlyZWN0XG4gICAqIDQuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKlxuICAgKiBOT1RFOlxuICAgKiBDYXNlIDEgYWJvdmUgd2lsbCBjYXVzZSB0aGlzIG1ldGhvZCdzIHByb21pc2UgdG8gYmUgYSBsb25nIHN0YWxsXG4gICAqIHVudGlsIHRoZSB1c2VyIGNvbXBsZXRlcyB0aGUgbG9naW4gcHJvY2Vzcy4gVGhpcyBzaG91bGQgYWxsb3cgdGhlXG4gICAqIGFwcCB0byBmb3JnbyBhIHJlbG9hZCBpcyBpdCBzaG91bGQgaGF2ZSB3YWl0ZWQgdGlsbCB0aGUgZW50aXJlXG4gICAqIHRpbWUgdGlsbCB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRVc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIFVzZXIgLSB0aGUgYXV0aGVudGljYXRlZCB1c2VyIHJlc29sdmVkIHZpYSBQcm9taXNlXG4gICAqL1xuICBhc3luYyBnZXRVc2VyKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPiB7XG4gICAgLy8gRm9yIGJhc2ljIHRlc3RpbmdcbiAgICAvLyB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoJ3VzZXJBdXRoZW50aWNhdGVkJywgeyBuYW1lOiAndXNlcm5hbWUnfSlcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5jaGVjaygpO1xuICAgIGlmKHVzZXIpIHJldHVybiB1c2VyXG5cbiAgICAvLyBDYXNlIDEgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICByZXR1cm4gdXNlclxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICAvLyBDYXNlIDMgLSBBTExPV19JRlJBTUVfTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICByZXR1cm4gbnVsbCAvLyBvciByZWplY3Q/XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMgVXNlciBvciBudWxsXG4gICAqL1xuICBhc3luYyBjaGVjaygpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj57XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vIElmIG5vIGxvY2FsIEpXVFxuICAgIGlmKCFqd3QpIHtcbiAgICAgIGNvbnN0IGZyZXNoSnd0ID0gYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoXCJcIik7XG5cbiAgICAgIHJldHVybiBqd3QgJiYgand0Lmxlbmd0aCA/XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1QoZnJlc2hKd3QpIDpcbiAgICAgICAgICAgICAgbnVsbDtcbiAgICB9XG4gICAgaWYoIXRoaXMuaXNJbXBsaWNpdEpXVChqd3QpKXsgLy8gR3JhbnQgdG9rZW5cbiAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jaGVja1dpdGhDbGllbnQoand0KVxuICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpIDogLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuXG4gICAgfSBlbHNlIHsgLy8gSW1wbGljaXQgSldUXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG51bGwpIDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBzZXJ2aWNlIGhvc3Rpbmcgbm9kZS1ncG9hdXRoIHRvIGFsbG93IGZvciBhXG4gICAqIHRva2VuIHJlZnJlc2ggb24gYW4gZXhwaXJlZCB0b2tlbiwgb3IgYSB0b2tlbiB0aGF0IGhhcyBiZWVuXG4gICAqIGludmFsaWRhdGVkIHRvIGJlIHJldm9rZWQuXG4gICAqXG4gICAqIE5vdGU6IENsaWVudCBhcyBpbiBob3N0aW5nIGFwcGxpY2F0aW9uOlxuICAgKiAgICBodHRwczovL3d3dy5kaWdpdGFsb2NlYW4uY29tL2NvbW11bml0eS90dXRvcmlhbHMvYW4taW50cm9kdWN0aW9uLXRvLW9hdXRoLTJcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1dpdGhDbGllbnRcbiAgICogQHBhcmFtIGp3dCAtIGVuY29kZWQgYWNjZXNzVG9rZW4vSldUXG4gICAqXG4gICAqIEByZXR1cm4gUHJvbWlzZTxqd3Q+XG4gICAqL1xuICBhc3luYyBjaGVja1dpdGhDbGllbnQob3JpZ2luYWxKV1Q6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zKGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vY2hlY2t0b2tlbmAsIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyA6IG9yaWdpbmFsSldUID8gYEJlYXJlciAke29yaWdpbmFsSldUfWAgOiAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICBjb25zdCBoZWFkZXIgPSByZXNwLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXVxuICAgICAgY29uc3QgbmV3SldUID0gaGVhZGVyICYmIGhlYWRlci5yZXBsYWNlKCdCZWFyZXInLCcnKS50cmltKCk7XG5cbiAgICAgIGlmKGhlYWRlciAmJiBuZXdKV1QubGVuZ3RoKSB0aGlzLnNldEF1dGgobmV3SldUKTtcbiAgICAgIHJldHVybiBuZXdKV1QgPyBuZXdKV1QgOiBvcmlnaW5hbEpXVDtcbiAgICB9XG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZShBVVRIX1NUT1JBR0VfS0VZKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW5cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9TVE9SQUdFX0tFWSlcbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiBCb29sZWFuXG4gICAqL1xuICBpc0V4cGlyZWQoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICBpZihwYXJzZWRKV1Qpe1xuICAgICAgY29uc3Qgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICByZXR1cm4gbm93ID4gcGFyc2VkSldULmV4cDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhlIEpXVCBhbiBpbXBsaWNpdCBKV1Q/XG4gICAqIEBwYXJhbSBqd3RcbiAgICovXG4gIGlzSW1wbGljaXRKV1Qoand0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJzZWRKV1QgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gcGFyc2VkSldUICYmIHBhcnNlZEpXVC5pbXBsaWNpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnNhZmUgKHNpZ25hdHVyZSBub3QgY2hlY2tlZCkgdW5wYWNraW5nIG9mIEpXVC5cbiAgICpcbiAgICogQHBhcmFtIHRva2VuIC0gQWNjZXNzIFRva2VuIChKV1QpXG4gICAqIEByZXR1cm4gdGhlIHBhcnNlZCBwYXlsb2FkIGluIHRoZSBKV1RcbiAgICovXG4gIHBhcnNlSnd0KHRva2VuOiBzdHJpbmcpOiBKV1Qge1xuICAgIHZhciBwYXJzZWQ7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKCctJywgJysnKS5yZXBsYWNlKCdfJywgJy8nKTtcbiAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShhdG9iKGJhc2U2NCkpO1xuICAgICAgfSBjYXRjaChlKSB7IC8qIERvbid0IHRocm93IHBhcnNlIGVycm9yICovIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfTtcblxuICAvKipcbiAgICogU2ltcGxlIGZyb250IGVuZCB2YWxpZGlvbiB0byB2ZXJpZnkgSldUIGlzIGNvbXBsZXRlIGFuZCBub3RcbiAgICogZXhwaXJlZC5cbiAgICpcbiAgICogTm90ZTpcbiAgICogIFNpZ25hdHVyZSB2YWxpZGF0aW9uIGlzIHRoZSBvbmx5IHRydWx5IHNhdmUgbWV0aG9kLiBUaGlzIGlzIGRvbmVcbiAgICogIGF1dG9tYXRpY2FsbHkgaW4gdGhlIG5vZGUtZ3BvYXV0aCBtb2R1bGUuXG4gICAqL1xuICB2YWxpZGF0ZUp3dCh0b2tlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIHBhcnNlZCA9IHRoaXMucGFyc2VKd3QodG9rZW4pO1xuICAgIHZhciB2YWxpZCA9IChwYXJzZWQgJiYgcGFyc2VkLmV4cCAmJiBwYXJzZWQuZXhwICogMTAwMCA+IERhdGUubm93KCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSBKV1QgdG8gbG9jYWxTdG9yYWdlIGFuZCBpbiB0aGUgcmVxdWVzdCBoZWFkZXJzIGZvciBhY2Nlc3NpbmdcbiAgICogcHJvdGVjdGVkIHJlc291cmNlcy5cbiAgICpcbiAgICogQHBhcmFtIGp3dCAtIEpXVFxuICAgKi9cbiAgcHVibGljIHNldEF1dGgoand0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZihqd3QgPT0gUkVWT0tFX1JFU1BPTlNFKXtcbiAgICAgIHRoaXMubG9nb3V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoQVVUSF9TVE9SQUdFX0tFWSwgand0KVxuICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUHVyZ2UgdGhlIEpXVCBmcm9tIGxvY2FsU3RvcmFnZSBhbmQgYXV0aG9yaXphdGlvbiBoZWFkZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVBdXRoKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKEFVVEhfU1RPUkFHRV9LRVkpXG4gICAgLy8gU2VuZCBudWxsIHVzZXIgYXMgd2VsbCAoYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgbnVsbClcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyU2lnbk91dFwiKVxuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZSxcbiAgQUxMT1dfU1NPX0xPR0lOOiB0cnVlXG59XG4iXX0=