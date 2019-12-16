(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios')) :
    typeof define === 'function' && define.amd ? define('@geoplatform/oauth-ng', ['exports', 'axios'], factory) :
    (global = global || self, factory((global.geoplatform = global.geoplatform || {}, global.geoplatform['oauth-ng'] = {}), global.axios));
}(this, (function (exports, axios) { 'use strict';

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * Convience class representing a simplified user.
     *
     * GeoPlatformUser
     */
    var GeoPlatformUser = /** @class */ (function () {
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
        GeoPlatformUser.prototype.toJSON = function () {
            return JSON.parse(JSON.stringify(Object.assign({}, this)));
        };
        ;
        GeoPlatformUser.prototype.clone = function () {
            return Object.assign({}, this);
        };
        ;
        GeoPlatformUser.prototype.compare = function (arg) {
            if (arg instanceof GeoPlatformUser) {
                return this.id === arg.id;
            }
            else if (typeof (arg) === 'object') {
                return typeof (arg.id) !== 'undefined' &&
                    arg.id === this.id;
            }
            return false;
        };
        ;
        GeoPlatformUser.prototype.isAuthorized = function (role) {
            return this.groups &&
                !!this.groups
                    .map(function (g) { return g.name; })
                    .filter(function (n) { return n === role; })
                    .length;
        };
        ;
        return GeoPlatformUser;
    }());

    var ACCESS_TOKEN_COOKIE = 'gpoauth-a';
    function getJson(url, jwt) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, err_1;
            return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var self, script, jwt, user;
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var err_2;
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var JWT, _a;
                return __generator(this, function (_b) {
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
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var jwt, freshJwt, _a;
                var _this = this;
                return __generator(this, function (_b) {
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
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
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
    var DefaultAuthConf = {
        AUTH_TYPE: 'grant',
        APP_BASE_URL: '',
        ALLOW_IFRAME_LOGIN: true,
        FORCE_LOGIN: false,
        ALLOW_DEV_EDITS: false
    };

    exports.AuthService = AuthService;
    exports.DefaultAuthConf = DefaultAuthConf;
    exports.GeoPlatformUser = GeoPlatformUser;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=geoplatform-oauth-ng.umd.js.map
