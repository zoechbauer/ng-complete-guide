import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';

export class AuthEffects {
  AuthLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START)
    // TODO insert Http Request
  );

  constructor(private actions$: Actions) {}
}
