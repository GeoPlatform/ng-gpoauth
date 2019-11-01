import { AuthService, DefaultAuthConf } from './auth';
import { msgProvider } from './angular/index';
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export function ngGpoauthFactory(config) {
    return new AuthService(Object.assign({}, DefaultAuthConf, config), new msgProvider());
}
// Expose internal types
export { AuthService } from './auth';
export { GeoPlatformUser } from './GeoPlatformUser';
