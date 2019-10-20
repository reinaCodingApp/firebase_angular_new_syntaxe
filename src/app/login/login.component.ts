import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  connect() {
    this.loginService.connect('malick@avs.fr', 'Azerty123').then(result => {
      console.log('signin result ', result);
    })
  }
  sendReset() {
    this.loginService.SendPasswordReset().then(result => {
      console.log('result reset : ', result);
    })
  }
  ngOnInit() {
  }

}
