import { BehaviorSubject } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, DefaultUrlSerializer, Router } from '@angular/router';
import { User } from 'app/main/settings/models/user';
import { DefaultClaim } from 'app/common/models/default-claim';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  onUsersChanged: BehaviorSubject<User[]>;

  private readonly defaultPasswordGuard = '#;&[=.}è_';
  constructor(
    private angularFireFunctions: AngularFireFunctions,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.onUsersChanged = new BehaviorSubject([]);
  }

  checkUserPrivilege(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.currentUser.getIdTokenResult().then(r => {
        resolve(r.claims);
      });
    });
  }

  passwordGuard(): string {
    return this.defaultPasswordGuard;
  }
  listUsers(): Promise<any> {
    const listUsersFn = this.angularFireFunctions.functions.httpsCallable('listUsers');
    return listUsersFn();
  }
  createUser(user: User) {
    const createUserFn = this.angularFireFunctions.functions.httpsCallable('createUser');
    return createUserFn({ email: user.email, password: user.password, displayName: user.displayName, customClaims: user.customClaims });
  }
  updateUser(user: User) {
    const updateUserFn = this.angularFireFunctions.functions.httpsCallable('updateUser');
    return updateUserFn(user.password === this.defaultPasswordGuard ?
      { uid: user.uid, email: user.email, displayName: user.displayName, customClaims: user.customClaims } :
      { uid: user.uid, email: user.email, password: user.password, displayName: user.displayName, customClaims: user.customClaims });
  }
  updateUserClaims(user: User) {
    const updateUserClaimsFn = this.angularFireFunctions.functions.httpsCallable('updateUserClaims');
    return updateUserClaimsFn({ uid: user.uid, customClaims: user.customClaims });
  }
  getUser(uid: string) {
    const getUserFn = this.angularFireFunctions.functions.httpsCallable('getUser');
    return getUserFn({ uid: uid });
  }

}
