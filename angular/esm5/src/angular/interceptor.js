/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor(authService) {
        this.authService = authService;
    }
    /**
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    TokenInterceptor.prototype.intercept = /**
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    function (request, next) {
        /** @type {?} */
        var updatedRequest;
        /** @type {?} */
        var jwt = this.authService.getJWT();
        if (!jwt) {
            // Carry on... nothing to do here
            updatedRequest = request;
        }
        else {
            /** @type {?} */
            var clone = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + jwt
                }
            });
            updatedRequest = clone;
        }
        /**
         * Handler for successful responses returned from the server.
         * This function must to the following:
         *  - check the URL for a JWT
         *  - check the 'Authorization' header for a JWT
         *  - set a new JWT in AuthService
         *
         * @param {?} event
         * @return {?}
         */
        function responseHandler(event) {
            if (event instanceof HttpResponse) {
                /** @type {?} */
                var urlJwt = this.authService.getJWTFromUrl();
                /** @type {?} */
                var headerJwt = event.headers.get('Authorization')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                var newJwt = urlJwt || headerJwt;
                if (newJwt)
                    this.authService.setAuth(newJwt);
                // TODO: may want to look at revoking if:
                //  'Authorization' : 'Bearer '
                // comes back from server....
            }
        }
        /**
         * The is the error handler when an unauthenticated request
         * comes back from the server...
         *
         * @param {?} err
         * @return {?}
         */
        function responseFailureHandler(err) {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // Should we check if forceLogin is set and force them???
                }
            }
        }
        // ==============================================//
        // setup and return with handlers
        return next
            .handle(updatedRequest)
            .do(responseHandler, responseFailureHandler);
    };
    TokenInterceptor.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    TokenInterceptor.ctorParameters = function () { return [
        { type: AuthService }
    ]; };
    return TokenInterceptor;
}());
export { TokenInterceptor };
if (false) {
    /** @type {?} */
    TokenInterceptor.prototype.authService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsic3JjL2FuZ3VsYXIvaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUVMLFlBQVksRUFFWixpQkFBaUIsRUFHbEIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDOztJQUtsQywwQkFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7S0FBSTs7Ozs7O0lBQ2hELG9DQUFTOzs7OztJQUFULFVBQVUsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsSUFBSSxjQUFjLENBQUM7O1FBSW5CLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxDQUFDLEdBQUcsRUFBQzs7WUFFSixjQUFjLEdBQUcsT0FBTyxDQUFDO1NBQzVCO2FBQU07O1lBRUgsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDMUIsVUFBVSxFQUFFO29CQUNSLGFBQWEsRUFBRSxZQUFVLEdBQUs7aUJBQ2pDO2FBQ0EsQ0FBQyxDQUFDO1lBQ0gsY0FBYyxHQUFHLEtBQUssQ0FBQztTQUMxQjs7Ozs7Ozs7Ozs7UUFhRCx5QkFBeUIsS0FBcUI7WUFDMUMsSUFBSSxLQUFLLFlBQVksWUFBWSxFQUFFOztnQkFFL0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7Z0JBR2hELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztxQkFDdkIsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7cUJBQ3JCLElBQUksRUFBRSxDQUFDOztnQkFFcEMsSUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQztnQkFFbkMsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzs7O2FBS3ZDO1NBQ0o7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxHQUFHLFlBQVksaUJBQWlCLEVBQUU7Z0JBQ2xDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7O2lCQUV2QjthQUNKO1NBQ0o7OztRQUtELE9BQU8sSUFBSTthQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUM7YUFDdEIsRUFBRSxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0tBQzFEOztnQkExRUYsVUFBVTs7OztnQkFIRixXQUFXOzsyQkFYcEI7O1NBZWEsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBSZXNwb25zZSxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgbGV0IHVwZGF0ZWRSZXF1ZXN0O1xuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIGNvbnN0IGp3dCA9IHRoaXMuYXV0aFNlcnZpY2UuZ2V0SldUKCk7XG4gICAgICAgIGlmKCFqd3Qpe1xuICAgICAgICAgICAgLy8gQ2Fycnkgb24uLi4gbm90aGluZyB0byBkbyBoZXJlXG4gICAgICAgICAgICB1cGRhdGVkUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZW5kIG91ciBjdXJyZW50IHRva2VuXG4gICAgICAgICAgICBsZXQgY2xvbmUgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7and0fWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdXBkYXRlZFJlcXVlc3QgPSBjbG9uZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBzdWNjZXNzZnVsIHJlc3BvbnNlcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gbXVzdCB0byB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgVVJMIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgJ0F1dGhvcml6YXRpb24nIGhlYWRlciBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gc2V0IGEgbmV3IEpXVCBpbiBBdXRoU2VydmljZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0h0dHBFdmVudDxhbnk+fSByZXNwIC0gcmVzcG9uc2UgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihldmVudDogSHR0cEV2ZW50PGFueT4pe1xuICAgICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIFVSTFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHRoaXMuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIGF1dGggaGVhZGVyc1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ0JlYXJlcicsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gdXJsSnd0IHx8IGhlYWRlckp3dDtcblxuICAgICAgICAgICAgICAgIGlmKG5ld0p3dClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcblxuICAgICAgICAgICAgICAgIC8vIFRPRE86IG1heSB3YW50IHRvIGxvb2sgYXQgcmV2b2tpbmcgaWY6XG4gICAgICAgICAgICAgICAgLy8gICdBdXRob3JpemF0aW9uJyA6ICdCZWFyZXIgJ1xuICAgICAgICAgICAgICAgIC8vIGNvbWVzIGJhY2sgZnJvbSBzZXJ2ZXIuLi4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGlzIHRoZSBlcnJvciBoYW5kbGVyIHdoZW4gYW4gdW5hdXRoZW50aWNhdGVkIHJlcXVlc3RcbiAgICAgICAgICogY29tZXMgYmFjayBmcm9tIHRoZSBzZXJ2ZXIuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyIC0gRXJyb3IgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIoZXJyOiBhbnkpe1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgd2UgY2hlY2sgaWYgZm9yY2VMb2dpbiBpcyBzZXQgYW5kIGZvcmNlIHRoZW0/Pz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cblxuICAgICAgICAvLyBzZXR1cCBhbmQgcmV0dXJuIHdpdGggaGFuZGxlcnNcbiAgICAgICAgcmV0dXJuIG5leHRcbiAgICAgICAgICAgICAgICAuaGFuZGxlKHVwZGF0ZWRSZXF1ZXN0KVxuICAgICAgICAgICAgICAgIC5kbyhyZXNwb25zZUhhbmRsZXIsIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIpO1xuICB9XG59Il19