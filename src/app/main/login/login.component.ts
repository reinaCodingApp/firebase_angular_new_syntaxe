import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from './login.service';
import { User } from 'app/models/user';
import { Router } from '@angular/router';

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
    constructor(private _fuseConfigService: FuseConfigService, private _formBuilder: FormBuilder, private loginService: LoginService, private router: Router)
    {
        this.loginService.getState().subscribe(state => {
            if (state && state.uid) {
                this.router.navigate(['home']);
            }

        });
        this._fuseConfigService.config = {
            layout: {navbar   : {hidden: true},
                toolbar  : {hidden: true},
                footer   : {hidden: true},
                sidepanel: {hidden: true}
            }
        };
    }
    login() {
        const user = {email: this.loginForm.get('email').value, password: this.loginForm.get('password').value} as User;
        this.loginService.login(user).then(result => {
            console.log('navigation ', result.user.uid);
            this.loginService.updateProfil();
            this.router.navigate(['home']);
        },
        err => {
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 15000);
            console.log('err', err); });
    }
    logout() {
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
