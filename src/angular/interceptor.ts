import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";

import { AuthService } from '../auth';

/**
 * Angular boilerplate because:
 * Angular6 HttpErrorResponse <> Angular7 HTTErrorPResponse
 */
function isHttpErrorResponse(evt: any): boolean {
    return evt && evt.error;
}

/**
 * Angular boilerplate because:
 * Angular6 HttpResponse <> Angular7 HTTPResponse
 * @param evt
 */
function isHttpResponse(evt: any): boolean {
    return evt && evt.body;
}

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
        function responseHandler(event: HttpResponse<any>): HttpEvent<any> {
            if (isHttpResponse(event)) {
                const AuthHeader = event.headers.get('Authorization') || '';

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

            return event;
        }

        /**
         * The is the error handler when an unauthenticated request
         * comes back from the server...
         *
         * @param {Error} err - Error from server
         */
        function responseFailureHandler(err: any){
            if (isHttpErrorResponse(event)) {
                if (err.status === 401) {
                    self.authService.logout();
                }
            }
        }

        // ==============================================//

        // setup and return with handlers
        // https://stackoverflow.com/questions/45664874/interceptor-making-two-calls-in-api
        const handler = next.handle(request).pipe(
            tap(responseHandler, responseFailureHandler));

        return handler
  }
}