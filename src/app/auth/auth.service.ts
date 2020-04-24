import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signup(email: string, password: string) {
    const firebaseApiKey = environment.firebaseApiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`;
    return this.http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
      })
    );
    this.autologout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  login(email: string, password: string) {
    const firebaseApiKey = environment.firebaseApiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
    return this.http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      // error messages for login
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is not correct!';
        break;
      // error messages for signup
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
    }
    return throwError(errorMessage);
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autologout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autologin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.store.dispatch(
        new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
        })
      );

      const expirationDateInMs = new Date(
        userData._tokenExpirationDate
      ).getTime();
      const expirationDuration = expirationDateInMs - new Date().getTime();
      console.log(
        userData._tokenExpirationDate,
        expirationDateInMs,
        expirationDuration
      );
      this.autologout(expirationDuration);
    }
  }
}
