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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0lBS2xDLDBCQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtLQUFJOzs7Ozs7SUFDaEQsb0NBQVM7Ozs7O0lBQVQsVUFBVSxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxJQUFJLGNBQWMsQ0FBQzs7UUFJbkIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxJQUFHLENBQUMsR0FBRyxFQUFDOztZQUVKLGNBQWMsR0FBRyxPQUFPLENBQUM7U0FDNUI7YUFBTTs7WUFFSCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUMxQixVQUFVLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFlBQVUsR0FBSztpQkFDakM7YUFDQSxDQUFDLENBQUM7WUFDSCxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzFCOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUFxQjtZQUMxQyxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7O2dCQUUvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFHaEQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO3FCQUN2QixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDckIsSUFBSSxFQUFFLENBQUM7O2dCQUVwQyxJQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDO2dCQUVuQyxJQUFHLE1BQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Ozs7YUFLdkM7U0FDSjs7Ozs7Ozs7UUFRRCxnQ0FBZ0MsR0FBUTtZQUNwQyxJQUFJLEdBQUcsWUFBWSxpQkFBaUIsRUFBRTtnQkFDbEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTs7aUJBRXZCO2FBQ0o7U0FDSjs7O1FBS0QsT0FBTyxJQUFJO2FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUN0QixFQUFFLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUM7S0FDMUQ7O2dCQTFFRixVQUFVOzs7O2dCQUhGLFdBQVc7OzJCQVhwQjs7U0FlYSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cFJlc3BvbnNlLFxuICBIdHRwSGFuZGxlcixcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBsZXQgdXBkYXRlZFJlcXVlc3Q7XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgY29uc3Qgand0ID0gdGhpcy5hdXRoU2VydmljZS5nZXRKV1QoKTtcbiAgICAgICAgaWYoIWp3dCl7XG4gICAgICAgICAgICAvLyBDYXJyeSBvbi4uLiBub3RoaW5nIHRvIGRvIGhlcmVcbiAgICAgICAgICAgIHVwZGF0ZWRSZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNlbmQgb3VyIGN1cnJlbnQgdG9rZW5cbiAgICAgICAgICAgIGxldCBjbG9uZSA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtqd3R9YFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB1cGRhdGVkUmVxdWVzdCA9IGNsb25lO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IHRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqICAtIGNoZWNrIHRoZSBVUkwgZm9yIGEgSldUXG4gICAgICAgICAqICAtIGNoZWNrIHRoZSAnQXV0aG9yaXphdGlvbicgaGVhZGVyIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBzZXQgYSBuZXcgSldUIGluIEF1dGhTZXJ2aWNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SHR0cEV2ZW50PGFueT59IHJlc3AgLSByZXNwb25zZSBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VIYW5kbGVyKGV2ZW50OiBIdHRwRXZlbnQ8YW55Pil7XG4gICAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gdGhpcy5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gYXV0aCBoZWFkZXJzXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVySnd0ID0gZXZlbnQuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdKd3QgPSB1cmxKd3QgfHwgaGVhZGVySnd0O1xuXG4gICAgICAgICAgICAgICAgaWYobmV3Snd0KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLnNldEF1dGgobmV3Snd0KVxuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogbWF5IHdhbnQgdG8gbG9vayBhdCByZXZva2luZyBpZjpcbiAgICAgICAgICAgICAgICAvLyAgJ0F1dGhvcml6YXRpb24nIDogJ0JlYXJlciAnXG4gICAgICAgICAgICAgICAgLy8gY29tZXMgYmFjayBmcm9tIHNlcnZlci4uLi5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCB3ZSBjaGVjayBpZiBmb3JjZUxvZ2luIGlzIHNldCBhbmQgZm9yY2UgdGhlbT8/P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCByZXR1cm4gd2l0aCBoYW5kbGVyc1xuICAgICAgICByZXR1cm4gbmV4dFxuICAgICAgICAgICAgICAgIC5oYW5kbGUodXBkYXRlZFJlcXVlc3QpXG4gICAgICAgICAgICAgICAgLmRvKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcik7XG4gIH1cbn0iXX0=