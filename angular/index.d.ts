import { AuthService } from './auth';
import { AuthConfig } from './authTypes';
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export declare function ngGpoauthFactory(config?: AuthConfig): AuthService;
export { AuthService } from './auth';
export { AuthConfig } from './authTypes';
export { TokenInterceptor } from './angular/interceptor';
export { GeoPlatformUser } from './GeoPlatformUser';
