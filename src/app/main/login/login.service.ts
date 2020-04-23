import { User } from '../settings/models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { MainTools } from 'app/common/tools/main-tools';
import { AngularFireStorage } from '@angular/fire/storage';
import { Attachment } from 'app/common/models/attachment';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService implements Resolve<any>{
  onUserAuthenticates: BehaviorSubject<firebase.auth.UserCredential>;
  onUserLogout: BehaviorSubject<any>;
  onProfilePictureUploaded: BehaviorSubject<any>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStorage: AngularFireStorage,
    private router: Router    
  ) {
    this.onUserAuthenticates = new BehaviorSubject(null);
    this.onUserLogout = new BehaviorSubject({});
    this.onProfilePictureUploaded = new BehaviorSubject(null);    
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.authState.subscribe(currentState => {
        if (currentState && currentState.uid) {
          this.router.navigate(['home']);
          resolve();
        }        
        resolve();
      });
    });
  }

  login(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    this.angularFireAuth.auth.signOut();
    this.onUserLogout.next(null);
  }
    
  sendPasswordResetEmail(email: string) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  confirmPasswordReset(oobCode: string, newPassword: string) {
    return this.angularFireAuth.auth.confirmPasswordReset(oobCode, newPassword);
  }

  uploadProfilePicture(file: File): Observable<number> {
    const filePath = file.name;
    const size = MainTools.getFileSizeToString(file.size);
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          const attachemnt = { url: downloadURL, fileName: file.name, size: size } as Attachment;
          this.onProfilePictureUploaded.next({ ...attachemnt });
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  updateProfile(profileData: any): Promise<void> {
    return this.angularFireAuth.auth.currentUser.updateProfile(profileData);
  }
}
