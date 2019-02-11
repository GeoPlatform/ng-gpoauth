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
        if (this.config.ALLOW_SSO_LOGIN && !user && this.config.AUTH_TYPE === 'grant')
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
                    // Case 1 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: true
                    if (_this.config.ALLOW_IFRAME_LOGIN && _this.config.FORCE_LOGIN) {
                        // Resolve with user once they have logged in
                        // Resolve with user once they have logged in
                        _this.messenger.on('userAuthenticated', function (event, user) {
                            resolve(user);
                        });
                    }
                    // Case 2 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: false
                    if (_this.config.ALLOW_IFRAME_LOGIN && !_this.config.FORCE_LOGIN) {
                        resolve(null);
                    }
                    // Case 3 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: true
                    if (!_this.config.ALLOW_IFRAME_LOGIN && _this.config.FORCE_LOGIN) {
                        addEventListener('message', function (event) {
                            // Handle SSO login failure
                            if (event.data === 'iframe:ssoFailed') {
                                resolve(self.getUser());
                            }
                        });
                        resolve(null);
                    }
                    // Case 4 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: false
                    if (!_this.config.ALLOW_IFRAME_LOGIN && !_this.config.FORCE_LOGIN) {
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
                    var newJWT = header && header.replace('Bearer', '').trim();
                    if (header && newJWT.length)
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
    APP_BASE_URL: '',
    // absolute path // use . for relative path
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    ALLOW_SSO_LOGIN: true
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOzs7Ozs7QUFFekIsaUJBQWlCLEdBQVcsRUFBRSxHQUFZO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFDRSxPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFVLEdBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3pELFlBQVksRUFBRSxNQUFNO0tBQ3JCLENBQUM7U0FDRCxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO0NBQzFDOzs7O0FBS0Q7OztBQUFBO0lBS0U7Ozs7Ozs7T0FPRztJQUNILHFCQUFZLE1BQWtCLEVBQUUsV0FBd0I7O1FBQ3RELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQTs7UUFHNUIsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBVTs7WUFFckMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLDBCQUEwQixFQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7YUFDWjs7WUFHRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO2dCQUM5QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7YUFDbEI7U0FDRixDQUFDLENBQUE7O1FBRUYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ3hCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssT0FBTztZQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtLQUM5RjtJQUVEOzs7T0FHRzs7Ozs7O0lBQ0gsa0NBQVk7Ozs7O0lBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUE7S0FDdEI7Ozs7Ozs7SUFLTyx3Q0FBa0I7Ozs7OztjQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ2hELFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUN4QyxDQUFDO0lBRUY7Ozs7T0FJRzs7Ozs7OztJQUNILHlDQUFtQjs7Ozs7O0lBQW5CLFVBQW9CLEdBQVc7O1FBQzdCLElBQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckMsSUFBRztZQUNELE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsU0FBUyxDQUFDO1NBQ25CO1FBQUMsT0FBTyxDQUFDLEVBQUMsRUFBRSw2Q0FBNkM7O1lBQ3hELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0tBQ0Y7SUFBQSxDQUFDOzs7O0lBRU0sOEJBQVE7Ozs7OztRQUNkLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFDbEIsSUFBTSxNQUFNLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLG9DQUErQixDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUksQ0FBQTs7UUFDakcsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7UUFHM0MsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsS0FBVTs7WUFFckMsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGtCQUFrQixFQUFDO2dCQUNuQyxJQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLGlCQUFpQjs7b0JBQ2pELFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTs7Z0JBRXBCLElBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO29CQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUM5Qzs7WUFHRCxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUcsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCOztvQkFDakQsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFBO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFBOzs7Ozs7Ozs7SUFTSSwwQkFBSTs7Ozs7Ozs7O1FBQ1YsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLElBQUcsR0FBRztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7O1FBR3pCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3hCLElBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBQztnQkFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUUsRUFBRSxFQUFHLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxFQUFFLENBQUMsQ0FBRSxDQUFBO2FBQzFJO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsRUFBRSxFQUFFLENBQUMsQ0FBQTthQUMvRTtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzs7Ozs7Ozs7SUFTekIsa0NBQVk7Ozs7Ozs7Y0FBQyxHQUFXOztRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxPQUFPLE1BQU0sQ0FBQTs7SUFDZCxDQUFDO0lBRUY7O09BRUc7Ozs7O0lBQ0gsMkJBQUs7Ozs7SUFBTDs7UUFFRSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtZQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVk7aUJBQ3ZDLCtCQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQVEsQ0FBQTtpQkFDakQsb0JBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBVyxDQUFBO2lCQUN6QyxtQkFBaUIsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFHLENBQUEsQ0FBQTs7U0FHaEY7YUFBTTs7WUFFTCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUM7Z0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUE7O2FBRzlDO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUzt1QkFDekIseUJBQXVCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFHLENBQUE7YUFDckY7U0FDRjtLQUNGO0lBQUEsQ0FBQztJQUVGOztPQUVHOzs7OztJQUNILDRCQUFNOzs7O0lBQU47UUFBQSxpQkFzQkM7O1FBckJDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7UUFNbEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBRWpCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxPQUFPLENBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLHFCQUFrQixFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDNUQsSUFBSSxDQUFDO2dCQUNKLElBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO29CQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFBO2dCQUN4RSxJQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVztvQkFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzlDLE9BQU8sRUFBRSxDQUFDO2FBQ1gsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxHQUFVO2dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYixDQUFDLENBQUM7U0FDWixDQUFDLENBQUE7S0FFSDtJQUFBLENBQUM7SUFFRjs7T0FFRzs7Ozs7SUFDSCxnQ0FBVTs7OztJQUFWO1FBQ0UsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7SUFBQSxDQUFDO0lBRUY7O09BRUc7Ozs7O0lBQ0gscUNBQWU7Ozs7SUFBZjtRQUFBLGlCQWNDOztRQWJDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUUxQixPQUFPLElBQUksT0FBTyxDQUFjLFVBQUMsT0FBTyxFQUFFLE1BQU07O1lBRTlDLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sQ0FBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksaUJBQWMsRUFBRSxHQUFHLENBQUM7cUJBQ3BELElBQUksQ0FBQyxVQUFDLFFBQXFCLElBQU0sT0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQWpCLENBQWlCLENBQUM7cUJBQ25ELEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQTthQUM3QjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDYjtTQUVGLENBQUMsQ0FBQTtLQUNIO0lBQUEsQ0FBQztJQUVGOzs7Ozs7O09BT0c7Ozs7Ozs7Ozs7SUFDSCxvQ0FBYzs7Ozs7Ozs7O0lBQWQsVUFBZSxHQUFXOztRQUN4QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sSUFBSSxDQUFDLENBQUM7WUFDTCxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQztLQUNkO0lBRUQ7Ozs7Ozs7OztPQVNHOzs7Ozs7Ozs7OztJQUNILGlDQUFXOzs7Ozs7Ozs7O0lBQVgsVUFBWSxRQUF5Qzs7UUFDbkQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztRQUUxQixJQUFHLFFBQVEsSUFBSSxPQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssVUFBVSxFQUFDO1lBQzdDLElBQUksQ0FBQyxLQUFLLEVBQUU7aUJBQ1gsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDOztTQUcvQjthQUFNOzs7O1lBSUwsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztLQUNGO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQThCRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDSCw2QkFBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFQO1FBQUEsaUJBeUNDOztRQXhDQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7OztRQUtsQixPQUFPLElBQUksT0FBTyxDQUF5QixVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3pELEtBQUksQ0FBQyxLQUFLLEVBQUU7aUJBQ1gsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDUixJQUFHLElBQUksRUFBRTtvQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2Q7cUJBQU07O29CQUVMLElBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQzs7d0JBRTNELEFBREEsNkNBQTZDO3dCQUM3QyxLQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLEtBQVksRUFBRSxJQUFxQjs0QkFDekUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO3lCQUNkLENBQUMsQ0FBQTtxQkFDSDs7b0JBRUQsSUFBRyxLQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7d0JBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFDZDs7b0JBRUQsSUFBRyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUM7d0JBQzVELGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQVU7OzRCQUVyQyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssa0JBQWtCLEVBQUM7Z0NBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTs2QkFDeEI7eUJBQ0YsQ0FBQyxDQUFBO3dCQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFDZDs7b0JBRUQsSUFBRyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBQzt3QkFDN0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUNkO2lCQUNGO2FBQ0YsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxHQUFVLElBQUssT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUE7U0FDekMsQ0FBQyxDQUFBO0tBQ0g7SUFBQSxDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNILDJCQUFLOzs7Ozs7O0lBQUw7UUFBQSxpQkFxQkM7UUFwQkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxHQUFHOztZQUM5QixJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O1lBRzFCLElBQUcsQ0FBQyxHQUFHO2dCQUNMLE9BQU8sS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7cUJBQ25CLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO1lBRXhFLElBQUcsQ0FBQyxHQUFHO2dCQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLElBQUcsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUUsY0FBYzs7Z0JBQzFDLE9BQU8sS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNwQixLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQzt5QkFDdEIsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDN0M7aUJBQU0sRUFBRSxlQUFlOztnQkFDdEIsT0FBTyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsT0FBTyxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMzQztTQUNGLENBQUMsQ0FBQTtLQUNIO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHOzs7Ozs7Ozs7Ozs7OztJQUNILHFDQUFlOzs7Ozs7Ozs7Ozs7O0lBQWYsVUFBZ0IsV0FBbUI7UUFBbkMsaUJBdUJDO1FBdEJDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxJQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBQztnQkFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2Q7aUJBQU07Z0JBRUwsS0FBSyxDQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxnQkFBYSxFQUFFO29CQUM5QyxPQUFPLEVBQUU7d0JBQ1AsZUFBZSxFQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBVSxXQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzVELCtCQUErQixFQUFFLGtEQUFrRDtxQkFDcEY7aUJBQ0YsQ0FBQztxQkFDRCxJQUFJLENBQUMsVUFBQSxJQUFJOztvQkFDUixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBOztvQkFDNUMsSUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUU1RCxJQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTTt3QkFDeEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDeEMsQ0FBQztxQkFDRCxLQUFLLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVyxDQUFDLENBQUM7YUFDNUI7U0FDRixDQUFDLENBQUE7S0FDSDtJQUVELHVEQUF1RDtJQUV2RDs7Ozs7O09BTUc7Ozs7Ozs7O0lBQ0gsbUNBQWE7Ozs7Ozs7SUFBYjs7UUFDRSxJQUFNLFdBQVcsR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7O1FBQ2pELElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN2RCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEI7SUFBQSxDQUFDO0lBRUY7Ozs7OztPQU1HOzs7Ozs7OztJQUNILDRDQUFzQjs7Ozs7OztJQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQzlDO0lBQUEsQ0FBQztJQUVGOzs7Ozs7OztPQVFHOzs7Ozs7Ozs7O0lBQ0gsNEJBQU07Ozs7Ozs7OztJQUFOOztRQUNFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTs7UUFFakUsSUFBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNsRSxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFBQSxDQUFDOzs7Ozs7OztJQVNNLDBDQUFvQjs7Ozs7Ozs7UUFDMUIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTs7SUFDdEMsQ0FBQztJQUVGOzs7Ozs7O09BT0c7Ozs7Ozs7OztJQUNILCtCQUFTOzs7Ozs7OztJQUFULFVBQVUsR0FBVzs7UUFDbkIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNwQyxJQUFHLFNBQVMsRUFBQzs7WUFDWCxJQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDMUMsT0FBTyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztTQUM1QjtRQUNELE9BQU8sSUFBSSxDQUFBO0tBQ1o7SUFBQSxDQUFDO0lBRUY7OztPQUdHOzs7Ozs7SUFDSCxtQ0FBYTs7Ozs7SUFBYixVQUFjLEdBQVc7O1FBQ3ZCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEMsT0FBTyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQztLQUN4QztJQUVEOzs7OztPQUtHOzs7Ozs7O0lBQ0gsOEJBQVE7Ozs7OztJQUFSLFVBQVMsS0FBYTs7UUFDcEIsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJLEtBQUssRUFBRTtZQUNULElBQUk7O2dCQUNGLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUNwQyxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUNuQztZQUFDLE9BQU0sQ0FBQyxFQUFFLEVBQUUsNkJBQTZCOzthQUFFO1NBQzdDO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUFBLENBQUM7SUFFRjs7Ozs7OztPQU9HOzs7Ozs7Ozs7OztJQUNILGlDQUFXOzs7Ozs7Ozs7O0lBQVgsVUFBWSxLQUFhOztRQUN2QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztRQUNsQyxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNwRixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUEsQ0FBQzs7Ozs7Ozs7SUFRSyw2QkFBTzs7Ozs7OztjQUFDLEdBQVc7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7O0lBQ3hFLENBQUM7Ozs7O0lBS00sZ0NBQVU7Ozs7O1FBQ2hCLFlBQVksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUE7O1FBRXJDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztJQUN4QyxDQUFDO3NCQTVoQko7SUE2aEJDLENBQUE7Ozs7QUE5Z0JELHVCQThnQkM7Ozs7Ozs7O0FBR0QsV0FBYSxlQUFlLEdBQWU7SUFDekMsU0FBUyxFQUFFLE9BQU87SUFDbEIsWUFBWSxFQUFFLEVBQUU7O0lBQ2hCLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsZUFBZSxFQUFFLElBQUk7Q0FDdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBKV1QsIFVzZXJQcm9maWxlIH0gZnJvbSAnLi4vc3JjL2F1dGhUeXBlcydcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4vR2VvUGxhdGZvcm1Vc2VyJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG5mdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGF4aW9zLmdldCh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbicgOiBqd3QgPyBgQmVhcmVyICR7and0fWAgOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHIgPT4gci5kYXRhKTtcbn1cblxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbiBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgY29uZmlnOiBBdXRoQ29uZmlnXG4gIG1lc3NlbmdlcjogbmdNZXNzZW5nZXJcblxuICAvKipcbiAgICpcbiAgICogQGNsYXNzIEF1dGhTZXJ2aWNlXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge0F1dGhDb25maWd9IGNvbmZpZ1xuICAgKiBAcGFyYW1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQXV0aENvbmZpZywgbmdNZXNzZW5nZXI6IG5nTWVzc2VuZ2VyKXtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1lc3NlbmdlciA9IG5nTWVzc2VuZ2VyXG5cbiAgICAvLyBTZXR1cCBnZW5lcmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFsd2F5cyBydW5cbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgc2VsZi5pbml0KCkgLy8gd2lsbCBicm9hZGNhc3QgdG8gYW5ndWxhciAoc2lkZS1lZmZlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBsb2dvdXQgZXZlbnRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICd1c2VyU2lnbk91dCcpe1xuICAgICAgICBzZWxmLnJlbW92ZUF1dGgoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCB1c2VyID0gc2VsZi5pbml0KClcbiAgICBpZih0aGlzLmNvbmZpZy5BTExPV19TU09fTE9HSU4gJiYgIXVzZXIgJiYgdGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAnZ3JhbnQnKSBzZWxmLnNzb0NoZWNrKClcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgbmdNZXNzZW5nZXIgc28gdGhhdCBhcHBsaWN0aW9uIGNvZGUgaXMgYWJsZSB0b1xuICAgKiBzdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBzZW50IGJ5IG5nLWdwb2F1dGhcbiAgICovXG4gIGdldE1lc3NlbmdlcigpOiBuZ01lc3NlbmdlciB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2VuZ2VyXG4gIH1cblxuICAvKipcbiAgICogU2VjdXJpdHkgd3JhcHBlciBmb3Igb2JmdXNjYXRpbmcgdmFsdWVzIHBhc3NlZCBpbnRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgc2F2ZVRvTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBidG9hKHZhbHVlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuZCBkZWNvZGUgdmFsdWUgZnJvbSBsb2NhbHN0b3JhZ2VcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgZ2V0RnJvbUxvY2FsU3RvcmFnZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgIHRyeXtcbiAgICAgIHJldHVybiByYXcgP1xuICAgICAgICAgICAgICBhdG9iKHJhdykgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBzc29DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzc29VUkwgPSBgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2xvZ2luP3Nzbz10cnVlJmNhY2hlYnVzdGVyPSR7KG5ldyBEYXRlKCkpLmdldFRpbWUoKX1gXG4gICAgY29uc3Qgc3NvSWZyYW1lID0gdGhpcy5jcmVhdGVJZnJhbWUoc3NvVVJMKVxuXG4gICAgLy8gU2V0dXAgc3NvSWZyYW1lIHNwZWNpZmljIGhhbmRsZXJzXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgICAvLyBGb3JjZSBsb2dpbiBvbmx5IGFmdGVyIFNTTyBoYXMgZmFpbGVkXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSBzZWxmLmZvcmNlTG9naW4oKVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV2Uga2VlcCB0aGlzIG91dHNpZGUgdGhlIGNvbnN0cnVjdG9yIHNvIHRoYXQgb3RoZXIgc2VydmljZXMgY2FsbFxuICAgKiBjYWxsIGl0IHRvIHRyaWdnZXIgdGhlIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBwcml2YXRlIGluaXQoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIGlmKGp3dCkgdGhpcy5zZXRBdXRoKGp3dClcblxuICAgIC8vY2xlYW4gaG9zdHVybCBvbiByZWRpcmVjdCBmcm9tIG9hdXRoXG4gICAgaWYgKHRoaXMuZ2V0SldURnJvbVVybCgpKSB7XG4gICAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJykgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKlxcJnRva2VuX3R5cGU9QmVhcmVyLywgJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZpc2FibGUgaWZyYW1lIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY3JlYXRlSWZyYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MSUZyYW1lRWxlbWVudH1cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbigpIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jb25maWcuQ0FMTEJBQ0sgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCdhdXRoOnJlcXVpcmVMb2dpbicpXG5cbiAgICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZil9YFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYmFja2dyb3VuZCBsb2dvdXQgYW5kIHJlcXVlc3RzIGp3dCByZXZva2F0aW9uXG4gICAqL1xuICBsb2dvdXQoKTogUHJvbWlzZTx2b2lkPntcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAvLyBDcmVhdGUgaWZyYW1lIHRvIG1hbnVhbGx5IGNhbGwgdGhlIGxvZ291dCBhbmQgcmVtb3ZlIGdwb2F1dGggY29va2llXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTM3NTgyMDcvd2h5LWlzLXBhc3Nwb3J0anMtaW4tbm9kZS1ub3QtcmVtb3Zpbmctc2Vzc2lvbi1vbi1sb2dvdXQjYW5zd2VyLTMzNzg2ODk5XG4gICAgLy8gdGhpcy5jcmVhdGVJZnJhbWUoYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hdXRoL2xvZ291dGApXG5cbiAgICAvLyBTYXZlIEpXVCB0byBzZW5kIHdpdGggZmluYWwgcmVxdWVzdCB0byByZXZva2UgaXRcbiAgICBzZWxmLnJlbW92ZUF1dGgoKSAvLyBwdXJnZSB0aGUgSldUXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZT9zc289dHJ1ZWAsIHRoaXMuZ2V0SldUKCkpXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNvbmZpZy5MT0dPVVRfVVJMKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR09VVF9VUkxcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTikgc2VsZi5mb3JjZUxvZ2luKCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgbG9nZ2luZyBvdXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0pO1xuICAgIH0pXG5cbiAgfTtcblxuICAvKipcbiAgICogT3B0aW9uYWwgZm9yY2UgcmVkaXJlY3QgZm9yIG5vbi1wdWJsaWMgc2VydmljZXNcbiAgICovXG4gIGZvcmNlTG9naW4oKSB7XG4gICAgdGhpcy5sb2dpbigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvdGVjdGVkIHVzZXIgcHJvZmlsZVxuICAgKi9cbiAgZ2V0T2F1dGhQcm9maWxlKCk6IFByb21pc2U8VXNlclByb2ZpbGU+IHtcbiAgICBjb25zdCBKV1QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFVzZXJQcm9maWxlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL2NoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBjYW4gbWFrZSBjYWxsZWRcbiAgICAgIGlmIChKV1QpIHtcbiAgICAgICAgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2FwaS9wcm9maWxlYCwgSldUKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZTogVXNlclByb2ZpbGUpID0+ICByZXNvbHZlKHJlc3BvbnNlKSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChlcnIpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG51bGwpXG4gICAgICB9XG5cbiAgICB9KVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgVXNlciBvYmplY3QgZnJvbSB0aGUgSldULlxuICAgKlxuICAgKiBJZiBubyBKV1QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb29rZWQgZm9yIGF0IHRoZSBub3JtYWwgSldUXG4gICAqIGxvY2F0aW9ucyAobG9jYWxTdG9yYWdlIG9yIFVSTCBxdWVyeVN0cmluZykuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBband0XSAtIHRoZSBKV1QgdG8gZXh0cmFjdCB1c2VyIGZyb20uXG4gICAqL1xuICBnZXRVc2VyRnJvbUpXVChqd3Q6IHN0cmluZyk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiB1c2VyID9cbiAgICAgICAgICAgIG5ldyBHZW9QbGF0Zm9ybVVzZXIoT2JqZWN0LmFzc2lnbih7fSwgdXNlciwgeyBpZDogdXNlci5zdWIgfSkpIDpcbiAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSB1c2VyIChvciBudWxsKS5cbiAgICpcbiAgICogU2lkZSBFZmZlY3RzOlxuICAgKiAgLSBXaWxsIHJlZGlyZWN0IHVzZXJzIGlmIG5vIHZhbGlkIEpXVCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGludm9rZSB3aXRoIHRoZSB1c2VyXG4gICAqIEByZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyBjdXJyZW50IHVzZXJcbiAgICovXG4gIGdldFVzZXJTeW5jKGNhbGxiYWNrPzogKHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIC8vIElmIGNhbGxiYWNrIHByb3ZpZGVkIHdlIGNhbiB0cmVhdCBhc3luYyBhbmQgY2FsbCBzZXJ2ZXJcbiAgICBpZihjYWxsYmFjayAmJiB0eXBlb2YoY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRoaXMuY2hlY2soKVxuICAgICAgLnRoZW4odXNlciA9PiBjYWxsYmFjayh1c2VyKSk7XG5cbiAgICAgIC8vIElmIG5vIGNhbGxiYWNrIHdlIGhhdmUgdG8gcHJvdmlkZSBhIHN5bmMgcmVzcG9uc2UgKG5vIG5ldHdvcmspXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAgIC8vIGJlY2F1c2UgdGhleSB3aWxsIHJlY2lldmUgYSBuZXcgdG9rZW4gYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb21pc2UgdmVyc2lvbiBvZiBnZXQgdXNlci5cbiAgICpcbiAgICogQmVsb3cgaXMgYSB0YWJsZSBvZiBob3cgdGhpcyBmdW5jdGlvbiBoYW5kZWxzIHRoaXMgbWV0aG9kIHdpdGhcbiAgICogZGlmZmVybnQgY29uZmlndXJhdGlvbnMuXG4gICAqICAtIEZPUkNFX0xPR0lOIDogSG9yaXpvbnRhbFxuICAgKiAgLSBBTExPV19JRlJBTUVfTE9HSU4gOiBWZXJ0aWNhbFxuICAgKlxuICAgKlxuICAgKiBnZXRVc2VyICB8IFQgfCBGIChGT1JDRV9MT0dJTilcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogVCAgICAgICAgfCAxIHwgMlxuICAgKiBGICAgICAgICB8IDMgfCA0XG4gICAqIChBTExPV19JRlJBTUVfTE9HSU4pXG4gICAqXG4gICAqIENhc2VzOlxuICAgKiAxLiBEZWxheSByZXNvbHZlIGZ1bmN0aW9uIHRpbGwgdXNlciBpcyBsb2dnZWQgaW5cbiAgICogMi4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqIDMuIEZvcmNlIHRoZSByZWRpcmVjdFxuICAgKiA0LiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICpcbiAgICogTk9URTpcbiAgICogQ2FzZSAxIGFib3ZlIHdpbGwgY2F1c2UgdGhpcyBtZXRob2QncyBwcm9taXNlIHRvIGJlIGEgbG9uZyBzdGFsbFxuICAgKiB1bnRpbCB0aGUgdXNlciBjb21wbGV0ZXMgdGhlIGxvZ2luIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGFsbG93IHRoZVxuICAgKiBhcHAgdG8gZm9yZ28gYSByZWxvYWQgaXMgaXQgc2hvdWxkIGhhdmUgd2FpdGVkIHRpbGwgdGhlIGVudGlyZVxuICAgKiB0aW1lIHRpbGwgdGhlIHVzZXIgd2FzIHN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4uXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0VXNlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxVc2VyPn0gVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICovXG4gIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXIgfCBudWxsPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlciB8IG51bGw+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY2hlY2soKVxuICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGlmKHVzZXIpIHtcbiAgICAgICAgICByZXNvbHZlKHVzZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FzZSAxIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICAgICAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIHVzZXIgb25jZSB0aGV5IGhhdmUgbG9nZ2VkIGluXG4gICAgICAgICAgICB0aGlzLm1lc3Nlbmdlci5vbigndXNlckF1dGhlbnRpY2F0ZWQnLCAoZXZlbnQ6IEV2ZW50LCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1c2VyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2FzZSAyIC0gQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgMyAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgICAgICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnNzb0ZhaWxlZCcpe1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5nZXRVc2VyKCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgNCAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICAgICAgICBpZighdGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICByZXNvbHZlKG51bGwpIC8vIG9yIHJlamVjdD9cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycjogRXJyb3IpID0+IGNvbnNvbGUubG9nKGVycikpXG4gICAgfSlcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgZnVuY3Rpb24gYmVpbmcgdXNlZCBieSBzb21lIGZyb250IGVuZCBhcHBzIGFscmVhZHkuXG4gICAqICh3cmFwcGVyIGZvciBnZXRVc2VyKVxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrXG4gICAqIEByZXR1cm5zIHtVc2VyfSAtIG5nLWNvbW1vbiB1c2VyIG9iamVjdCBvciBudWxsXG4gICAqL1xuICBjaGVjaygpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcbiAgICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG5cbiAgICAgIC8vIElmIG5vIGxvY2FsIEpXVFxuICAgICAgaWYoIWp3dClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tXaXRoQ2xpZW50KFwiXCIpXG4gICAgICAgICAgICAgICAgICAgLnRoZW4oand0ID0+IGp3dC5sZW5ndGggPyB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkgOiBudWxsKTtcblxuICAgICAgaWYoIWp3dCkgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICBpZighdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkpeyAvLyBHcmFudCB0b2tlblxuICAgICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1dpdGhDbGllbnQoand0KVxuICAgICAgICAgICAgICAgICAgLnRoZW4oand0ID0+IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSkgOiAvLyBDaGVjayB3aXRoIHNlcnZlclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpO1xuICAgICAgfSBlbHNlIHsgLy8gSW1wbGljaXQgSldUXG4gICAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdChudWxsKSA6XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjYWxsIHRvIGEgc2VydmljZSBob3N0aW5nIG5vZGUtZ3BvYXV0aCB0byBhbGxvdyBmb3IgYVxuICAgKiB0b2tlbiByZWZyZXNoIG9uIGFuIGV4cGlyZWQgdG9rZW4sIG9yIGEgdG9rZW4gdGhhdCBoYXMgYmVlblxuICAgKiBpbnZhbGlkYXRlZCB0byBiZSByZXZva2VkLlxuICAgKlxuICAgKiBOb3RlOiBDbGllbnQgYXMgaW4gaG9zdGluZyBhcHBsaWNhdGlvbjpcbiAgICogICAgaHR0cHM6Ly93d3cuZGlnaXRhbG9jZWFuLmNvbS9jb21tdW5pdHkvdHV0b3JpYWxzL2FuLWludHJvZHVjdGlvbi10by1vYXV0aC0yXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tXaXRoQ2xpZW50XG4gICAqIEBwYXJhbSB7and0fSAtIGVuY29kZWQgYWNjZXNzVG9rZW4vSldUXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8and0Pn0gLSBwcm9taXNlIHJlc29sdmluZyB3aXRoIGEgSldUXG4gICAqL1xuICBjaGVja1dpdGhDbGllbnQob3JpZ2luYWxKV1Q6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyl7XG4gICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgYXhpb3MoYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9jaGVja3Rva2VuYCwge1xuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJyA6IG9yaWdpbmFsSldUID8gYEJlYXJlciAke29yaWdpbmFsSldUfWAgOiAnJyxcbiAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1FeHBvc2UtSGVhZGVycyc6ICdBdXRob3JpemF0aW9uLCBXV1ctQXV0aG9yaXphdGlvbiwgY29udGVudC1sZW5ndGgnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXNwID0+IHtcbiAgICAgICAgICBjb25zdCBoZWFkZXIgPSByZXNwLmhlYWRlcnNbJ2F1dGhvcml6YXRpb24nXVxuICAgICAgICAgIGNvbnN0IG5ld0pXVCA9IGhlYWRlciAmJiBoZWFkZXIucmVwbGFjZSgnQmVhcmVyJywnJykudHJpbSgpO1xuXG4gICAgICAgICAgaWYoaGVhZGVyICYmIG5ld0pXVC5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLnNldEF1dGgobmV3SldUKTtcbiAgICAgICAgICByZXNvbHZlKG5ld0pXVCA/IG5ld0pXVCA6IG9yaWdpbmFsSldUKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogRXh0cmFjdCB0b2tlbiBmcm9tIGN1cnJlbnQgVVJMXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldURnJvbVVybFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmcgfCB1bmRlZmluZWR9IC0gSldUIFRva2VuIChyYXcgc3RyaW5nKVxuICAgKi9cbiAgZ2V0SldURnJvbVVybCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2gpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcbiAgICBjb25zdCByZXMgPSBxdWVyeVN0cmluZy5tYXRjaCgvYWNjZXNzX3Rva2VuPShbXlxcJl0qKS8pO1xuICAgIHJldHVybiByZXMgJiYgcmVzWzFdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBKV1Qgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZVxuICAgKlxuICAgKiBAcmV0dXJuIHtKV1QgfCB1bmRlZmluZWR9IEFuIG9iamVjdCB3aWggdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSgnZ3BvYXV0aEpXVCcpXG4gIH07XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgYW5kIHB1bGwgSldUIGZyb20gdGhlIGZvbGxvd2luZyBsb2NhdGlvbnMgKGluIG9yZGVyKTpcbiAgICogIC0gVVJMIHF1ZXJ5IHBhcmFtZXRlciAnYWNjZXNzX3Rva2VuJyAocmV0dXJuZWQgZnJvbSBJRFApXG4gICAqICAtIEJyb3dzZXIgbG9jYWwgc3RvcmFnZSAoc2F2ZWQgZnJvbSBwcmV2aW91cyByZXF1ZXN0KVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdGluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICogQHJldHVybiAge3VuZGVmaW5lZH1cbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSB7SldUfSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNFeHBpcmVkKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgaWYocGFyc2VkSldUKXtcbiAgICAgIGNvbnN0IG5vdyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgcmV0dXJuIG5vdyA+IHBhcnNlZEpXVC5leHA7XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoZSBKV1QgYW4gaW1wbGljaXQgSldUP1xuICAgKiBAcGFyYW0gand0XG4gICAqL1xuICBpc0ltcGxpY2l0SldUKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHBhcnNlZEpXVCAmJiBwYXJzZWRKV1QuaW1wbGljaXQ7XG4gIH1cblxuICAvKipcbiAgICogVW5zYWZlIChzaWduYXR1cmUgbm90IGNoZWNrZWQpIHVucGFja2luZyBvZiBKV1QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIEFjY2VzcyBUb2tlbiAoSldUKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBwYXJzZWQgcGF5bG9hZCBpbiB0aGUgSldUXG4gICAqL1xuICBwYXJzZUp3dCh0b2tlbjogc3RyaW5nKTogSldUIHtcbiAgICB2YXIgcGFyc2VkO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGJhc2U2NFVybCA9IHRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgnLScsICcrJykucmVwbGFjZSgnXycsICcvJyk7XG4gICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UoYXRvYihiYXNlNjQpKTtcbiAgICAgIH0gY2F0Y2goZSkgeyAvKiBEb24ndCB0aHJvdyBwYXJzZSBlcnJvciAqLyB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBmcm9udCBlbmQgdmFsaWRpb24gdG8gdmVyaWZ5IEpXVCBpcyBjb21wbGV0ZSBhbmQgbm90XG4gICAqIGV4cGlyZWQuXG4gICAqXG4gICAqIE5vdGU6XG4gICAqICBTaWduYXR1cmUgdmFsaWRhdGlvbiBpcyB0aGUgb25seSB0cnVseSBzYXZlIG1ldGhvZC4gVGhpcyBpcyBkb25lXG4gICAqICBhdXRvbWF0aWNhbGx5IGluIHRoZSBub2RlLWdwb2F1dGggbW9kdWxlLlxuICAgKi9cbiAgdmFsaWRhdGVKd3QodG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciBwYXJzZWQgPSB0aGlzLnBhcnNlSnd0KHRva2VuKTtcbiAgICB2YXIgdmFsaWQgPSAocGFyc2VkICYmIHBhcnNlZC5leHAgJiYgcGFyc2VkLmV4cCAqIDEwMDAgPiBEYXRlLm5vdygpKSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4gdmFsaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgSldUIHRvIGxvY2FsU3RvcmFnZSBhbmQgaW4gdGhlIHJlcXVlc3QgaGVhZGVycyBmb3IgYWNjZXNzaW5nXG4gICAqIHByb3RlY3RlZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBqd3RcbiAgICovXG4gIHB1YmxpYyBzZXRBdXRoKGp3dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoJ2dwb2F1dGhKV1QnLCBqd3QpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKVxuICB9O1xuXG4gIC8qKlxuICAgKiBQdXJnZSB0aGUgSldUIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBhdXRob3JpemF0aW9uIGhlYWRlcnMuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZUF1dGgoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICAgIC8vIFNlbmQgbnVsbCB1c2VyIGFzIHdlbGwgKGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5KVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlclNpZ25PdXRcIilcbiAgfTtcbn1cblxuXG5leHBvcnQgY29uc3QgRGVmYXVsdEF1dGhDb25mOiBBdXRoQ29uZmlnID0ge1xuICBBVVRIX1RZUEU6ICdncmFudCcsXG4gIEFQUF9CQVNFX1VSTDogJycsIC8vIGFic29sdXRlIHBhdGggLy8gdXNlIC4gZm9yIHJlbGF0aXZlIHBhdGhcbiAgQUxMT1dfSUZSQU1FX0xPR0lOOiB0cnVlLFxuICBGT1JDRV9MT0dJTjogZmFsc2UsXG4gIEFMTE9XX0RFVl9FRElUUzogZmFsc2UsXG4gIEFMTE9XX1NTT19MT0dJTjogdHJ1ZVxufVxuIl19