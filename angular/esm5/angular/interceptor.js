/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { tap } from "rxjs/operators";
import { AuthService } from '../auth';
/**
 * Angular boilerplate because:
 * Angular6 HttpErrorResponse <> Angular7 HTTErrorPResponse
 * @param {?} evt
 * @return {?}
 */
function isHttpErrorResponse(evt) {
    return evt && evt.error;
}
/**
 * Angular boilerplate because:
 * Angular6 HttpResponse <> Angular7 HTTPResponse
 * @param {?} evt
 * @return {?}
 */
function isHttpResponse(evt) {
    return evt && evt.body;
}
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
            if (isHttpResponse(event)) {
                /** @type {?} */
                var AuthHeader = event.headers.get('Authorization') || '';
                /** @type {?} */
                var urlJwt = self.authService.getJWTFromUrl();
                /** @type {?} */
                var headerJwt = AuthHeader
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                var newJwt = ((!!urlJwt && urlJwt.length) ? urlJwt : null)
                    || ((!!headerJwt && headerJwt.length) ? headerJwt : null);
                if (newJwt)
                    self.authService.setAuth(newJwt);
            }
            return event;
        }
        /**
         * The is the error handler when an unauthenticated request
         * comes back from the server...
         *
         * @param {?} err
         * @return {?}
         */
        function responseFailureHandler(err) {
            if (isHttpErrorResponse(event)) {
                if (err.status === 401) {
                    self.authService.logout();
                }
            }
        }
        /** @type {?} */
        var handler = next.handle(request).pipe(tap(responseHandler, responseFailureHandler));
        return handler;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVMzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7Ozs7OztBQU10Qyw2QkFBNkIsR0FBUTtJQUNqQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0NBQzNCOzs7Ozs7O0FBT0Qsd0JBQXdCLEdBQVE7SUFDNUIsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztDQUMxQjs7SUFLRywwQkFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7S0FBSTs7Ozs7O0lBRWhELG9DQUFTOzs7OztJQUFULFVBQVUsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQU1sQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RDLElBQUcsR0FBRyxFQUFDOztZQUVILE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNwQixVQUFVLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFlBQVUsR0FBSztpQkFDakM7YUFDSixDQUFDLENBQUM7U0FDTjs7Ozs7Ozs7Ozs7UUFhRCx5QkFBeUIsS0FBd0I7WUFDN0MsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7O2dCQUN2QixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7O2dCQUc1RCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFFaEQsSUFBTSxTQUFTLEdBQUcsVUFBVTtxQkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDckIsSUFBSSxFQUFFLENBQUM7O2dCQUU1QixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3VCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXJFLElBQUcsTUFBTTtvQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUN2QztZQUVELE9BQU8sS0FBSyxDQUFDO1NBQ2hCOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQzdCO2FBQ0o7U0FDSjs7UUFLRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDckMsR0FBRyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFFbEQsT0FBTyxPQUFPLENBQUE7S0FDbkI7O2dCQTNFRixVQUFVOzs7O2dCQW5CRixXQUFXOzsyQkFYcEI7O1NBK0JhLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBSZXF1ZXN0LFxuICBIdHRwUmVzcG9uc2UsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuLyoqXG4gKiBBbmd1bGFyIGJvaWxlcnBsYXRlIGJlY2F1c2U6XG4gKiBBbmd1bGFyNiBIdHRwRXJyb3JSZXNwb25zZSA8PiBBbmd1bGFyNyBIVFRFcnJvclBSZXNwb25zZVxuICovXG5mdW5jdGlvbiBpc0h0dHBFcnJvclJlc3BvbnNlKGV2dDogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGV2dCAmJiBldnQuZXJyb3I7XG59XG5cbi8qKlxuICogQW5ndWxhciBib2lsZXJwbGF0ZSBiZWNhdXNlOlxuICogQW5ndWxhcjYgSHR0cFJlc3BvbnNlIDw+IEFuZ3VsYXI3IEhUVFBSZXNwb25zZVxuICogQHBhcmFtIGV2dFxuICovXG5mdW5jdGlvbiBpc0h0dHBSZXNwb25zZShldnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBldnQgJiYgZXZ0LmJvZHk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gVE9ETzogd2UgbmVlZCB0byBjaGVjayBmb3IgZXhwaXJhdGlvbiBhbmQgZG8gYSBwcmVmbGlnaHQgdG9cbiAgICAgICAgLy8gL2NoZWNrdG9rZW4gaWYgdGhlIGN1cnJlbnQgdG9rZW4gaXMgZXhwaXJlZFxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIGNvbnN0IGp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldUKCk7XG4gICAgICAgIGlmKGp3dCl7XG4gICAgICAgICAgICAvLyBTZW5kIG91ciBjdXJyZW50IHRva2VuXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7and0fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBzdWNjZXNzZnVsIHJlc3BvbnNlcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gbXVzdCB0byB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgVVJMIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgJ0F1dGhvcml6YXRpb24nIGhlYWRlciBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gc2V0IGEgbmV3IEpXVCBpbiBBdXRoU2VydmljZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0h0dHBFdmVudDxhbnk+fSByZXNwIC0gcmVzcG9uc2UgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihldmVudDogSHR0cFJlc3BvbnNlPGFueT4pOiBIdHRwRXZlbnQ8YW55PiB7XG4gICAgICAgICAgICBpZiAoaXNIdHRwUmVzcG9uc2UoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgQXV0aEhlYWRlciA9IGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJykgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIGF1dGggaGVhZGVyc1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IEF1dGhIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdKd3QgPSAoKCEhdXJsSnd0ICYmIHVybEp3dC5sZW5ndGgpID8gdXJsSnd0IDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoKCEhaGVhZGVySnd0ICYmIGhlYWRlckp3dC5sZW5ndGgpID8gaGVhZGVySnd0IDogbnVsbClcblxuICAgICAgICAgICAgICAgIGlmKG5ld0p3dClcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpcyB0aGUgZXJyb3IgaGFuZGxlciB3aGVuIGFuIHVuYXV0aGVudGljYXRlZCByZXF1ZXN0XG4gICAgICAgICAqIGNvbWVzIGJhY2sgZnJvbSB0aGUgc2VydmVyLi4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyciAtIEVycm9yIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUZhaWx1cmVIYW5kbGVyKGVycjogYW55KXtcbiAgICAgICAgICAgIGlmIChpc0h0dHBFcnJvclJlc3BvbnNlKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cblxuICAgICAgICAvLyBzZXR1cCBhbmQgcmV0dXJuIHdpdGggaGFuZGxlcnNcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5leHQuaGFuZGxlKHJlcXVlc3QpLnBpcGUoXG4gICAgICAgICAgICB0YXAocmVzcG9uc2VIYW5kbGVyLCByZXNwb25zZUZhaWx1cmVIYW5kbGVyKSk7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxufSJdfQ==