import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private angularFireAuth: AngularFireAuth) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.angularFireAuth.idToken.pipe(take(1), mergeMap((token) => {
      if (!token) {
        this.router.navigateByUrl('/login');
      }
      if (request.url.indexOf('googleapis') !== -1) {
        return next.handle(request);
      }
      if (token && token.length > 0) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next.handle(request);
    }));
  }
}
