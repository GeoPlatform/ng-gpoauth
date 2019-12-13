import { AuthService, DefaultAuthConf } from './auth'
import { AuthConfig } from './authTypes'
import { msgProvider } from './angular/index'

/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export function ngGpoauthFactory(config?: AuthConfig): AuthService {
    return new AuthService(Object.assign({}, DefaultAuthConf, config),  new msgProvider())
}

// Expose internal types
export { AuthService } from './auth'
export { AuthConfig } from './authTypes'
export { TokenInterceptor } from './angular/interceptor'
export { GeoPlatformUser } from './GeoPlatformUser'