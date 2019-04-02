/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVUzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDOzs7Ozs7O0FBTXRDLDZCQUE2QixHQUFRO0lBQ2pDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUM7Q0FDM0I7Ozs7Ozs7QUFPRCx3QkFBd0IsR0FBUTtJQUM1QixPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO0NBQzFCO0FBR0QsTUFBTTs7OztJQUVGLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUVoRCxTQUFTLENBQUMsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQU1sQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RDLElBQUcsR0FBRyxFQUFDOztZQUVILE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNwQixVQUFVLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFVBQVUsR0FBRyxFQUFFO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUF3QjtZQUM3QyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7Z0JBQ3ZCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Z0JBRzVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUVoRCxNQUFNLFNBQVMsR0FBRyxVQUFVO3FCQUNQLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO3FCQUNyQixJQUFJLEVBQUUsQ0FBQzs7Z0JBRTVCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7dUJBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFckUsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3ZDO1lBRUQsT0FBTyxLQUFLLENBQUM7U0FDaEI7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDN0I7YUFDSjtTQUNKOztRQUtELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQTtLQUNuQjs7O1lBM0VGLFVBQVU7Ozs7WUFuQkYsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBSZXF1ZXN0LFxuICBIdHRwUmVzcG9uc2UsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cbi8qKlxuICogQW5ndWxhciBib2lsZXJwbGF0ZSBiZWNhdXNlOlxuICogQW5ndWxhcjYgSHR0cEVycm9yUmVzcG9uc2UgPD4gQW5ndWxhcjcgSFRURXJyb3JQUmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gaXNIdHRwRXJyb3JSZXNwb25zZShldnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBldnQgJiYgZXZ0LmVycm9yO1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgYm9pbGVycGxhdGUgYmVjYXVzZTpcbiAqIEFuZ3VsYXI2IEh0dHBSZXNwb25zZSA8PiBBbmd1bGFyNyBIVFRQUmVzcG9uc2VcbiAqIEBwYXJhbSBldnRcbiAqL1xuZnVuY3Rpb24gaXNIdHRwUmVzcG9uc2UoZXZ0OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXZ0ICYmIGV2dC5ib2R5O1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gY2hlY2sgZm9yIGV4cGlyYXRpb24gYW5kIGRvIGEgcHJlZmxpZ2h0IHRvXG4gICAgICAgIC8vIC9jaGVja3Rva2VuIGlmIHRoZSBjdXJyZW50IHRva2VuIGlzIGV4cGlyZWRcblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICBjb25zdCBqd3QgPSBzZWxmLmF1dGhTZXJ2aWNlLmdldEpXVCgpO1xuICAgICAgICBpZihqd3Qpe1xuICAgICAgICAgICAgLy8gU2VuZCBvdXIgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3Igc3VjY2Vzc2Z1bCByZXNwb25zZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgdG8gdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICogIC0gY2hlY2sgdGhlIFVSTCBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gY2hlY2sgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgZm9yIGEgSldUXG4gICAgICAgICAqICAtIHNldCBhIG5ldyBKV1QgaW4gQXV0aFNlcnZpY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIdHRwRXZlbnQ8YW55Pn0gcmVzcCAtIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBSZXNwb25zZTxhbnk+KTogSHR0cEV2ZW50PGFueT4ge1xuICAgICAgICAgICAgaWYgKGlzSHR0cFJlc3BvbnNlKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IEF1dGhIZWFkZXIgPSBldmVudC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIFVSTFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJKd3QgPSBBdXRoSGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gKCghIXVybEp3dCAmJiB1cmxKd3QubGVuZ3RoKSA/IHVybEp3dCA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2Uuc2V0QXV0aChuZXdKd3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoaXNIdHRwRXJyb3JSZXNwb25zZShldmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHJldHVybiB3aXRoIGhhbmRsZXJzXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcbiAgICAgICAgaGFuZGxlci5zdWJzY3JpYmUocmVzcG9uc2VIYW5kbGVyLCByZXNwb25zZUZhaWx1cmVIYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlclxuICB9XG59Il19