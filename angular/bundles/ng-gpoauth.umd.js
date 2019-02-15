(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('rxjs'), require('@angular/core'), require('@angular/common/http')) :
    typeof define === 'function' && define.amd ? define('ng-gpoauth', ['exports', 'axios', 'rxjs', '@angular/core', '@angular/common/http'], factory) :
    (factory((global['ng-gpoauth'] = {}),global.axios,global.rxjs,global.ng.core,global.ng.common.http));
}(this, (function (exports,axios,rxjs,core,http) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Convience class representing a simplified user.
     *
     */
    var /**
     * Convience class representing a simplified user.
     *
     */ GeoPlatformUser = /** @class */ (function () {
        function GeoPlatformUser(opts) {
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
        GeoPlatformUser.prototype.toJSON = /**
         * @return {?}
         */
            function () {
                return JSON.parse(JSON.stringify(Object.assign({}, this)));
            };
        /**
         * @return {?}
         */
        GeoPlatformUser.prototype.clone = /**
         * @return {?}
         */
            function () {
                return Object.assign({}, this);
            };
        /**
         * @param {?} arg
         * @return {?}
         */
        GeoPlatformUser.prototype.compare = /**
         * @param {?} arg
         * @return {?}
         */
            function (arg) {
                if (arg instanceof GeoPlatformUser) {
                    return this.id === arg.id;
                }
                else if (typeof (arg) === 'object') {
                    return typeof (arg.id) !== 'undefined' &&
                        arg.id === this.id;
                }
                return false;
            };
        /**
         * @param {?} role
         * @return {?}
         */
        GeoPlatformUser.prototype.isAuthorized = /**
         * @param {?} role
         * @return {?}
         */
            function (role) {
                return this.groups &&
                    !!this.groups
                        .map(function (g) { return g.name; })
                        .filter(function (n) { return n === role; })
                        .length;
            };
        return GeoPlatformUser;
    }());

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
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
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
     */ AuthService = /** @class */ (function () {
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
                return __awaiter(this, void 0, void 0, function () {
                    var jwt;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jwt = this.getJWT();
                                //clean hosturl on redirect from oauth
                                if (this.getJWTFromUrl())
                                    this.removeTokenFromUrl();
                                if (!jwt)
                                    return [3 /*break*/, 1];
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
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, 'Remove token from URL', window.location.href.replace(/[\?\&]access_token=.*\&token_type=Bearer/, ''));
                }
                else {
                    window.location.search.replace(/[\?\&]access_token=.*\&token_type=Bearer/, '');
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
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var JWT, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                JWT = this.getJWT();
                                if (!JWT)
                                    return [3 /*break*/, 2];
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
                return __awaiter(this, void 0, void 0, function () {
                    var user;
                    var _this = this;
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var jwt, freshJwt, _a;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                jwt = this.getJWT();
                                if (!!jwt)
                                    return [3 /*break*/, 2];
                                return [4 /*yield*/, this.checkWithClient("")];
                            case 1:
                                freshJwt = _b.sent();
                                return [2 /*return*/, jwt && jwt.length ?
                                        this.getUserFromJWT(freshJwt) :
                                        null];
                            case 2:
                                if (!!this.isImplicitJWT(jwt))
                                    return [3 /*break*/, 6];
                                if (!this.isExpired(jwt))
                                    return [3 /*break*/, 4];
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
                return __awaiter(this, void 0, void 0, function () {
                    var resp, header, newJWT;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this.config.AUTH_TYPE === 'token'))
                                    return [3 /*break*/, 1];
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
        return AuthService;
    }());
    /** @type {?} */
    var DefaultAuthConf = {
        AUTH_TYPE: 'grant',
        APP_BASE_URL: '',
        // absolute path // use . for relative path
        ALLOW_IFRAME_LOGIN: true,
        FORCE_LOGIN: false,
        ALLOW_DEV_EDITS: false,
        ALLOW_SSO_LOGIN: true
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TokenInterceptor = /** @class */ (function () {
        function TokenInterceptor(authService) {
            this.authService = authService;
        }
        /**
         * @param {?} request
         * @param {?} next
         * @return {?}
         */
        TokenInterceptor.prototype.intercept = /**
         * @param {?} request
         * @param {?} next
         * @return {?}
         */
            function (request, next) {
                /** @type {?} */
                var jwt = this.authService.getJWT();
                if (jwt) {
                    // Send our current token
                    request = request.clone({
                        setHeaders: {
                            Authorization: "Bearer " + jwt
                        }
                    });
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
                    if (event instanceof http.HttpResponse) {
                        /** @type {?} */
                        var urlJwt = this.authService.getJWTFromUrl();
                        /** @type {?} */
                        var headerJwt = event.headers.get('Authorization')
                            .replace('Bearer', '')
                            .trim();
                        /** @type {?} */
                        var newJwt = urlJwt || headerJwt;
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
                    if (err instanceof http.HttpErrorResponse) {
                        if (err.status === 401) ;
                    }
                }
                // ==============================================//
                // setup and return with handlers
                return next
                    .handle(request)
                    .do(responseHandler, responseFailureHandler);
            };
        TokenInterceptor.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TokenInterceptor.ctorParameters = function () {
            return [
                { type: AuthService }
            ];
        };
        return TokenInterceptor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var msgProvider = /** @class */ (function () {
        function msgProvider() {
            this.sub = new rxjs.Subject();
        }
        /**
         * @return {?}
         */
        msgProvider.prototype.raw = /**
         * @return {?}
         */
            function () {
                return this.sub;
            };
        /**
         * @param {?} name
         * @param {?} user
         * @return {?}
         */
        msgProvider.prototype.broadcast = /**
         * @param {?} name
         * @param {?} user
         * @return {?}
         */
            function (name, user) {
                this.sub.next({ name: name, user: user });
            };
        /**
         * @param {?} name
         * @param {?} func
         * @return {?}
         */
        msgProvider.prototype.on = /**
         * @param {?} name
         * @param {?} func
         * @return {?}
         */
            function (name, func) {
                this.sub
                    .filter(function (msg) { return msg.name === name; })
                    .subscribe(function (msg) { return func(new Event(msg.name), msg.user); });
            };
        return msgProvider;
    }());

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

    exports.ngGpoauthFactory = ngGpoauthFactory$1;
    exports.AuthService = AuthService;
    exports.GeoPlatformUser = GeoPlatformUser;
    exports.TokenInterceptor = TokenInterceptor;
    exports.ɵd = msgProvider;
    exports.ɵa = DefaultAuthConf;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ng-gpoauth.umd.js.map