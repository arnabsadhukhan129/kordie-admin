import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message.includes('TokenExpiredError')) {
          // Token expired: Logout user
          this.logoutUser();
        }
        return throwError(error);
      })
    );
  }

  private logoutUser() {
    localStorage.removeItem('portal_login_token'); // Clear token
    localStorage.removeItem('login_role');
    this.router.navigate(['/login']); // Redirect to login page
  }
}

