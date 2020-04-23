import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from './login.service';
import { User } from 'app/main/settings/models/user';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    showError = false;
    constructor(private _fuseConfigService: FuseConfigService, 
                private _formBuilder: FormBuilder,
                private loginService: LoginService, 
                private router: Router,
                private loaderService: NgxUiLoaderService)
    { 
        this._fuseConfigService.config = {
            layout: {navbar   : {hidden: true},
                toolbar  : {hidden: true},
                footer   : {hidden: true},
                sidepanel: {hidden: true}
            }
        };
    }
    login(): void {        
        this.loaderService.start();
        const user = {email: this.loginForm.get('email').value, password: this.loginForm.get('password').value} as User;
        this.loginService.login(user).then(result => {
          this.loaderService.stop();
          this.loginService.onUserAuthenticates.next(result);
          this.router.navigate(['home']);
        },
        err => {
            this.loaderService.stop();
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 15000);
            console.log('err', err); });
    }
    logout(): void {
        this.loginService.logout();
    }
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
