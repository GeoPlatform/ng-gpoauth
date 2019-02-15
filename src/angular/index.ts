/**
 * For Angluar 2+ (TypeScript)
 */
import { MSG, ngMessenger, AuthConfig, authMessage } from '../authTypes'
import { AuthService, DefaultAuthConf } from '../auth'
import { GeoPlatformUser } from '../GeoPlatformUser'

import { Subject } from 'rxjs'

// Setup messageProvider

export class msgProvider implements ngMessenger<Subject<MSG>> {
    sub: Subject<MSG>

    constructor(){
        this.sub = new Subject<MSG>();
    }

    raw(){
        return this.sub;
    }

    broadcast(name: authMessage, user: GeoPlatformUser){
        this.sub.next({name, user})
    }

    on(name: authMessage, func: (e: Event, data: GeoPlatformUser) => any){
        this.sub
            .filter(msg => msg.name === name)
            .subscribe(msg => func(new Event(msg.name), msg.user))
    }
}


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
export { AuthService } from '../auth'
export { GeoPlatformUser } from '../GeoPlatformUser'
export { TokenInterceptor } from './interceptor'