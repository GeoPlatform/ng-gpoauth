/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
/** @type {?} */
var REVOKE_RESPONSE = 'Bearer ';
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
                var AuthHeader = event.headers.get('Authorization') || '';
                // Revoke local (localstorage) JWT if signaled by node-gpoauth
                if (AuthHeader === REVOKE_RESPONSE) {
                    self.authService.logout();
                    // Check for new JWT
                }
                else {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBR3RDLElBQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQzs7SUFLOUIsMEJBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUVoRCxvQ0FBUzs7Ozs7SUFBVCxVQUFVLE9BQXlCLEVBQUUsSUFBaUI7O1FBQ2xELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFNbEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxJQUFHLEdBQUcsRUFBQzs7WUFFSCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDcEIsVUFBVSxFQUFFO29CQUNSLGFBQWEsRUFBRSxZQUFVLEdBQUs7aUJBQ2pDO2FBQ0osQ0FBQyxDQUFDO1NBQ047Ozs7Ozs7Ozs7O1FBYUQseUJBQXlCLEtBQXFCO1lBQzFDLElBQUksS0FBSyxZQUFZLFlBQVksRUFBRTs7Z0JBQy9CLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELElBQUcsVUFBVSxLQUFLLGVBQWUsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7aUJBRzdCO3FCQUFNOztvQkFFSCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztvQkFFaEQsSUFBTSxTQUFTLEdBQUcsVUFBVTt5QkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzt5QkFDckIsSUFBSSxFQUFFLENBQUM7O29CQUU1QixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzJCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJFLElBQUcsTUFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtpQkFDdkM7YUFDSjtTQUNKOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksR0FBRyxZQUFZLGlCQUFpQixFQUFFO2dCQUNsQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOztpQkFFdkI7YUFDSjtTQUNKOztRQUtELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7Z0JBaEZGLFVBQVU7Ozs7Z0JBTEYsV0FBVzs7MkJBWHBCOztTQWlCYSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cFJlc3BvbnNlLFxuICBIdHRwSGFuZGxlcixcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuLy8gQXV0aG9yaXphdGlvbiBoZWFkZXIgaW5kaWNhdGluZyBsb2NhbCB0b2tlbiBzaG91bGQgYmUgcmV2b2tlZC5cbmNvbnN0IFJFVk9LRV9SRVNQT05TRSA9ICdCZWFyZXIgJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG5cbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBUT0RPOiB3ZSBuZWVkIHRvIGNoZWNrIGZvciBleHBpcmF0aW9uIGFuZCBkbyBhIHByZWZsaWdodCB0b1xuICAgICAgICAvLyAvY2hlY2t0b2tlbiBpZiB0aGUgY3VycmVudCB0b2tlbiBpcyBleHBpcmVkXG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgY29uc3Qgand0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1QoKTtcbiAgICAgICAgaWYoand0KXtcbiAgICAgICAgICAgIC8vIFNlbmQgb3VyIGN1cnJlbnQgdG9rZW5cbiAgICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtqd3R9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IHRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqICAtIGNoZWNrIHRoZSBVUkwgZm9yIGEgSldUXG4gICAgICAgICAqICAtIGNoZWNrIHRoZSAnQXV0aG9yaXphdGlvbicgaGVhZGVyIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBzZXQgYSBuZXcgSldUIGluIEF1dGhTZXJ2aWNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SHR0cEV2ZW50PGFueT59IHJlc3AgLSByZXNwb25zZSBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VIYW5kbGVyKGV2ZW50OiBIdHRwRXZlbnQ8YW55Pil7XG4gICAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBBdXRoSGVhZGVyID0gZXZlbnQuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSB8fCAnJztcblxuICAgICAgICAgICAgICAgIC8vIFJldm9rZSBsb2NhbCAobG9jYWxzdG9yYWdlKSBKV1QgaWYgc2lnbmFsZWQgYnkgbm9kZS1ncG9hdXRoXG4gICAgICAgICAgICAgICAgaWYoQXV0aEhlYWRlciA9PT0gUkVWT0tFX1JFU1BPTlNFKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbmV3IEpXVFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBVUkxcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGVySnd0ID0gQXV0aEhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0p3dCA9ICgoISF1cmxKd3QgJiYgdXJsSnd0Lmxlbmd0aCkgPyB1cmxKd3QgOiBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoKCEhaGVhZGVySnd0ICYmIGhlYWRlckp3dC5sZW5ndGgpID8gaGVhZGVySnd0IDogbnVsbClcblxuICAgICAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLnNldEF1dGgobmV3Snd0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCB3ZSBjaGVjayBpZiBmb3JjZUxvZ2luIGlzIHNldCBhbmQgZm9yY2UgdGhlbT8/P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCByZXR1cm4gd2l0aCBoYW5kbGVyc1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gICAgICAgIGhhbmRsZXIuc3Vic2NyaWJlKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxufSJdfQ==