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
        let updatedRequest;
        /** @type {?} */
        const jwt = this.authService.getJWT();
        if (!jwt) {
            // Carry on... nothing to do here
            updatedRequest = request;
        }
        else {
            /** @type {?} */
            let clone = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
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
                const urlJwt = this.authService.getJWTFromUrl();
                /** @type {?} */
                const headerJwt = event.headers.get('Authorization')
                    .replace('Bearer', '')
                    .trim();
                /** @type {?} */
                const newJwt = urlJwt || headerJwt;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsWUFBWSxFQUVaLGlCQUFpQixFQUdsQixNQUFNLHNCQUFzQixDQUFDO0FBRzlCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFJdEMsTUFBTTs7OztJQUNGLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0tBQUk7Ozs7OztJQUNoRCxTQUFTLENBQUMsT0FBeUIsRUFBRSxJQUFpQjs7UUFDbEQsSUFBSSxjQUFjLENBQUM7O1FBSW5CLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEMsSUFBRyxDQUFDLEdBQUcsRUFBQzs7WUFFSixjQUFjLEdBQUcsT0FBTyxDQUFDO1NBQzVCO2FBQU07O1lBRUgsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDMUIsVUFBVSxFQUFFO29CQUNSLGFBQWEsRUFBRSxVQUFVLEdBQUcsRUFBRTtpQkFDakM7YUFDQSxDQUFDLENBQUM7WUFDSCxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzFCOzs7Ozs7Ozs7OztRQWFELHlCQUF5QixLQUFxQjtZQUMxQyxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7O2dCQUUvQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFHaEQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO3FCQUN2QixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDckIsSUFBSSxFQUFFLENBQUM7O2dCQUVwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDO2dCQUVuQyxJQUFHLE1BQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7Ozs7YUFLdkM7U0FDSjs7Ozs7Ozs7UUFRRCxnQ0FBZ0MsR0FBUTtZQUNwQyxJQUFJLEdBQUcsWUFBWSxpQkFBaUIsRUFBRTtnQkFDbEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTs7aUJBRXZCO2FBQ0o7U0FDSjs7O1FBS0QsT0FBTyxJQUFJO2FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUN0QixFQUFFLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUM7S0FDMUQ7OztZQTFFRixVQUFVOzs7O1lBSEYsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEh0dHBSZXF1ZXN0LFxuICBIdHRwUmVzcG9uc2UsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXJyb3JSZXNwb25zZSxcbiAgSHR0cEV2ZW50LFxuICBIdHRwSW50ZXJjZXB0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb2tlbkludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cbiAgICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgICAgIGxldCB1cGRhdGVkUmVxdWVzdDtcblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICBjb25zdCBqd3QgPSB0aGlzLmF1dGhTZXJ2aWNlLmdldEpXVCgpO1xuICAgICAgICBpZighand0KXtcbiAgICAgICAgICAgIC8vIENhcnJ5IG9uLi4uIG5vdGhpbmcgdG8gZG8gaGVyZVxuICAgICAgICAgICAgdXBkYXRlZFJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU2VuZCBvdXIgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgbGV0IGNsb25lID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHVwZGF0ZWRSZXF1ZXN0ID0gY2xvbmU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3Igc3VjY2Vzc2Z1bCByZXNwb25zZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgdG8gdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICogIC0gY2hlY2sgdGhlIFVSTCBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gY2hlY2sgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgZm9yIGEgSldUXG4gICAgICAgICAqICAtIHNldCBhIG5ldyBKV1QgaW4gQXV0aFNlcnZpY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIdHRwRXZlbnQ8YW55Pn0gcmVzcCAtIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBFdmVudDxhbnk+KXtcbiAgICAgICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBVUkxcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxKd3QgPSB0aGlzLmF1dGhTZXJ2aWNlLmdldEpXVEZyb21VcmwoKTtcblxuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJKd3QgPSBldmVudC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdCZWFyZXInLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0p3dCA9IHVybEp3dCB8fCBoZWFkZXJKd3Q7XG5cbiAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2Uuc2V0QXV0aChuZXdKd3QpXG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBtYXkgd2FudCB0byBsb29rIGF0IHJldm9raW5nIGlmOlxuICAgICAgICAgICAgICAgIC8vICAnQXV0aG9yaXphdGlvbicgOiAnQmVhcmVyICdcbiAgICAgICAgICAgICAgICAvLyBjb21lcyBiYWNrIGZyb20gc2VydmVyLi4uLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpcyB0aGUgZXJyb3IgaGFuZGxlciB3aGVuIGFuIHVuYXV0aGVudGljYXRlZCByZXF1ZXN0XG4gICAgICAgICAqIGNvbWVzIGJhY2sgZnJvbSB0aGUgc2VydmVyLi4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVyciAtIEVycm9yIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUZhaWx1cmVIYW5kbGVyKGVycjogYW55KXtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2hvdWxkIHdlIGNoZWNrIGlmIGZvcmNlTG9naW4gaXMgc2V0IGFuZCBmb3JjZSB0aGVtPz8/XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHJldHVybiB3aXRoIGhhbmRsZXJzXG4gICAgICAgIHJldHVybiBuZXh0XG4gICAgICAgICAgICAgICAgLmhhbmRsZSh1cGRhdGVkUmVxdWVzdClcbiAgICAgICAgICAgICAgICAuZG8ocmVzcG9uc2VIYW5kbGVyLCByZXNwb25zZUZhaWx1cmVIYW5kbGVyKTtcbiAgfVxufSJdfQ==