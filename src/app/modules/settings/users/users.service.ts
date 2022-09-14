import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'app/modules/settings/models/user';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly defaultPasswordGuard = '#;&[=.}è_';
  constructor(
    private angularFireFunctions: AngularFireFunctions,
    private angularFireAuth: AngularFireAuth
  ) {
  }

  checkUserPrivilege(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.idTokenResult.subscribe((r) => {
        resolve(r.claims);
      });
    });
  }

  passwordGuard(): string {
    return this.defaultPasswordGuard;
  }
  listUsers(): Observable<any> {
    const listUsersFn = this.angularFireFunctions.httpsCallable('listUsers');
    return listUsersFn({});
  }
  createUser(user: User) {
    const createUserFn = this.angularFireFunctions.httpsCallable('createUser');
    return createUserFn({ email: user.email, password: user.password, displayName: user.displayName, customClaims: user.customClaims });
  }
  updateUser(user: User) {
    const updateUserFn = this.angularFireFunctions.httpsCallable('updateUser');
    return updateUserFn(user.password === this.defaultPasswordGuard ?
      { uid: user.uid, email: user.email, displayName: user.displayName, customClaims: user.customClaims } :
      { uid: user.uid, email: user.email, password: user.password, displayName: user.displayName, customClaims: user.customClaims });
  }
  updateUserClaims(user: User) {
    const updateUserClaimsFn = this.angularFireFunctions.httpsCallable('updateUserClaims');
    return updateUserClaimsFn({ uid: user.uid, customClaims: user.customClaims });
  }
  getUser(uid: string) {
    const getUserFn = this.angularFireFunctions.httpsCallable('getUser');
    return getUserFn({ uid: uid });
  }

}
