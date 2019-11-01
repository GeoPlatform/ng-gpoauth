/**
 * For AngluarJS (Angluar1 : JavaScript)
 */
import { AuthService, DefaultAuthConf } from '../auth'
import {} from './polyfill'

/**
 * Detect if AngularJS (Angular version 1) is present
 *
 * @method isAngularJS
 * @returns {boolean}
 */
function isAngularJS(){
    return window
        && window.angular
        && window.angular.version.major === 1
}

(function(angular) {

    if(!isAngularJS()) return false

    angular.module("ng-gpoauth", ['$rootScope'])

    // Expose service ========================================
    .service('ng-authServiceFactory', ['$rootScope', function(msgProvider){

        /**
         * Combine the user passed in configuration with defaults and return
         * the final service.
         */
        return function(userConfig){
            var authConfig = Object.assign({}, DefaultAuthConf, userConfig)
            return new AuthService(authConfig, msgProvider)
        }
    }])

})(angular)