declare var window: any

import { Messenger, AuthConfig, JWT, UserProfile, StringObj } from './authTypes'
import { GeoPlatformUser } from './GeoPlatformUser'
import axios from 'axios'


const ACCESS_TOKEN_COOKIE  = 'gpoauth-a'

async function getJson(url: string, jwt?: string) {
  try{
    const resp = await axios.get(url, {
                          headers: { 'Authorization' : jwt ? `Bearer ${jwt}` : '' },
                          responseType: 'json'
                        })
    return resp.data;
  } catch(err) {
    return {
      error: "Error fetching data",
      msg: err,
      url,
    }
  }
}


/**
 * Authentication Service
 */
export class AuthService {

  config: AuthConfig
  messenger: Messenger
  preveiousTokenPresentCheck: boolean

  /**
   *
   * AuthService
   *
   * @param config
   * @param
   */
  constructor(config: AuthConfig, ngMessenger: Messenger){
    const self = this;
    this.config = config;
    this.messenger = ngMessenger

    // Setup general event listeners that always run
    addEventListener('message', (event: any) => {
      // Handle User Authenticated
      if(event.data === 'iframe:userAuthenticated'){
        self.init() // will broadcast to angular (side-effect)
      }

      // Handle logout event
      if(event.data === 'userSignOut'){
        this.messenger.broadcast("userAuthenticated", null)
        this.messenger.broadcast("userSignOut")
      }
    })

    self.init()
  }

  /**
   * Expose ngMessenger so that appliction code is able to
   * subscribe to notifications sent by ng-gpoauth
   */
  getMessenger(): Messenger {
    return this.messenger
  }

  /**
   * Retrieve and decode value from localstorage
   *
   * @param key
   */
  getFromLocalStorage(key: string): string {
    const raw = localStorage.getItem(key)
    try{
      return raw ?
              atob(raw) :
              undefined;
    } catch (e){ // Catch bad encoding or formally not encoded
      return undefined;
    }
  };

  /**
   * We keep this outside the constructor so that other services call
   * call it to trigger the side-effects.
   *
   * @method init
   */
  private async init(): Promise<GeoPlatformUser> {
    const self = this;

    // Delay init until RPMService is loaded
    if(this.RPMLoaded() && this.config.loadRPM){
      const script = document.createElement('script');
      script.onload = function () {
          //do stuff with the script
          self.init();
      };
      script.src = `https://s3.amazonaws.com/geoplatform-cdn/gp.rpm/${this.config.RPMVersion || 'stable'}/js/gp.rpm.browser.js`;

      document.head.appendChild(script);
      return // skip init() till RPM is loaded
    }


    const jwt = this.getJWT();

    //clean hosturl on redirect from oauth
    if (this.getJWTFromUrl()) {
      if(window.history && window.history.replaceState){
        window.history.replaceState( {} , 'Remove token from URL', window.location.href.replace(/[\?\&]access_token=.*\&token_type=Bearer/, '') )
      } else {
        window.location.search.replace(/[\?\&]access_token=.*\&token_type=Bearer/, '')
      }
    }

    // Setup active session checher
    this.preveiousTokenPresentCheck = !!jwt
    setInterval(() => { self.checkForLocalToken() }, this.config.tokenCheckInterval)

    const user = this.getUserFromJWT(jwt)
    if(user)
      this.messenger.broadcast("userAuthenticated", user)

    return user
  }

  /**
   * Checks for the presence of token in cookie. If there has been a
   * change (cookie appears or disapears) the fire event handlers to
   * notify the appliction of the event.
   */
  private checkForLocalToken(){
    const jwt = this.getJWT()
    const tokenPresent = !!jwt
    // compare with previous check
    if (tokenPresent !== this.preveiousTokenPresentCheck)
      tokenPresent ?
        this.messenger.broadcast("userAuthenticated", this.getUserFromJWT(jwt)) :
        this.messenger.broadcast("userSignOut");

    // update previous state for next check
    this.preveiousTokenPresentCheck = tokenPresent
  }

  /**
   * Clears the access_token property from the URL.
   */
  private removeTokenFromUrl(): void {
    const replaceRegex = /[\?\&]access_token=.*(\&token_type=Bearer)?/
    if(window.history && window.history.replaceState){
      window.history.replaceState( {} , 'Remove token from URL', window.location.href.replace(replaceRegex, '') )
    } else {
      window.location.search.replace(replaceRegex, '')
    }
  }

