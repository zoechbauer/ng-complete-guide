import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { LoggingService } from './logging.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-complete-guide';

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private loggingService: LoggingService,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // localStorage is a Browser api and not available at server
      this.store.dispatch(new AuthActions.AutoLogin());
    }

    // this message is logged from server & browser
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }
}
