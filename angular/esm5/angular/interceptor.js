/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
/** @type {?} */
var REVOKE_RESPONSE = 'Bearer';
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
                if (AuthHeader.trim() === REVOKE_RESPONSE) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBR3RDLElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQzs7SUFLN0IsMEJBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUVoRCxvQ0FBUzs7Ozs7SUFBVCxVQUFVLE9BQXlCLEVBQUUsSUFBaUI7O1FBQ2xELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFNbEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxJQUFHLEdBQUcsRUFBQzs7WUFFSCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDcEIsVUFBVSxFQUFFO29CQUNSLGFBQWEsRUFBRSxZQUFVLEdBQUs7aUJBQ2pDO2FBQ0osQ0FBQyxDQUFDO1NBQ047Ozs7Ozs7Ozs7O1FBYUQseUJBQXlCLEtBQXFCO1lBQzFDLElBQUksS0FBSyxZQUFZLFlBQVksRUFBRTs7Z0JBQy9CLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELElBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLGVBQWUsRUFBRTtvQkFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7aUJBRzdCO3FCQUFNOztvQkFFSCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztvQkFFaEQsSUFBTSxTQUFTLEdBQUcsVUFBVTt5QkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzt5QkFDckIsSUFBSSxFQUFFLENBQUM7O29CQUU1QixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzJCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJFLElBQUcsTUFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtpQkFDdkM7YUFDSjtTQUNKOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksR0FBRyxZQUFZLGlCQUFpQixFQUFFO2dCQUNsQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOztpQkFFdkI7YUFDSjtTQUNKOztRQUtELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7Z0JBaEZGLFVBQVU7Ozs7Z0JBTEYsV0FBVzs7MkJBWHBCOztTQWlCYSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cFJlc3BvbnNlLFxuICBIdHRwSGFuZGxlcixcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuLy8gQXV0aG9yaXphdGlvbiBoZWFkZXIgaW5kaWNhdGluZyBsb2NhbCB0b2tlbiBzaG91bGQgYmUgcmV2b2tlZC5cbmNvbnN0IFJFVk9LRV9SRVNQT05TRSA9ICdCZWFyZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gY2hlY2sgZm9yIGV4cGlyYXRpb24gYW5kIGRvIGEgcHJlZmxpZ2h0IHRvXG4gICAgICAgIC8vIC9jaGVja3Rva2VuIGlmIHRoZSBjdXJyZW50IHRva2VuIGlzIGV4cGlyZWRcblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICBjb25zdCBqd3QgPSBzZWxmLmF1dGhTZXJ2aWNlLmdldEpXVCgpO1xuICAgICAgICBpZihqd3Qpe1xuICAgICAgICAgICAgLy8gU2VuZCBvdXIgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3Igc3VjY2Vzc2Z1bCByZXNwb25zZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgdG8gdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICogIC0gY2hlY2sgdGhlIFVSTCBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gY2hlY2sgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgZm9yIGEgSldUXG4gICAgICAgICAqICAtIHNldCBhIG5ldyBKV1QgaW4gQXV0aFNlcnZpY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIdHRwRXZlbnQ8YW55Pn0gcmVzcCAtIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KXtcbiAgICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IEF1dGhIZWFkZXIgPSBldmVudC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgLy8gUmV2b2tlIGxvY2FsIChsb2NhbHN0b3JhZ2UpIEpXVCBpZiBzaWduYWxlZCBieSBub2RlLWdwb2F1dGhcbiAgICAgICAgICAgICAgICBpZihBdXRoSGVhZGVyLnRyaW0oKSA9PT0gUkVWT0tFX1JFU1BPTlNFKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbmV3IEpXVFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBVUkxcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsSnd0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1RGcm9tVXJsKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGVySnd0ID0gQXV0aEhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0p3dCA9ICgoISF1cmxKd3QgJiYgdXJsSnd0Lmxlbmd0aCkgPyB1cmxKd3QgOiBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoKCEhaGVhZGVySnd0ICYmIGhlYWRlckp3dC5sZW5ndGgpID8gaGVhZGVySnd0IDogbnVsbClcblxuICAgICAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLnNldEF1dGgobmV3Snd0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgSHR0cEVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3VsZCB3ZSBjaGVjayBpZiBmb3JjZUxvZ2luIGlzIHNldCBhbmQgZm9yY2UgdGhlbT8/P1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCByZXR1cm4gd2l0aCBoYW5kbGVyc1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gICAgICAgIGhhbmRsZXIuc3Vic2NyaWJlKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcik7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJcbiAgfVxufSJdfQ==