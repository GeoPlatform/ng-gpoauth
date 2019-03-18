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
                var headerJwt = (event.headers.get('Authorization') || '')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                var newJwt = ((!!urlJwt && urlJwt.length) ? urlJwt : null)
                    || ((!!headerJwt && headerJwt.length) ? headerJwt : null);
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
        /** @type {?} */
        var handler = next.handle(request);
        handler.subscribe(responseHandler, responseFailureHandler);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0lBTWxDLDBCQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtLQUFJOzs7Ozs7SUFFaEQsb0NBQVM7Ozs7O0lBQVQsVUFBVSxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O1FBTWxCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxHQUFHLEVBQUM7O1lBRUgsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDUixhQUFhLEVBQUUsWUFBVSxHQUFLO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUFxQjtZQUMxQyxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7O2dCQUUvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFHaEQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQy9CLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO3FCQUNyQixJQUFJLEVBQUUsQ0FBQzs7Z0JBRXBDLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7dUJBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFckUsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzs7O2FBS3ZDO1NBQ0o7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxHQUFHLFlBQVksaUJBQWlCLEVBQUU7Z0JBQ2xDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7O2lCQUV2QjthQUNKO1NBQ0o7O1FBS0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBRTNELE9BQU8sT0FBTyxDQUFBO0tBQ25COztnQkE1RUYsVUFBVTs7OztnQkFIRixXQUFXOzsyQkFYcEI7O1NBZWEsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBSZXNwb25zZSxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG5cbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBUT0RPOiB3ZSBuZWVkIHRvIGNoZWNrIGZvciBleHBpcmF0aW9uIGFuZCBkbyBhIHByZWZsaWdodCB0b1xuICAgICAgICAvLyAvY2hlY2t0b2tlbiBpZiB0aGUgY3VycmVudCB0b2tlbiBpcyBleHBpcmVkXG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgY29uc3Qgand0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1QoKTtcbiAgICAgICAgaWYoand0KXtcbiAgICAgICAgICAgIC8vIFNlbmQgb3VyIGN1cnJlbnQgdG9rZW5cbiAgICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtqd3R9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IHRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqICAtIGNoZWNrIHRoZSBVUkwgZm9yIGEgSldUXG4gICAgICAgICAqICAtIGNoZWNrIHRoZSAnQXV0aG9yaXphdGlvbicgaGVhZGVyIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBzZXQgYSBuZXcgSldUIGluIEF1dGhTZXJ2aWNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SHR0cEV2ZW50PGFueT59IHJlc3AgLSByZXNwb25zZSBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VIYW5kbGVyKGV2ZW50OiBIdHRwRXZlbnQ8YW55Pil7XG4gICAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gYXV0aCBoZWFkZXJzXG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVySnd0ID0gKGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJykgfHwgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0p3dCA9ICgoISF1cmxKd3QgJiYgdXJsSnd0Lmxlbmd0aCkgPyB1cmxKd3QgOiBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICgoISFoZWFkZXJKd3QgJiYgaGVhZGVySnd0Lmxlbmd0aCkgPyBoZWFkZXJKd3QgOiBudWxsKVxuXG4gICAgICAgICAgICAgICAgaWYobmV3Snd0KVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLnNldEF1dGgobmV3Snd0KVxuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogbWF5IHdhbnQgdG8gbG9vayBhdCByZXZva2luZyBpZjpcbiAgICAgICAgICAgICAgICAvLyAgJ0F1dGhvcml6YXRpb24nIDogJ0JlYXJlciAnXG4gICAgICAgICAgICAgICAgLy8gY29tZXMgYmFjayBmcm9tIHNlcnZlci4uLi5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCB3ZSBjaGVjayBpZiBmb3JjZUxvZ2luIGlzIHNldCBhbmQgZm9yY2UgdGhlbT8/P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCByZXR1cm4gd2l0aCBoYW5kbGVyc1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gICAgICAgIGhhbmRsZXIuc3Vic2NyaWJlKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxufSJdfQ==