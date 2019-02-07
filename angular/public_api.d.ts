import { AuthService } from './src/auth';
import { AuthConfig } from './src/authTypes';
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export declare function ngGpoauthFactory(config?: AuthConfig): AuthService;
export { AuthService } from './src/auth';
export { GeoPlatformUser } from './src/GeoPlatformUser';
export { TokenInterceptor } from './src/angular/interceptor';
