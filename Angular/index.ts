/**
 * For Angluar 2+ (TypeScript)
 */
import { AuthService, GeoPlatformUser, DefaultAuthConf } from '../src/auth'

import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

// Setup messageProvider
type MSG = {
    name: authMessage
    data: GeoPlatformUser // or null
}
class msgProvider implements ngMessenger<Subject<MSG>> {
    sub: Subject<MSG>

    constructor(){
        this.sub = new Subject<MSG>();
    }

    raw(){
        return this.sub;
    }

    broadcast(name: authMessage, data: GeoPlatformUser){
        this.sub.next({name, data})
    }

    on(name: authMessage, func: (e: Event, data: GeoPlatformUser) => any){
        this.sub
            .pipe(filter(msg => msg.name === name))
            .subscribe(msg => func(new Event(msg.name), msg.data))
    }
}


/**
 * Expose the class that can be loaded in Angular
 */
export function ngGpoauthFactory(config?: AuthConfig): AuthService {
    return new AuthService(config || DefaultAuthConf,  new msgProvider())
}

// Expose internal types
export { GeoPlatformUser, AuthService } from '../src/auth'