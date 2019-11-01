import { Subject } from "rxjs"
import { GeoPlatformUser } from './GeoPlatformUser'

/*
 * Common types to ng-gpoauth (used in both AngularJS and Angular(2+))
 */

/**
 * Common configuration object used by ng-common.
 *
 * Its expected that this object will exist in the global scope where
 * ng-common is loaded and run.
 *
 * @type GeoPlatform
 */
export type AuthConfig = {
  // Auth Settings
  AUTH_TYPE?: 'grant' | 'token'
  IDP_BASE_URL?: string
  APP_BASE_URL?: string
  APP_ID?: boolean
  ALLOW_IFRAME_LOGIN?: boolean
  FORCE_LOGIN?: boolean
  CALLBACK?: string
  LOGIN_URL?: string
  LOGOUT_URL?: string
  ALLOW_DEV_EDITS?: boolean
  tokenCheckInterval?: number
  // RPM Settings
  loadRPM?: boolean,
  RPMVersion?: string
}

/**
 * JWT object returned from gpoauth server.
 *
 * @type JWT
 */
type JWT = {
  sub: string
  name: string
  email: string
  username: string
  roles: string
  groups: [{_id: string, name: string}]
  orgs: [{_id: string, name: string}]
  scope: [string]
  iss: string
  aud: string
  nonce: string
  iat: number
  exp: number
  implicit?: boolean
}

type IDPRole = 'admin'
              | 'staff'
              | 'user'


export type authMessage = 'userAuthenticated'
                        | 'userSignOut'
                        | 'auth:requireLogin'
                        | 'auth:iframeLoginShow'
                        | 'auth:iframeLoginHide'

/**
 * @type userProfile
 */
type UserProfile = {
  _id: string
  modificationDate: string
  creationDate: string
  username: string
  title: string
  firstName: string
  lastName: string
  middleName: string
  email: string
  appRole: IDPRole
  __v: number
  lastLogin: string
  resetHash: null
  resetExp: null
  appSettings: [object]
  auditLog: [undefined]
  lockoutCount: number
  lockedOut: Boolean
}

declare interface httpProvider {
  get<T>(url: string, headers: {}): Promise<T>
}

export type MSG = {
  name: authMessage
  user?: GeoPlatformUser // or null
}

/**
 * An abstracted messanger object so that any version of Angular
 * (or other framework) is able to implement a messenger.
 */
declare interface ngMessenger<T= Subject<MSG>> {
  /**
   * Get the raw messaging mechanism
   */
  raw(): T

  /**
   *
   */
  broadcast(name: authMessage, msg?: any): any

  /**
   * Message Listener
   *
   * @param msgName
   * @param func
   */
  on(msgName: authMessage, func: (event: Event, data: any) => any)
}