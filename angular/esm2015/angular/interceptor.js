/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth';
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
                const urlJwt = self.authService.getJWTFromUrl();
                /** @type {?} */
                const headerJwt = (event.headers.get('Authorization') || '')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                const newJwt = ((!!urlJwt && urlJwt.length) ? urlJwt : null)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFJdEMsTUFBTTs7OztJQUVGLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUVoRCxTQUFTLENBQUMsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQU1sQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RDLElBQUcsR0FBRyxFQUFDOztZQUVILE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNwQixVQUFVLEVBQUU7b0JBQ1IsYUFBYSxFQUFFLFVBQVUsR0FBRyxFQUFFO2lCQUNqQzthQUNKLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUFxQjtZQUMxQyxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7O2dCQUUvQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFHaEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQy9CLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO3FCQUNyQixJQUFJLEVBQUUsQ0FBQzs7Z0JBRXBDLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7dUJBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFckUsSUFBRyxNQUFNO29CQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOzs7O2FBS3ZDO1NBQ0o7Ozs7Ozs7O1FBUUQsZ0NBQWdDLEdBQVE7WUFDcEMsSUFBSSxHQUFHLFlBQVksaUJBQWlCLEVBQUU7Z0JBQ2xDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7O2lCQUV2QjthQUNKO1NBQ0o7O1FBS0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBRTNELE9BQU8sT0FBTyxDQUFBO0tBQ25COzs7WUE1RUYsVUFBVTs7OztZQUhGLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cFJlc3BvbnNlLFxuICBIdHRwSGFuZGxlcixcbiAgSHR0cEVycm9yUmVzcG9uc2UsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJztcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gY2hlY2sgZm9yIGV4cGlyYXRpb24gYW5kIGRvIGEgcHJlZmxpZ2h0IHRvXG4gICAgICAgIC8vIC9jaGVja3Rva2VuIGlmIHRoZSBjdXJyZW50IHRva2VuIGlzIGV4cGlyZWRcblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICBjb25zdCBqd3QgPSBzZWxmLmF1dGhTZXJ2aWNlLmdldEpXVCgpO1xuICAgICAgICBpZihqd3Qpe1xuICAgICAgICAgICAgLy8gU2VuZCBvdXIgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3Igc3VjY2Vzc2Z1bCByZXNwb25zZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgdG8gdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICogIC0gY2hlY2sgdGhlIFVSTCBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gY2hlY2sgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgZm9yIGEgSldUXG4gICAgICAgICAqICAtIHNldCBhIG5ldyBKV1QgaW4gQXV0aFNlcnZpY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIdHRwRXZlbnQ8YW55Pn0gcmVzcCAtIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KXtcbiAgICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBVUkxcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxKd3QgPSBzZWxmLmF1dGhTZXJ2aWNlLmdldEpXVEZyb21VcmwoKTtcblxuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJKd3QgPSAoZXZlbnQuaGVhZGVycy5nZXQoJ0F1dGhvcml6YXRpb24nKSB8fCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ0JlYXJlcicsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gKCghIXVybEp3dCAmJiB1cmxKd3QubGVuZ3RoKSA/IHVybEp3dCA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2Uuc2V0QXV0aChuZXdKd3QpXG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBtYXkgd2FudCB0byBsb29rIGF0IHJldm9raW5nIGlmOlxuICAgICAgICAgICAgICAgIC8vICAnQXV0aG9yaXphdGlvbicgOiAnQmVhcmVyICdcbiAgICAgICAgICAgICAgICAvLyBjb21lcyBiYWNrIGZyb20gc2VydmVyLi4uLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpcyB0aGUgZXJyb3IgaGFuZGxlciB3aGVuIGFuIHVuYXV0aGVudGljYXRlZCByZXF1ZXN0XG4gICAgICAgICAqIGNvbWVzIGJhY2sgZnJvbSB0aGUgc2VydmVyLi4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyciAtIEVycm9yIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUZhaWx1cmVIYW5kbGVyKGVycjogYW55KXtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2hvdWxkIHdlIGNoZWNrIGlmIGZvcmNlTG9naW4gaXMgc2V0IGFuZCBmb3JjZSB0aGVtPz8/XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHJldHVybiB3aXRoIGhhbmRsZXJzXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcbiAgICAgICAgaGFuZGxlci5zdWJzY3JpYmUocmVzcG9uc2VIYW5kbGVyLCByZXNwb25zZUZhaWx1cmVIYW5kbGVyKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlclxuICB9XG59Il19