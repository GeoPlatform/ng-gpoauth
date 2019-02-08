import { ngMessenger, AuthConfig, JWT, UserProfile } from '../src/authTypes';
import { GeoPlatformUser } from './GeoPlatformUser';
/**
 * Authentication Service
 */
export declare class AuthService {
    config: AuthConfig;
    messenger: ngMessenger;
    /**
     *
     * @class AuthService
     * @constructor
     *
     * @param {AuthConfig} config
     * @param
     */
    constructor(config: AuthConfig, ngMessenger: ngMessenger);
    /**
     * Expose ngMessenger so that appliction code is able to
     * subscribe to notifications sent by ng-gpoauth
     */
    getMessenger(): ngMessenger;
    /**
     * Security wrapper for obfuscating values passed into local storage
     */
    private saveToLocalStorage;
    /**
     * Retrieve and decode value from localstorage
     *
     * @param key
     */
    getFromLocalStorage(key: string): string;
    private ssoCheck;
    /**
     * We keep this outside the constructor so that other services call
     * call it to trigger the side-effects.
     *
     * @method init
     */
    private init;
    /**
     * Create an invisable iframe and appends it to the bottom of the page.
     *
     * @method createIframe
     * @returns {HTMLIFrameElement}
     */
    private createIframe;
    /**
     * Redirects or displays login window the page to the login site
     */
    login(): void;
    /**
     * Performs background logout and requests jwt revokation
     */
    logout(): Promise<void>;
    /**
     * Optional force redirect for non-public services
     */
    forceLogin(): void;
    /**
     * Get protected user profile
     */
    getOauthProfile(): Promise<UserProfile>;
    /**
     * Get User object from the JWT.
     *
     * If no JWT is provided it will be looked for at the normal JWT
     * locations (localStorage or URL queryString).
     *
     * @param {JWT} [jwt] - the JWT to extract user from.
     */
    getUserFromJWT(jwt: string): GeoPlatformUser;
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
    getUserSync(callback?: (user: GeoPlatformUser) => any): GeoPlatformUser;
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
    getUser(): Promise<GeoPlatformUser | null>;
    /**
     * Check function being used by some front end apps already.
     * (wrapper for getUser)
     *
     * @method check
     * @returns {User} - ng-common user object or null
     */
    check(): Promise<GeoPlatformUser>;
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
    checkWithClient(originalJWT: string): Promise<any>;
    /**
     * Extract token from current URL
     *
     * @method getJWTFromUrl
     *
     * @return {String | undefined} - JWT Token (raw string)
     */
    getJWTFromUrl(): string;
    /**
     * Load the JWT stored in local storage.
     *
     * @method getJWTfromLocalStorage
     *
     * @return {JWT | undefined} An object wih the following format:
     */
    getJWTfromLocalStorage(): string;
    /**
     * Attempt and pull JWT from the following locations (in order):
     *  - URL query parameter 'access_token' (returned from IDP)
     *  - Browser local storage (saved from previous request)
     *
     * @method getJWT
     *
     * @return {sting | undefined}
     */
    getJWT(): string;
    /**
     * Remove the JWT saved in local storge.
     *
     * @method clearLocalStorageJWT
     *
     * @return  {undefined}
     */
    private clearLocalStorageJWT;
    /**
     * Is a token expired.
     *
     * @method isExpired
     * @param {JWT} jwt - A JWT
     *
     * @return {boolean}
     */
    isExpired(jwt: string): boolean;
    /**
     * Is the JWT an implicit JWT?
     * @param jwt
     */
    isImplicitJWT(jwt: string): boolean;
    /**
     * Unsafe (signature not checked) unpacking of JWT.
     *
     * @param {string} token - Access Token (JWT)
     * @return {Object} the parsed payload in the JWT
     */
    parseJwt(token: string): JWT;
    /**
     * Simple front end validion to verify JWT is complete and not
     * expired.
     *
     * Note:
     *  Signature validation is the only truly save method. This is done
     *  automatically in the node-gpoauth module.
     */
    validateJwt(token: string): boolean;
    /**
     * Save JWT to localStorage and in the request headers for accessing
     * protected resources.
     *
     * @param {JWT} jwt
     */
    setAuth(jwt: string): void;
    /**
     * Purge the JWT from localStorage and authorization headers.
     */
    private removeAuth;
}
export declare const DefaultAuthConf: AuthConfig;
