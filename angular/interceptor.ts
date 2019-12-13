import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const self = this;
        // ====== For sending token (with request) ======//
        const jwt = self.authService.getJWT();
        // Send our current token
        const withAuthHeader = request.clone({
            setHeaders: {
                Authorization: jwt ? `Bearer ${jwt}` : ''
            }
        });

        return next.handle(withAuthHeader)
  }
}