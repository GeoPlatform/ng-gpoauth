import * as tslib_1 from "tslib";
import { GeoPlatformUser } from './GeoPlatformUser';
import axios from 'axios';
var ACCESS_TOKEN_COOKIE = 'gpoauth-a';
function getJson(url, jwt) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var resp, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get(url, {
                            headers: { 'Authorization': jwt ? "Bearer " + jwt : '' },
                            responseType: 'json'
                        })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, {
                            error: "Error fetching data",
                            msg: err_1,
                            url: url,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Authentication Service
 */
var AuthService = /** @class */ (function () {
    /**
     *
     * AuthService
     *
     * @param config
     * @param
     */
    function AuthService(config, ngMessenger) {
        var _this = this;
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
    AuthService.prototype.getMessenger = function () {
        return this.messenger;
    };
    /**
     * Retrieve and decode value from localstorage
     *
     * @param key
     */
    AuthService.prototype.getFromLocalStorage = function (key) {
        var raw = localStorage.getItem(key);
        try {
            return raw ?
                atob(raw) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
            return undefined;
        }
    };
    ;
    /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * @method init
     */
    AuthService.prototype.init = function () {
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
     */
    AuthService.prototype.checkForLocalToken = function () {
        var jwt = this.getJWT();
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
     */
    AuthService.prototype.removeTokenFromUrl = function () {
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
     * @method createIframe
     * @returns HTMLIFrameElement
     */
    AuthService.prototype.createIframe = function (url) {
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
    AuthService.prototype.login = function (path) {
        // Check implicit we need to actually redirect them
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
    AuthService.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getJson(this.config.APP_BASE_URL + "/revoke", this.getJWT())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log("Error logging out: " + err_2);
                        return [3 /*break*/, 3];
                    case 3:
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
    AuthService.prototype.forceLogin = function () {
        this.login();
    };
    ;
    /**
     * Get protected user profile
     */
    AuthService.prototype.getOauthProfile = function () {
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
    AuthService.prototype.getUserFromJWT = function (jwt) {
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
    AuthService.prototype.getUserSync = function () {
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
    AuthService.prototype.getUser = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.check()];
                    case 1:
                        user = _a.sent();
                        if (user)
                            return [2 /*return*/, user
                                // Case 1 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: true
                            ];
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
    AuthService.prototype.check = function () {
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
    AuthService.prototype.checkWithClient = function () {
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
    AuthService.prototype.getJWTFromUrl = function () {
        var queryString = (window && window.location && window.location.hash) ?
            window.location.hash :
            window.location.toString();
        var res = queryString.match(/access_token=([^\&]*)/);
        return res && res[1];
    };
    ;
    /**
     * Is RPM library loaded already?
     */
    AuthService.prototype.RPMLoaded = function () {
        return typeof window.RPMService != 'undefined';
    };
    /**
     * Get an associated array of cookies.
     */
    AuthService.prototype.getCookieObject = function () {
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
     * @param key
     */
    AuthService.prototype.getFromCookie = function (key) {
        var raw = this.getCookieObject()[key];
        try {
            return raw ?
                atob(decodeURIComponent(raw)) :
                undefined;
        }
        catch (e) { // Catch bad encoding or formally not encoded
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
    AuthService.prototype.getJWTfromLocalStorage = function () {
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
    AuthService.prototype.getJWT = function () {
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
    AuthService.prototype.isExpired = function (jwt) {
        var parsedJWT = this.parseJwt(jwt);
        if (parsedJWT) {
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
    AuthService.prototype.isImplicitJWT = function (jwt) {
        var parsedJWT = this.parseJwt(jwt);
        return parsedJWT && parsedJWT.implicit;
    };
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param token - Access Token (JWT)
     * @return the parsed payload in the JWT
     */
    AuthService.prototype.parseJwt = function (token) {
        var parsed;
        if (token) {
            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                parsed = JSON.parse(atob(base64));
            }
            catch (e) { /* Don't throw parse error */ }
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
    AuthService.prototype.validateJwt = function (token) {
        var parsed = this.parseJwt(token);
        var valid = (parsed && parsed.exp && parsed.exp * 1000 > Date.now()) ? true : false;
        return valid;
    };
    ;
    return AuthService;
}());
export { AuthService };
export var DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    APP_BASE_URL: '',
    ALLOW_IFRAME_LOGIN: true,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BnZW9wbGF0Zm9ybS9vYXV0aC1uZy8iLCJzb3VyY2VzIjpbImF1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNuRCxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUE7QUFHekIsSUFBTSxtQkFBbUIsR0FBSSxXQUFXLENBQUE7QUFFeEMsU0FBZSxPQUFPLENBQUMsR0FBVyxFQUFFLEdBQVk7Ozs7Ozs7b0JBRS9CLHFCQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFOzRCQUNaLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVUsR0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7NEJBQ3pELFlBQVksRUFBRSxNQUFNO3lCQUNyQixDQUFDLEVBQUE7O29CQUhoQixJQUFJLEdBQUcsU0FHUztvQkFDdEIsc0JBQU8sSUFBSSxDQUFDLElBQUksRUFBQzs7O29CQUVqQixzQkFBTzs0QkFDTCxLQUFLLEVBQUUscUJBQXFCOzRCQUM1QixHQUFHLEVBQUUsS0FBRzs0QkFDUixHQUFHLEtBQUE7eUJBQ0osRUFBQTs7Ozs7Q0FFSjtBQUdEOztHQUVHO0FBQ0g7SUFNRTs7Ozs7O09BTUc7SUFDSCxxQkFBWSxNQUFrQixFQUFFLFdBQXNCO1FBQXRELGlCQW9CQztRQW5CQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7UUFFNUIsZ0RBQWdEO1FBQ2hELGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEtBQVU7WUFDckMsNEJBQTRCO1lBQzVCLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSywwQkFBMEIsRUFBQztnQkFDM0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFB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Q0gsaUNBQVcsR0FBWCxVQUFZLEtBQWE7UUFDdkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNwRixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFBQSxDQUFDO0lBQ0osa0JBQUM7QUFBRCxDQUFDLEFBamZELElBaWZDOztBQUdELE1BQU0sQ0FBQyxJQUFNLGVBQWUsR0FBZTtJQUN6QyxTQUFTLEVBQUUsT0FBTztJQUNsQixZQUFZLEVBQUUsRUFBRTtJQUNoQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciB3aW5kb3c6IGFueVxuXG5pbXBvcnQgeyBNZXNzZW5nZXIsIEF1dGhDb25maWcsIEpXVCwgVXNlclByb2ZpbGUsIFN0cmluZ09iaiB9IGZyb20gJy4vYXV0aFR5cGVzJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi9HZW9QbGF0Zm9ybVVzZXInXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cblxuY29uc3QgQUNDRVNTX1RPS0VOX0NPT0tJRSAgPSAnZ3BvYXV0aC1hJ1xuXG5hc3luYyBmdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgdHJ5e1xuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgcmV0dXJuIHJlc3AuZGF0YTtcbiAgfSBjYXRjaChlcnIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IFwiRXJyb3IgZmV0Y2hpbmcgZGF0YVwiLFxuICAgICAgbXNnOiBlcnIsXG4gICAgICB1cmwsXG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbiBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgY29uZmlnOiBBdXRoQ29uZmlnXG4gIG1lc3NlbmdlcjogTWVzc2VuZ2VyXG4gIHByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrOiBib29sZWFuXG5cbiAgLyoqXG4gICAqXG4gICAqIEF1dGhTZXJ2aWNlXG4gICAqXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBNZXNzZW5nZXIpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubWVzc2VuZ2VyID0gbmdNZXNzZW5nZXJcblxuICAgIC8vIFNldHVwIGdlbmVyYWwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgYWx3YXlzIHJ1blxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIFVzZXIgQXV0aGVudGljYXRlZFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTp1c2VyQXV0aGVudGljYXRlZCcpe1xuICAgICAgICBzZWxmLmluaXQoKSAvLyB3aWxsIGJyb2FkY2FzdCB0byBhbmd1bGFyIChzaWRlLWVmZmVjdClcbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIGxvZ291dCBldmVudFxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ3VzZXJTaWduT3V0Jyl7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGYuaW5pdCgpXG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlIG5nTWVzc2VuZ2VyIHNvIHRoYXQgYXBwbGljdGlvbiBjb2RlIGlzIGFibGUgdG9cbiAgICogc3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbnMgc2VudCBieSBuZy1ncG9hdXRoXG4gICAqL1xuICBnZXRNZXNzZW5nZXIoKTogTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbmQgZGVjb2RlIHZhbHVlIGZyb20gbG9jYWxzdG9yYWdlXG4gICAqXG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGdldEZyb21Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihyYXcpIDpcbiAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuICAgIH0gY2F0Y2ggKGUpeyAvLyBDYXRjaCBiYWQgZW5jb2Rpbmcgb3IgZm9ybWFsbHkgbm90IGVuY29kZWRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gRGVsYXkgaW5pdCB1bnRpbCBSUE1TZXJ2aWNlIGlzIGxvYWRlZFxuICAgIGlmKHRoaXMuUlBNTG9hZGVkKCkgJiYgdGhpcy5jb25maWcubG9hZFJQTSl7XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy9kbyBzdHVmZiB3aXRoIHRoZSBzY3JpcHRcbiAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgIH07XG4gICAgICBzY3JpcHQuc3JjID0gYGh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9nZW9wbGF0Zm9ybS1jZG4vZ3AucnBtLyR7dGhpcy5jb25maWcuUlBNVmVyc2lvbiB8fCAnc3RhYmxlJ30vanMvZ3AucnBtLmJyb3dzZXIuanNgO1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICByZXR1cm4gLy8gc2tpcCBpbml0KCkgdGlsbCBSUE0gaXMgbG9hZGVkXG4gICAgfVxuXG5cbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy9jbGVhbiBob3N0dXJsIG9uIHJlZGlyZWN0IGZyb20gb2F1dGhcbiAgICBpZiAodGhpcy5nZXRKV1RGcm9tVXJsKCkpIHtcbiAgICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LipcXCZ0b2tlbl90eXBlPUJlYXJlci8sICcnKSApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXR1cCBhY3RpdmUgc2Vzc2lvbiBjaGVjaGVyXG4gICAgdGhpcy5wcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjayA9ICEhand0XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4geyBzZWxmLmNoZWNrRm9yTG9jYWxUb2tlbigpIH0sIHRoaXMuY29uZmlnLnRva2VuQ2hlY2tJbnRlcnZhbClcblxuICAgIGNvbnN0IHVzZXIgPSB0aGlzLmdldFVzZXJGcm9tSldUKGp3dClcbiAgICBpZih1c2VyKVxuICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdXNlcilcblxuICAgIHJldHVybiB1c2VyXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciB0aGUgcHJlc2VuY2Ugb2YgdG9rZW4gaW4gY29va2llLiBJZiB0aGVyZSBoYXMgYmVlbiBhXG4gICAqIGNoYW5nZSAoY29va2llIGFwcGVhcnMgb3IgZGlzYXBlYXJzKSB0aGUgZmlyZSBldmVudCBoYW5kbGVycyB0b1xuICAgKiBub3RpZnkgdGhlIGFwcGxpY3Rpb24gb2YgdGhlIGV2ZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBjaGVja0ZvckxvY2FsVG9rZW4oKXtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpXG4gICAgY29uc3QgdG9rZW5QcmVzZW50ID0gISFqd3RcbiAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY2hlY2tcbiAgICBpZiAodG9rZW5QcmVzZW50ICE9PSB0aGlzLnByZXZlaW91c1Rva2VuUHJlc2VudENoZWNrKVxuICAgICAgdG9rZW5QcmVzZW50ID9cbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpO1xuXG4gICAgLy8gdXBkYXRlIHByZXZpb3VzIHN0YXRlIGZvciBuZXh0IGNoZWNrXG4gICAgdGhpcy5wcmV2ZWlvdXNUb2tlblByZXNlbnRDaGVjayA9IHRva2VuUHJlc2VudFxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgYWNjZXNzX3Rva2VuIHByb3BlcnR5IGZyb20gdGhlIFVSTC5cbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlVG9rZW5Gcm9tVXJsKCk6IHZvaWQge1xuICAgIGNvbnN0IHJlcGxhY2VSZWdleCA9IC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKihcXCZ0b2tlbl90eXBlPUJlYXJlcik/L1xuICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJykgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UocmVwbGFjZVJlZ2V4LCAnJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGludmlzYWJsZSBpZnJhbWUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBjcmVhdGVJZnJhbWVcbiAgICogQHJldHVybnMgSFRNTElGcmFtZUVsZW1lbnRcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbihwYXRoPzogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gQ2hlY2sgaW1wbGljaXQgd2UgbmVlZCB0byBhY3R1YWxseSByZWRpcmVjdCB0aGVtXG4gICAgY29uc3QgbG9jID0gcGF0aCA/XG4gICAgICAgICAgICAgICAgYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0ke3BhdGh9YCA6XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuQ0FMTEJBQ0sgP1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5DQUxMQkFDSyA6XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmIC8vIGRlZmF1bHRcblxuICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJykge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkwgK1xuICAgICAgICAgICAgICBgL2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0ke3RoaXMuY29uZmlnLkFQUF9JRH1gICtcbiAgICAgICAgICAgICAgYCZyZXNwb25zZV90eXBlPSR7dGhpcy5jb25maWcuQVVUSF9UWVBFfWAgK1xuICAgICAgICAgICAgICBgJnJlZGlyZWN0X3VyaT0ke2VuY29kZVVSSUNvbXBvbmVudChsb2MgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCdhdXRoOnJlcXVpcmVMb2dpbicpXG5cbiAgICAgIC8vIFJlZGlyZWN0IGxvZ2luXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR0lOX1VSTFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgYC9sb2dpbj9yZWRpcmVjdF91cmw9JHtlbmNvZGVVUklDb21wb25lbnQobG9jKX1gXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBiYWNrZ3JvdW5kIGxvZ291dCBhbmQgcmVxdWVzdHMgand0IHJldm9rYXRpb25cbiAgICovXG4gIGFzeW5jIGxvZ291dCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L3Jldm9rZWAsIHRoaXMuZ2V0SldUKCkpXG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgY29uc29sZS5sb2coYEVycm9yIGxvZ2dpbmcgb3V0OiAke2Vycn1gKVxuICAgIH1cbiAgICBpZih0aGlzLmNvbmZpZy5MT0dPVVRfVVJMKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR09VVF9VUkxcbiAgICBpZih0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTikgdGhpcy5mb3JjZUxvZ2luKCk7XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9uYWwgZm9yY2UgcmVkaXJlY3QgZm9yIG5vbi1wdWJsaWMgc2VydmljZXNcbiAgICovXG4gIGZvcmNlTG9naW4oKSB7XG4gICAgdGhpcy5sb2dpbigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvdGVjdGVkIHVzZXIgcHJvZmlsZVxuICAgKi9cbiAgYXN5bmMgZ2V0T2F1dGhQcm9maWxlKCk6IFByb21pc2U8VXNlclByb2ZpbGU+IHtcbiAgICBjb25zdCBKV1QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgcmV0dXJuIEpXVCA/XG4gICAgICBhd2FpdCBnZXRKc29uKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXBpL3Byb2ZpbGVgLCBKV1QpIDpcbiAgICAgIG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCBVc2VyIG9iamVjdCBmcm9tIHRoZSBKV1QuXG4gICAqXG4gICAqIElmIG5vIEpXVCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGxvb2tlZCBmb3IgYXQgdGhlIG5vcm1hbCBKV1RcbiAgICogbG9jYXRpb25zIChsb2NhbFN0b3JhZ2Ugb3IgVVJMIHF1ZXJ5U3RyaW5nKS5cbiAgICpcbiAgICogQHBhcmFtIFtqd3RdIC0gdGhlIEpXVCB0byBleHRyYWN0IHVzZXIgZnJvbS5cbiAgICovXG4gIGdldFVzZXJGcm9tSldUKGp3dDogc3RyaW5nKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCB1c2VyID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHVzZXIgP1xuICAgICAgICAgICAgbmV3IEdlb1BsYXRmb3JtVXNlcihPYmplY3QuYXNzaWduKHt9LCB1c2VyLCB7IGlkOiB1c2VyLnN1YiB9KSkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyIGlzIHNwZWNpZmllZCwgdGhpcyBtZXRob2RcbiAgICogd2lsbCByZXR1cm4gdW5kZWZpbmVkLiBPdGhlcndpc2UsIGl0IHJldHVybnMgdGhlIHVzZXIgKG9yIG51bGwpLlxuICAgKlxuICAgKiBTaWRlIEVmZmVjdHM6XG4gICAqICAtIFdpbGwgcmVkaXJlY3QgdXNlcnMgaWYgbm8gdmFsaWQgSldUIHdhcyBmb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2sgb3B0aW9uYWwgZnVuY3Rpb24gdG8gaW52b2tlIHdpdGggdGhlIHVzZXJcbiAgICogQHJldHVybiBvYmplY3QgcmVwcmVzZW50aW5nIGN1cnJlbnQgdXNlclxuICAgKi9cbiAgZ2V0VXNlclN5bmMoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCByZWNpZXZlIGEgbmV3IHRva2VuIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgIC8vIG1ha2luZyBhIGNhbGwgdG8gdGhlIGNsaWVudChhcHBsaWNhdGlvbilcbiAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dfSUZSQU1FX0xPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dfSUZSQU1FX0xPR0lOKVxuICAgKlxuICAgKiBDYXNlczpcbiAgICogMS4gRGVsYXkgcmVzb2x2ZSBmdW5jdGlvbiB0aWxsIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAqIDIuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKiAzLiBGb3JjZSB0aGUgcmVkaXJlY3RcbiAgICogNC4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqXG4gICAqIE5PVEU6XG4gICAqIENhc2UgMSBhYm92ZSB3aWxsIGNhdXNlIHRoaXMgbWV0aG9kJ3MgcHJvbWlzZSB0byBiZSBhIGxvbmcgc3RhbGxcbiAgICogdW50aWwgdGhlIHVzZXIgY29tcGxldGVzIHRoZSBsb2dpbiBwcm9jZXNzLiBUaGlzIHNob3VsZCBhbGxvdyB0aGVcbiAgICogYXBwIHRvIGZvcmdvIGEgcmVsb2FkIGlzIGl0IHNob3VsZCBoYXZlIHdhaXRlZCB0aWxsIHRoZSBlbnRpcmVcbiAgICogdGltZSB0aWxsIHRoZSB1c2VyIHdhcyBzdWNjZXNzZnVsbHkgbG9nZ2VkIGluLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldFVzZXJcbiAgICpcbiAgICogQHJldHVybnMgVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgcmVzb2x2ZWQgdmlhIFByb21pc2VcbiAgICovXG4gIGFzeW5jIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+IHtcbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgLy8gcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLmNoZWNrKCk7XG4gICAgaWYodXNlcikgcmV0dXJuIHVzZXJcblxuICAgIC8vIENhc2UgMSAtIEFMTE9XX0lGUkFNRV9MT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgaWYodGhpcy5jb25maWcuQUxMT1dfSUZSQU1FX0xPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIC8vIFJlc29sdmUgd2l0aCB1c2VyIG9uY2UgdGhleSBoYXZlIGxvZ2dlZCBpblxuICAgICAgdGhpcy5tZXNzZW5nZXIub24oJ3VzZXJBdXRoZW50aWNhdGVkJywgKGV2ZW50OiBFdmVudCwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBDYXNlIDIgLSBBTExPV19JRlJBTUVfTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICBpZih0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIC8vIENhc2UgMyAtIEFMTE9XX0lGUkFNRV9MT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogdHJ1ZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgLy8gQ2FzZSA0IC0gQUxMT1dfSUZSQU1FX0xPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiBmYWxzZVxuICAgIGlmKCF0aGlzLmNvbmZpZy5BTExPV19JRlJBTUVfTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgIHJldHVybiBudWxsIC8vIG9yIHJlamVjdD9cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGZ1bmN0aW9uIGJlaW5nIHVzZWQgYnkgc29tZSBmcm9udCBlbmQgYXBwcyBhbHJlYWR5LlxuICAgKiAod3JhcHBlciBmb3IgZ2V0VXNlcilcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJucyBVc2VyIG9yIG51bGxcbiAgICovXG4gIGFzeW5jIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgaWYoIWp3dCkge1xuICAgICAgY29uc3QgZnJlc2hKd3QgPSBhd2FpdCB0aGlzLmNoZWNrV2l0aENsaWVudCgpO1xuXG4gICAgICByZXR1cm4gand0ICYmIGp3dC5sZW5ndGggP1xuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGZyZXNoSnd0KSA6XG4gICAgICAgICAgICAgIG51bGw7XG4gICAgfVxuICAgIGlmKCF0aGlzLmlzSW1wbGljaXRKV1Qoand0KSl7IC8vIEdyYW50IHRva2VuXG4gICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuY2hlY2tXaXRoQ2xpZW50KCkgLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiBqd3QgJiYgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcblxuICAgIH0gZWxzZSB7IC8vIEltcGxpY2l0IEpXVFxuICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdChudWxsKSA6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjYWxsIHRvIGEgc2VydmljZSBob3N0aW5nIG5vZGUtZ3BvYXV0aCB0byBhbGxvdyBmb3IgYVxuICAgKiB0b2tlbiByZWZyZXNoIG9uIGFuIGV4cGlyZWQgdG9rZW4sIG9yIGEgdG9rZW4gdGhhdCBoYXMgYmVlblxuICAgKiBpbnZhbGlkYXRlZCB0byBiZSByZXZva2VkLlxuICAgKlxuICAgKiBOb3RlOiBDbGllbnQgYXMgaW4gaG9zdGluZyBhcHBsaWNhdGlvbjpcbiAgICogICAgaHR0cHM6Ly93d3cuZGlnaXRhbG9jZWFuLmNvbS9jb21tdW5pdHkvdHV0b3JpYWxzL2FuLWludHJvZHVjdGlvbi10by1vYXV0aC0yXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tXaXRoQ2xpZW50XG4gICAqIEBwYXJhbSBqd3QgLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIFByb21pc2U8and0PlxuICAgKi9cbiAgYXN5bmMgY2hlY2tXaXRoQ2xpZW50KCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJyA/XG4gICAgICAgICAgICAgICAgbnVsbCA6XG4gICAgICAgICAgICAgICAgYXhpb3MoYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9jaGVja3Rva2VuYClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5nZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCkpXG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW4gKHJhdyBzdHJpbmcpXG4gICAqL1xuICBnZXRKV1RGcm9tVXJsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSAod2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuICAgIGNvbnN0IHJlcyA9IHF1ZXJ5U3RyaW5nLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteXFwmXSopLyk7XG4gICAgcmV0dXJuIHJlcyAmJiByZXNbMV07XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIFJQTSBsaWJyYXJ5IGxvYWRlZCBhbHJlYWR5P1xuICAgKi9cbiAgUlBNTG9hZGVkKCk6ICBib29sZWFuIHtcbiAgIHJldHVybiB0eXBlb2Ygd2luZG93LlJQTVNlcnZpY2UgIT0gJ3VuZGVmaW5lZCdcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXNzb2NpYXRlZCBhcnJheSBvZiBjb29raWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDb29raWVPYmplY3QoKTogU3RyaW5nT2JqICB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiBjLnRyaW0oKS5zcGxpdCgnPScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhY2M6IFN0cmluZ09iaiwgcGFpcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY1twYWlyWzBdXSA9IHBhaXJbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KVxuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYW5kIGRlY29kZSBmcm9tIGNvb2tpZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBwcml2YXRlIGdldEZyb21Db29raWUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCByYXcgPSB0aGlzLmdldENvb2tpZU9iamVjdCgpW2tleV1cbiAgICB0cnl7XG4gICAgICByZXR1cm4gcmF3ID9cbiAgICAgICAgICAgICAgYXRvYihkZWNvZGVVUklDb21wb25lbnQocmF3KSkgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIEpXVCBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlXG4gICAqXG4gICAqIEByZXR1cm4gSldUIFRva2VuXG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUNvb2tpZShBQ0NFU1NfVE9LRU5fQ09PS0lFKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiBKV1QgVG9rZW5cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIEJvb2xlYW5cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xufVxuXG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0QXV0aENvbmY6IEF1dGhDb25maWcgPSB7XG4gIEFVVEhfVFlQRTogJ2dyYW50JyxcbiAgQVBQX0JBU0VfVVJMOiAnJywgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxuICBBTExPV19JRlJBTUVfTE9HSU46IHRydWUsXG4gIEZPUkNFX0xPR0lOOiBmYWxzZSxcbiAgQUxMT1dfREVWX0VESVRTOiBmYWxzZVxufVxuIl19