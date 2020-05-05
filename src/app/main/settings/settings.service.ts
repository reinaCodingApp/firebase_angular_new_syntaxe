import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UsersService } from './users/users.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppService } from 'app/app.service';
import { DefaultClaim } from 'app/common/models/default-claim';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements Resolve<any> {

  constructor(
    private usersService: UsersService,
    private appService: AppService,
    private router: Router) { }

  resolve(): Observable<any> | Promise<any> {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          if (user.customClaims.isRoot || user.customClaims.isTechAdmin) {
            this.usersService.listUsers().then(response => {
              let users = response.data.map(u => {
                const result = { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } as User;
                if (u.customClaims) {
                  result.customClaims = (u.customClaims as DefaultClaim);
                }
                return result;
              });
              users = users.sort((a, b) => a.displayName.localeCompare(b.displayName));
              this.usersService.onUsersChanged.next(users);
              resolve();
            }, (err) => {
              reject(err);
            });
          } else {
            this.router.navigateByUrl('/home');
            resolve();
          }
        } else {
          this.router.navigate(['login']);
          resolve();
        }
      }, (err) => {
        reject(err);
      });
    });
  }

}