  /**
   * Create an invisable iframe and appends it to the bottom of the page.
   *
   * @method createIframe
   * @returns HTMLIFrameElement
   */
  private createIframe(url: string): HTMLIFrameElement {
    let iframe = document.createElement('iframe')

    iframe.style.display = "none";
    iframe.src = url
    document.body.appendChild(iframe);

    return iframe
  };

  /**
   * Redirects or displays login window the page to the login site
   */
  login(path?: string): void {
    // Check implicit we need to actually redirect them
    const loc = path ?
                `${window.location.origin}${path}` :
                this.config.CALLBACK ?
                    this.config.CALLBACK :
                    window.location.href // default

    if(this.config.AUTH_TYPE === 'token') {
      window.location.href = this.config.IDP_BASE_URL +
              `/auth/authorize?client_id=${this.config.APP_ID}` +
              `&response_type=${this.config.AUTH_TYPE}` +
              `&redirect_uri=${encodeURIComponent(loc || '/login')}`

    // Otherwise pop up the login modal
    } else {
      // Iframe login
      if(this.config.ALLOW_IFRAME_LOGIN){
        this.messenger.broadcast('auth:requireLogin')

      // Redirect login
      } else {
        window.location.href = this.config.LOGIN_URL
                        || `/login?redirect_url=${encodeURIComponent(loc)}`
      }
    }
  };

  /**
   * Performs background logout and requests jwt revokation
   */
  async logout(): Promise<void> {
    try {
      await getJson(`${this.config.APP_BASE_URL}/revoke`, this.getJWT())
    } catch(err){
      console.log(`Error logging out: ${err}`)
    }
    if(this.config.LOGOUT_URL) window.location.href = this.config.LOGOUT_URL
    if(this.config.FORCE_LOGIN) this.forceLogin();
  }

  /**
   * Optional force redirect for non-public services
   */
  forceLogin() {
    this.login();
  };

  /**
   * Get protected user profile
   */
  async getOauthProfile(): Promise<UserProfile> {
    const JWT = this.getJWT();

    return JWT ?
      await getJson(`${this.config.IDP_BASE_URL}/api/profile`, JWT) :
      null;
  };

