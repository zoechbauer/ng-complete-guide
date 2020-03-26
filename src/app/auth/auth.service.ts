import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    const firebaseApiKey = environment.firebaseApiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`;
    console.log('url', url);
    console.log(email, password);
    return this.http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already!';
              break;
          }
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {
    const firebaseApiKey = environment.firebaseApiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
    return this.http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(errorRes => {
          console.log(errorRes);
          let errorMessage = 'An unknown error occurred!';
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'The email does not exist!';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'The password is not correct!';
              break;
          }
          return throwError(errorMessage);
        })
      );
  }
}
