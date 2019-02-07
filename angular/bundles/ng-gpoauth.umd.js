(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('rxjs'), require('@angular/core'), require('@angular/common/http')) :
    typeof define === 'function' && define.amd ? define('ng-gpoauth', ['exports', 'axios', 'rxjs', '@angular/core', '@angular/common/http'], factory) :
    (factory((global['ng-gpoauth'] = {}),global.axios,global.rxjs,global.ng.core,global.ng.common.http));
}(this, (function (exports,axios,rxjs,core,http) { 'use strict';

    axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

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
        return axios.get(url, {
            headers: { 'Authorization': jwt ? "Bearer " + jwt : '' },
            responseType: 'json'
        })
            .then(function (r) { return r.data; });
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
            /** @type {?} */
            var user = self.init();
            if (!user && this.config.AUTH_TYPE === 'grant')
                self.ssoCheck();
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
                var ssoURL = "/login?sso=true&cachebuster=" + (new Date()).getTime();
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
                /** @type {?} */
                var jwt = this.getJWT();
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
                    if (this.config.ALLOWIFRAMELOGIN) {
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
                var _this = this;
                /** @type {?} */
                var self = this;
                // Create iframe to manually call the logout and remove gpoauth cookie
                // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
                // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
                // Save JWT to send with final request to revoke it
                self.removeAuth(); // purge the JWT
                return getJson(this.config.APP_BASE_URL + "/revoke?sso=true", this.getJWT())
                    .then(function () {
                    if (_this.config.LOGOUT_URL)
                        window.location.href = _this.config.LOGOUT_URL;
                    if (_this.config.FORCE_LOGIN)
                        self.forceLogin();
                })
                    .catch(function (err) { return console.log('Error logging out: ', err); });
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
                var _this = this;
                /** @type {?} */
                var JWT = this.getJWT();
                return new Promise(function (resolve, reject) {
                    //check to make sure we can make called
                    if (JWT) {
                        getJson(_this.config.IDP_BASE_URL + "/api/profile", JWT)
                            .then(function (response) { return resolve(response); })
                            .catch(function (err) { return reject(err); });
                    }
                    else {
                        reject(null);
                    }
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
                // If callback provided we can treat async and call server
                if (callback && typeof (callback) === 'function') {
                    this.check()
                        .then(function (user) { return callback(user); });
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
            };
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
        AuthService.prototype.getUser = /**
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
            function () {
                var _this = this;
                /** @type {?} */
                var self = this;
                // For basic testing
                // this.messenger.broadcast('userAuthenticated', { name: 'username'})
                return new Promise(function (resolve, reject) {
                    _this.check()
                        .then(function (user) {
                        if (user) {
                            resolve(user);
                        }
                        else {
                            // Case 1 - ALLOWIFRAMELOGIN: true | FORCE_LOGIN: true
                            if (_this.config.ALLOWIFRAMELOGIN && _this.config.FORCE_LOGIN) {
                                // Resolve with user once they have logged in
                                // Resolve with user once they have logged in
                                _this.messenger.on('userAuthenticated', function (event, user) {
                                    resolve(user);
                                });
                            }
                            // Case 2 - ALLOWIFRAMELOGIN: true | FORCE_LOGIN: false
                            if (_this.config.ALLOWIFRAMELOGIN && !_this.config.FORCE_LOGIN) {
                                resolve(null);
                            }
                            // Case 3 - ALLOWIFRAMELOGIN: false | FORCE_LOGIN: true
                            if (!_this.config.ALLOWIFRAMELOGIN && _this.config.FORCE_LOGIN) {
                                addEventListener('message', function (event) {
                                    // Handle SSO login failure
                                    if (event.data === 'iframe:ssoFailed') {
                                        resolve(self.getUser());
                                    }
                                });
                                resolve(null);
                            }
                            // Case 4 - ALLOWIFRAMELOGIN: false | FORCE_LOGIN: false
                            if (!_this.config.ALLOWIFRAMELOGIN && !_this.config.FORCE_LOGIN) {
                                resolve(null); // or reject?
                            }
                        }
                    })
                        .catch(function (err) { return console.log(err); });
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
                var _this = this;
                return new Promise(function (resolve, rej) {
                    /** @type {?} */
                    var jwt = _this.getJWT();
                    // If no local JWT
                    if (!jwt)
                        return _this.checkWithClient("")
                            .then(function (jwt) { return jwt.length ? _this.getUserFromJWT(jwt) : null; });
                    if (!jwt)
                        return resolve(null);
                    if (!_this.isImplicitJWT(jwt)) { // Grant token
                        // Grant token
                        return _this.isExpired(jwt) ?
                            _this.checkWithClient(jwt)
                                .then(function (jwt) { return _this.getUserFromJWT(jwt); }) : // Check with server
                            resolve(_this.getUserFromJWT(jwt));
                    }
                    else { // Implicit JWT
                        // Implicit JWT
                        return _this.isExpired(jwt) ?
                            Promise.reject(null) :
                            resolve(_this.getUserFromJWT(jwt));
                    }
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
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (_this.config.AUTH_TYPE === 'token') {
                        resolve(null);
                    }
                    else {
                        axios(_this.config.APP_BASE_URL + "/checktoken", {
                            headers: {
                                'Authorization': originalJWT ? "Bearer " + originalJWT : '',
                                'Access-Control-Expose-Headers': 'Authorization, WWW-Authorization, content-length'
                            }
                        })
                            .then(function (resp) {
                            /** @type {?} */
                            var header = resp.headers['authorization'];
                            /** @type {?} */
                            var newJWT = header && header.replace('Bearer ', '');
                            if (newJWT)
                                _this.setAuth(newJWT);
                            resolve(newJWT ? newJWT : originalJWT);
                        })
                            .catch(function (err) { return reject(err); });
                    }
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
        ALLOWIFRAMELOGIN: false,
        FORCE_LOGIN: false,
        ALLOW_DEV_EDITS: false,
        APP_BASE_URL: '' // absolute path // use . for relative path
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
                var updatedRequest;
                /** @type {?} */
                var jwt = this.authService.getJWT();
                if (!jwt) {
                    // Carry on... nothing to do here
                    updatedRequest = request;
                }
                else {
                    /** @type {?} */
                    var clone = request.clone({
                        setHeaders: {
                            Authorization: "Bearer " + jwt
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
                    .handle(updatedRequest)
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
        return new AuthService(config || DefaultAuthConf, new msgProvider());
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