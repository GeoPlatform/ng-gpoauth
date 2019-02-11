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


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let updatedRequest;

        // TODO: we need to check for expiration and do a preflight to
        // /checktoken if the current token is expired

        // ====== For sending token (with request) ======//

        const jwt = this.authService.getJWT();
        if(!jwt){
            // Carry on... nothing to do here
            updatedRequest = request;
        } else {
            // Send our current token
            let clone = request.clone({
            setHeaders: {
                Authorization: `Bearer ${jwt}`
            }
            });
            updatedRequest = clone;
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
                // look for JWT in URL
                const urlJwt = this.authService.getJWTFromUrl();

                // look for JWT in auth headers
                const headerJwt = event.headers.get('Authorization')
                                            .replace('Bearer', '')
                                            .trim();

                const newJwt = urlJwt || headerJwt;

                if(newJwt)
                    this.authService.setAuth(newJwt)

                // TODO: may want to look at revoking if:
                //  'Authorization' : 'Bearer '
                // comes back from server....
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
        return next
                .handle(updatedRequest)
                .do(responseHandler, responseFailureHandler);
  }
}