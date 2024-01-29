import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IResponse } from 'src/app/shared/models';
import { IUser } from 'src/app/shared/models/User';

/**
 * Service handling authentication-related functionality.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * BehaviorSubject to store the current user's information.
   */
  private _currentUser: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);

  private currentUser$ = this._currentUser.asObservable();

  /**
   * Constructor for AuthService.
   * @param httpClient - Angular HttpClient for making HTTP requests.
   * @param toastr - ToastrService for displaying toast messages.
   * @param router - Angular Router for navigation.
   */
  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    try {
      const storeUser = localStorage.getItem('currentUser');
      if (storeUser) {
        this._currentUser.next(JSON.parse(storeUser));
      }
    } catch (error) {}
  }

  /**
   * Performs user login and updates the current user information.
   * @param credentials - User credentials containing username and password.
   */
  login({
    username,
    password,
  }: Partial<IUser>): Observable<{ data: IUser | null }> {
    return this.httpClient
      .post<IResponse<IUser>>('http://localhost:3000/auth/login', {
        username,
        password,
      })
      .pipe(
        tap({
          next: (result: { data: IUser | null }) => {
            this._currentUser.next(result.data);

            this.toastr.success('Đăng nhập thành công!', 'Success');
            localStorage.setItem('currentUser', JSON.stringify(result.data));

            this.router.navigate(['']);
          },
          error: (error: HttpErrorResponse & { meta: { message: string } }) => {
            if (error?.error?.meta?.message) {
              this.toastr.error(error?.error?.meta?.message, 'Error');
            } else {
              this.toastr.error('Có lôi xảy ra xin vui lòng thử lại!', 'Error');
            }
          },
        })
      );
  }

  /**
   * Logs the user out by clearing the current user information.
   */
  logout(): void {
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['auth/login']);
  }

  /**
   * Getter for the current user as an observable.
   * @returns Observable containing the current user information.
   */
  get currentUser(): Observable<IUser | null> {
    return this.currentUser$;
  }
}
