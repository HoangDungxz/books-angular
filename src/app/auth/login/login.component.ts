/**
 * @file LoginComponent is a component for handling the login functionality.
 * @module app-login
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interface representing the structure of the account fields.
 * @interface
 * @property {string} username - The username for the account.
 * @property {string} password - The password for the account.
 */
interface AccountField {
  username: string;
  password: string;
}

/**
 * Component for the login functionality.
 * @class
 * @implements {OnInit}
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Object holding account data and errors.
   * @property {Object} data - Object containing account data.
   * @property {string} data.username - The username for the account.
   * @property {string} data.password - The password for the account.
   * @property {Object} errors - Object containing validation errors.
   * @property {string} errors.username - Validation error message for the username.
   * @property {string} errors.password - Validation error message for the password.
   */
  account: {
    data: AccountField;
    errors: AccountField;
  } = {
    data: {
      username: 'admin',
      password: 'Admin@123',
    },
    errors: {
      username: '',
      password: '',
    },
  };

  /**
   * Flag to indicate whether the login process is loading.
   * @type {boolean}
   */
  isLoading: boolean = false;

  /**
   * Flag to toggle password visibility.
   * @type {boolean}
   */
  isShowPassword: boolean = false;

  /**
   * Constructor for LoginComponent.
   * @constructor
   * @param {AuthService} authService - The authentication service.
   * @param {Router} router - The Angular router service.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Lifecycle hook called after the component's data-bound properties have been initialized.
   * @method
   */
  ngOnInit(): void {}

  /**
   * Toggles the visibility of the password.
   * @method
   */
  togglePasswordVisibility(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  /**
   * Validates the username field.
   * Sets an error message if the username is empty.
   * @method
   */
  validateUsername(): void {
    if (!this.account.data.username) {
      this.account.errors.username = 'Username is required';
      return;
    }
    this.account.errors.username = '';
  }

  /**
   * Validates the password field.
   * Sets an error message if the password is empty or does not meet the strength criteria.
   * @method
   */
  validatePassword(): void {
    const password = this.account.data.password;

    if (!password) {
      this.account.errors.password = 'Password is required';
      return;
    }

    // Password strength criteria: at least one uppercase, one digit, and one special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!passwordRegex.test(password)) {
      this.account.errors.password =
        'Password must contain at least one uppercase letter, one digit, and one special character';
      return;
    }

    this.account.errors.password = '';
  }

  /**
   * Handles the login event.
   * Prevents the default behavior of the event.
   * You can add your login logic here.
   * @method
   * @param {Event} event - The login event.
   */
  login(event: Event): void {
    event.preventDefault();

    this.validateUsername();
    this.validatePassword();
    if (this.account.errors.username || this.account.errors.password) {
      return;
    }
    this.isLoading = true;
    this.authService
      .login({
        username: this.account.data.username,
        password: this.account.data.password,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
