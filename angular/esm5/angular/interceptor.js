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
         * @param {?} err - Error from server
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2ludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDOzs7Ozs7O0FBTXRDLDZCQUE2QixHQUFRO0lBQ2pDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7Q0FDM0I7Ozs7Ozs7QUFPRCx3QkFBd0IsR0FBUTtJQUM1QixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO0NBQzFCOztJQUtHLDBCQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtLQUFJOzs7Ozs7SUFFaEQsb0NBQVM7Ozs7O0lBQVQsVUFBVSxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O1FBTWxCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxHQUFHLEVBQUM7O1lBRUgsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDUixhQUFhLEVBQUUsWUFBVSxHQUFLO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUF3QjtZQUM3QyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7Z0JBQ3ZCLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUVoRCxJQUFNLFNBQVMsR0FBRyxVQUFVO3FCQUNQLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO3FCQUNyQixJQUFJLEVBQUUsQ0FBQzs7Z0JBRTVCLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7dUJBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFckUsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3ZDO1lBRUQsT0FBTyxLQUFLLENBQUM7U0FDaEI7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDN0I7YUFDSjtTQUNKOztRQU1ELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNyQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUVsRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7Z0JBNUVGLFVBQVU7Ozs7Z0JBbkJGLFdBQVc7OzJCQVhwQjs7U0ErQmEsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBSZXNwb25zZSxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRhcCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnO1xuXG4vKipcbiAqIEFuZ3VsYXIgYm9pbGVycGxhdGUgYmVjYXVzZTpcbiAqIEFuZ3VsYXI2IEh0dHBFcnJvclJlc3BvbnNlIDw+IEFuZ3VsYXI3IEhUVEVycm9yUFJlc3BvbnNlXG4gKi9cbmZ1bmN0aW9uIGlzSHR0cEVycm9yUmVzcG9uc2UoZXZ0OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXZ0ICYmIGV2dC5lcnJvcjtcbn1cblxuLyoqXG4gKiBBbmd1bGFyIGJvaWxlcnBsYXRlIGJlY2F1c2U6XG4gKiBBbmd1bGFyNiBIdHRwUmVzcG9uc2UgPD4gQW5ndWxhcjcgSFRUUFJlc3BvbnNlXG4gKiBAcGFyYW0gZXZ0XG4gKi9cbmZ1bmN0aW9uIGlzSHR0cFJlc3BvbnNlKGV2dDogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGV2dCAmJiBldnQuYm9keTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG5cbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBUT0RPOiB3ZSBuZWVkIHRvIGNoZWNrIGZvciBleHBpcmF0aW9uIGFuZCBkbyBhIHByZWZsaWdodCB0b1xuICAgICAgICAvLyAvY2hlY2t0b2tlbiBpZiB0aGUgY3VycmVudCB0b2tlbiBpcyBleHBpcmVkXG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgY29uc3Qgand0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1QoKTtcbiAgICAgICAgaWYoand0KXtcbiAgICAgICAgICAgIC8vIFNlbmQgb3VyIGN1cnJlbnQgdG9rZW5cbiAgICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtqd3R9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IHRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqICAtIGNoZWNrIHRoZSBVUkwgZm9yIGEgSldUXG4gICAgICAgICAqICAtIGNoZWNrIHRoZSAnQXV0aG9yaXphdGlvbicgaGVhZGVyIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBzZXQgYSBuZXcgSldUIGluIEF1dGhTZXJ2aWNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByZXNwIC0gSHR0cEV2ZW50PGFueT5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihldmVudDogSHR0cFJlc3BvbnNlPGFueT4pOiBIdHRwRXZlbnQ8YW55PiB7XG4gICAgICAgICAgICBpZiAoaXNIdHRwUmVzcG9uc2UoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgQXV0aEhlYWRlciA9IGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJykgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIGF1dGggaGVhZGVyc1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IEF1dGhIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdKd3QgPSAoKCEhdXJsSnd0ICYmIHVybEp3dC5sZW5ndGgpID8gdXJsSnd0IDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoKCEhaGVhZGVySnd0ICYmIGhlYWRlckp3dC5sZW5ndGgpID8gaGVhZGVySnd0IDogbnVsbClcblxuICAgICAgICAgICAgICAgIGlmKG5ld0p3dClcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpcyB0aGUgZXJyb3IgaGFuZGxlciB3aGVuIGFuIHVuYXV0aGVudGljYXRlZCByZXF1ZXN0XG4gICAgICAgICAqIGNvbWVzIGJhY2sgZnJvbSB0aGUgc2VydmVyLi4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoaXNIdHRwRXJyb3JSZXNwb25zZShldmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHJldHVybiB3aXRoIGhhbmRsZXJzXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjY0ODc0L2ludGVyY2VwdG9yLW1ha2luZy10d28tY2FsbHMtaW4tYXBpXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0LmhhbmRsZShyZXF1ZXN0KS5waXBlKFxuICAgICAgICAgICAgdGFwKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcikpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gIH1cbn0iXX0=