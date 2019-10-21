import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password = '';
  constructor(private loginService: LoginService, private router: Router) { }

  connect() {
    this.loginService.connect('malick@avs.fr', this.password).then(result => {
      console.log('signin result ', result);
      this.router.navigateByUrl('/home');
    });
  }
  sendReset() {
    this.loginService.SendPasswordReset().then(result => {
      console.log('result reset : ', result);
    });
  }
  ngOnInit() {
  }

}
