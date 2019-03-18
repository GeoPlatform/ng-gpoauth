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
        var self = this;
        /** @type {?} */
        var jwt = self.authService.getJWT();
        if (jwt) {
            // Send our current token
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + jwt
                }
            });
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
                var urlJwt = self.authService.getJWTFromUrl();
                /** @type {?} */
                var headerJwt = event.headers.get('Authorization')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                var newJwt = urlJwt || headerJwt;
                if (newJwt)
                    self.authService.setAuth(newJwt);
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
            .handle(request)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0lBTWxDLDBCQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtLQUFJOzs7Ozs7SUFFaEQsb0NBQVM7Ozs7O0lBQVQsVUFBVSxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O1FBTWxCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxHQUFHLEVBQUM7O1lBRUgsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDUixhQUFhLEVBQUUsWUFBVSxHQUFLO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUFxQjtZQUMxQyxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7O2dCQUUvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFHaEQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO3FCQUN2QixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDckIsSUFBSSxFQUFFLENBQUM7O2dCQUVwQyxJQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDO2dCQUVuQyxJQUFHLE1BQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Ozs7YUFLdkM7U0FDSjs7Ozs7Ozs7UUFRRCxnQ0FBZ0MsR0FBUTtZQUNwQyxJQUFJLEdBQUcsWUFBWSxpQkFBaUIsRUFBRTtnQkFDbEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTs7aUJBRXZCO2FBQ0o7U0FDSjs7O1FBS0QsT0FBTyxJQUFJO2FBQ0YsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNmLEVBQUUsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztLQUMxRDs7Z0JBMUVGLFVBQVU7Ozs7Z0JBSEYsV0FBVzs7MkJBWHBCOztTQWVhLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBSZXF1ZXN0LFxuICBIdHRwUmVzcG9uc2UsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cEV2ZW50LFxuICBIdHRwSW50ZXJjZXB0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gVE9ETzogd2UgbmVlZCB0byBjaGVjayBmb3IgZXhwaXJhdGlvbiBhbmQgZG8gYSBwcmVmbGlnaHQgdG9cbiAgICAgICAgLy8gL2NoZWNrdG9rZW4gaWYgdGhlIGN1cnJlbnQgdG9rZW4gaXMgZXhwaXJlZFxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIGNvbnN0IGp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldUKCk7XG4gICAgICAgIGlmKGp3dCl7XG4gICAgICAgICAgICAvLyBTZW5kIG91ciBjdXJyZW50IHRva2VuXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7and0fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBzdWNjZXNzZnVsIHJlc3BvbnNlcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gbXVzdCB0byB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgVVJMIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgJ0F1dGhvcml6YXRpb24nIGhlYWRlciBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gc2V0IGEgbmV3IEpXVCBpbiBBdXRoU2VydmljZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0h0dHBFdmVudDxhbnk+fSByZXNwIC0gcmVzcG9uc2UgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihldmVudDogSHR0cEV2ZW50PGFueT4pe1xuICAgICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIFVSTFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIGF1dGggaGVhZGVyc1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ0JlYXJlcicsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gdXJsSnd0IHx8IGhlYWRlckp3dDtcblxuICAgICAgICAgICAgICAgIGlmKG5ld0p3dClcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcblxuICAgICAgICAgICAgICAgIC8vIFRPRE86IG1heSB3YW50IHRvIGxvb2sgYXQgcmV2b2tpbmcgaWY6XG4gICAgICAgICAgICAgICAgLy8gICdBdXRob3JpemF0aW9uJyA6ICdCZWFyZXIgJ1xuICAgICAgICAgICAgICAgIC8vIGNvbWVzIGJhY2sgZnJvbSBzZXJ2ZXIuLi4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGlzIHRoZSBlcnJvciBoYW5kbGVyIHdoZW4gYW4gdW5hdXRoZW50aWNhdGVkIHJlcXVlc3RcbiAgICAgICAgICogY29tZXMgYmFjayBmcm9tIHRoZSBzZXJ2ZXIuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyIC0gRXJyb3IgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIoZXJyOiBhbnkpe1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgd2UgY2hlY2sgaWYgZm9yY2VMb2dpbiBpcyBzZXQgYW5kIGZvcmNlIHRoZW0/Pz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cblxuICAgICAgICAvLyBzZXR1cCBhbmQgcmV0dXJuIHdpdGggaGFuZGxlcnNcbiAgICAgICAgcmV0dXJuIG5leHRcbiAgICAgICAgICAgICAgICAuaGFuZGxlKHJlcXVlc3QpXG4gICAgICAgICAgICAgICAgLmRvKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcik7XG4gIH1cbn0iXX0=