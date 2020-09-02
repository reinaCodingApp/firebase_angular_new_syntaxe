import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from './main/settings/models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { firestoreCollections } from './data/firestoreCollections';
import { Module } from './main/access-rights/models/module';
import { FuseNavigationItem } from '@fuse/types';
import { AccessRightsService } from './main/access-rights/access-rights.service';
import { Habilitation } from './main/access-rights/models/habilitation';
import { AppVersion } from './main/changelog/models/app-version';
import { first, mergeMap, take } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NewVersionSnackbarComponent } from './shared/new-version-snackbar/new-version-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  onShowConfigButtonChanged: BehaviorSubject<boolean>;
  onConfigurationUrlChanged: BehaviorSubject<string>;
  currentUser: User;
  onCurentUserChanged: BehaviorSubject<User>;
  onNavigationMenuChanged: BehaviorSubject<any>;
  onAppVersionChanged: BehaviorSubject<AppVersion>;
  latestKnownAppVersion: AppVersion = null;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.onShowConfigButtonChanged = new BehaviorSubject(false);
    this.onConfigurationUrlChanged = new BehaviorSubject('');
    this.onCurentUserChanged = new BehaviorSubject(null);
    this.onNavigationMenuChanged = new BehaviorSubject(null);
    this.onAppVersionChanged = new BehaviorSubject(null);

  }
  loadNavigationMenu(user: User): void {
    if (!user) {
      this.onNavigationMenuChanged.next([]);
    } else {
      this.angularFirestore.collection(firestoreCollections.modules, query => query.orderBy('index', 'asc'))
        .get()
        .subscribe(data => {
          if (data && data.size > 0) {
            const modules = data.docs.map(d => ({ id: d.id, ...d.data() } as Module));
            const userModules: Module[] = [];
            const claims = user.customClaims;
            modules.forEach(m => {
              if (m.type === 'collapsable' && m.children && m.children.length > 0) {
                const parentMenu = { ...m };
                parentMenu.children = [];
                let includeParentMenu = false;
                m.children.forEach(child => {
                  if (claims[child.key] > 0 && child.displayInMenu) {
                    parentMenu.children.push(child);
                    includeParentMenu = true;
                  }
                });
                if (includeParentMenu) {
                  userModules.push(parentMenu);
                }

              } else if (m.type === 'item') {
                if (claims[m.key] > 0 && m.displayInMenu) {
                  userModules.push({ ...m });
                }
              }
            });
            const builtModules = [{
              id: 'applications',
              title: 'APPLICATIONS',
              type: 'group',
              children: [...userModules]
            }];
            this.onNavigationMenuChanged.next(builtModules);
          }
        });

    }
  }
  getLastAppVersion(): Observable<DocumentChangeAction<unknown>[]> {
    return this.angularFirestore.collection(firestoreCollections.appVersions,
      query => query.where('published', '==', true)
        .orderBy('versionCode', 'desc')
        .limit(1)).snapshotChanges();
  }
  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    } else {
      return this.onCurentUserChanged.asObservable();
    }
  }
  getHabilitation(user: User, moduleIdentifier: string): Promise<Habilitation> {
    return new Promise((resolve, reject) => {
      const claims = user.customClaims;
      this.getKey(moduleIdentifier).then(moduleKey => {
        const habilitation = new Habilitation(claims[moduleKey]);
        resolve(habilitation);
      }, reject);
    });
  }
  async getConnectedUser(): Promise<User> {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }
    return await this.angularFireAuth.authState.
      pipe(first(), mergeMap(u => {
        if (!u) {
          return Promise.resolve(null);
        }
        return u.getIdTokenResult().then(claims => {
          const user = { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } as User;
          if (claims) {
            user.customClaims = claims.claims;
          }
          this.currentUser = user;
          return user;
        });
      })
      ).toPromise();
  }

  setConfigButtonParameters(visible: boolean, configurationUrl: string): void {
    this.onShowConfigButtonChanged.next(visible);
    this.onConfigurationUrlChanged.next(configurationUrl);
  }

  getKey(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.moduleKeys).doc(id)
        .get().subscribe(async data => {
          if (data.exists) {
            const moduleKey = data.data() as any;
            resolve(moduleKey.key);
          }
        }, err => {
          reject();
          console.log(err);
        });
    });
  }

  displayNewAppVersionSnackBar(): void {
    if (!this.currentUser.customClaims.isRoot) {
      const config: MatSnackBarConfig = {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['new-version-snackbar']
      };
      this.snackBar.openFromComponent(NewVersionSnackbarComponent, {
        ...config
      });
    }
  }
}
