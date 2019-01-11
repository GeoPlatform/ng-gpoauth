/**
 * For Angluar 2+ (TypeScript)
 */
import { AuthService, GeoPlatformUser, DefaultAuthConf } from '../src/auth'

import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

// Setup messageProvider
type MSG = {
    name: string
    data: null | GeoPlatformUser
}
class msgProvider implements ngMessenger {
    sub: Subject<MSG>

    constructor(){
        this.sub = new Subject<MSG>();
    }

    get(){
        return this.sub;
    }

    broadcast(name, data){
        this.sub.next({name, data})
    }

    on(name, func){
        this.sub
            .pipe(filter((msg => msg.name === name)))
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