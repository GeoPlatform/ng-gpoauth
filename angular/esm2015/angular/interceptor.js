/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
/** @type {?} */
const REVOKE_RESPONSE = 'Bearer';
export class TokenInterceptor {
    /**
     * @param {?} authService
     */
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * @param {?} request
     * @param {?} next
     * @return {?}
     */
    intercept(request, next) {
        /** @type {?} */
        const self = this;
        /** @type {?} */
        const jwt = self.authService.getJWT();
        if (jwt) {
            // Send our current token
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
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
                const AuthHeader = event.headers.get('Authorization') || '';
                // Revoke local (localstorage) JWT if signaled by node-gpoauth
                if (AuthHeader.trim() === REVOKE_RESPONSE) {
                    self.authService.logout();
                    // Check for new JWT
                }
                else {
                    /** @type {?} */
                    const urlJwt = self.authService.getJWTFromUrl();
                    /** @type {?} */
                    const headerJwt = AuthHeader
                        .replace('Bearer', '')
                        .trim();
                    /** @type {?} */
                    const newJwt = ((!!urlJwt && urlJwt.length) ? urlJwt : null)
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
        const handler = next.handle(request);
        handler.subscribe(responseHandler, responseFailureHandler);
        return handler;
    }
}
TokenInterceptor.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TokenInterceptor.ctorParameters = () => [
    { type: AuthService }
];
if (false) {
    /** @type {?} */
    TokenInterceptor.prototype.authService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBR3RDLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQztBQUdqQyxNQUFNOzs7O0lBRUYsWUFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7S0FBSTs7Ozs7O0lBRWhELFNBQVMsQ0FBQyxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O1FBTWxCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxHQUFHLEVBQUM7O1lBRUgsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDUixhQUFhLEVBQUUsVUFBVSxHQUFHLEVBQUU7aUJBQ2pDO2FBQ0osQ0FBQyxDQUFDO1NBQ047Ozs7Ozs7Ozs7O1FBYUQseUJBQXlCLEtBQXFCO1lBQzFDLElBQUksS0FBSyxZQUFZLFlBQVksRUFBRTs7Z0JBQy9CLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELElBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLGVBQWUsRUFBRTtvQkFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7aUJBRzdCO3FCQUFNOztvQkFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztvQkFFaEQsTUFBTSxTQUFTLEdBQUcsVUFBVTt5QkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzt5QkFDckIsSUFBSSxFQUFFLENBQUM7O29CQUU1QixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzJCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJFLElBQUcsTUFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtpQkFDdkM7YUFDSjtTQUNKOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksR0FBRyxZQUFZLGlCQUFpQixFQUFFO2dCQUNsQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOztpQkFFdkI7YUFDSjtTQUNKOztRQUtELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7O1lBaEZGLFVBQVU7Ozs7WUFMRixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBSZXNwb25zZSxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cbi8vIEF1dGhvcml6YXRpb24gaGVhZGVyIGluZGljYXRpbmcgbG9jYWwgdG9rZW4gc2hvdWxkIGJlIHJldm9rZWQuXG5jb25zdCBSRVZPS0VfUkVTUE9OU0UgPSAnQmVhcmVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XG5cbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBUT0RPOiB3ZSBuZWVkIHRvIGNoZWNrIGZvciBleHBpcmF0aW9uIGFuZCBkbyBhIHByZWZsaWdodCB0b1xuICAgICAgICAvLyAvY2hlY2t0b2tlbiBpZiB0aGUgY3VycmVudCB0b2tlbiBpcyBleHBpcmVkXG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgY29uc3Qgand0ID0gc2VsZi5hdXRoU2VydmljZS5nZXRKV1QoKTtcbiAgICAgICAgaWYoand0KXtcbiAgICAgICAgICAgIC8vIFNlbmQgb3VyIGN1cnJlbnQgdG9rZW5cbiAgICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtqd3R9YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09IEZvciBzZW5kaW5nIHRva2VuICh3aXRoIHJlcXVlc3QpID09PT09PS8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IHRvIHRoZSBmb2xsb3dpbmc6XG4gICAgICAgICAqICAtIGNoZWNrIHRoZSBVUkwgZm9yIGEgSldUXG4gICAgICAgICAqICAtIGNoZWNrIHRoZSAnQXV0aG9yaXphdGlvbicgaGVhZGVyIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBzZXQgYSBuZXcgSldUIGluIEF1dGhTZXJ2aWNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SHR0cEV2ZW50PGFueT59IHJlc3AgLSByZXNwb25zZSBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VIYW5kbGVyKGV2ZW50OiBIdHRwRXZlbnQ8YW55Pil7XG4gICAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBBdXRoSGVhZGVyID0gZXZlbnQuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSB8fCAnJztcblxuICAgICAgICAgICAgICAgIC8vIFJldm9rZSBsb2NhbCAobG9jYWxzdG9yYWdlKSBKV1QgaWYgc2lnbmFsZWQgYnkgbm9kZS1ncG9hdXRoXG4gICAgICAgICAgICAgICAgaWYoQXV0aEhlYWRlci50cmltKCkgPT09IFJFVk9LRV9SRVNQT05TRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBKV1RcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gYXV0aCBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IEF1dGhIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdKd3QgPSAoKCEhdXJsSnd0ICYmIHVybEp3dC5sZW5ndGgpID8gdXJsSnd0IDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYobmV3Snd0KVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGlzIHRoZSBlcnJvciBoYW5kbGVyIHdoZW4gYW4gdW5hdXRoZW50aWNhdGVkIHJlcXVlc3RcbiAgICAgICAgICogY29tZXMgYmFjayBmcm9tIHRoZSBzZXJ2ZXIuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyIC0gRXJyb3IgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIoZXJyOiBhbnkpe1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgd2UgY2hlY2sgaWYgZm9yY2VMb2dpbiBpcyBzZXQgYW5kIGZvcmNlIHRoZW0/Pz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cblxuICAgICAgICAvLyBzZXR1cCBhbmQgcmV0dXJuIHdpdGggaGFuZGxlcnNcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5leHQuaGFuZGxlKHJlcXVlc3QpO1xuICAgICAgICBoYW5kbGVyLnN1YnNjcmliZShyZXNwb25zZUhhbmRsZXIsIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gIH1cbn0iXX0=