  /**
   * Get User object from the JWT.
   *
   * If no JWT is provided it will be looked for at the normal JWT
   * locations (localStorage or URL queryString).
   *
   * @param [jwt] - the JWT to extract user from.
   */
  getUserFromJWT(jwt: string): GeoPlatformUser {
    const user = this.parseJwt(jwt)
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
   * @param callback optional function to invoke with the user
   * @return object representing current user
   */
  getUserSync(): GeoPlatformUser {
    const jwt = this.getJWT();
    // We allow front end to get user data if grant type and expired
    // because they will recieve a new token automatically when
    // making a call to the client(application)
    return this.isImplicitJWT(jwt) && this.isExpired(jwt) ?
            null :
            this.getUserFromJWT(jwt);
  }

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
  async getUser(): Promise<GeoPlatformUser> {
    // For basic testing
    // this.messenger.broadcast('userAuthenticated', { name: 'username'})

    // return new Promise<GeoPlatformUser>((resolve, reject) => {
    const user = await this.check();
    if(user) return user

    // Case 1 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: true
    if(this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN){
      // Resolve with user once they have logged in
      this.messenger.on('userAuthenticated', (event: Event, user: GeoPlatformUser) => {
        return user
      })
    }
    // Case 2 - ALLOW_IFRAME_LOGIN: true | FORCE_LOGIN: false
    if(this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN){
      return null
    }
    // Case 3 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: true
    if(!this.config.ALLOW_IFRAME_LOGIN && this.config.FORCE_LOGIN){
      return null
    }
    // Case 4 - ALLOW_IFRAME_LOGIN: false | FORCE_LOGIN: false
    if(!this.config.ALLOW_IFRAME_LOGIN && !this.config.FORCE_LOGIN){
      return null // or reject?
    }
  };

  /**
   * Check function being used by some front end apps already.
   * (wrapper for getUser)
   *
   * @method check
   * @returns User or null
   */
  async check(): Promise<GeoPlatformUser>{
    const jwt = this.getJWT();

    // If no local JWT
    if(!jwt) {
      const freshJwt = await this.checkWithClient();

      return jwt && jwt.length ?
              this.getUserFromJWT(freshJwt) :
              null;
    }
    if(!this.isImplicitJWT(jwt)){ // Grant token
      return this.isExpired(jwt) ?
              await this.checkWithClient() // Check with server
                        .then(jwt => jwt && this.getUserFromJWT(jwt)) :
              this.getUserFromJWT(jwt);

    } else { // Implicit JWT
      return this.isExpired(jwt) ?
              Promise.reject(null) :
              this.getUserFromJWT(jwt);
    }
  }

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
  async checkWithClient(): Promise<any> {
    return this.config.AUTH_TYPE === 'token' ?
                null :
                axios(`${this.config.APP_BASE_URL}/checktoken`)
                          .then(() => this.getJWTfromLocalStorage())
  }

  //=====================================================

  /**
   * Extract token from current URL
   *
   * @method getJWTFromUrl
   *
   * @return JWT Token (raw string)
   */
  getJWTFromUrl(): string {
    const queryString = (window && window.location && window.location.hash) ?
                          window.location.hash :
                          window.location.toString();
    const res = queryString.match(/access_token=([^\&]*)/);
    return res && res[1];
  };

  /**
   * Is RPM library loaded already?
   */
  RPMLoaded():  boolean {
   return typeof window.RPMService != 'undefined'
  }

  /**
   * Get an associated array of cookies.
   */
  private getCookieObject(): StringObj  {
    return document.cookie.split(';')
                          .map(c => c.trim().split('='))
                          .reduce((acc: StringObj, pair) => {
                            acc[pair[0]] = pair[1]
                            return acc
                          }, {})
  }

  /**
   * Extract and decode from cookie
   *
   * @param key
   */
  private getFromCookie(key: string) {
    const raw = this.getCookieObject()[key]
    try{
      return raw ?
              atob(decodeURIComponent(raw)) :
              undefined;
    } catch (e){ // Catch bad encoding or formally not encoded
      return undefined;
    }
  };

  /**
   * Load the JWT stored in local storage.
   *
   * @method getJWTfromLocalStorage
   *
   * @return JWT Token
   */
  getJWTfromLocalStorage(): string {
    return this.getFromCookie(ACCESS_TOKEN_COOKIE)
  };

  /**
   * Attempt and pull JWT from the following locations (in order):
   *  - URL query parameter 'access_token' (returned from IDP)
   *  - Browser local storage (saved from previous request)
   *
   * @method getJWT
   *
   * @return JWT Token
   */
  getJWT(): string {
    const jwt = this.getJWTFromUrl() || this.getJWTfromLocalStorage()
    // Only deny implicit tokens that have expired
    if(!jwt || (jwt && this.isImplicitJWT(jwt) && this.isExpired(jwt))) {
      return null;
    } else {
      return jwt;
    }
  };

  /**
   * Is a token expired.
   *
   * @method isExpired
   * @param jwt - A JWT
   *
   * @return Boolean
   */
  isExpired(jwt: string): boolean {
    const parsedJWT = this.parseJwt(jwt)
    if(parsedJWT){
      const now = (new Date()).getTime() / 1000;
      return now > parsedJWT.exp;
    }
    return true
  };

  /**
   * Is the JWT an implicit JWT?
   * @param jwt
   */
  isImplicitJWT(jwt: string): boolean {
    const parsedJWT = this.parseJwt(jwt)
    return parsedJWT && parsedJWT.implicit;
  }

  /**
   * Unsafe (signature not checked) unpacking of JWT.
   *
   * @param token - Access Token (JWT)
   * @return the parsed payload in the JWT
   */
  parseJwt(token: string): JWT {
    var parsed;
    if (token) {
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        parsed = JSON.parse(atob(base64));
      } catch(e) { /* Don't throw parse error */ }
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
  validateJwt(token: string): boolean {
    var parsed = this.parseJwt(token);
    var valid = (parsed && parsed.exp && parsed.exp * 1000 > Date.now()) ? true : false;
    return valid;
  };
}


export const DefaultAuthConf: AuthConfig = {
  AUTH_TYPE: 'grant',
  APP_BASE_URL: '', // absolute path // use . for relative path
  ALLOW_IFRAME_LOGIN: true,
  FORCE_LOGIN: false,
  ALLOW_DEV_EDITS: false
}
