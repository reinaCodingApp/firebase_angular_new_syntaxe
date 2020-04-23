import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UsersService } from './users/users.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppService } from 'app/app.service';

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
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          if (!user.customClaims.isRoot) {
            this.router.navigateByUrl('/home');
            resolve();
          } else {
            this.usersService.listUsers();
            resolve();
          }
        }
      }, (err) => {
        reject(err);
      });
    });
  }

}

