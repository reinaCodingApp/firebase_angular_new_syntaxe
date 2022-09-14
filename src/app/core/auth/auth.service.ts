import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "@angular/fire/auth";
import { User } from "app/modules/settings/models/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable()
export class AuthService {
  private tokenId: string;
  constructor(
    private auth: Auth,

    private afAuth: AngularFireAuth
  ) {}

  signIn(credentials: {
    email: string;
    password: string;
  }): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  forgotPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  resetPassword(oobCode: string, password:string) {
    return this.afAuth.confirmPasswordReset(oobCode, password);
  }
  verifyOobCode(code) {
    return this.afAuth.verifyPasswordResetCode(code.toString());
  }

  signUp(user: {
    name: string;
    email: string;
    password: string;
    company: string;
  }): Observable<any> {
    return of(1);
  }

  check(): Observable<boolean> {
    return of(true);
  }
  async getCurrentUser(): Promise<User> {
    const user: any = {
      displayName: this.auth.currentUser.displayName,
      email: this.auth.currentUser.email,
    };
    let claims = await (await this.auth.currentUser.getIdTokenResult()).claims;
    this.tokenId = await this.auth.currentUser.getIdToken();
    user.customClaims = claims;
    return new Promise((resolve) => {
      resolve(user);
    });
  }
  getTokenId() {
    return this.tokenId;
  }
}
