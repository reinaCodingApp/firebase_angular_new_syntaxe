import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { User } from './../../models/user';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private router: Router) {
      angularFireAuth.authState.subscribe(state => {
          console.log('state subscription', state);
          if (state == null)
          {
            this.router.navigate(['login']);
          }
      });
      angularFireAuth.auth.currentUser
   }

  login(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }
  getUserProfil(uid: string){
      return this.angularFirestore.collection('/users', q => q.where('uid', '==', uid)).get();
  }
  updateProfil(){
    const profilData = {displayName: 'Malick NDIONE',
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/rc0001-9ae8b.appspot.com/o/789313665.png?alt=media&token=71e2fa61-a782-4ec0-8c73-b14138c34351'};
    this.angularFireAuth.auth.currentUser.updateProfile(profilData);
  }
  logout() {
      this.angularFireAuth.auth.signOut();
  }
  getState() {
      return this.angularFireAuth.authState;
  }
}
