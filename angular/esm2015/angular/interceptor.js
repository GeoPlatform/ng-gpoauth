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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVMzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7Ozs7OztBQU10Qyw2QkFBNkIsR0FBUTtJQUNqQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0NBQzNCOzs7Ozs7O0FBT0Qsd0JBQXdCLEdBQVE7SUFDNUIsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztDQUMxQjtBQUdELE1BQU07Ozs7SUFFRixZQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtLQUFJOzs7Ozs7SUFFaEQsU0FBUyxDQUFDLE9BQXlCLEVBQUUsSUFBaUI7O1FBQ2xELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFNbEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxJQUFHLEdBQUcsRUFBQzs7WUFFSCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDcEIsVUFBVSxFQUFFO29CQUNSLGFBQWEsRUFBRSxVQUFVLEdBQUcsRUFBRTtpQkFDakM7YUFDSixDQUFDLENBQUM7U0FDTjs7Ozs7Ozs7Ozs7UUFhRCx5QkFBeUIsS0FBd0I7WUFDN0MsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7O2dCQUN2QixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7O2dCQUc1RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztnQkFFaEQsTUFBTSxTQUFTLEdBQUcsVUFBVTtxQkFDUCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDckIsSUFBSSxFQUFFLENBQUM7O2dCQUU1QixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3VCQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXJFLElBQUcsTUFBTTtvQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUN2QztZQUVELE9BQU8sS0FBSyxDQUFDO1NBQ2hCOzs7Ozs7OztRQVFELGdDQUFnQyxHQUFRO1lBQ3BDLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQzdCO2FBQ0o7U0FDSjs7UUFLRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDckMsR0FBRyxDQUFDLGVBQWUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFFbEQsT0FBTyxPQUFPLENBQUE7S0FDbkI7OztZQTNFRixVQUFVOzs7O1lBbkJGLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cFJlc3BvbnNlLFxuICBIdHRwSGFuZGxlcixcbiAgSHR0cEV2ZW50LFxuICBIdHRwSW50ZXJjZXB0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XG5cbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCc7XG5cbi8qKlxuICogQW5ndWxhciBib2lsZXJwbGF0ZSBiZWNhdXNlOlxuICogQW5ndWxhcjYgSHR0cEVycm9yUmVzcG9uc2UgPD4gQW5ndWxhcjcgSFRURXJyb3JQUmVzcG9uc2VcbiAqL1xuZnVuY3Rpb24gaXNIdHRwRXJyb3JSZXNwb25zZShldnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBldnQgJiYgZXZ0LmVycm9yO1xufVxuXG4vKipcbiAqIEFuZ3VsYXIgYm9pbGVycGxhdGUgYmVjYXVzZTpcbiAqIEFuZ3VsYXI2IEh0dHBSZXNwb25zZSA8PiBBbmd1bGFyNyBIVFRQUmVzcG9uc2VcbiAqIEBwYXJhbSBldnRcbiAqL1xuZnVuY3Rpb24gaXNIdHRwUmVzcG9uc2UoZXZ0OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXZ0ICYmIGV2dC5ib2R5O1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gY2hlY2sgZm9yIGV4cGlyYXRpb24gYW5kIGRvIGEgcHJlZmxpZ2h0IHRvXG4gICAgICAgIC8vIC9jaGVja3Rva2VuIGlmIHRoZSBjdXJyZW50IHRva2VuIGlzIGV4cGlyZWRcblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICBjb25zdCBqd3QgPSBzZWxmLmF1dGhTZXJ2aWNlLmdldEpXVCgpO1xuICAgICAgICBpZihqd3Qpe1xuICAgICAgICAgICAgLy8gU2VuZCBvdXIgY3VycmVudCB0b2tlblxuICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dH1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT0gRm9yIHNlbmRpbmcgdG9rZW4gKHdpdGggcmVxdWVzdCkgPT09PT09Ly9cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3Igc3VjY2Vzc2Z1bCByZXNwb25zZXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgdG8gdGhlIGZvbGxvd2luZzpcbiAgICAgICAgICogIC0gY2hlY2sgdGhlIFVSTCBmb3IgYSBKV1RcbiAgICAgICAgICogIC0gY2hlY2sgdGhlICdBdXRob3JpemF0aW9uJyBoZWFkZXIgZm9yIGEgSldUXG4gICAgICAgICAqICAtIHNldCBhIG5ldyBKV1QgaW4gQXV0aFNlcnZpY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIdHRwRXZlbnQ8YW55Pn0gcmVzcCAtIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiByZXNwb25zZUhhbmRsZXIoZXZlbnQ6IEh0dHBSZXNwb25zZTxhbnk+KTogSHR0cEV2ZW50PGFueT4ge1xuICAgICAgICAgICAgaWYgKGlzSHR0cFJlc3BvbnNlKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IEF1dGhIZWFkZXIgPSBldmVudC5oZWFkZXJzLmdldCgnQXV0aG9yaXphdGlvbicpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgLy8gbG9vayBmb3IgSldUIGluIFVSTFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybEp3dCA9IHNlbGYuYXV0aFNlcnZpY2UuZ2V0SldURnJvbVVybCgpO1xuICAgICAgICAgICAgICAgIC8vIGxvb2sgZm9yIEpXVCBpbiBhdXRoIGhlYWRlcnNcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJKd3QgPSBBdXRoSGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnQmVhcmVyJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Snd0ID0gKCghIXVybEp3dCAmJiB1cmxKd3QubGVuZ3RoKSA/IHVybEp3dCA6IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCghIWhlYWRlckp3dCAmJiBoZWFkZXJKd3QubGVuZ3RoKSA/IGhlYWRlckp3dCA6IG51bGwpXG5cbiAgICAgICAgICAgICAgICBpZihuZXdKd3QpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2Uuc2V0QXV0aChuZXdKd3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaXMgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbiB1bmF1dGhlbnRpY2F0ZWQgcmVxdWVzdFxuICAgICAgICAgKiBjb21lcyBiYWNrIGZyb20gdGhlIHNlcnZlci4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgLSBFcnJvciBmcm9tIHNlcnZlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2VGYWlsdXJlSGFuZGxlcihlcnI6IGFueSl7XG4gICAgICAgICAgICBpZiAoaXNIdHRwRXJyb3JSZXNwb25zZShldmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgICAgICAgLy8gc2V0dXAgYW5kIHJldHVybiB3aXRoIGhhbmRsZXJzXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0LmhhbmRsZShyZXF1ZXN0KS5waXBlKFxuICAgICAgICAgICAgdGFwKHJlc3BvbnNlSGFuZGxlciwgcmVzcG9uc2VGYWlsdXJlSGFuZGxlcikpO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gIH1cbn0iXX0=