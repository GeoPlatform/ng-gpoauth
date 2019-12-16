import { AuthConfig, GeoPlatformUser, AuthService } from '@geoplatform/oauth-ng';
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
declare function ngGpoauthFactory(config?: AuthConfig): AuthService;
export { AuthService, AuthConfig, GeoPlatformUser, ngGpoauthFactory };
