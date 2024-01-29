import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '../../models/User';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Subscription } from 'rxjs';

/**
 * HeaderComponent represents the header section of the application.
 *
 * This component displays information related to the currently logged-in user and provides a logout option.
 *
 * @example
 * <app-header></app-header>
 *
 * @implements {OnInit} Angular lifecycle hook for component initialization.
 * @implements {OnDestroy} Angular lifecycle hook for component destruction.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * Holds the information of the currently logged-in user.
   * @type {IUser | null}
   */
  currentUser: IUser | null = null;

  /**
   * Subscription to observe changes in the current user.
   * @private
   * @type {Subscription}
   */
  private _currentUserObserver: Subscription = new Subscription();

  /**
   * Creates an instance of HeaderComponent.
   * @param {AuthService} authService - The authentication service used for user-related operations.
   */
  constructor(private authService: AuthService) {}

  /**
   * Lifecycle hook called after the component is initialized.
   * Subscribes to changes in the current user and updates the `currentUser` property accordingly.
   * @memberof HeaderComponent
   */
  ngOnInit(): void {
    this._currentUserObserver = this.authService.currentUser.subscribe((e) => {
      this.currentUser = e;
    });
  }

  /**
   * Initiates the logout process for the current user.
   * @memberof HeaderComponent
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from the current user observer to prevent memory leaks.
   * @memberof HeaderComponent
   */
  ngOnDestroy(): void {
    this._currentUserObserver?.unsubscribe();
  }
}
