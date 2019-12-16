import { Subject } from 'rxjs';
import { AuthService, DefaultAuthConf } from '@geoplatform/oauth-ng';
export { AuthService, GeoPlatformUser } from '@geoplatform/oauth-ng';

/**
 * Angular implementation of message handler
 */
var msgProvider = /** @class */ (function () {
    function msgProvider() {
        this.sub = new Subject();
    }
    msgProvider.prototype.raw = function () {
        return this.sub;
    };
    msgProvider.prototype.broadcast = function (name, user) {
        this.sub.next({ name: name, user: user });
    };
    msgProvider.prototype.on = function (name, func) {
        this.sub
            .filter(function (msg) { return msg.name === name; })
            .subscribe(function (msg) { return func(new Event(msg.name), msg.user); });
    };
    return msgProvider;
}());
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
