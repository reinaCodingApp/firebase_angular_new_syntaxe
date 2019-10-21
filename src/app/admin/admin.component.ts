import { User } from './../models/user';
import { LoginService } from './../login/login.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userParam: User = { email: 'malick@avs.fr', password: 'Azerty123', name: 'MALICK' } as User;
  constructor(private loginService: LoginService) { }

  register(user: User) {
    this.loginService.register(user.email, user.password).then((result) => {
      console.log('result ', result);
      if (result) {
        user.uid = result.user.uid;
        const u = {uid: result.user.uid, email: user.email, name: user.name };
        this.loginService.createUser(u).then(response => {
          console.log('response create user ', response);
        });
      }
    }).catch((err) => {
      console.log('err ', err);
    });
  }
  ngOnInit() {
    console.log('user', this.userParam);
    // todo: à tester sur un serveur node
    /*
    var defaultApp = admin.initializeApp(firebaseConfig);
    console.log('name : ' , defaultApp.name);  // '[DEFAULT]'
    */
  }


}
