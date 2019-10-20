import { User } from './../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({providedIn: 'root'})
export class LoginService {
constructor(private angualrFireAuth: AngularFireAuth, private angularFireStore: AngularFirestore) {
  angualrFireAuth.authState.subscribe(state => {
    console.log('state ', state);
  });

}

register(email: string, password: string) {
  this.angualrFireAuth.auth.languageCode = 'fr';
  return this.angualrFireAuth.auth.createUserWithEmailAndPassword(email, password);
}
createUser(user: any) {
  return this.angularFireStore.collection('/users').add(user);
}
connect(email: string, password: string) {
  return this.angualrFireAuth.auth.signInWithEmailAndPassword(email, password);
}
SendPasswordReset() {
  this.angualrFireAuth.auth.languageCode = 'fr';
  return this.angualrFireAuth.auth.sendPasswordResetEmail('m.hessas@gmail.com');
}
}
