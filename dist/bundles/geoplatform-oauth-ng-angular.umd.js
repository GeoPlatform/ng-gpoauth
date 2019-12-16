(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@geoplatform/oauth-ng')) :
    typeof define === 'function' && define.amd ? define('@geoplatform/oauth-ng/angular', ['exports', 'rxjs', '@geoplatform/oauth-ng'], factory) :
    (global = global || self, factory((global.geoplatform = global.geoplatform || {}, global.geoplatform['oauth-ng'] = global.geoplatform['oauth-ng'] || {}, global.geoplatform['oauth-ng'].angular = {}), global.rxjs, global.geoplatform['oauth-ng']));
}(this, (function (exports, rxjs, oauthNg) { 'use strict';

    /**
     * Angular implementation of message handler
     */
    var msgProvider = /** @class */ (function () {
        function msgProvider() {
            this.sub = new rxjs.Subject();
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
        return new oauthNg.AuthService(Object.assign({}, oauthNg.DefaultAuthConf, config), new msgProvider());
    }

    Object.defineProperty(exports, 'AuthService', {
        enumerable: true,
        get: function () {
            return oauthNg.AuthService;
        }
    });
    Object.defineProperty(exports, 'GeoPlatformUser', {
        enumerable: true,
        get: function () {
            return oauthNg.GeoPlatformUser;
        }
    });
    exports.ngGpoauthFactory = ngGpoauthFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=geoplatform-oauth-ng-angular.umd.js.map
