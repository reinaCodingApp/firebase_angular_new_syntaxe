import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Route } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { ResetPasswordRequestComponent } from './reset-password-request/reset-password-request.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';
import { LoginService } from './login.service';

const routes: Route[] = [
    {path: 'login', component: LoginComponent, resolve: {main: LoginService}},
    {path: 'login/reset-password-request', component: ResetPasswordRequestComponent},
    {path: 'login/reset-password-form', component: ResetPasswordFormComponent},
    {path: 'login/reset-password-confirm', component: ResetPasswordConfirmComponent}
];

@NgModule({
  declarations: [LoginComponent, ResetPasswordRequestComponent, ResetPasswordFormComponent, ResetPasswordConfirmComponent],
  imports: [
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    FuseSharedModule
  ],
  exports : [LoginComponent]
})
export class LoginModule { }
