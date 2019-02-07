import { AuthService, DefaultAuthConf } from './src/auth'
import { AuthConfig } from './src/authTypes'
import { msgProvider } from './src/angular/index'

/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export function ngGpoauthFactory(config?: AuthConfig): AuthService {
    return new AuthService(config || DefaultAuthConf,  new msgProvider())
}

// Expose internal types
export { AuthService } from './src/auth'
export { GeoPlatformUser } from './src/GeoPlatformUser'
export { TokenInterceptor } from './src/angular/interceptor'