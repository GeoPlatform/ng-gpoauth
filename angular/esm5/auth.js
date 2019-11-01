/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
/** @type {?} */
var ACCESS_TOKEN_COOKIE = 'gpoauth-a';
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
                _this.messenger.broadcast("userAuthenticated", null);
                _this.messenger.broadcast("userSignOut");
            }
        });
        self.init();
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
            var self, script, jwt, user;
            return tslib_1.__generator(this, function (_a) {
                self = this;
                // Delay init until RPMService is loaded
                if (this.RPMLoaded() && this.config.loadRPM) {
                    script = document.createElement('script');
                    script.onload = function () {
                        //do stuff with the script
                        self.init();
                    };
                    script.src = "https://s3.amazonaws.com/geoplatform-cdn/gp.rpm/" + (this.config.RPMVersion || 'stable') + "/js/gp.rpm.browser.js";
                    document.head.appendChild(script);
                    return [2 /*return*/]; // skip init() till RPM is loaded
                }
                jwt = this.getJWT();
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
                setInterval(function () { self.checkForLocalToken(); }, this.config.tokenCheckInterval);
                user = this.getUserFromJWT(jwt);
                if (user)
                    this.messenger.broadcast("userAuthenticated", user);
                return [2 /*return*/, user];
            });
        });
    };
    /**
     * Checks for the presence of token in cookie. If there has been a
     * change (cookie appears or disapears) the fire event handlers to
     * notify the appliction of the event.
     * @return {?}
     */
    AuthService.prototype.checkForLocalToken = /**
     * Checks for the presence of token in cookie. If there has been a
     * change (cookie appears or disapears) the fire event handlers to
     * notify the appliction of the event.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var jwt = this.getJWT();
        /** @type {?} */
        var tokenPresent = !!jwt;
        // compare with previous check
        if (tokenPresent !== this.preveiousTokenPresentCheck)
            tokenPresent ?
                this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt)) :
                this.messenger.broadcast("userSignOut");
        // update previous state for next check
        this.preveiousTokenPresentCheck = tokenPresent;
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
                    case 0: return [4 /*yield*/, getJson(this.config.APP_BASE_URL + "/revoke", this.getJWT())];
                    case 1:
                        _a.sent();
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
     * @return {?} object representing current user
     */
    AuthService.prototype.getUserSync = /**
     * If the callback parameter is specified, this method
     * will return undefined. Otherwise, it returns the user (or null).
     *
     * Side Effects:
     *  - Will redirect users if no valid JWT was found
     *
     * @return {?} object representing current user
     */
    function () {
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
                        return [4 /*yield*/, this.checkWithClient()];
                    case 1:
                        freshJwt = _b.sent();
                        return [2 /*return*/, jwt && jwt.length ?
                                this.getUserFromJWT(freshJwt) :
                                null];
                    case 2:
                        if (!!this.isImplicitJWT(jwt)) return [3 /*break*/, 6];
                        if (!this.isExpired(jwt)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkWithClient() // Check with server
                                .then(function (jwt) { return jwt && _this.getUserFromJWT(jwt); })];
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
     * @return {?} Promise<jwt>
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.config.AUTH_TYPE === 'token' ?
                        null :
                        axios(this.config.APP_BASE_URL + "/checktoken")
                            .then(function () { return _this.getJWTfromLocalStorage(); })];
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
     * Is RPM library loaded already?
     */
    /**
     * Is RPM library loaded already?
     * @return {?}
     */
    AuthService.prototype.RPMLoaded = /**
     * Is RPM library loaded already?
     * @return {?}
     */
    function () {
        return typeof window.RPMService != 'undefined';
    };
    /**
     * Get an associated array of cookies.
     * @return {?}
     */
    AuthService.prototype.getCookieObject = /**
     * Get an associated array of cookies.
     * @return {?}
     */
    function () {
        return document.cookie.split(';')
            .map(function (c) { return c.trim().split('='); })
            .reduce(function (acc, pair) {
            acc[pair[0]] = pair[1];
            return acc;
        }, {});
    };
    /**
     * Extract and decode from cookie
     *
     * @param {?} key
     * @return {?}
     */
    AuthService.prototype.getFromCookie = /**
     * Extract and decode from cookie
     *
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var raw = this.getCookieObject()[key];
        try {
            return raw ?
                atob(decodeURIComponent(raw)) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            // Catch bad encoding or formally not encoded
            return undefined;
        }
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
        return this.getFromCookie(ACCESS_TOKEN_COOKIE);
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
    /** @type {?} */
    AuthService.prototype.preveiousTokenPresentCheck;
}
/** @type {?} */
export var DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    // absolute path // use . for relative path
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOztBQUl6QixJQUFNLG1CQUFtQixHQUFJLFdBQVcsQ0FBQTs7Ozs7O0FBRXhDLGlCQUF1QixHQUFXLEVBQUUsR0FBWTs7Ozs7d0JBQ2pDLHFCQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO3dCQUNaLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVUsR0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ3pELFlBQVksRUFBRSxNQUFNO3FCQUNyQixDQUFDLEVBQUE7O29CQUhoQixJQUFJLEdBQUcsU0FHUztvQkFDdEIsc0JBQU8sSUFBSSxDQUFDLElBQUksRUFBQzs7OztDQUNsQjs7OztBQU1EOzs7QUFBQTtJQU1FOzs7Ozs7T0FNRztJQUNILHFCQUFZLE1BQWtCLEVBQUUsV0FBd0I7UUFBeEQsaUJBb0JDOztRQW5CQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7O1FBRzVCLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQVU7O1lBRXJDLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSywwQkFBMEIsRUFBQztnQkFDM0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO2FBQ1o7O1lBR0QsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBQztnQkFDOUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ25ELEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO2FBQ3hDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ1o7SUFFRDs7O09BR0c7Ozs7OztJQUNILGtDQUFZOzs7OztJQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO0tBQ3RCO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILHlDQUFtQjs7Ozs7O0lBQW5CLFVBQW9CLEdBQVc7O1FBQzdCLElBQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckMsSUFBRztZQUNELE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsU0FBUyxDQUFDO1NBQ25CO1FBQUMsT0FBTyxDQUFDLEVBQUMsRUFBRSw2Q0FBNkM7O1lBQ3hELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0tBQ0Y7SUFBQSxDQUFDOzs7Ozs7OztJQVFZLDBCQUFJOzs7Ozs7Ozs7OztnQkFDVixJQUFJLEdBQUcsSUFBSSxDQUFDOztnQkFHbEIsSUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUM7b0JBQ25DLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsTUFBTSxHQUFHOzt3QkFFWixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ2YsQ0FBQztvQkFDRixNQUFNLENBQUMsR0FBRyxHQUFHLHNEQUFtRCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxRQUFRLDJCQUF1QixDQUFDO29CQUUxSCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDbEMsc0JBQU0sQ0FBQyxpQ0FBaUM7aUJBQ3pDO2dCQUdLLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O2dCQUcxQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtvQkFDeEIsSUFBRyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFDO3dCQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBRSxFQUFFLEVBQUcsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxFQUFFLEVBQUUsQ0FBQyxDQUFFLENBQUE7cUJBQzFJO3lCQUFNO3dCQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxFQUFFLENBQUMsQ0FBQTtxQkFDL0U7aUJBQ0Y7O2dCQUdELElBQUksQ0FBQywwQkFBMEIsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFBO2dCQUN2QyxXQUFXLENBQUMsY0FBUSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2dCQUUxRSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDckMsSUFBRyxJQUFJO29CQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUVyRCxzQkFBTyxJQUFJLEVBQUE7Ozs7Ozs7Ozs7SUFRTCx3Q0FBa0I7Ozs7Ozs7O1FBQ3hCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTs7UUFDekIsSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQTs7UUFFMUIsSUFBSSxZQUFZLEtBQUssSUFBSSxDQUFDLDBCQUEwQjtZQUNsRCxZQUFZLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7O1FBRzVDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxZQUFZLENBQUE7Ozs7OztJQU14Qyx3Q0FBa0I7Ozs7OztRQUN4QixJQUFNLFlBQVksR0FBRyw2Q0FBNkMsQ0FBQTtRQUNsRSxJQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUM7WUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUUsRUFBRSxFQUFHLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUUsQ0FBQTtTQUM1RzthQUFNO1lBQ0wsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQTtTQUNqRDs7Ozs7Ozs7O0lBU0ssa0NBQVk7Ozs7Ozs7Y0FBQyxHQUFXOztRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxPQUFPLE1BQU0sQ0FBQTs7SUFDZCxDQUFDO0lBRUY7O09BRUc7Ozs7OztJQUNILDJCQUFLOzs7OztJQUFMLFVBQU0sSUFBYTs7UUFFakIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO1FBRXBDLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFO1lBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWTtpQkFDdkMsK0JBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBUSxDQUFBO2lCQUNqRCxvQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFXLENBQUE7aUJBQ3pDLG1CQUFpQixrQkFBa0IsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFHLENBQUEsQ0FBQTs7U0FHL0Q7YUFBTTs7WUFFTCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUM7Z0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUE7O2FBRzlDO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUzt1QkFDekIseUJBQXVCLGtCQUFrQixDQUFDLEdBQUcsQ0FBRyxDQUFBO2FBQ3BFO1NBQ0Y7S0FDRjtJQUFBLENBQUM7SUFFRjs7T0FFRzs7Ozs7SUFDRyw0QkFBTTs7OztJQUFaOzs7OzRCQUNFLHFCQUFNLE9BQU8sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksWUFBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFBOzt3QkFBbEUsU0FBa0UsQ0FBQTt3QkFFbEUsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7NEJBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUE7d0JBQ3hFLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXOzRCQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7Ozs7S0FDL0M7SUFFRDs7T0FFRzs7Ozs7SUFDSCxnQ0FBVTs7OztJQUFWO1FBQ0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7SUFBQSxDQUFDO0lBRUY7O09BRUc7Ozs7O0lBQ0cscUNBQWU7Ozs7SUFBckI7Ozs7Ozt3QkFDUSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzZCQUVuQixHQUFHLEVBQUgsd0JBQUc7d0JBQ1IscUJBQU0sT0FBTyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxpQkFBYyxFQUFFLEdBQUcsQ0FBQyxFQUFBOzt3QkFBN0QsS0FBQSxTQUE2RCxDQUFBOzs7d0JBQzdELEtBQUEsSUFBSSxDQUFBOzs0QkFGTiwwQkFFTzs7OztLQUNSO0lBQUEsQ0FBQztJQUVGOzs7Ozs7O09BT0c7Ozs7Ozs7Ozs7SUFDSCxvQ0FBYzs7Ozs7Ozs7O0lBQWQsVUFBZSxHQUFXOztRQUN4QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFDTCxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQztLQUNkO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7O0lBQ0gsaUNBQVc7Ozs7Ozs7OztJQUFYOztRQUNFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7OztRQUkxQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4Qkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQ0csNkJBQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBYjs7Ozs7NEJBS2UscUJBQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBekIsSUFBSSxHQUFHLFNBQWtCO3dCQUMvQixJQUFHLElBQUk7NEJBQUUsc0JBQU8sSUFBSSxFQUFBOzt3QkFHcEIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDOzs0QkFFM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxLQUFZLEVBQUUsSUFBcUI7Z0NBQ3pFLE9BQU8sSUFBSSxDQUFBOzZCQUNaLENBQUMsQ0FBQTt5QkFDSDs7d0JBRUQsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7NEJBQzVELHNCQUFPLElBQUksRUFBQTt5QkFDWjs7d0JBRUQsSUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7NEJBQzVELHNCQUFPLElBQUksRUFBQTt5QkFDWjs7d0JBRUQsSUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQzs0QkFDN0Qsc0JBQU8sSUFBSSxFQUFBLENBQUMsYUFBYTt5QkFDMUI7Ozs7O0tBQ0Y7SUFBQSxDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNHLDJCQUFLOzs7Ozs7O0lBQVg7Ozs7Ozs7d0JBQ1EsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs2QkFHdkIsQ0FBQyxHQUFHLEVBQUosd0JBQUk7d0JBQ1kscUJBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFBOzt3QkFBdkMsUUFBUSxHQUFHLFNBQTRCO3dCQUU3QyxzQkFBTyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0NBQy9CLElBQUksRUFBQzs7NkJBRVosQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUF4Qix3QkFBd0I7NkJBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQW5CLHdCQUFtQjt3QkFDbEIscUJBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRTtpQ0FDakIsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxJQUFJLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQS9CLENBQStCLENBQUMsRUFBQTs7d0JBRHZELEtBQUEsU0FDdUQsQ0FBQTs7O3dCQUN2RCxLQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7OzRCQUpKLGNBQWM7b0JBQzFDLDBCQUdpQzs0QkFFMUIsZUFBZTtvQkFDdEIsc0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNwQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUM7Ozs7S0FFcEM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7Ozs7Ozs7Ozs7OztJQUNHLHFDQUFlOzs7Ozs7Ozs7OztJQUFyQjs7OztnQkFDRSxzQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxPQUFPLENBQUMsQ0FBQzt3QkFDOUIsSUFBSSxDQUFDLENBQUM7d0JBQ04sS0FBSyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxnQkFBYSxDQUFDOzZCQUNwQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUE3QixDQUE2QixDQUFDLEVBQUE7OztLQUNqRTtJQUVELHVEQUF1RDtJQUV2RDs7Ozs7O09BTUc7Ozs7Ozs7O0lBQ0gsbUNBQWE7Ozs7Ozs7SUFBYjs7UUFDRSxJQUFNLFdBQVcsR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7O1FBQ2pELElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFBQSxDQUFDO0lBRUY7O09BRUc7Ozs7O0lBQ0gsK0JBQVM7Ozs7SUFBVDtRQUNDLE9BQU8sT0FBTyxNQUFNLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQTtLQUM5Qzs7Ozs7SUFLTyxxQ0FBZTs7Ozs7UUFDckIsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFuQixDQUFtQixDQUFDO2FBQzdCLE1BQU0sQ0FBQyxVQUFDLEdBQWMsRUFBRSxJQUFJO1lBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdEIsT0FBTyxHQUFHLENBQUE7U0FDWCxFQUFFLEVBQUUsQ0FBQyxDQUFBOzs7Ozs7OztJQVF0QixtQ0FBYTs7Ozs7O2NBQUMsR0FBVzs7UUFDL0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZDLElBQUc7WUFDRCxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLFNBQVMsQ0FBQztTQUNuQjtRQUFDLE9BQU8sQ0FBQyxFQUFDLEVBQUUsNkNBQTZDOztZQUN4RCxPQUFPLFNBQVMsQ0FBQztTQUNsQjs7SUFDRixDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNILDRDQUFzQjs7Ozs7OztJQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0tBQy9DO0lBQUEsQ0FBQztJQUVGOzs7Ozs7OztPQVFHOzs7Ozs7Ozs7O0lBQ0gsNEJBQU07Ozs7Ozs7OztJQUFOOztRQUNFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTs7UUFFakUsSUFBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNsRSxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFBQSxDQUFDO0lBRUY7Ozs7Ozs7T0FPRzs7Ozs7Ozs7O0lBQ0gsK0JBQVM7Ozs7Ozs7O0lBQVQsVUFBVSxHQUFXOztRQUNuQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BDLElBQUcsU0FBUyxFQUFDOztZQUNYLElBQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztZQUMxQyxPQUFPLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxJQUFJLENBQUE7S0FDWjtJQUFBLENBQUM7SUFFRjs7O09BR0c7Ozs7OztJQUNILG1DQUFhOzs7OztJQUFiLFVBQWMsR0FBVzs7UUFDdkIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNwQyxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDO0tBQ3hDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7SUFDSCw4QkFBUTs7Ozs7O0lBQVIsVUFBUyxLQUFhOztRQUNwQixJQUFJLE1BQU0sQ0FBQztRQUNYLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSTs7Z0JBQ0YsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBQ3BDLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ25DO1lBQUMsT0FBTSxDQUFDLEVBQUUsRUFBRSw2QkFBNkI7O2FBQUU7U0FDN0M7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQUEsQ0FBQztJQUVGOzs7Ozs7O09BT0c7Ozs7Ozs7Ozs7O0lBQ0gsaUNBQVc7Ozs7Ozs7Ozs7SUFBWCxVQUFZLEtBQWE7O1FBQ3ZCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O1FBQ2xDLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3BGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQSxDQUFDO3NCQW5nQko7SUFvZ0JDLENBQUE7Ozs7QUE5ZUQsdUJBOGVDOzs7Ozs7Ozs7O0FBR0QsV0FBYSxlQUFlLEdBQWU7SUFDekMsU0FBUyxFQUFFLE9BQU87SUFDbEIsWUFBWSxFQUFFLEVBQUU7O0lBQ2hCLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsZUFBZSxFQUFFLEtBQUs7Q0FDdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIHdpbmRvdzogYW55XG5cbmltcG9ydCB7IG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBKV1QsIFVzZXJQcm9maWxlLCBTdHJpbmdPYmogfSBmcm9tICcuLi9zcmMvYXV0aFR5cGVzJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi9HZW9QbGF0Zm9ybVVzZXInXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cblxuXG5jb25zdCBBQ0NFU1NfVE9LRU5fQ09PS0lFICA9ICdncG9hdXRoLWEnXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEpzb24odXJsOiBzdHJpbmcsIGp3dD86IHN0cmluZykge1xuICBjb25zdCByZXNwID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbicgOiBqd3QgPyBgQmVhcmVyICR7and0fWAgOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICByZXR1cm4gcmVzcC5kYXRhO1xufVxuXG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG4gIHByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrOiBib29sZWFuXG5cbiAgLyoqXG4gICAqXG4gICAqIEF1dGhTZXJ2aWNlXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBuZ01lc3Nlbmdlcil7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tZXNzZW5nZXIgPSBuZ01lc3NlbmdlclxuXG4gICAgLy8gU2V0dXAgZ2VuZXJhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCBhbHdheXMgcnVuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIHNlbGYuaW5pdCgpIC8vIHdpbGwgYnJvYWRjYXN0IHRvIGFuZ3VsYXIgKHNpZGUtZWZmZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgbG9nb3V0IGV2ZW50XG4gICAgICBpZihldmVudC5kYXRhID09PSAndXNlclNpZ25PdXQnKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgbnVsbClcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlclNpZ25PdXRcIilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2VsZi5pbml0KClcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgbmdNZXNzZW5nZXIgc28gdGhhdCBhcHBsaWN0aW9uIGNvZGUgaXMgYWJsZSB0b1xuICAgKiBzdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBzZW50IGJ5IG5nLWdwb2F1dGhcbiAgICovXG4gIGdldE1lc3NlbmdlcigpOiBuZ01lc3NlbmdlciB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2VuZ2VyXG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYW5kIGRlY29kZSB2YWx1ZSBmcm9tIGxvY2Fsc3RvcmFnZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRGcm9tTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IocmF3KSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlKXsgLy8gQ2F0Y2ggYmFkIGVuY29kaW5nIG9yIGZvcm1hbGx5IG5vdCBlbmNvZGVkXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogV2Uga2VlcCB0aGlzIG91dHNpZGUgdGhlIGNvbnN0cnVjdG9yIHNvIHRoYXQgb3RoZXIgc2VydmljZXMgY2FsbFxuICAgKiBjYWxsIGl0IHRvIHRyaWdnZXIgdGhlIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGluaXQoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIC8vIERlbGF5IGluaXQgdW50aWwgUlBNU2VydmljZSBpcyBsb2FkZWRcbiAgICBpZih0aGlzLlJQTUxvYWRlZCgpICYmIHRoaXMuY29uZmlnLmxvYWRSUE0pe1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vZG8gc3R1ZmYgd2l0aCB0aGUgc2NyaXB0XG4gICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICB9O1xuICAgICAgc2NyaXB0LnNyYyA9IGBodHRwczovL3MzLmFtYXpvbmF3cy5jb20vZ2VvcGxhdGZvcm0tY2RuL2dwLnJwbS8ke3RoaXMuY29uZmlnLlJQTVZlcnNpb24gfHwgJ3N0YWJsZSd9L2pzL2dwLnJwbS5icm93c2VyLmpzYDtcblxuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgcmV0dXJuIC8vIHNraXAgaW5pdCgpIHRpbGwgUlBNIGlzIGxvYWRlZFxuICAgIH1cblxuXG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIC8vY2xlYW4gaG9zdHVybCBvbiByZWRpcmVjdCBmcm9tIG9hdXRoXG4gICAgaWYgKHRoaXMuZ2V0SldURnJvbVVybCgpKSB7XG4gICAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJykgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKlxcJnRva2VuX3R5cGU9QmVhcmVyLywgJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0dXAgYWN0aXZlIHNlc3Npb24gY2hlY2hlclxuICAgIHRoaXMucHJldmVpb3VzVG9rZW5QcmVzZW50Q2hlY2sgPSAhIWp3dFxuICAgIHNldEludGVydmFsKCgpID0+IHsgc2VsZi5jaGVja0ZvckxvY2FsVG9rZW4oKSB9LCB0aGlzLmNvbmZpZy50b2tlbkNoZWNrSW50ZXJ2YWwpXG5cbiAgICBjb25zdCB1c2VyID0gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpXG4gICAgaWYodXNlcilcbiAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIHVzZXIpXG5cbiAgICByZXR1cm4gdXNlclxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgdGhlIHByZXNlbmNlIG9mIHRva2VuIGluIGNvb2tpZS4gSWYgdGhlcmUgaGFzIGJlZW4gYVxuICAgKiBjaGFuZ2UgKGNvb2tpZSBhcHBlYXJzIG9yIGRpc2FwZWFycykgdGhlIGZpcmUgZXZlbnQgaGFuZGxlcnMgdG9cbiAgICogbm90aWZ5IHRoZSBhcHBsaWN0aW9uIG9mIHRoZSBldmVudC5cbiAgICovXG4gIHByaXZhdGUgY2hlY2tGb3JMb2NhbFRva2VuKCl7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKVxuICAgIGNvbnN0IHRva2VuUHJlc2VudCA9ICEhand0XG4gICAgLy8gY29tcGFyZSB3aXRoIHByZXZpb3VzIGNoZWNrXG4gICAgaWYgKHRva2VuUHJlc2VudCAhPT0gdGhpcy5wcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjaylcbiAgICAgIHRva2VuUHJlc2VudCA/XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSkgOlxuICAgICAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyU2lnbk91dFwiKTtcblxuICAgIC8vIHVwZGF0ZSBwcmV2aW91cyBzdGF0ZSBmb3IgbmV4dCBjaGVja1xuICAgIHRoaXMucHJldmVpb3VzVG9rZW5QcmVzZW50Q2hlY2sgPSB0b2tlblByZXNlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGFjY2Vzc190b2tlbiBwcm9wZXJ0eSBmcm9tIHRoZSBVUkwuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZVRva2VuRnJvbVVybCgpOiB2b2lkIHtcbiAgICBjb25zdCByZXBsYWNlUmVnZXggPSAvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LiooXFwmdG9rZW5fdHlwZT1CZWFyZXIpPy9cbiAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCB7fSAsICdSZW1vdmUgdG9rZW4gZnJvbSBVUkwnLCB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKHJlcGxhY2VSZWdleCwgJycpIClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKHJlcGxhY2VSZWdleCwgJycpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZpc2FibGUgaWZyYW1lIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY3JlYXRlSWZyYW1lXG4gICAqIEByZXR1cm5zIEhUTUxJRnJhbWVFbGVtZW50XG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZUlmcmFtZSh1cmw6IHN0cmluZyk6IEhUTUxJRnJhbWVFbGVtZW50IHtcbiAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJylcblxuICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgaWZyYW1lLnNyYyA9IHVybFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICAgIHJldHVybiBpZnJhbWVcbiAgfTtcblxuICAvKipcbiAgICogUmVkaXJlY3RzIG9yIGRpc3BsYXlzIGxvZ2luIHdpbmRvdyB0aGUgcGFnZSB0byB0aGUgbG9naW4gc2l0ZVxuICAgKi9cbiAgbG9naW4ocGF0aD86IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIENoZWNrIGltcGxpY2l0IHdlIG5lZWQgdG8gYWN0dWFsbHkgcmVkaXJlY3QgdGhlbVxuICAgIGNvbnN0IGxvYyA9IHBhdGggP1xuICAgICAgICAgICAgICAgIGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59JHtwYXRofWAgOlxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLkNBTExCQUNLID9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuQ0FMTEJBQ0sgOlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiAvLyBkZWZhdWx0XG5cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQobG9jIHx8ICcvbG9naW4nKX1gXG5cbiAgICAvLyBPdGhlcndpc2UgcG9wIHVwIHRoZSBsb2dpbiBtb2RhbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZnJhbWUgbG9naW5cbiAgICAgIGlmKHRoaXMuY29uZmlnLkFMTE9XX0lGUkFNRV9MT0dJTil7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgnYXV0aDpyZXF1aXJlTG9naW4nKVxuXG4gICAgICAvLyBSZWRpcmVjdCBsb2dpblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dJTl9VUkxcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IGAvbG9naW4/cmVkaXJlY3RfdXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KGxvYyl9YFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYmFja2dyb3VuZCBsb2dvdXQgYW5kIHJlcXVlc3RzIGp3dCByZXZva2F0aW9uXG4gICAqL1xuICBhc3luYyBsb2dvdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZWAsIHRoaXMuZ2V0SldUKCkpXG5cbiAgICBpZih0aGlzLmNvbmZpZy5MT0dPVVRfVVJMKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR09VVF9VUkxcbiAgICBpZih0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTikgdGhpcy5mb3JjZUxvZ2luKCk7XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9uYWwgZm9yY2UgcmVkaXJlY3QgZm9yIG5vbi1wdWJsaWMgc2VydmljZXNcbiAgICovXG4gIGZvcmNlTG9naW4oKSB7XG4gICAgdGhpcy5sb2dpbigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvdGVjdGVkIHVzZXIgcHJvZmlsZVxuICAgKi9cbiAgYXN5bmMgZ2V0T2F1dGhQcm9maWxlKCk6IFByb21pc2U8VXNlclByb2ZpbGU+IHtcbiAgICBjb25zdCBKV1QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgcmV0dXJuIEpXVCA/XG4gICAgICBhd2FpdCBnZXRKc29uKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXBpL3Byb2ZpbGVgLCBKV1QpIDpcbiAgICAgIG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBVc2VyIG9iamVjdCBmcm9tIHRoZSBKV1QuXG4gICAqXG4gICAqIElmIG5vIEpXVCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGxvb2tlZCBmb3IgYXQgdGhlIG5vcm1hbCBKV1RcbiAgICogbG9jYXRpb25zIChsb2NhbFN0b3JhZ2Ugb3IgVVJMIHF1ZXJ5U3RyaW5nKS5cbiAgICpcbiAgICogQHBhcmFtIFtqd3RdIC0gdGhlIEpXVCB0byBleHRyYWN0IHVzZXIgZnJvbS5cbiAgICovXG4gIGdldFVzZXJGcm9tSldUKGp3dDogc3RyaW5nKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHVzZXIgP1xuICAgICAgICAgICAgbmV3IEdlb1BsYXRmb3JtVXNlcihPYmplY3QuYXNzaWduKHt9LCB1c2VyLCB7IGlkOiB1c2VyLnN1YiB9KSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyIGlzIHNwZWNpZmllZCwgdGhpcyBtZXRob2RcbiAgICogd2lsbCByZXR1cm4gdW5kZWZpbmVkLiBPdGhlcndpc2UsIGl0IHJldHVybnMgdGhlIHVzZXIgKG9yIG51bGwpLlxuICAgKlxuICAgKiBTaWRlIEVmZmVjdHM6XG4gICAqICAtIFdpbGwgcmVkaXJlY3QgdXNlcnMgaWYgbm8gdmFsaWQgSldUIHdhcyBmb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgb3B0aW9uYWwgZnVuY3Rpb24gdG8gaW52b2tlIHdpdGggdGhlIHVzZXJcbiAgICogQHJldHVybiBvYmplY3QgcmVwcmVzZW50aW5nIGN1cnJlbnQgdXNlclxuICAgKi9cbiAgZ2V0VXNlclN5bmMoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCByZWNpZXZlIGEgbmV3IHRva2VuIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgIC8vIG1ha2luZyBhIGNhbGwgdG8gdGhlIGNsaWVudChhcHBsaWNhdGlvbilcbiAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dfSUZSQU1FX0xPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dfSUZSQU1FX0xPR0lOKVxuICAgKlxuICAgKiBDYXNlczpcbiAgICogMS4gRGVsYXkgcmVzb2x2ZSBmdW5jdGlvbiB0aWxsIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAqIDIuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKiAzLiBGb3JjZSB0aGUgcmVkaXJlY3RcbiAgICogNC4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqXG4gICAqIE5PVEU6XG4gICAqIENhc2UgMSBhYm92ZSB3aWxsIGNhdXNlIHRoaXMgbWV0aG9kJ3MgcHJvbWlzZSB0byBiZSBhIGxvbmcgc3RhbGxcbiAgICogdW50aWwgdGhlIHVzZXIgY29tcGxldGVzIHRoZSBsb2dpbiBwcm9jZXNzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGVcbiAgICogYXBwIHRvIGZvcmdvIGEgcmVsb2FkIGlzIGl0IHNob3VsZCBoYXZlIHdhaXRlZCB0aWxsIHRoZSBlbnRpcmVcbiAgICogdGltZSB0aWxsIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldFVzZXJcbiAgICpcbiAgICogQHJldHVybnMgVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgcmVzb2x2ZWQgdmlhIFByb21pc2VcbiAgICovXG4gIGFzeW5jIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+IHtcbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgLy8gcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLmNoZWNrKCk7XG4gICAgaWYodXNlcikgcmV0dXJuIHVzZXJcblxuICAgIC8vIENhc2UgMSAtIEFMTE9XX0lGUkFNRV9MT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIC8vIFJlc29sdmUgd2l0aCB1c2VyIG9uY2UgdGhleSBoYXZlIGxvZ2dlZCBpblxuICAgICAgdGhpcy5tZXNzZW5nZXIub24oJ3VzZXJBdXRoZW50aWNhdGVkJywgKGV2ZW50OiBFdmVudCwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBDYXNlIDIgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgMyAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgLy8gQ2FzZSA0IC0gQUxMT1dfSUZSQU1FX0xPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiBmYWxzZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsIC8vIG9yIHJlamVjdD9cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGZ1bmN0aW9uIGJlaW5nIHVzZWQgYnkgc29tZSBmcm9udCBlbmQgYXBwcyBhbHJlYWR5LlxuICAgKiAod3JhcHBlciBmb3IgZ2V0VXNlcilcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJucyBVc2VyIG9yIG51bGxcbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgaWYoIWp3dCkge1xuICAgICAgY29uc3QgZnJlc2hKd3QgPSBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudCgpO1xuXG4gICAgICByZXR1cm4gand0ICYmIGp3dC5sZW5ndGggP1xuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGZyZXNoSnd0KSA6XG4gICAgICAgICAgICAgIG51bGw7XG4gICAgfVxuICAgIGlmKCF0aGlzLmlzSW1wbGljaXRKV1Qoand0KSl7IC8vIEdyYW50IHRva2VuXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2hlY2tXaXRoQ2xpZW50KCkgLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiBqd3QgJiYgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcblxuICAgIH0gZWxzZSB7IC8vIEltcGxpY2l0IEpXVFxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdChudWxsKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjYWxsIHRvIGEgc2VydmljZSBob3N0aW5nIG5vZGUtZ3BvYXV0aCB0byBhbGxvdyBmb3IgYVxuICAgKiB0b2tlbiByZWZyZXNoIG9uIGFuIGV4cGlyZWQgdG9rZW4sIG9yIGEgdG9rZW4gdGhhdCBoYXMgYmVlblxuICAgKiBpbnZhbGlkYXRlZCB0byBiZSByZXZva2VkLlxuICAgKlxuICAgKiBOb3RlOiBDbGllbnQgYXMgaW4gaG9zdGluZyBhcHBsaWNhdGlvbjpcbiAgICogICAgaHR0cHM6Ly93d3cuZGlnaXRhbG9jZWFuLmNvbS9jb21tdW5pdHkvdHV0b3JpYWxzL2FuLWludHJvZHVjdGlvbi10by1vYXV0aC0yXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tXaXRoQ2xpZW50XG4gICAqIEBwYXJhbSBqd3QgLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2U8and0PlxuICAgKi9cbiAgYXN5bmMgY2hlY2tXaXRoQ2xpZW50KCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyA/XG4gICAgICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICAgICAgYXhpb3MoYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9jaGVja3Rva2VuYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5nZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCkpXG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIFJQTSBsaWJyYXJ5IGxvYWRlZCBhbHJlYWR5P1xuICAgKi9cbiAgUlBNTG9hZGVkKCk6ICBib29sZWFuIHtcbiAgIHJldHVybiB0eXBlb2Ygd2luZG93LlJQTVNlcnZpY2UgIT0gJ3VuZGVmaW5lZCdcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXNzb2NpYXRlZCBhcnJheSBvZiBjb29raWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDb29raWVPYmplY3QoKTogU3RyaW5nT2JqICB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRyaW0oKS5zcGxpdCgnPScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2M6IFN0cmluZ09iaiwgcGFpcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY1twYWlyWzBdXSA9IHBhaXJbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYW5kIGRlY29kZSBmcm9tIGNvb2tpZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBwcml2YXRlIGdldEZyb21Db29raWUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCByYXcgPSB0aGlzLmdldENvb2tpZU9iamVjdCgpW2tleV1cbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihkZWNvZGVVUklDb21wb25lbnQocmF3KSkgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUNvb2tpZShBQ0NFU1NfVE9LRU5fQ09PS0lFKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW5cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZVxufVxuIl19