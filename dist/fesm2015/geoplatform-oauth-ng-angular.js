import { Subject } from 'rxjs';
import { AuthService, DefaultAuthConf } from '@geoplatform/oauth-ng';
export { AuthService, GeoPlatformUser } from '@geoplatform/oauth-ng';

/**
 * Angular implementation of message handler
 */
class msgProvider {
    constructor() {
        this.sub = new Subject();
    }
    raw() {
        return this.sub;
    }
    broadcast(name, user) {
        this.sub.next({ name, user });
    }
    on(name, func) {
        this.sub
            .filter(msg => msg.name === name)
            .subscribe(msg => func(new Event(msg.name), msg.user));
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
function ngGpoauthFactory(config) {
    return new AuthService(Object.assign({}, DefaultAuthConf, config), new msgProvider());
}

/**
 * Generated bundle index. Do not edit.
 */

export { ngGpoauthFactory };
//# sourceMappingURL=geoplatform-oauth-ng-angular.js.map
