import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth';

// Authorization header indicating local token should be revoked.
const REVOKE_RESPONSE = 'Bearer ';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const self = this;
        // TODO: we need to check for expiration and do a preflight to
        // /checktoken if the current token is expired

        // ====== For sending token (with request) ======//

        const jwt = self.authService.getJWT();
        if(jwt){
            // Send our current token
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        }

        // ====== For sending token (with request) ======//

        /**
         * Handler for successful responses returned from the server.
         * This function must to the following:
         *  - check the URL for a JWT
         *  - check the 'Authorization' header for a JWT
         *  - set a new JWT in AuthService
         *
         * @param {HttpEvent<any>} resp - response from server
         */
        function responseHandler(event: HttpEvent<any>){
            if (event instanceof HttpResponse) {
                const AuthHeader = event.headers.get('Authorization') || '';

                // Revoke local (localstorage) JWT if signaled by node-gpoauth
                if(AuthHeader === REVOKE_RESPONSE) {
                    self.authService.logout();

                // Check for new JWT
                } else {
                    // look for JWT in URL
                    const urlJwt = self.authService.getJWTFromUrl();
                    // look for JWT in auth headers
                    const headerJwt = AuthHeader
                                        .replace('Bearer', '')
                                        .trim();

                    const newJwt = ((!!urlJwt && urlJwt.length) ? urlJwt : null)
                                || ((!!headerJwt && headerJwt.length) ? headerJwt : null)

                    if(newJwt)
                        self.authService.setAuth(newJwt)
                }
            }
        }

        /**
         * The is the error handler when an unauthenticated request
         * comes back from the server...
         *
         * @param {Error} err - Error from server
         */
        function responseFailureHandler(err: any){
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // Should we check if forceLogin is set and force them???
                }
            }
        }

        // ==============================================//

        // setup and return with handlers
        const handler = next.handle(request);
        handler.subscribe(responseHandler, responseFailureHandler);

        return handler
  }
}