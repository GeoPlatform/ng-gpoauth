/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
/** @type {?} */
const REVOKE_RESPONSE = 'Bearer ';
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
                if (AuthHeader === REVOKE_RESPONSE) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7O0FBR3RDLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUdsQyxNQUFNOzs7O0lBRUYsWUFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7S0FBSTs7Ozs7O0lBRWhELFNBQVMsQ0FBQyxPQUF5QixFQUFFLElBQWlCOztRQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O1FBTWxCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxHQUFHLEVBQUM7O1lBRUgsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDUixhQUFhLEVBQUUsVUFBVSxHQUFHLEVBQUU7aUJBQ2pDO2FBQ0osQ0FBQyxDQUFDO1NBQ047Ozs7Ozs7Ozs7O1FBYUQseUJBQXlCLEtBQXFCO1lBQzFDLElBQUksS0FBSyxZQUFZLFlBQVksRUFBRTs7Z0JBQy9CLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELElBQUcsVUFBVSxLQUFLLGVBQWUsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7aUJBRzdCO3FCQUFNOztvQkFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztvQkFFaEQsTUFBTSxTQUFTLEdBQUcsVUFBVTt5QkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzt5QkFDckIsSUFBSSxFQUFFLENBQUM7O29CQUU1QixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDOzJCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJFLElBQUcsTUFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtpQkFDdkM7YUFDSjtTQUNKOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksR0FBRyxZQUFZLGlCQUFpQixFQUFFO2dCQUNsQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOztpQkFFdkI7YUFDSjtTQUNKOztRQUtELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7O1lBaEZGLFVBQVU7Ozs7WUFMRixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBSZXNwb25zZSxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFcnJvclJlc3BvbnNlLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cbi8vIEF1dGhvcml6YXRpb24gaGVhZGVyIGluZGljYXRpbmcgbG9jYWwgdG9rZW4gc2hvdWxkIGJlIHJldm9rZWQuXG5jb25zdCBSRVZPS0VfUkVTUE9OU0UgPSAnQmVhcmVyICc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gVE9ETzogd2UgbmVlZCB0byBjaGVjayBmb3IgZXhwaXJhdGlvbiBhbmQgZG8gYSBwcmVmbGlnaHQgdG9cbiAgICAgICAgLy8gL2NoZWNrdG9rZW4gaWYgdGhlIGN1cnJlbnQgdG9rZW4gaXMgZXhwaXJlZFxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIGNvbnN0IGp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldUKCk7XG4gICAgICAgIGlmKGp3dCl7XG4gICAgICAgICAgICAvLyBTZW5kIG91ciBjdXJyZW50IHRva2VuXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7and0fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBzdWNjZXNzZnVsIHJlc3BvbnNlcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gbXVzdCB0byB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgVVJMIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgJ0F1dGhvcml6YXRpb24nIGhlYWRlciBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gc2V0IGEgbmV3IEpXVCBpbiBBdXRoU2VydmljZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0h0dHBFdmVudDxhbnk+fSByZXNwIC0gcmVzcG9uc2UgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlcihldmVudDogSHR0cEV2ZW50PGFueT4pe1xuICAgICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgQXV0aEhlYWRlciA9IGV2ZW50LmhlYWRlcnMuZ2V0KCdBdXRob3JpemF0aW9uJykgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXZva2UgbG9jYWwgKGxvY2Fsc3RvcmFnZSkgSldUIGlmIHNpZ25hbGVkIGJ5IG5vZGUtZ3BvYXV0aFxuICAgICAgICAgICAgICAgIGlmKEF1dGhIZWFkZXIgPT09IFJFVk9LRV9SRVNQT05TRSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG5ldyBKV1RcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gVVJMXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb29rIGZvciBKV1QgaW4gYXV0aCBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckp3dCA9IEF1dGhIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdKd3QgPSAoKCEhdXJsSnd0ICYmIHVybEp3dC5sZW5ndGgpID8gdXJsSnd0IDogbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYobmV3Snd0KVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hdXRoU2VydmljZS5zZXRBdXRoKG5ld0p3dClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGlzIHRoZSBlcnJvciBoYW5kbGVyIHdoZW4gYW4gdW5hdXRoZW50aWNhdGVkIHJlcXVlc3RcbiAgICAgICAgICogY29tZXMgYmFjayBmcm9tIHRoZSBzZXJ2ZXIuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyIC0gRXJyb3IgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIoZXJyOiBhbnkpe1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG91bGQgd2UgY2hlY2sgaWYgZm9yY2VMb2dpbiBpcyBzZXQgYW5kIGZvcmNlIHRoZW0/Pz9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cblxuICAgICAgICAvLyBzZXR1cCBhbmQgcmV0dXJuIHdpdGggaGFuZGxlcnNcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5leHQuaGFuZGxlKHJlcXVlc3QpO1xuICAgICAgICBoYW5kbGVyLnN1YnNjcmliZShyZXNwb25zZUhhbmRsZXIsIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gIH1cbn0iXX0=