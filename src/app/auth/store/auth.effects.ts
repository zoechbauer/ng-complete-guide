import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes) => {
  // process errror
  console.log('AuthEffects ERROR', errorRes);
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  private firebaseApiKey = environment.firebaseApiKey;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authState: AuthActions.SignupStart) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.firebaseApiKey}`;
      return this.http
        .post<AuthResponseData>(url, {
          email: authState.payload.email,
          password: authState.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;
      return this.http
        .post<AuthResponseData>(url, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData) => {
            return handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'DUMMY' };
      }
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        const expirationDateInMs = new Date(
          userData._tokenExpirationDate
        ).getTime();
        const expirationDuration = expirationDateInMs - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        });
      }
      return { type: 'DUMMY' };
    })
  );
}
