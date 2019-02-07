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
        return getJson(`${this.config.APP_BASE_URL}/revoke?sso=true`, this.getJWT())
            .then(() => {
            if (this.config.LOGOUT_URL)
                window.location.href = this.config.LOGOUT_URL;
            if (this.config.FORCE_LOGIN)
                self.forceLogin();
        })
            .catch((err) => console.log('Error logging out: ', err));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLWdwb2F1dGgvIiwic291cmNlcyI6WyJzcmMvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQTs7Ozs7O0FBRXpCLGlCQUFpQixHQUFXLEVBQUUsR0FBWTtJQUN4QyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ0UsT0FBTyxFQUFFLEVBQUUsZUFBZSxFQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3pELFlBQVksRUFBRSxNQUFNO0tBQ3JCLENBQUM7U0FDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDMUM7Ozs7QUFLRCxNQUFNOzs7Ozs7O0lBYUosWUFBWSxNQUFrQixFQUFFLFdBQXdCOztRQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUE7O1FBRzVCLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFOztZQUV6QyxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUNaOztZQUdELElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTthQUNsQjtTQUNGLENBQUMsQ0FBQTs7UUFFRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDeEIsSUFBRyxDQUFDLElBQUksSUFBSSxJQUFJ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LEtBQUs7SUFDbEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsWUFBWSxFQUFFLEVBQUU7Q0FDakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBKV1QsIFVzZXJQcm9maWxlIH0gZnJvbSAnLi4vc3JjL2F1dGhUeXBlcydcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4vR2VvUGxhdGZvcm1Vc2VyJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuXG5mdW5jdGlvbiBnZXRKc29uKHVybDogc3RyaW5nLCBqd3Q/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGF4aW9zLmdldCh1cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQXV0aG9yaXphdGlvbicgOiBqd3QgPyBgQmVhcmVyICR7and0fWAgOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHIgPT4gci5kYXRhKTtcbn1cblxuLyoqXG4gKiBBdXRoZW50aWNhdGlvbiBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgY29uZmlnOiBBdXRoQ29uZmlnXG4gIG1lc3NlbmdlcjogbmdNZXNzZW5nZXJcblxuICAvKipcbiAgICpcbiAgICogQGNsYXNzIEF1dGhTZXJ2aWNlXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge0F1dGhDb25maWd9IGNvbmZpZ1xuICAgKiBAcGFyYW1cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQXV0aENvbmZpZywgbmdNZXNzZW5nZXI6IG5nTWVzc2VuZ2VyKXtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLm1lc3NlbmdlciA9IG5nTWVzc2VuZ2VyXG5cbiAgICAvLyBTZXR1cCBnZW5lcmFsIGV2ZW50IGxpc3RlbmVycyB0aGF0IGFsd2F5cyBydW5cbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgc2VsZi5pbml0KCkgLy8gd2lsbCBicm9hZGNhc3QgdG8gYW5ndWxhciAoc2lkZS1lZmZlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBsb2dvdXQgZXZlbnRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICd1c2VyU2lnbk91dCcpe1xuICAgICAgICBzZWxmLnJlbW92ZUF1dGgoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCB1c2VyID0gc2VsZi5pbml0KClcbiAgICBpZighdXNlciAmJiB0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICdncmFudCcpIHNlbGYuc3NvQ2hlY2soKVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBuZ01lc3NlbmdlciBzbyB0aGF0IGFwcGxpY3Rpb24gY29kZSBpcyBhYmxlIHRvXG4gICAqIHN1YnNjcmliZSB0byBub3RpZmljYXRpb25zIHNlbnQgYnkgbmctZ3BvYXV0aFxuICAgKi9cbiAgZ2V0TWVzc2VuZ2VyKCk6IG5nTWVzc2VuZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzZW5nZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWN1cml0eSB3cmFwcGVyIGZvciBvYmZ1c2NhdGluZyB2YWx1ZXMgcGFzc2VkIGludG8gbG9jYWwgc3RvcmFnZVxuICAgKi9cbiAgcHJpdmF0ZSBzYXZlVG9Mb2NhbFN0b3JhZ2Uoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGJ0b2EodmFsdWUpKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0cmlldmUgYW5kIGRlY29kZSB2YWx1ZSBmcm9tIGxvY2Fsc3RvcmFnZVxuICAgKlxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBnZXRGcm9tTG9jYWxTdG9yYWdlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpXG4gICAgdHJ5e1xuICAgICAgcmV0dXJuIHJhdyA/XG4gICAgICAgICAgICAgIGF0b2IocmF3KSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICB9IGNhdGNoIChlKXsgLy8gQ2F0Y2ggYmFkIGVuY29kaW5nIG9yIGZvcm1hbGx5IG5vdCBlbmNvZGVkXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHNzb0NoZWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNzb1VSTCA9IGAvbG9naW4/c3NvPXRydWUmY2FjaGVidXN0ZXI9JHsobmV3IERhdGUoKSkuZ2V0VGltZSgpfWBcbiAgICBjb25zdCBzc29JZnJhbWUgPSB0aGlzLmNyZWF0ZUlmcmFtZShzc29VUkwpXG5cbiAgICAvLyBTZXR1cCBzc29JZnJhbWUgc3BlY2lmaWMgaGFuZGxlcnNcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBTU08gbG9naW4gZmFpbHVyZVxuICAgICAgaWYoZXZlbnQuZGF0YSA9PT0gJ2lmcmFtZTpzc29GYWlsZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICAgIC8vIEZvcmNlIGxvZ2luIG9ubHkgYWZ0ZXIgU1NPIGhhcyBmYWlsZWRcbiAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpXG4gICAgICB9XG5cbiAgICAgIC8vIEhhbmRsZSBVc2VyIEF1dGhlbnRpY2F0ZWRcbiAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6dXNlckF1dGhlbnRpY2F0ZWQnKXtcbiAgICAgICAgaWYoc3NvSWZyYW1lICYmIHNzb0lmcmFtZS5yZW1vdmUpIC8vIElFIDExIC0gZ290Y2hhXG4gICAgICAgICAgc3NvSWZyYW1lLnJlbW92ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBrZWVwIHRoaXMgb3V0c2lkZSB0aGUgY29uc3RydWN0b3Igc28gdGhhdCBvdGhlciBzZXJ2aWNlcyBjYWxsXG4gICAqIGNhbGwgaXQgdG8gdHJpZ2dlciB0aGUgc2lkZS1lZmZlY3RzLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIHByaXZhdGUgaW5pdCgpOiBHZW9QbGF0Zm9ybVVzZXIge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldUKCk7XG4gICAgaWYoand0KSB0aGlzLnNldEF1dGgoand0KVxuXG4gICAgLy9jbGVhbiBob3N0dXJsIG9uIHJlZGlyZWN0IGZyb20gb2F1dGhcbiAgICBpZiAodGhpcy5nZXRKV1RGcm9tVXJsKCkpIHtcbiAgICAgIGlmKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSl7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgge30gLCAnUmVtb3ZlIHRva2VuIGZyb20gVVJMJywgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW1xcP1xcJl1hY2Nlc3NfdG9rZW49LipcXCZ0b2tlbl90eXBlPUJlYXJlci8sICcnKSApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnJlcGxhY2UoL1tcXD9cXCZdYWNjZXNzX3Rva2VuPS4qXFwmdG9rZW5fdHlwZT1CZWFyZXIvLCAnJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGludmlzYWJsZSBpZnJhbWUgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZS5cbiAgICpcbiAgICogQG1ldGhvZCBjcmVhdGVJZnJhbWVcbiAgICogQHJldHVybnMge0hUTUxJRnJhbWVFbGVtZW50fVxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVJZnJhbWUodXJsOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XG4gICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXG5cbiAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmcmFtZS5zcmMgPSB1cmxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICByZXR1cm4gaWZyYW1lXG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZGlyZWN0cyBvciBkaXNwbGF5cyBsb2dpbiB3aW5kb3cgdGhlIHBhZ2UgdG8gdGhlIGxvZ2luIHNpdGVcbiAgICovXG4gIGxvZ2luKCkge1xuICAgIC8vIENoZWNrIGltcGxpY2l0IHdlIG5lZWQgdG8gYWN0dWFsbHkgcmVkaXJlY3QgdGhlbVxuICAgIGlmKHRoaXMuY29uZmlnLkFVVEhfVFlQRSA9PT0gJ3Rva2VuJykge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkwgK1xuICAgICAgICAgICAgICBgL2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0ke3RoaXMuY29uZmlnLkFQUF9JRH1gICtcbiAgICAgICAgICAgICAgYCZyZXNwb25zZV90eXBlPSR7dGhpcy5jb25maWcuQVVUSF9UWVBFfWAgK1xuICAgICAgICAgICAgICBgJnJlZGlyZWN0X3VyaT0ke2VuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNvbmZpZy5DQUxMQkFDSyB8fCAnL2xvZ2luJyl9YFxuXG4gICAgLy8gT3RoZXJ3aXNlIHBvcCB1cCB0aGUgbG9naW4gbW9kYWxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWZyYW1lIGxvZ2luXG4gICAgICBpZih0aGlzLmNvbmZpZy5BTExPV0lGUkFNRUxPR0lOKXtcbiAgICAgICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCdhdXRoOnJlcXVpcmVMb2dpbicpXG5cbiAgICAgICAgLy8gUmVkaXJlY3QgbG9naW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdGhpcy5jb25maWcuTE9HSU5fVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBgL2xvZ2luP3JlZGlyZWN0X3VybD0ke2VuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZil9YFxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYmFja2dyb3VuZCBsb2dvdXQgYW5kIHJlcXVlc3RzIGp3dCByZXZva2F0aW9uXG4gICAqL1xuICBsb2dvdXQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgLy8gQ3JlYXRlIGlmcmFtZSB0byBtYW51YWxseSBjYWxsIHRoZSBsb2dvdXQgYW5kIHJlbW92ZSBncG9hdXRoIGNvb2tpZVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNzU4MjA3L3doeS1pcy1wYXNzcG9ydGpzLWluLW5vZGUtbm90LXJlbW92aW5nLXNlc3Npb24tb24tbG9nb3V0I2Fuc3dlci0zMzc4Njg5OVxuICAgIC8vIHRoaXMuY3JlYXRlSWZyYW1lKGAke3RoaXMuY29uZmlnLklEUF9CQVNFX1VSTH0vYXV0aC9sb2dvdXRgKVxuXG4gICAgLy8gU2F2ZSBKV1QgdG8gc2VuZCB3aXRoIGZpbmFsIHJlcXVlc3QgdG8gcmV2b2tlIGl0XG4gICAgc2VsZi5yZW1vdmVBdXRoKCkgLy8gcHVyZ2UgdGhlIEpXVFxuXG4gICAgcmV0dXJuIGdldEpzb24oYCR7dGhpcy5jb25maWcuQVBQX0JBU0VfVVJMfS9yZXZva2U/c3NvPXRydWVgLCB0aGlzLmdldEpXVCgpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBpZih0aGlzLmNvbmZpZy5MT0dPVVRfVVJMKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuY29uZmlnLkxPR09VVF9VUkxcbiAgICAgICAgICAgICAgaWYodGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pIHNlbGYuZm9yY2VMb2dpbigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBFcnJvcikgPT4gY29uc29sZS5sb2coJ0Vycm9yIGxvZ2dpbmcgb3V0OiAnLCBlcnIpKTtcbiAgfTtcblxuICAvKipcbiAgICogT3B0aW9uYWwgZm9yY2UgcmVkaXJlY3QgZm9yIG5vbi1wdWJsaWMgc2VydmljZXNcbiAgICovXG4gIGZvcmNlTG9naW4oKSB7XG4gICAgdGhpcy5sb2dpbigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgcHJvdGVjdGVkIHVzZXIgcHJvZmlsZVxuICAgKi9cbiAgZ2V0T2F1dGhQcm9maWxlKCk6IFByb21pc2U8VXNlclByb2ZpbGU+IHtcbiAgICBjb25zdCBKV1QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFVzZXJQcm9maWxlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL2NoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBjYW4gbWFrZSBjYWxsZWRcbiAgICAgIGlmIChKV1QpIHtcbiAgICAgICAgZ2V0SnNvbihgJHt0aGlzLmNvbmZpZy5JRFBfQkFTRV9VUkx9L2FwaS9wcm9maWxlYCwgSldUKVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZTogVXNlclByb2ZpbGUpID0+ICByZXNvbHZlKHJlc3BvbnNlKSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChlcnIpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG51bGwpXG4gICAgICB9XG5cbiAgICB9KVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgVXNlciBvYmplY3QgZnJvbSB0aGUgSldULlxuICAgKlxuICAgKiBJZiBubyBKV1QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb29rZWQgZm9yIGF0IHRoZSBub3JtYWwgSldUXG4gICAqIGxvY2F0aW9ucyAobG9jYWxTdG9yYWdlIG9yIFVSTCBxdWVyeVN0cmluZykuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBband0XSAtIHRoZSBKV1QgdG8gZXh0cmFjdCB1c2VyIGZyb20uXG4gICAqL1xuICBnZXRVc2VyRnJvbUpXVChqd3Q6IHN0cmluZyk6IEdlb1BsYXRmb3JtVXNlciB7XG4gICAgY29uc3QgdXNlciA9IHRoaXMucGFyc2VKd3Qoand0KVxuICAgIHJldHVybiB1c2VyID9cbiAgICAgICAgICAgIG5ldyBHZW9QbGF0Zm9ybVVzZXIoT2JqZWN0LmFzc2lnbih7fSwgdXNlciwgeyBpZDogdXNlci5zdWIgfSkpIDpcbiAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlLCBpdCByZXR1cm5zIHRoZSB1c2VyIChvciBudWxsKS5cbiAgICpcbiAgICogU2lkZSBFZmZlY3RzOlxuICAgKiAgLSBXaWxsIHJlZGlyZWN0IHVzZXJzIGlmIG5vIHZhbGlkIEpXVCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGludm9rZSB3aXRoIHRoZSB1c2VyXG4gICAqIEByZXR1cm4gb2JqZWN0IHJlcHJlc2VudGluZyBjdXJyZW50IHVzZXJcbiAgICovXG4gIGdldFVzZXJTeW5jKGNhbGxiYWNrPzogKHVzZXI6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KTogR2VvUGxhdGZvcm1Vc2VyIHtcbiAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuICAgIC8vIElmIGNhbGxiYWNrIHByb3ZpZGVkIHdlIGNhbiB0cmVhdCBhc3luYyBhbmQgY2FsbCBzZXJ2ZXJcbiAgICBpZihjYWxsYmFjayAmJiB0eXBlb2YoY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRoaXMuY2hlY2soKVxuICAgICAgLnRoZW4odXNlciA9PiBjYWxsYmFjayh1c2VyKSk7XG5cbiAgICAgIC8vIElmIG5vIGNhbGxiYWNrIHdlIGhhdmUgdG8gcHJvdmlkZSBhIHN5bmMgcmVzcG9uc2UgKG5vIG5ldHdvcmspXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGFsbG93IGZyb250IGVuZCB0byBnZXQgdXNlciBkYXRhIGlmIGdyYW50IHR5cGUgYW5kIGV4cGlyZWRcbiAgICAgIC8vIGJlY2F1c2UgdGhleSB3aWxsIHJlY2lldmUgYSBuZXcgdG9rZW4gYXV0b21hdGljYWxseSB3aGVuXG4gICAgICAvLyBtYWtpbmcgYSBjYWxsIHRvIHRoZSBjbGllbnQoYXBwbGljYXRpb24pXG4gICAgICByZXR1cm4gdGhpcy5pc0ltcGxpY2l0SldUKGp3dCkgJiYgdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgICAgICB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb21pc2UgdmVyc2lvbiBvZiBnZXQgdXNlci5cbiAgICpcbiAgICogQmVsb3cgaXMgYSB0YWJsZSBvZiBob3cgdGhpcyBmdW5jdGlvbiBoYW5kZWxzIHRoaXMgbWV0aG9kIHdpdGhcbiAgICogZGlmZmVybnQgY29uZmlndXJhdGlvbnMuXG4gICAqICAtIEZPUkNFX0xPR0lOIDogSG9yaXpvbnRhbFxuICAgKiAgLSBBTExPV0lGUkFNRUxPR0lOIDogVmVydGljYWxcbiAgICpcbiAgICpcbiAgICogZ2V0VXNlciAgfCBUIHwgRiAoRk9SQ0VfTE9HSU4pXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFQgICAgICAgIHwgMSB8IDJcbiAgICogRiAgICAgICAgfCAzIHwgNFxuICAgKiAoQUxMT1dJRlJBTUVMT0dJTilcbiAgICpcbiAgICogQ2FzZXM6XG4gICAqIDEuIERlbGF5IHJlc29sdmUgZnVuY3Rpb24gdGlsbCB1c2VyIGlzIGxvZ2dlZCBpblxuICAgKiAyLiBSZXR1cm4gbnVsbCAoaWYgdXNlciBub3QgYXV0aG9yaXplZClcbiAgICogMy4gRm9yY2UgdGhlIHJlZGlyZWN0XG4gICAqIDQuIFJldHVybiBudWxsIChpZiB1c2VyIG5vdCBhdXRob3JpemVkKVxuICAgKlxuICAgKiBOT1RFOlxuICAgKiBDYXNlIDEgYWJvdmUgd2lsbCBjYXVzZSB0aGlzIG1ldGhvZCdzIHByb21pc2UgdG8gYmUgYSBsb25nIHN0YWxsXG4gICAqIHVudGlsIHRoZSB1c2VyIGNvbXBsZXRlcyB0aGUgbG9naW4gcHJvY2Vzcy4gVGhpcyBzaG91bGQgYWxsb3cgdGhlXG4gICAqIGFwcCB0byBmb3JnbyBhIHJlbG9hZCBpcyBpdCBzaG91bGQgaGF2ZSB3YWl0ZWQgdGlsbCB0aGUgZW50aXJlXG4gICAqIHRpbWUgdGlsbCB0aGUgdXNlciB3YXMgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRVc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFVzZXI+fSBVc2VyIC0gdGhlIGF1dGhlbnRpY2F0ZWQgdXNlclxuICAgKi9cbiAgZ2V0VXNlcigpOiBQcm9taXNlPEdlb1BsYXRmb3JtVXNlciB8IG51bGw+IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIC8vIEZvciBiYXNpYyB0ZXN0aW5nXG4gICAgLy8gdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KCd1c2VyQXV0aGVudGljYXRlZCcsIHsgbmFtZTogJ3VzZXJuYW1lJ30pXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8R2VvUGxhdGZvcm1Vc2VyIHwgbnVsbD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5jaGVjaygpXG4gICAgICAudGhlbih1c2VyID0+IHtcbiAgICAgICAgaWYodXNlcikge1xuICAgICAgICAgIHJlc29sdmUodXNlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDYXNlIDEgLSBBTExPV0lGUkFNRUxPR0lOOiB0cnVlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICAgICAgICBpZih0aGlzLmNvbmZpZy5BTExPV0lGUkFNRUxPR0lOICYmIHRoaXMuY29uZmlnLkZPUkNFX0xPR0lOKXtcbiAgICAgICAgICAgIC8vIFJlc29sdmUgd2l0aCB1c2VyIG9uY2UgdGhleSBoYXZlIGxvZ2dlZCBpblxuICAgICAgICAgICAgdGhpcy5tZXNzZW5nZXIub24oJ3VzZXJBdXRoZW50aWNhdGVkJywgKGV2ZW50OiBFdmVudCwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXNlcilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgMiAtIEFMTE9XSUZSQU1FTE9HSU46IHRydWUgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICAgICAgICBpZih0aGlzLmNvbmZpZy5BTExPV0lGUkFNRUxPR0lOICYmICF0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhc2UgMyAtIEFMTE9XSUZSQU1FTE9HSU46IGZhbHNlIHwgRk9SQ0VfTE9HSU46IHRydWVcbiAgICAgICAgICBpZighdGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiB0aGlzLmNvbmZpZy5GT1JDRV9MT0dJTil7XG4gICAgICAgICAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgLy8gSGFuZGxlIFNTTyBsb2dpbiBmYWlsdXJlXG4gICAgICAgICAgICAgIGlmKGV2ZW50LmRhdGEgPT09ICdpZnJhbWU6c3NvRmFpbGVkJyl7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzZWxmLmdldFVzZXIoKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2FzZSA0IC0gQUxMT1dJRlJBTUVMT0dJTjogZmFsc2UgfCBGT1JDRV9MT0dJTjogZmFsc2VcbiAgICAgICAgICBpZighdGhpcy5jb25maWcuQUxMT1dJRlJBTUVMT0dJTiAmJiAhdGhpcy5jb25maWcuRk9SQ0VfTE9HSU4pe1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKSAvLyBvciByZWplY3Q/XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnI6IEVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnIpKVxuICAgIH0pXG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrIGZ1bmN0aW9uIGJlaW5nIHVzZWQgYnkgc29tZSBmcm9udCBlbmQgYXBwcyBhbHJlYWR5LlxuICAgKiAod3JhcHBlciBmb3IgZ2V0VXNlcilcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJucyB7VXNlcn0gLSBuZy1jb21tb24gdXNlciBvYmplY3Qgb3IgbnVsbFxuICAgKi9cbiAgY2hlY2soKTogUHJvbWlzZTxHZW9QbGF0Zm9ybVVzZXI+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG4gICAgICBjb25zdCBqd3QgPSB0aGlzLmdldEpXVCgpO1xuXG4gICAgICAvLyBJZiBubyBsb2NhbCBKV1RcbiAgICAgIGlmKCFqd3QpXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrV2l0aENsaWVudChcIlwiKVxuICAgICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiBqd3QubGVuZ3RoID8gdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpIDogbnVsbCk7XG5cbiAgICAgIGlmKCFqd3QpIHJldHVybiByZXNvbHZlKG51bGwpO1xuICAgICAgaWYoIXRoaXMuaXNJbXBsaWNpdEpXVChqd3QpKXsgLy8gR3JhbnQgdG9rZW5cbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkKGp3dCkgP1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tXaXRoQ2xpZW50KGp3dClcbiAgICAgICAgICAgICAgICAgIC50aGVuKGp3dCA9PiB0aGlzLmdldFVzZXJGcm9tSldUKGp3dCkpIDogLy8gQ2hlY2sgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKTtcbiAgICAgIH0gZWxzZSB7IC8vIEltcGxpY2l0IEpXVFxuICAgICAgICByZXR1cm4gdGhpcy5pc0V4cGlyZWQoand0KSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobnVsbCkgOlxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgY2FsbCB0byBhIHNlcnZpY2UgaG9zdGluZyBub2RlLWdwb2F1dGggdG8gYWxsb3cgZm9yIGFcbiAgICogdG9rZW4gcmVmcmVzaCBvbiBhbiBleHBpcmVkIHRva2VuLCBvciBhIHRva2VuIHRoYXQgaGFzIGJlZW5cbiAgICogaW52YWxpZGF0ZWQgdG8gYmUgcmV2b2tlZC5cbiAgICpcbiAgICogTm90ZTogQ2xpZW50IGFzIGluIGhvc3RpbmcgYXBwbGljYXRpb246XG4gICAqICAgIGh0dHBzOi8vd3d3LmRpZ2l0YWxvY2Vhbi5jb20vY29tbXVuaXR5L3R1dG9yaWFscy9hbi1pbnRyb2R1Y3Rpb24tdG8tb2F1dGgtMlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrV2l0aENsaWVudFxuICAgKiBAcGFyYW0ge2p3dH0gLSBlbmNvZGVkIGFjY2Vzc1Rva2VuL0pXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGp3dD59IC0gcHJvbWlzZSByZXNvbHZpbmcgd2l0aCBhIEpXVFxuICAgKi9cbiAgY2hlY2tXaXRoQ2xpZW50KG9yaWdpbmFsSldUOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLmNvbmZpZy5BVVRIX1RZUEUgPT09ICd0b2tlbicpe1xuICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGF4aW9zKGAke3RoaXMuY29uZmlnLkFQUF9CQVNFX1VSTH0vY2hlY2t0b2tlbmAsIHtcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbicgOiBvcmlnaW5hbEpXVCA/IGBCZWFyZXIgJHtvcmlnaW5hbEpXVH1gIDogJycsXG4gICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtRXhwb3NlLUhlYWRlcnMnOiAnQXV0aG9yaXphdGlvbiwgV1dXLUF1dGhvcml6YXRpb24sIGNvbnRlbnQtbGVuZ3RoJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgY29uc3QgaGVhZGVyID0gcmVzcC5oZWFkZXJzWydhdXRob3JpemF0aW9uJ11cbiAgICAgICAgICBjb25zdCBuZXdKV1QgPSBoZWFkZXIgJiYgaGVhZGVyLnJlcGxhY2UoJ0JlYXJlciAnLCcnKVxuICAgICAgICAgIGlmKG5ld0pXVCkgdGhpcy5zZXRBdXRoKG5ld0pXVCk7XG5cbiAgICAgICAgICByZXNvbHZlKG5ld0pXVCA/IG5ld0pXVCA6IG9yaWdpbmFsSldUKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QoZXJyKSk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogRXh0cmFjdCB0b2tlbiBmcm9tIGN1cnJlbnQgVVJMXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldURnJvbVVybFxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmcgfCB1bmRlZmluZWR9IC0gSldUIFRva2VuIChyYXcgc3RyaW5nKVxuICAgKi9cbiAgZ2V0SldURnJvbVVybCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gKHdpbmRvdyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2gpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcbiAgICBjb25zdCByZXMgPSBxdWVyeVN0cmluZy5tYXRjaCgvYWNjZXNzX3Rva2VuPShbXlxcJl0qKS8pO1xuICAgIHJldHVybiByZXMgJiYgcmVzWzFdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBKV1Qgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SldUZnJvbUxvY2FsU3RvcmFnZVxuICAgKlxuICAgKiBAcmV0dXJuIHtKV1QgfCB1bmRlZmluZWR9IEFuIG9iamVjdCB3aWggdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqL1xuICBnZXRKV1Rmcm9tTG9jYWxTdG9yYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnJvbUxvY2FsU3RvcmFnZSgnZ3BvYXV0aEpXVCcpXG4gIH07XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgYW5kIHB1bGwgSldUIGZyb20gdGhlIGZvbGxvd2luZyBsb2NhdGlvbnMgKGluIG9yZGVyKTpcbiAgICogIC0gVVJMIHF1ZXJ5IHBhcmFtZXRlciAnYWNjZXNzX3Rva2VuJyAocmV0dXJuZWQgZnJvbSBJRFApXG4gICAqICAtIEJyb3dzZXIgbG9jYWwgc3RvcmFnZSAoc2F2ZWQgZnJvbSBwcmV2aW91cyByZXF1ZXN0KVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtzdGluZyB8IHVuZGVmaW5lZH1cbiAgICovXG4gIGdldEpXVCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGp3dCA9IHRoaXMuZ2V0SldURnJvbVVybCgpIHx8IHRoaXMuZ2V0SldUZnJvbUxvY2FsU3RvcmFnZSgpXG4gICAgLy8gT25seSBkZW55IGltcGxpY2l0IHRva2VucyB0aGF0IGhhdmUgZXhwaXJlZFxuICAgIGlmKCFqd3QgfHwgKGp3dCAmJiB0aGlzLmlzSW1wbGljaXRKV1Qoand0KSAmJiB0aGlzLmlzRXhwaXJlZChqd3QpKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqd3Q7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEpXVCBzYXZlZCBpbiBsb2NhbCBzdG9yZ2UuXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYXJMb2NhbFN0b3JhZ2VKV1RcbiAgICpcbiAgICogQHJldHVybiAge3VuZGVmaW5lZH1cbiAgICovXG4gIHByaXZhdGUgY2xlYXJMb2NhbFN0b3JhZ2VKV1QoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyBhIHRva2VuIGV4cGlyZWQuXG4gICAqXG4gICAqIEBtZXRob2QgaXNFeHBpcmVkXG4gICAqIEBwYXJhbSB7SldUfSBqd3QgLSBBIEpXVFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNFeHBpcmVkKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgaWYocGFyc2VkSldUKXtcbiAgICAgIGNvbnN0IG5vdyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgcmV0dXJuIG5vdyA+IHBhcnNlZEpXVC5leHA7XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoZSBKV1QgYW4gaW1wbGljaXQgSldUP1xuICAgKiBAcGFyYW0gand0XG4gICAqL1xuICBpc0ltcGxpY2l0SldUKGp3dDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyc2VkSldUID0gdGhpcy5wYXJzZUp3dChqd3QpXG4gICAgcmV0dXJuIHBhcnNlZEpXVCAmJiBwYXJzZWRKV1QuaW1wbGljaXQ7XG4gIH1cblxuICAvKipcbiAgICogVW5zYWZlIChzaWduYXR1cmUgbm90IGNoZWNrZWQpIHVucGFja2luZyBvZiBKV1QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIEFjY2VzcyBUb2tlbiAoSldUKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBwYXJzZWQgcGF5bG9hZCBpbiB0aGUgSldUXG4gICAqL1xuICBwYXJzZUp3dCh0b2tlbjogc3RyaW5nKTogSldUIHtcbiAgICB2YXIgcGFyc2VkO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGJhc2U2NFVybCA9IHRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgnLScsICcrJykucmVwbGFjZSgnXycsICcvJyk7XG4gICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UoYXRvYihiYXNlNjQpKTtcbiAgICAgIH0gY2F0Y2goZSkgeyAvKiBEb24ndCB0aHJvdyBwYXJzZSBlcnJvciAqLyB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBmcm9udCBlbmQgdmFsaWRpb24gdG8gdmVyaWZ5IEpXVCBpcyBjb21wbGV0ZSBhbmQgbm90XG4gICAqIGV4cGlyZWQuXG4gICAqXG4gICAqIE5vdGU6XG4gICAqICBTaWduYXR1cmUgdmFsaWRhdGlvbiBpcyB0aGUgb25seSB0cnVseSBzYXZlIG1ldGhvZC4gVGhpcyBpcyBkb25lXG4gICAqICBhdXRvbWF0aWNhbGx5IGluIHRoZSBub2RlLWdwb2F1dGggbW9kdWxlLlxuICAgKi9cbiAgdmFsaWRhdGVKd3QodG9rZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciBwYXJzZWQgPSB0aGlzLnBhcnNlSnd0KHRva2VuKTtcbiAgICB2YXIgdmFsaWQgPSAocGFyc2VkICYmIHBhcnNlZC5leHAgJiYgcGFyc2VkLmV4cCAqIDEwMDAgPiBEYXRlLm5vdygpKSA/IHRydWUgOiBmYWxzZTtcbiAgICByZXR1cm4gdmFsaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgSldUIHRvIGxvY2FsU3RvcmFnZSBhbmQgaW4gdGhlIHJlcXVlc3QgaGVhZGVycyBmb3IgYWNjZXNzaW5nXG4gICAqIHByb3RlY3RlZCByZXNvdXJjZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7SldUfSBqd3RcbiAgICovXG4gIHB1YmxpYyBzZXRBdXRoKGp3dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoJ2dwb2F1dGhKV1QnLCBqd3QpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlckF1dGhlbnRpY2F0ZWRcIiwgdGhpcy5nZXRVc2VyRnJvbUpXVChqd3QpKVxuICB9O1xuXG4gIC8qKlxuICAgKiBQdXJnZSB0aGUgSldUIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBhdXRob3JpemF0aW9uIGhlYWRlcnMuXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZUF1dGgoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2dwb2F1dGhKV1QnKVxuICAgIC8vIFNlbmQgbnVsbCB1c2VyIGFzIHdlbGwgKGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5KVxuICAgIHRoaXMubWVzc2VuZ2VyLmJyb2FkY2FzdChcInVzZXJBdXRoZW50aWNhdGVkXCIsIG51bGwpXG4gICAgdGhpcy5tZXNzZW5nZXIuYnJvYWRjYXN0KFwidXNlclNpZ25PdXRcIilcbiAgfTtcbn1cblxuXG5leHBvcnQgY29uc3QgRGVmYXVsdEF1dGhDb25mOiBBdXRoQ29uZmlnID0ge1xuICBBVVRIX1RZUEU6ICdncmFudCcsXG4gIEFMTE9XSUZSQU1FTE9HSU46IGZhbHNlLFxuICBGT1JDRV9MT0dJTjogZmFsc2UsXG4gIEFMTE9XX0RFVl9FRElUUzogZmFsc2UsXG4gIEFQUF9CQVNFX1VSTDogJycgLy8gYWJzb2x1dGUgcGF0aCAvLyB1c2UgLiBmb3IgcmVsYXRpdmUgcGF0aFxufVxuIl19