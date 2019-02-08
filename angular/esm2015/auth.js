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
        headers: { 'Authorization': jwt ? `Bearer ${jwt}` : '' },
        responseType: 'json'
    })
        .then(r => r.data);
}
/**
 * Authentication Service
 */
export class AuthService {
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
if (false) {
    /** @type {?} */
    AuthService.prototype.config;
    /** @type {?} */
    AuthService.prototype.messenger;
}
/** @type {?} */
export const DefaultAuthConf = {
    AUTH_TYPE: 'grant',
    ALLOWIFRAMELOGIN: false,
    FORCE_LOGIN: false,
    ALLOW_DEV_EDITS: false,
    APP_BASE_URL: '' // absolute path // use . for relative path
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJhdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBOzs7Ozs7QUFFekIsaUJBQWlCLEdBQVcsRUFBRSxHQUFZO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7UUFDRSxPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDekQsWUFBWSxFQUFFLE1BQU07S0FDckIsQ0FBQztTQUNELElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUMxQzs7OztBQUtELE1BQU07Ozs7Ozs7SUFhSixZQUFZLE1BQWtCLEVBQUUsV0FBd0I7O1FBQ3RELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQTs7UUFHNUIsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUU7O1lBRXpDLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSywwQkFBMEIsRUFBQztnQkFDM0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO2FBQ1o7O1lBR0QsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBQztnQkFDOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFBOztRQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUN4QixJQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FB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QyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7O0lBQ3hDLENBQUM7Q0FDSDs7Ozs7Ozs7QUFHRCxhQUFhLGVBQWUsR0FBZTtJQUN6QyxTQUFTLEVBQUUsT0FBTztJQUNsQixnQkFBZ0IsRUFBRSxLQUFLO0lBQ3ZCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLFlBQVksRUFBRSxFQUFFO0NBQ2pCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgSldULCBVc2VyUHJvZmlsZSB9IGZyb20gJy4uL3NyYy9hdXRoVHlwZXMnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlcidcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblxuZnVuY3Rpb24gZ2V0SnNvbih1cmw6IHN0cmluZywgand0Pzogc3RyaW5nKSB7XG4gIHJldHVybiBheGlvcy5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nIDogand0ID8gYEJlYXJlciAke2p3dH1gIDogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyID0+IHIuZGF0YSk7XG59XG5cbi8qKlxuICogQXV0aGVudGljYXRpb24gU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIGNvbmZpZzogQXV0aENvbmZpZ1xuICBtZXNzZW5nZXI6IG5nTWVzc2VuZ2VyXG5cbiAgLyoqXG4gICAqXG4gICAqIEBjbGFzcyBBdXRoU2VydmljZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtBdXRoQ29uZmlnfSBjb25maWdcbiAgICogQHBhcmFtXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IEF1dGhDb25maWcsIG5nTWVzc2VuZ2VyOiBuZ01lc3Nlbmdlcil7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5tZXNzZW5nZXIgPSBuZ01lc3NlbmdlclxuXG4gICAgLy8gU2V0dXAgZ2VuZXJhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCBhbHdheXMgcnVuXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIHNlbGYuaW5pdCgpIC8vIHdpbGwgYnJvYWRjYXN0IHRvIGFuZ3VsYXIgKHNpZGUtZWZmZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgbG9nb3V0IGV2ZW50XG4gICAgICBpZihldmVudC5kYXRhID09PSAndXNlclNpZ25PdXQnKXtcbiAgICAgICAgc2VsZi5yZW1vdmVBdXRoKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgdXNlciA9IHNlbGYuaW5pdCgpXG4gICAgaWYoIXVzZXIgJiYgdGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAnZ3JhbnQnKSBzZWxmLnNzb0NoZWNrKClcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgbmdNZXNzZW5nZXIgc28gdGhhdCBhcHBsaWN0aW9uIGNvZGUgaXMgYWJsZSB0b1xuICAgKiBzdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9ucyBzZW50IGJ5IG5nLWdwb2F1dGhcbiAgICovXG4gIGdldE1lc3NlbmdlcigpOiBuZ01lc3NlbmdlciB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2VuZ2VyXG4gIH1cblxuICAvKipcbiAgICogU2VjdXJpdHkgd3JhcHBlciBmb3Igb2JmdXNjYXRpbmcgdmFsdWVzIHBhc3NlZCBpbnRvIGxvY2FsIHN0b3JhZ2VcbiAgICovXG4gIHByaXZhdGUgc2F2ZVRvTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBidG9hKHZhbHVlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuZCBkZWNvZGUgdmFsdWUgZnJvbSBsb2NhbHN0b3JhZ2VcbiAgICpcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgZ2V0RnJvbUxvY2FsU3RvcmFnZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgIHRyeXtcbiAgICAgIHJldHVybiByYXcgP1xuICAgICAgICAgICAgICBhdG9iKHJhdykgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgfSBjYXRjaCAoZSl7IC8vIENhdGNoIGJhZCBlbmNvZGluZyBvciBmb3JtYWxseSBub3QgZW5jb2RlZFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBzc29DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBzc29VUkwgPSBgL2xvZ2luP3Nzbz10cnVlJmNhY2hlYnVzdGVyPSR7KG5ldyBEYXRlKCkpLmdldFRpbWUoKX1gXG4gICAgY29uc3Qgc3NvSWZyYW1lID0gdGhpcy5jcmVhdGVJZnJhbWUoc3NvVVJMKVxuXG4gICAgLy8gU2V0dXAgc3NvSWZyYW1lIHNwZWNpZmljIGhhbmRsZXJzXG4gICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAvLyBIYW5kbGUgU1NPIGxvZ2luIGZhaWx1cmVcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgICAvLyBGb3JjZSBsb2dpbiBvbmx5IGFmdGVyIFNTTyBoYXMgZmFpbGVkXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKSBzZWxmLmZvcmNlTG9naW4oKVxuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgVXNlciBBdXRoZW50aWNhdGVkXG4gICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnVzZXJBdXRoZW50aWNhdGVkJyl7XG4gICAgICAgIGlmKHNzb0lmcmFtZSAmJiBzc29JZnJhbWUucmVtb3ZlKSAvLyBJRSAxMSAtIGdvdGNoYVxuICAgICAgICAgIHNzb0lmcmFtZS5yZW1vdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV2Uga2VlcCB0aGlzIG91dHNpZGUgdGhlIGNvbnN0cnVjdG9yIHNvIHRoYXQgb3RoZXIgc2VydmljZXMgY2FsbFxuICAgKiBjYWxsIGl0IHRvIHRyaWdnZXIgdGhlIHNpZGUtZWZmZWN0cy5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBwcml2YXRlIGluaXQoKTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIGlmKGp3dCkgdGhpcy5zZXRBdXRoKGp3dClcblxuICAgIC8vY2xlYW4gaG9zdHVybCBvbiByZWRpcmVjdCBmcm9tIG9hdXRoXG4gICAgaWYgKHRoaXMuZ2V0SldURnJvbVVybCgpKSB7XG4gICAgICBpZih3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUpe1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgJ1JlbW92ZSB0b2tlbiBmcm9tIFVSTCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJykgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKC9bXFw/XFwmXWFjY2Vzc190b2tlbj0uKlxcJnRva2VuX3R5cGU9QmVhcmVyLywgJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBpbnZpc2FibGUgaWZyYW1lIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBib3R0b20gb2YgdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY3JlYXRlSWZyYW1lXG4gICAqIEByZXR1cm5zIHtIVE1MSUZyYW1lRWxlbWVudH1cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSWZyYW1lKHVybDogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQge1xuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuXG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBpZnJhbWUuc3JjID0gdXJsXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgcmV0dXJuIGlmcmFtZVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRpcmVjdHMgb3IgZGlzcGxheXMgbG9naW4gd2luZG93IHRoZSBwYWdlIHRvIHRoZSBsb2dpbiBzaXRlXG4gICAqL1xuICBsb2dpbigpIHtcbiAgICAvLyBDaGVjayBpbXBsaWNpdCB3ZSBuZWVkIHRvIGFjdHVhbGx5IHJlZGlyZWN0IHRoZW1cbiAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuSURQX0JBU0VfVVJMICtcbiAgICAgICAgICAgICAgYC9hdXRoL2F1dGhvcml6ZT9jbGllbnRfaWQ9JHt0aGlzLmNvbmZpZy5BUFBfSUR9YCArXG4gICAgICAgICAgICAgIGAmcmVzcG9uc2VfdHlwZT0ke3RoaXMuY29uZmlnLkFVVEhfVFlQRX1gICtcbiAgICAgICAgICAgICAgYCZyZWRpcmVjdF91cmk9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jb25maWcuQ0FMTEJBQ0sgfHwgJy9sb2dpbicpfWBcblxuICAgIC8vIE90aGVyd2lzZSBwb3AgdXAgdGhlIGxvZ2luIG1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmcmFtZSBsb2dpblxuICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTil7XG4gICAgICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgnYXV0aDpyZXF1aXJlTG9naW4nKVxuXG4gICAgICAgIC8vIFJlZGlyZWN0IGxvZ2luXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR0lOX1VSTFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgYC9sb2dpbj9yZWRpcmVjdF91cmw9JHtlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhyZWYpfWBcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGJhY2tncm91bmQgbG9nb3V0IGFuZCByZXF1ZXN0cyBqd3QgcmV2b2thdGlvblxuICAgKi9cbiAgbG9nb3V0KCk6IFByb21pc2U8dm9pZD57XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB0byBtYW51YWxseSBjYWxsIHRoZSBsb2dvdXQgYW5kIHJlbW92ZSBncG9hdXRoIGNvb2tpZVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNzU4MjA3L3doeS1pcy1wYXNzcG9ydGpzLWluLW5vZGUtbm90LXJlbW92aW5nLXNlc3Npb24tb24tbG9nb3V0I2Fuc3dlci0zMzc4Njg5OVxuICAgIC8vIHRoaXMuY3JlYXRlSWZyYW1lKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXV0aC9sb2dvdXRgKVxuXG4gICAgLy8gU2F2ZSBKV1QgdG8gc2VuZCB3aXRoIGZpbmFsIHJlcXVlc3QgdG8gcmV2b2tlIGl0XG4gICAgc2VsZi5yZW1vdmVBdXRoKCkgLy8gcHVyZ2UgdGhlIEpXVFxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb25maWcuTE9HT1VUX1VSTCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5MT0dPVVRfVVJMXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvZ2dpbmcgb3V0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9KTtcbiAgICB9KVxuXG4gIH07XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIGZvcmNlIHJlZGlyZWN0IGZvciBub24tcHVibGljIHNlcnZpY2VzXG4gICAqL1xuICBmb3JjZUxvZ2luKCkge1xuICAgIHRoaXMubG9naW4oKTtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHByb3RlY3RlZCB1c2VyIHByb2ZpbGVcbiAgICovXG4gIGdldE9hdXRoUHJvZmlsZSgpOiBQcm9taXNlPFVzZXJQcm9maWxlPiB7XG4gICAgY29uc3QgSldUID0gdGhpcy5nZXRKV1QoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxVc2VyUHJvZmlsZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy9jaGVjayB0byBtYWtlIHN1cmUgd2UgY2FuIG1ha2UgY2FsbGVkXG4gICAgICBpZiAoSldUKSB7XG4gICAgICAgIGdldEpzb24oYCR7dGhpcy5jb25maWcuSURQX0JBU0VfVVJMfS9hcGkvcHJvZmlsZWAsIEpXVClcbiAgICAgICAgICAudGhlbigocmVzcG9uc2U6IFVzZXJQcm9maWxlKSA9PiAgcmVzb2x2ZShyZXNwb25zZSkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChudWxsKVxuICAgICAgfVxuXG4gICAgfSlcbiAgfTtcblxuICAvKipcbiAgICogR2V0IFVzZXIgb2JqZWN0IGZyb20gdGhlIEpXVC5cbiAgICpcbiAgICogSWYgbm8gSldUIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgbG9va2VkIGZvciBhdCB0aGUgbm9ybWFsIEpXVFxuICAgKiBsb2NhdGlvbnMgKGxvY2FsU3RvcmFnZSBvciBVUkwgcXVlcnlTdHJpbmcpLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gW2p3dF0gLSB0aGUgSldUIHRvIGV4dHJhY3QgdXNlciBmcm9tLlxuICAgKi9cbiAgZ2V0VXNlckZyb21KV1Qoand0OiBzdHJpbmcpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IHVzZXIgPSB0aGlzLnBhcnNlSnd0KGp3dClcbiAgICByZXR1cm4gdXNlciA/XG4gICAgICAgICAgICBuZXcgR2VvUGxhdGZvcm1Vc2VyKE9iamVjdC5hc3NpZ24oe30sIHVzZXIsIHsgaWQ6IHVzZXIuc3ViIH0pKSA6XG4gICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgKiB3aWxsIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSwgaXQgcmV0dXJucyB0aGUgdXNlciAob3IgbnVsbCkuXG4gICAqXG4gICAqIFNpZGUgRWZmZWN0czpcbiAgICogIC0gV2lsbCByZWRpcmVjdCB1c2VycyBpZiBubyB2YWxpZCBKV1Qgd2FzIGZvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjYWxsYmFjayBvcHRpb25hbCBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCB0aGUgdXNlclxuICAgKiBAcmV0dXJuIG9iamVjdCByZXByZXNlbnRpbmcgY3VycmVudCB1c2VyXG4gICAqL1xuICBnZXRVc2VyU3luYyhjYWxsYmFjaz86ICh1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcbiAgICAvLyBJZiBjYWxsYmFjayBwcm92aWRlZCB3ZSBjYW4gdHJlYXQgYXN5bmMgYW5kIGNhbGwgc2VydmVyXG4gICAgaWYoY2FsbGJhY2sgJiYgdHlwZW9mKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aGlzLmNoZWNrKClcbiAgICAgIC50aGVuKHVzZXIgPT4gY2FsbGJhY2sodXNlcikpO1xuXG4gICAgICAvLyBJZiBubyBjYWxsYmFjayB3ZSBoYXZlIHRvIHByb3ZpZGUgYSBzeW5jIHJlc3BvbnNlIChubyBuZXR3b3JrKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBhbGxvdyBmcm9udCBlbmQgdG8gZ2V0IHVzZXIgZGF0YSBpZiBncmFudCB0eXBlIGFuZCBleHBpcmVkXG4gICAgICAvLyBiZWNhdXNlIHRoZXkgd2lsbCByZWNpZXZlIGEgbmV3IHRva2VuIGF1dG9tYXRpY2FsbHkgd2hlblxuICAgICAgLy8gbWFraW5nIGEgY2FsbCB0byB0aGUgY2xpZW50KGFwcGxpY2F0aW9uKVxuICAgICAgcmV0dXJuIHRoaXMuaXNJbXBsaWNpdEpXVChqd3QpICYmIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICBudWxsIDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHZlcnNpb24gb2YgZ2V0IHVzZXIuXG4gICAqXG4gICAqIEJlbG93IGlzIGEgdGFibGUgb2YgaG93IHRoaXMgZnVuY3Rpb24gaGFuZGVscyB0aGlzIG1ldGhvZCB3aXRoXG4gICAqIGRpZmZlcm50IGNvbmZpZ3VyYXRpb25zLlxuICAgKiAgLSBGT1JDRV9MT0dJTiA6IEhvcml6b250YWxcbiAgICogIC0gQUxMT1dJRlJBTUVMT0dJTiA6IFZlcnRpY2FsXG4gICAqXG4gICAqXG4gICAqIGdldFVzZXIgIHwgVCB8IEYgKEZPUkNFX0xPR0lOKVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUICAgICAgICB8IDEgfCAyXG4gICAqIEYgICAgICAgIHwgMyB8IDRcbiAgICogKEFMTE9XSUZSQU1FTE9HSU4pXG4gICAqXG4gICAqIENhc2VzOlxuICAgKiAxLiBEZWxheSByZXNvbHZlIGZ1bmN0aW9uIHRpbGwgdXNlciBpcyBsb2dnZWQgaW5cbiAgICogMi4gUmV0dXJuIG51bGwgKGlmIHVzZXIgbm90IGF1dGhvcml6ZWQpXG4gICAqIDMuIEZvcmNlIHRoZSByZWRpcmVjdFxuICAgKiA0LiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICpcbiAgICogTk9URTpcbiAgICogQ2FzZSAxIGFib3ZlIHdpbGwgY2F1c2UgdGhpcyBtZXRob2QncyBwcm9taXNlIHRvIGJlIGEgbG9uZyBzdGFsbFxuICAgKiB1bnRpbCB0aGUgdXNlciBjb21wbGV0ZXMgdGhlIGxvZ2luIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGFsbG93IHRoZVxuICAgKiBhcHAgdG8gZm9yZ28gYSByZWxvYWQgaXMgaXQgc2hvdWxkIGhhdmUgd2FpdGVkIHRpbGwgdGhlIGVudGlyZVxuICAgKiB0aW1lIHRpbGwgdGhlIHVzZXIgd2FzIHN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4uXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0VXNlclxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxVc2VyPn0gVXNlciAtIHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICovXG4gIGdldFVzZXIoKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXIgfCBudWxsPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBGb3IgYmFzaWMgdGVzdGluZ1xuICAgIC8vIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdCgndXNlckF1dGhlbnRpY2F0ZWQnLCB7IG5hbWU6ICd1c2VybmFtZSd9KVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEdlb1BsYXRmb3JtVXNlciB8IG51bGw+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY2hlY2soKVxuICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGlmKHVzZXIpIHtcbiAgICAgICAgICByZXNvbHZlKHVzZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2FzZSAxIC0gQUxMT1dJRlJBTUVMT0dJTjogdHJ1ZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdXNlciBvbmNlIHRoZXkgaGF2ZSBsb2dnZWQgaW5cbiAgICAgICAgICAgIHRoaXMubWVzc2VuZ2VyLm9uKCd1c2VyQXV0aGVudGljYXRlZCcsIChldmVudDogRXZlbnQsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHVzZXIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYXNlIDIgLSBBTExPV0lGUkFNRUxPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgICAgICAgaWYodGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiAhdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYXNlIDMgLSBBTExPV0lGUkFNRUxPR0lOOiBmYWxzZSB8IEZPUkNFX0xPR0lOOiB0cnVlXG4gICAgICAgICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XSUZSQU1FTE9HSU4gJiYgdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgICAgICAgICBpZihldmVudC5kYXRhID09PSAnaWZyYW1lOnNzb0ZhaWxlZCcpe1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5nZXRVc2VyKCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgNCAtIEFMTE9XSUZSQU1FTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IGZhbHNlXG4gICAgICAgICAgaWYoIXRoaXMuY29uZmlnLkFMTE9XSUZSQU1FTE9HSU4gJiYgIXRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCkgLy8gb3IgcmVqZWN0P1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyOiBFcnJvcikgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICB9KVxuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBmdW5jdGlvbiBiZWluZyB1c2VkIGJ5IHNvbWUgZnJvbnQgZW5kIGFwcHMgYWxyZWFkeS5cbiAgICogKHdyYXBwZXIgZm9yIGdldFVzZXIpXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tcbiAgICogQHJldHVybnMge1VzZXJ9IC0gbmctY29tbW9uIHVzZXIgb2JqZWN0IG9yIG51bGxcbiAgICovXG4gIGNoZWNrKCk6IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyPntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgY29uc3Qgand0ID0gdGhpcy5nZXRKV1QoKTtcblxuICAgICAgLy8gSWYgbm8gbG9jYWwgSldUXG4gICAgICBpZighand0KVxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja1dpdGhDbGllbnQoXCJcIilcbiAgICAgICAgICAgICAgICAgICAudGhlbihqd3QgPT4gand0Lmxlbmd0aCA/IHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSA6IG51bGwpO1xuXG4gICAgICBpZighand0KSByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIGlmKCF0aGlzLmlzSW1wbGljaXRKV1Qoand0KSl7IC8vIEdyYW50IHRva2VuXG4gICAgICAgIHJldHVybiB0aGlzLmlzRXhwaXJlZChqd3QpID9cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrV2l0aENsaWVudChqd3QpXG4gICAgICAgICAgICAgICAgICAudGhlbihqd3QgPT4gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKSA6IC8vIENoZWNrIHdpdGggc2VydmVyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSk7XG4gICAgICB9IGVsc2UgeyAvLyBJbXBsaWNpdCBKV1RcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG51bGwpIDpcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGNhbGwgdG8gYSBzZXJ2aWNlIGhvc3Rpbmcgbm9kZS1ncG9hdXRoIHRvIGFsbG93IGZvciBhXG4gICAqIHRva2VuIHJlZnJlc2ggb24gYW4gZXhwaXJlZCB0b2tlbiwgb3IgYSB0b2tlbiB0aGF0IGhhcyBiZWVuXG4gICAqIGludmFsaWRhdGVkIHRvIGJlIHJldm9rZWQuXG4gICAqXG4gICAqIE5vdGU6IENsaWVudCBhcyBpbiBob3N0aW5nIGFwcGxpY2F0aW9uOlxuICAgKiAgICBodHRwczovL3d3dy5kaWdpdGFsb2NlYW4uY29tL2NvbW11bml0eS90dXRvcmlhbHMvYW4taW50cm9kdWN0aW9uLXRvLW9hdXRoLTJcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1dpdGhDbGllbnRcbiAgICogQHBhcmFtIHtqd3R9IC0gZW5jb2RlZCBhY2Nlc3NUb2tlbi9KV1RcbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxqd3Q+fSAtIHByb21pc2UgcmVzb2x2aW5nIHdpdGggYSBKV1RcbiAgICovXG4gIGNoZWNrV2l0aENsaWVudChvcmlnaW5hbEpXVDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYodGhpcy5jb25maWcuQVVUSF9UWVBFID09PSAndG9rZW4nKXtcbiAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBheGlvcyhgJHt0aGlzLmNvbmZpZy5BUFBfQkFTRV9VUkx9L2NoZWNrdG9rZW5gLCB7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nIDogb3JpZ2luYWxKV1QgPyBgQmVhcmVyICR7b3JpZ2luYWxKV1R9YCA6ICcnLFxuICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzJzogJ0F1dGhvcml6YXRpb24sIFdXVy1BdXRob3JpemF0aW9uLCBjb250ZW50LWxlbmd0aCdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgIGNvbnN0IGhlYWRlciA9IHJlc3AuaGVhZGVyc1snYXV0aG9yaXphdGlvbiddXG4gICAgICAgICAgY29uc3QgbmV3SldUID0gaGVhZGVyICYmIGhlYWRlci5yZXBsYWNlKCdCZWFyZXIgJywnJylcbiAgICAgICAgICBpZihuZXdKV1QpIHRoaXMuc2V0QXV0aChuZXdKV1QpO1xuXG4gICAgICAgICAgcmVzb2x2ZShuZXdKV1QgPyBuZXdKV1QgOiBvcmlnaW5hbEpXVCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KGVycikpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdG9rZW4gZnJvbSBjdXJyZW50IFVSTFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVEZyb21VcmxcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nIHwgdW5kZWZpbmVkfSAtIEpXVCBUb2tlbiAocmF3IHN0cmluZylcbiAgICovXG4gIGdldEpXVEZyb21VcmwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9ICh3aW5kb3cgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgcmVzID0gcXVlcnlTdHJpbmcubWF0Y2goL2FjY2Vzc190b2tlbj0oW15cXCZdKikvKTtcbiAgICByZXR1cm4gcmVzICYmIHJlc1sxXTtcbiAgfTtcblxuICAvKipcbiAgICogTG9hZCB0aGUgSldUIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVGZyb21Mb2NhbFN0b3JhZ2VcbiAgICpcbiAgICogQHJldHVybiB7SldUIHwgdW5kZWZpbmVkfSBBbiBvYmplY3Qgd2loIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgKi9cbiAgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEZyb21Mb2NhbFN0b3JhZ2UoJ2dwb2F1dGhKV1QnKVxuICB9O1xuXG4gIC8qKlxuICAgKiBBdHRlbXB0IGFuZCBwdWxsIEpXVCBmcm9tIHRoZSBmb2xsb3dpbmcgbG9jYXRpb25zIChpbiBvcmRlcik6XG4gICAqICAtIFVSTCBxdWVyeSBwYXJhbWV0ZXIgJ2FjY2Vzc190b2tlbicgKHJldHVybmVkIGZyb20gSURQKVxuICAgKiAgLSBCcm93c2VyIGxvY2FsIHN0b3JhZ2UgKHNhdmVkIGZyb20gcHJldmlvdXMgcmVxdWVzdClcbiAgICpcbiAgICogQG1ldGhvZCBnZXRKV1RcbiAgICpcbiAgICogQHJldHVybiB7c3RpbmcgfCB1bmRlZmluZWR9XG4gICAqL1xuICBnZXRKV1QoKTogc3RyaW5nIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVEZyb21VcmwoKSB8fCB0aGlzLmdldEpXVGZyb21Mb2NhbFN0b3JhZ2UoKVxuICAgIC8vIE9ubHkgZGVueSBpbXBsaWNpdCB0b2tlbnMgdGhhdCBoYXZlIGV4cGlyZWRcbiAgICBpZighand0IHx8IChqd3QgJiYgdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gand0O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBKV1Qgc2F2ZWQgaW4gbG9jYWwgc3RvcmdlLlxuICAgKlxuICAgKiBAbWV0aG9kIGNsZWFyTG9jYWxTdG9yYWdlSldUXG4gICAqXG4gICAqIEByZXR1cm4gIHt1bmRlZmluZWR9XG4gICAqL1xuICBwcml2YXRlIGNsZWFyTG9jYWxTdG9yYWdlSldUKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdncG9hdXRoSldUJylcbiAgfTtcblxuICAvKipcbiAgICogSXMgYSB0b2tlbiBleHBpcmVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzRXhwaXJlZFxuICAgKiBAcGFyYW0ge0pXVH0gand0IC0gQSBKV1RcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRXhwaXJlZChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIGlmKHBhcnNlZEpXVCl7XG4gICAgICBjb25zdCBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAgIHJldHVybiBub3cgPiBwYXJzZWRKV1QuZXhwO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGUgSldUIGFuIGltcGxpY2l0IEpXVD9cbiAgICogQHBhcmFtIGp3dFxuICAgKi9cbiAgaXNJbXBsaWNpdEpXVChqd3Q6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcnNlZEpXVCA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiBwYXJzZWRKV1QgJiYgcGFyc2VkSldULmltcGxpY2l0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc2FmZSAoc2lnbmF0dXJlIG5vdCBjaGVja2VkKSB1bnBhY2tpbmcgb2YgSldULlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBBY2Nlc3MgVG9rZW4gKEpXVClcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcGFyc2VkIHBheWxvYWQgaW4gdGhlIEpXVFxuICAgKi9cbiAgcGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEpXVCB7XG4gICAgdmFyIHBhcnNlZDtcbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICB9IGNhdGNoKGUpIHsgLyogRG9uJ3QgdGhyb3cgcGFyc2UgZXJyb3IgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgZnJvbnQgZW5kIHZhbGlkaW9uIHRvIHZlcmlmeSBKV1QgaXMgY29tcGxldGUgYW5kIG5vdFxuICAgKiBleHBpcmVkLlxuICAgKlxuICAgKiBOb3RlOlxuICAgKiAgU2lnbmF0dXJlIHZhbGlkYXRpb24gaXMgdGhlIG9ubHkgdHJ1bHkgc2F2ZSBtZXRob2QuIFRoaXMgaXMgZG9uZVxuICAgKiAgYXV0b21hdGljYWxseSBpbiB0aGUgbm9kZS1ncG9hdXRoIG1vZHVsZS5cbiAgICovXG4gIHZhbGlkYXRlSnd0KHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZUp3dCh0b2tlbik7XG4gICAgdmFyIHZhbGlkID0gKHBhcnNlZCAmJiBwYXJzZWQuZXhwICYmIHBhcnNlZC5leHAgKiAxMDAwID4gRGF0ZS5ub3coKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgcmV0dXJuIHZhbGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIEpXVCB0byBsb2NhbFN0b3JhZ2UgYW5kIGluIHRoZSByZXF1ZXN0IGhlYWRlcnMgZm9yIGFjY2Vzc2luZ1xuICAgKiBwcm90ZWN0ZWQgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge0pXVH0gand0XG4gICAqL1xuICBwdWJsaWMgc2V0QXV0aChqd3Q6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlKCdncG9hdXRoSldUJywgand0KVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIHRoaXMuZ2V0VXNlckZyb21KV1Qoand0KSlcbiAgfTtcblxuICAvKipcbiAgICogUHVyZ2UgdGhlIEpXVCBmcm9tIGxvY2FsU3RvcmFnZSBhbmQgYXV0aG9yaXphdGlvbiBoZWFkZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSByZW1vdmVBdXRoKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdncG9hdXRoSldUJylcbiAgICAvLyBTZW5kIG51bGwgdXNlciBhcyB3ZWxsIChiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSlcbiAgICB0aGlzLm1lc3Nlbmdlci5icm9hZGNhc3QoXCJ1c2VyQXV0aGVudGljYXRlZFwiLCBudWxsKVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJTaWduT3V0XCIpXG4gIH07XG59XG5cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRBdXRoQ29uZjogQXV0aENvbmZpZyA9IHtcbiAgQVVUSF9UWVBFOiAnZ3JhbnQnLFxuICBBTExPV0lGUkFNRUxPR0lOOiBmYWxzZSxcbiAgRk9SQ0VfTE9HSU46IGZhbHNlLFxuICBBTExPV19ERVZfRURJVFM6IGZhbHNlLFxuICBBUFBfQkFTRV9VUkw6ICcnIC8vIGFic29sdXRlIHBhdGggLy8gdXNlIC4gZm9yIHJlbGF0aXZlIHBhdGhcbn1cbiJdfQ==