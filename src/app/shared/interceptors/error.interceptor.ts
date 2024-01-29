import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * ErrorInterceptor constructor.
   * @param {ToastrService} toastr - ToastrService for displaying toast notifications.
   * @param {Router} router - Angular Router for navigation.
   */
  constructor(private toastr: ToastrService, private router: Router) {}

  /**
   * Intercepts HTTP requests and handles errors.
   * @param {HttpRequest<any>} request - The outgoing HTTP request.
   * @param {HttpHandler} next - The HTTP handler for the request.
   * @returns {Observable<HttpEvent<any>>} - An observable of the HTTP event.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
          this.toastr.error('Unauthorized Access', 'Error');
        }
        return throwError(error);
      })
    );
  }
}
