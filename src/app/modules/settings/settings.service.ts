import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UsersService } from './users/users.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefaultClaim } from 'app/common/models/default-claim';
import { User } from './models/user';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements Resolve<any> {
  onUsersChanged: BehaviorSubject<User[]>;
  currentUser: User;
  
  constructor(
    private usersService: UsersService,
    private authSerivce: AuthService,
    private router: Router) { 
      this.onUsersChanged = new BehaviorSubject([]);
    }

  resolve(): Observable<any> | Promise<any> {
      console.log('### settings resolve');
    return new Promise<void>((resolve, reject) => {
      this.authSerivce.getCurrentUser().then(user => {
          this.currentUser = user;
          if (user.customClaims.isRoot || user.customClaims.isTechAdmin) {
            this.usersService.listUsers().subscribe((response) => {
              console.log('### response', response);
              let users = response.map((u) => {
                const result = { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } as User;
                if (u.customClaims !== null) {
                  result.customClaims = (u.customClaims as DefaultClaim);
                }
                return result;
              });
              console.log('#### users', users);
              users = users.sort((a, b) => a.displayName.localeCompare(b.displayName)) as User[];
              console.log('#### users after sort()', users);
              this.onUsersChanged.next(users);
              resolve();
            }, (err) => {
                console.log('#### error', err);
              reject(err);
            });
         }
           else {
            this.router.navigateByUrl('/home');
            resolve();
          }
      }, (err) => {
        reject(err);
      });
    });
  }

}

