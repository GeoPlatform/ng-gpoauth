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
            if (isHttpResponse(event)) {
                /** @type {?} */
                const AuthHeader = event.headers.get('Authorization') || '';
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
        const handler = next.handle(request).pipe(tap(responseHandler, responseFailureHandler));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2ludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDOzs7Ozs7O0FBTXRDLDZCQUE2QixHQUFRO0lBQ2pDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7Q0FDM0I7Ozs7Ozs7QUFPRCx3QkFBd0IsR0FBUTtJQUM1QixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO0NBQzFCO0FBR0QsTUFBTTs7OztJQUVGLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUVoRCxTQUFTLENBQUMsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQU1sQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RDLElBQUcsR0FBRyxFQUFDOztZQUVILE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNwQixVQUFVLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFVBQVUsR0FBRyxFQUFFO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUF3QjtZQUM3QyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7Z0JBQ3ZCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUVoRCxNQUFNLFNBQVMsR0FBRyxVQUFVO3FCQUNQLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO3FCQUNyQixJQUFJLEVBQUUsQ0FBQzs7Z0JBRTVCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7dUJBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFckUsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3ZDO1lBRUQsT0FBTyxLQUFLLENBQUM7U0FDaEI7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDN0I7YUFDSjtTQUNKOztRQU1ELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNyQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQztRQUVsRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7O1lBNUVGLFVBQVU7Ozs7WUFuQkYsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBSZXF1ZXN0LFxuICBIdHRwUmVzcG9uc2UsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuLyoqXG4gKiBBbmd1bGFyIGJvaWxlcnBsYXRlIGJlY2F1c2U6XG4gKiBBbmd1bGFyNiBIdHRwRXJyb3JSZXNwb25zZSA8PiBBbmd1bGFyNyBIVFRFcnJvclBSZXNwb25zZVxuICovXG5mdW5jdGlvbiBpc0h0dHBFcnJvclJlc3BvbnNlKGV2dDogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGV2dCAmJiBldnQuZXJyb3I7XG59XG5cbi8qKlxuICogQW5ndWxhciBib2lsZXJwbGF0ZSBiZWNhdXNlOlxuICogQW5ndWxhcjYgSHR0cFJlc3BvbnNlIDw+IEFuZ3VsYXI3IEhUVFBSZXNwb25zZVxuICogQHBhcmFtIGV2dFxuICovXG5mdW5jdGlvbiBpc0h0dHBSZXNwb25zZShldnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBldnQgJiYgZXZ0LmJvZHk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlKSB7fVxuXG4gICAgaW50ZXJjZXB0KHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gVE9ETzogd2UgbmVlZCB0byBjaGVjayBmb3IgZXhwaXJhdGlvbiBhbmQgZG8gYSBwcmVmbGlnaHQgdG9cbiAgICAgICAgLy8gL2NoZWNrdG9rZW4gaWYgdGhlIGN1cnJlbnQgdG9rZW4gaXMgZXhwaXJlZFxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIGNvbnN0IGp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldUKCk7XG4gICAgICAgIGlmKGp3dCl7XG4gICAgICAgICAgICAvLyBTZW5kIG91ciBjdXJyZW50IHRva2VuXG4gICAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7and0fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PSBGb3Igc2VuZGluZyB0b2tlbiAod2l0aCByZXF1ZXN0KSA9PT09PT0vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciBzdWNjZXNzZnVsIHJlc3BvbnNlcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gbXVzdCB0byB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgVVJMIGZvciBhIEpXVFxuICAgICAgICAgKiAgLSBjaGVjayB0aGUgJ0F1dGhvcml6YXRpb24nIGhlYWRlciBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gc2V0IGEgbmV3IEpXVCBpbiBBdXRoU2VydmljZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmVzcCAtIEh0dHBFdmVudDxhbnk+XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBSZXNwb25zZTxhbnk+KTogSHR0cEV2ZW50PGFueT4ge1xuICAgICAgICAgICAgaWYgKGlzSHR0cFJlc3BvbnNlKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IEF1dGhIZWFkZXIgPSBldmVudC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIFVSTFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJKd3QgPSBBdXRoSGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gKCghIXVybEp3dCAmJiB1cmxKd3QubGVuZ3RoKSA/IHVybEp3dCA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2Uuc2V0QXV0aChuZXdKd3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXJyIC0gRXJyb3IgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIoZXJyOiBhbnkpe1xuICAgICAgICAgICAgaWYgKGlzSHR0cEVycm9yUmVzcG9uc2UoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gICAgICAgIC8vIHNldHVwIGFuZCByZXR1cm4gd2l0aCBoYW5kbGVyc1xuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2NDg3NC9pbnRlcmNlcHRvci1tYWtpbmctdHdvLWNhbGxzLWluLWFwaVxuICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV4dC5oYW5kbGUocmVxdWVzdCkucGlwZShcbiAgICAgICAgICAgIHRhcChyZXNwb25zZUhhbmRsZXIsIHJlc3BvbnNlRmFpbHVyZUhhbmRsZXIpKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlclxuICB9XG59Il19