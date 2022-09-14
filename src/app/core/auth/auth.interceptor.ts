import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { Auth } from '@angular/fire/auth';
import { NavigationService } from '../navigation/navigation.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private auth: Auth, private navigation: NavigationService)
    {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        //const tokenId = localStorage.getItem('tokenId');
        const tokenId = this._authService.getTokenId();
        let newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenId}`
            }
          });
        return next.handle(newReq);
    }
}
