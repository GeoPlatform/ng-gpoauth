/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
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
        var _this = this;
        /** @type {?} */
        var self = this;
        // Create iframe to manually call the logout and remove gpoauth cookie
        // https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout#answer-33786899
        // this.createIframe(`${this.config.IDP_BASE_URL}/auth/logout`)
        // Save JWT to send with final request to revoke it
        self.removeAuth(); // purge the JWT
        return new Promise(function (resolve, reject) {
            getJson(_this.config.APP_BASE_URL + "/revoke?sso=true", _this.getJWT())
                .then(function () {
                if (_this.config.LOGOUT_URL)
                    window.location.href = _this.config.LOGOUT_URL;
                if (_this.config.FORCE_LOGIN)
                    self.forceLogin();
                resolve();
            })
                .catch(function (err) {
                console.log('Error logging out: ', err);
                reject(err);
            });
        });
    };
    ;
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
    ALLOWIFRAMELOGIN: false,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    APP_BASE_URL: '' // absolute path // use . for relative path
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOzs7Ozs7QUFFekIsaUJBQWlCLEdBQVcsRUFBRSxHQUFZO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFDRSxPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFVLEdBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3pELFlBQVksRUFBRSxNQUFNO0tBQ3JCLENBQUM7U0FDRCxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO0NBQzFDOzs7O0FBS0Q7OztBQUFBO0lBS0U7Ozs7Ozs7T0FPRztJQUNILHFCQUFZLE1BQWtCLEVBQUUsV0FBd0I7O1FBQ3RELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQTs7UUFHNUIsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBVTs7WUFFckMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLDBCQUEwQixFQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDWjs7WUFHRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO2dCQUM5QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7YUFDbEI7U0FDRixDQUFDLENBQUE7O1FBRUYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ3hCLElBQUcsQ0FBQyxJQUFJLElBQUks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SUFBWCxVQUFZLEtBQWE7O1FBQ3ZCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O1FBQ2xDLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3BGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQSxDQUFDOzs7Ozs7OztJQVFLLDZCQUFPOzs7Ozs7O2NBQUMsR0FBVztRQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTs7SUFDeEUsQ0FBQzs7Ozs7SUFLTSxnQ0FBVTs7Ozs7UUFDaEIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTs7UUFFckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7O0lBQ3hDLENBQUM7c0JBM2hCSjtJQTRoQkMsQ0FBQTs7OztBQTdnQkQsdUJBNmdCQzs7Ozs7Ozs7QUFHRCxXQUFhLGVBQWUsR0FBZTtJQUN6QyxTQUFTLEVBQUUsT0FBTztJQUNsQixnQkFBZ0IsRUFBRSxLQUFLO0lBQ3ZCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLFlBQVksRUFBRSxFQUFFO0NBQ2pCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSB9IGZyb20gJy4uL3NyYy9hdXRoVHlwZXMnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlcidcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblxuZnVuY3Rpb24gZ2V0SnNvbih1cmw6IHN0cmluZywgand0Pzogc3RyaW5nKSB7XG4gIHJldHVybiBheGlvcy5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyID0+IHIuZGF0YSk7XG59XG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG5cbiAgLyoqXG4gICAqXG4gICAqIEBjbGFzcyBBdXRoU2VydmljZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtBdXRoQ29uZmlnfSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBuZ01lc3Nlbmdlcil7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tZXNzZW5nZXIgPSBuZ01lc3NlbmdlclxuXG4gICAgLy8gU2V0dXAgZ2VuZXJhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCBhbHdheXMgcnVuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIHNlbGYuaW5pdCgpIC8vIHdpbGwgYnJvYWRjYXN0IHRvIGFuZ3VsYXIgKHNpZGUtZWZmZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgbG9nb3V0IGV2ZW50XG4gICAgICBpZihldmVudC5kYXRhID09PSAndXNlclNpZ25PdXQnKXtcbiAgICAgICAgc2VsZi5yZW1vdmVBdXRoKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgdXNlciA9IHNlbGYuaW5pdCgpXG4gICAgaWYoIXVzZXIgJiYgdGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAnZ3JhbnQnKSBzZWxmLnNzb0NoZWNrKClcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgbmdNZXNzZW5nZXIgc28gdGhhdCBhcHBsaWN0aW9uIGNvZGUgaXMgYWJsZSB0b1xuICAgKiBzdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBzZW50IGJ5IG5nLWdwb2F1dGhcbiAgICovXG4gIGdldE1lc3NlbmdlcigpOiBuZ01lc3NlbmdlciB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2VuZ2VyXG4gIH1cblxuICAvKipcbiAgICogU2VjdXJpdHkgd3JhcHBlciBmb3Igb2JmdXNjYXRpbmcgdmFsdWVzIHBhc3NlZCBpbnRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgc2F2ZVRvTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBidG9hKHZhbHVlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuZCBkZWNvZGUgdmFsdWUgZnJvbSBsb2NhbHN0b3JhZ2VcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgZ2V0RnJvbUxvY2FsU3RvcmFnZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgIHRyeXtcbiAgICAgIHJldHVybiByYXcgP1xuICAgICAgICAgICAgICBhdG9iKHJhdykgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBzc29DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzc29VUkwgPSBgL2xvZ2luP3Nzbz10cnVlJmNhY2hlYnVzdGVyPSR7KG5ldyBEYXRlKCkpLmdldFRpbWUoKX1gXG4gICAgY29uc3Qgc3NvSWZyYW1lID0gdGhpcy5jcmVhdGVJZnJhbWUoc3NvVVJMKVxuXG4gICAgLy8gU2V0dXAgc3NvSWZyYW1lIHNwZWNpZmljIGhhbmRsZXJzXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgICAvLyBGb3JjZSBsb2dpbiBvbmx5IGFmdGVyIFNTTyBoYXMgZmFpbGVkXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSBzZWxmLmZvcmNlTG9naW4oKVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV2Uga2VlcCB0aGlzIG91dHNpZGUgdGhlIGNvbnN0cnVjdG9yIHNvIHRoYXQgb3RoZXIgc2VydmljZXMgY2FsbFxuICAgKiBjYWxsIGl0IHRvIHRyaWdnZXIgdGhlIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBwcml2YXRlIGluaXQoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIGlmKGp3dCkgdGhpcy5zZXRBdXRoKGp3dClcblxuICAgIC8vY2xlYW4gaG9zdHVybCBvbiByZWRpcmVjdCBmcm9tIG9hdXRoXG4gICAgaWYgKHRoaXMuZ2V0SldURnJvbVVybCgpKSB7XG4gICAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJykgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKlxcJnRva2VuX3R5cGU9QmVhcmVyLywgJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZpc2FibGUgaWZyYW1lIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY3JlYXRlSWZyYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MSUZyYW1lRWxlbWVudH1cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbigpIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jb25maWcuQ0FMTEJBQ0sgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTil7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgnYXV0aDpyZXF1aXJlTG9naW4nKVxuXG4gICAgICAgIC8vIFJlZGlyZWN0IGxvZ2luXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR0lOX1VSTFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgYC9sb2dpbj9yZWRpcmVjdF91cmw9JHtlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhyZWYpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgbG9nb3V0KCk6IFByb21pc2U8dm9pZD57XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB0byBtYW51YWxseSBjYWxsIHRoZSBsb2dvdXQgYW5kIHJlbW92ZSBncG9hdXRoIGNvb2tpZVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNzU4MjA3L3doeS1pcy1wYXNzcG9ydGpzLWluLW5vZGUtbm90LXJlbW92aW5nLXNlc3Npb24tb24tbG9nb3V0I2Fuc3dlci0zMzc4Njg5OVxuICAgIC8vIHRoaXMuY3JlYXRlSWZyYW1lKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXV0aC9sb2dvdXRgKVxuXG4gICAgLy8gU2F2ZSBKV1QgdG8gc2VuZCB3aXRoIGZpbmFsIHJlcXVlc3QgdG8gcmV2b2tlIGl0XG4gICAgc2VsZi5yZW1vdmVBdXRoKCkgLy8gcHVyZ2UgdGhlIEpXVFxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb25maWcuTE9HT1VUX1VSTCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dPVVRfVVJMXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvZ2dpbmcgb3V0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9KTtcbiAgICB9KVxuXG4gIH07XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIGZvcmNlIHJlZGlyZWN0IGZvciBub24tcHVibGljIHNlcnZpY2VzXG4gICAqL1xuICBmb3JjZUxvZ2luKCkge1xuICAgIHRoaXMubG9naW4oKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb3RlY3RlZCB1c2VyIHByb2ZpbGVcbiAgICovXG4gIGdldE9hdXRoUHJvZmlsZSgpOiBQcm9taXNlPFVzZXJQcm9maWxlPiB7XG4gICAgY29uc3QgSldUID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxVc2VyUHJvZmlsZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy9jaGVjayB0byBtYWtlIHN1cmUgd2UgY2FuIG1ha2UgY2FsbGVkXG4gICAgICBpZiAoSldUKSB7XG4gICAgICAgIGdldEpzb24oYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hcGkvcHJvZmlsZWAsIEpXVClcbiAgICAgICAgICAudGhlbigocmVzcG9uc2U6IFVzZXJQcm9maWxlKSA9PiAgcmVzb2x2ZShyZXNwb25zZSkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChudWxsKVxuICAgICAgfVxuXG4gICAgfSlcbiAgfTtcblxuICAvKipcbiAgICogR2V0IFVzZXIgb2JqZWN0IGZyb20gdGhlIEpXVC5cbiAgICpcbiAgICogSWYgbm8gSldUIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgbG9va2VkIGZvciBhdCB0aGUgbm9ybWFsIEpXVFxuICAgKiBsb2NhdGlvbnMgKGxvY2FsU3RvcmFnZSBvciBVUkwgcXVlcnlTdHJpbmcpLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gW2p3dF0gLSB0aGUgSldUIHRvIGV4dHJhY3QgdXNlciBmcm9tLlxuICAgKi9cbiAgZ2V0VXNlckZyb21KV1Qoand0OiBzdHJpbmcpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gdXNlciA/XG4gICAgICAgICAgICBuZXcgR2VvUGxhdGZvcm1Vc2VyKE9iamVjdC5hc3NpZ24oe30sIHVzZXIsIHsgaWQ6IHVzZXIuc3ViIH0pKSA6XG4gICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgKiB3aWxsIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSwgaXQgcmV0dXJucyB0aGUgdXNlciAob3IgbnVsbCkuXG4gICAqXG4gICAqIFNpZGUgRWZmZWN0czpcbiAgICogIC0gV2lsbCByZWRpcmVjdCB1c2VycyBpZiBubyB2YWxpZCBKV1Qgd2FzIGZvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayBvcHRpb25hbCBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCB0aGUgdXNlclxuICAgKiBAcmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgY3VycmVudCB1c2VyXG4gICAqL1xuICBnZXRVc2VyU3luYyhjYWxsYmFjaz86ICh1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAvLyBJZiBjYWxsYmFjayBwcm92aWRlZCB3ZSBjYW4gdHJlYXQgYXN5bmMgYW5kIGNhbGwgc2VydmVyXG4gICAgaWYoY2FsbGJhY2sgJiYgdHlwZW9mKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aGlzLmNoZWNrKClcbiAgICAgIC50aGVuKHVzZXIgPT4gY2FsbGJhY2sodXNlcikpO1xuXG4gICAgICAvLyBJZiBubyBjYWxsYmFjayB3ZSBoYXZlIHRvIHByb3ZpZGUgYSBzeW5jIHJlc3BvbnNlIChubyBuZXR3b3JrKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBhbGxvdyBmcm9udCBlbmQgdG8gZ2V0IHVzZXIgZGF0YSBpZiBncmFudCB0eXBlIGFuZCBleHBpcmVkXG4gICAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCByZWNpZXZlIGEgbmV3IHRva2VuIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgICAgLy8gbWFraW5nIGEgY2FsbCB0byB0aGUgY2xpZW50KGFwcGxpY2F0aW9uKVxuICAgICAgcmV0dXJuIHRoaXMuaXNJbXBsaWNpdEpXVChqd3QpICYmIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dJRlJBTUVMT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XSUZSQU1FTE9HSU4pXG4gICAqXG4gICAqIENhc2VzOlxuICAgKiAxLiBEZWxheSByZXNvbHZlIGZ1bmN0aW9uIHRpbGwgdXNlciBpcyBsb2dnZWQgaW5cbiAgICogMi4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqIDMuIEZvcmNlIHRoZSByZWRpcmVjdFxuICAgKiA0LiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICpcbiAgICogTk9URTpcbiAgICogQ2FzZSAxIGFib3ZlIHdpbGwgY2F1c2UgdGhpcyBtZXRob2QncyBwcm9taXNlIHRvIGJlIGEgbG9uZyBzdGFsbFxuICAgKiB1bnRpbCB0aGUgdXNlciBjb21wbGV0ZXMgdGhlIGxvZ2luIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGFsbG93IHRoZVxuICAgKiBhcHAgdG8gZm9yZ28gYSByZWxvYWQgaXMgaXQgc2hvdWxkIGhhdmUgd2FpdGVkIHRpbGwgdGhlIGVudGlyZVxuICAgKiB0aW1lIHRpbGwgdGhlIHVzZXIgd2FzIHN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4uXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0VXNlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxVc2VyPn0gVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICovXG4gIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXIgfCBudWxsPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlciB8IG51bGw+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY2hlY2soKVxuICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGlmKHVzZXIpIHtcbiAgICAgICAgICByZXNvbHZlKHVzZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FzZSAxIC0gQUxMT1dJRlJBTUVMT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgICAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHVzZXIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYXNlIDIgLSBBTExPV0lGUkFNRUxPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiAhdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYXNlIDMgLSBBTExPV0lGUkFNRUxPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgICAgICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XSUZSQU1FTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnNzb0ZhaWxlZCcpe1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5nZXRVc2VyKCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgNCAtIEFMTE9XSUZSQU1FTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgICAgICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XSUZSQU1FTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCkgLy8gb3IgcmVqZWN0P1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyOiBFcnJvcikgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICB9KVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMge1VzZXJ9IC0gbmctY29tbW9uIHVzZXIgb2JqZWN0IG9yIG51bGxcbiAgICovXG4gIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgICBpZighand0KVxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja1dpdGhDbGllbnQoXCJcIilcbiAgICAgICAgICAgICAgICAgICAudGhlbihqd3QgPT4gand0Lmxlbmd0aCA/IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSA6IG51bGwpO1xuXG4gICAgICBpZighand0KSByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIGlmKCF0aGlzLmlzSW1wbGljaXRKV1Qoand0KSl7IC8vIEdyYW50IHRva2VuXG4gICAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrV2l0aENsaWVudChqd3QpXG4gICAgICAgICAgICAgICAgICAudGhlbihqd3QgPT4gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6IC8vIENoZWNrIHdpdGggc2VydmVyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSk7XG4gICAgICB9IGVsc2UgeyAvLyBJbXBsaWNpdCBKV1RcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG51bGwpIDpcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBzZXJ2aWNlIGhvc3Rpbmcgbm9kZS1ncG9hdXRoIHRvIGFsbG93IGZvciBhXG4gICAqIHRva2VuIHJlZnJlc2ggb24gYW4gZXhwaXJlZCB0b2tlbiwgb3IgYSB0b2tlbiB0aGF0IGhhcyBiZWVuXG4gICAqIGludmFsaWRhdGVkIHRvIGJlIHJldm9rZWQuXG4gICAqXG4gICAqIE5vdGU6IENsaWVudCBhcyBpbiBob3N0aW5nIGFwcGxpY2F0aW9uOlxuICAgKiAgICBodHRwczovL3d3dy5kaWdpdGFsb2NlYW4uY29tL2NvbW11bml0eS90dXRvcmlhbHMvYW4taW50cm9kdWN0aW9uLXRvLW9hdXRoLTJcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1dpdGhDbGllbnRcbiAgICogQHBhcmFtIHtqd3R9IC0gZW5jb2RlZCBhY2Nlc3NUb2tlbi9KV1RcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxqd3Q+fSAtIHByb21pc2UgcmVzb2x2aW5nIHdpdGggYSBKV1RcbiAgICovXG4gIGNoZWNrV2l0aENsaWVudChvcmlnaW5hbEpXVDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKXtcbiAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBheGlvcyhgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2NoZWNrdG9rZW5gLCB7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nIDogb3JpZ2luYWxKV1QgPyBgQmVhcmVyICR7b3JpZ2luYWxKV1R9YCA6ICcnLFxuICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzJzogJ0F1dGhvcml6YXRpb24sIFdXVy1BdXRob3JpemF0aW9uLCBjb250ZW50LWxlbmd0aCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgIGNvbnN0IGhlYWRlciA9IHJlc3AuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXG4gICAgICAgICAgY29uc3QgbmV3SldUID0gaGVhZGVyICYmIGhlYWRlci5yZXBsYWNlKCdCZWFyZXIgJywnJylcbiAgICAgICAgICBpZihuZXdKV1QpIHRoaXMuc2V0QXV0aChuZXdKV1QpO1xuXG4gICAgICAgICAgcmVzb2x2ZShuZXdKV1QgPyBuZXdKV1QgOiBvcmlnaW5hbEpXVCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KGVycikpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nIHwgdW5kZWZpbmVkfSAtIEpXVCBUb2tlbiAocmF3IHN0cmluZylcbiAgICovXG4gIGdldEpXVEZyb21VcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9ICh3aW5kb3cgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgcmVzID0gcXVlcnlTdHJpbmcubWF0Y2goL2FjY2Vzc190b2tlbj0oW15cXCZdKikvKTtcbiAgICByZXR1cm4gcmVzICYmIHJlc1sxXTtcbiAgfTtcblxuICAvKipcbiAgICogTG9hZCB0aGUgSldUIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVGZyb21Mb2NhbFN0b3JhZ2VcbiAgICpcbiAgICogQHJldHVybiB7SldUIHwgdW5kZWZpbmVkfSBBbiBvYmplY3Qgd2loIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKi9cbiAgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEZyb21Mb2NhbFN0b3JhZ2UoJ2dwb2F1dGhKV1QnKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiB7c3RpbmcgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRKV1QoKTogc3RyaW5nIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVEZyb21VcmwoKSB8fCB0aGlzLmdldEpXVGZyb21Mb2NhbFN0b3JhZ2UoKVxuICAgIC8vIE9ubHkgZGVueSBpbXBsaWNpdCB0b2tlbnMgdGhhdCBoYXZlIGV4cGlyZWRcbiAgICBpZighand0IHx8IChqd3QgJiYgdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gand0O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBKV1Qgc2F2ZWQgaW4gbG9jYWwgc3RvcmdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNsZWFyTG9jYWxTdG9yYWdlSldUXG4gICAqXG4gICAqIEByZXR1cm4gIHt1bmRlZmluZWR9XG4gICAqL1xuICBwcml2YXRlIGNsZWFyTG9jYWxTdG9yYWdlSldUKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdncG9hdXRoSldUJylcbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0ge0pXVH0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIEpXVCB0byBsb2NhbFN0b3JhZ2UgYW5kIGluIHRoZSByZXF1ZXN0IGhlYWRlcnMgZm9yIGFjY2Vzc2luZ1xuICAgKiBwcm90ZWN0ZWQgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gand0XG4gICAqL1xuICBwdWJsaWMgc2V0QXV0aChqd3Q6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlKCdncG9hdXRoSldUJywgand0KVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSlcbiAgfTtcblxuICAvKipcbiAgICogUHVyZ2UgdGhlIEpXVCBmcm9tIGxvY2FsU3RvcmFnZSBhbmQgYXV0aG9yaXphdGlvbiBoZWFkZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVBdXRoKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdncG9hdXRoSldUJylcbiAgICAvLyBTZW5kIG51bGwgdXNlciBhcyB3ZWxsIChiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSlcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCBudWxsKVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gIH07XG59XG5cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRBdXRoQ29uZjogQXV0aENvbmZpZyA9IHtcbiAgQVVUSF9UWVBFOiAnZ3JhbnQnLFxuICBBTExPV0lGUkFNRUxPR0lOOiBmYWxzZSxcbiAgRk9SQ0VfTE9HSU46IGZhbHNlLFxuICBBTExPV19ERVZfRURJVFM6IGZhbHNlLFxuICBBUFBfQkFTRV9VUkw6ICcnIC8vIGFic29sdXRlIHBhdGggLy8gdXNlIC4gZm9yIHJlbGF0aXZlIHBhdGhcbn1cbiJdfQ==