import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
  ],
})
export class AuthModule {}
