/**
 * For AngluarJS (Angluar1 : JavaScript)
 */
import { AuthService, DefaultAuthConf } from '@geoplatform/oauth-ng';
/**
 * Detect if AngularJS (Angular version 1) is present
 *
 * @method isAngularJS
 * @returns {boolean}
 */
function isAngularJS() {
    return window
        && window.angular
        && window.angular.version.major === 1;
}
(function (angular) {
    if (!isAngularJS())
        return false;
    angular.module("ng-gpoauth", ['$rootScope'])
        // Expose service ========================================
        .service('ng-authServiceFactory', ['$rootScope', function (msgProvider) {
            /**
             * Combine the user passed in configuration with defaults and return
             * the final service.
             */
            return function (userConfig) {
                var authConfig = Object.assign({}, DefaultAuthConf, userConfig);
                return new AuthService(authConfig, msgProvider);
            };
        }]);
})(angular);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvYW5ndWxhcmpzLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7O0dBRUc7QUFDSCxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVCQUF1QixDQUFBO0FBR3BFOzs7OztHQUtHO0FBQ0gsU0FBUyxXQUFXO0lBQ2hCLE9BQU8sTUFBTTtXQUNBLE1BQU8sQ0FBQyxPQUFPO1dBQ2YsTUFBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxDQUFDO0FBRUQsQ0FBQyxVQUFTLE9BQU87SUFFYixJQUFHLENBQUMsV0FBVyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUE7SUFFL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU1QywwREFBMEQ7U0FDekQsT0FBTyxDQUFDLHVCQUF1QixFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVMsV0FBVztZQUVqRTs7O2VBR0c7WUFDSCxPQUFPLFVBQVMsVUFBVTtnQkFDdEIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFBO2dCQUMvRCxPQUFPLElBQUksV0FBVyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUNuRCxDQUFDLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRVAsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBhbmd1bGFyOiBhbnlcbi8qKlxuICogRm9yIEFuZ2x1YXJKUyAoQW5nbHVhcjEgOiBKYXZhU2NyaXB0KVxuICovXG5pbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnQGdlb3BsYXRmb3JtL29hdXRoLW5nJ1xuXG5cbi8qKlxuICogRGV0ZWN0IGlmIEFuZ3VsYXJKUyAoQW5ndWxhciB2ZXJzaW9uIDEpIGlzIHByZXNlbnRcbiAqXG4gKiBAbWV0aG9kIGlzQW5ndWxhckpTXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNBbmd1bGFySlMoKXtcbiAgICByZXR1cm4gd2luZG93XG4gICAgICAgICYmICg8YW55PndpbmRvdykuYW5ndWxhclxuICAgICAgICAmJiAoPGFueT53aW5kb3cpLmFuZ3VsYXIudmVyc2lvbi5tYWpvciA9PT0gMVxufVxuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgaWYoIWlzQW5ndWxhckpTKCkpIHJldHVybiBmYWxzZVxuXG4gICAgYW5ndWxhci5tb2R1bGUoXCJuZy1ncG9hdXRoXCIsIFsnJHJvb3RTY29wZSddKVxuXG4gICAgLy8gRXhwb3NlIHNlcnZpY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC5zZXJ2aWNlKCduZy1hdXRoU2VydmljZUZhY3RvcnknLCBbJyRyb290U2NvcGUnLCBmdW5jdGlvbihtc2dQcm92aWRlcil7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbWJpbmUgdGhlIHVzZXIgcGFzc2VkIGluIGNvbmZpZ3VyYXRpb24gd2l0aCBkZWZhdWx0cyBhbmQgcmV0dXJuXG4gICAgICAgICAqIHRoZSBmaW5hbCBzZXJ2aWNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHVzZXJDb25maWcpe1xuICAgICAgICAgICAgdmFyIGF1dGhDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0QXV0aENvbmYsIHVzZXJDb25maWcpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEF1dGhTZXJ2aWNlKGF1dGhDb25maWcsIG1zZ1Byb3ZpZGVyKVxuICAgICAgICB9XG4gICAgfV0pXG5cbn0pKGFuZ3VsYXIpXG4iXX0=