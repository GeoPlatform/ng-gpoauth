import { Subject } from 'rxjs'
import { MSG
       , Messenger
       , authMessage
       , AuthConfig
       , GeoPlatformUser
       , AuthService
       , DefaultAuthConf } from '@geoplatform/oauth-ng'

/**
 * Angular implementation of message handler
 */
class msgProvider implements Messenger<Subject<MSG>> {
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
function ngGpoauthFactory(config?: AuthConfig): AuthService {
    return new AuthService(Object.assign({}, DefaultAuthConf, config),  new msgProvider())
}

// Expose API for consumption
export { AuthService
       , AuthConfig
       , GeoPlatformUser
       , ngGpoauthFactory }