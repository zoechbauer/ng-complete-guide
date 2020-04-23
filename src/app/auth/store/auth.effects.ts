import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable()
export class AuthEffects {
  private firebaseApiKey = environment.firebaseApiKey;
  private url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;

  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect()
  AuthLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(this.url, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((resData) => {
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return of(
              new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              })
            );
          }),
          catchError((err) => {
            // process errror
            console.log(err);
            return of();
          })
        );
    })
  );
}
