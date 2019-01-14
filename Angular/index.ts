/**
 * For Angluar 2+ (TypeScript)
 */
import { MSG, ngMessenger, AuthConfig, authMessage } from '../src/authTypes'
import { AuthService, DefaultAuthConf } from '../src/auth'
import { GeoPlatformUser } from '../src/GeoPlatformUser'

import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

// Setup messageProvider

class msgProvider implements ngMessenger<Subject<MSG>> {
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
            .pipe(filter(msg => msg.name === name))
            .subscribe(msg => func(new Event(msg.name), msg.user))
    }
}


/**
 * Expose the class that can be loaded in Angular
 */
export function ngGpoauthFactory(config?: AuthConfig): AuthService {
    return new AuthService(config || DefaultAuthConf,  new msgProvider())
}

// Expose internal types
export { AuthService } from '../src/auth'
export { GeoPlatformUser } from '../src/GeoPlatformUser'