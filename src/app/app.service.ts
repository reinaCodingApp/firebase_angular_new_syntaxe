import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from './main/settings/models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { firestoreCollections } from './data/firestoreCollections';
import { Module } from './main/access-rights/models/module';
import { FuseNavigationItem } from '@fuse/types';
import { AccessRightsService } from './main/access-rights/access-rights.service';
import { Habilitation } from './main/access-rights/models/habilitation';
import { AppVersion } from './common/models/app-version';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  onShowConfigButtonChanged: BehaviorSubject<boolean>;
  onConfigurationUrlChanged: BehaviorSubject<string>;
  currentUser: User;
  onCurentUserChanged: BehaviorSubject<User>;
  onNavigationMenuChanged: BehaviorSubject<any>;
  onShowSettingsButtonChanged: BehaviorSubject<boolean>;
  onAppVersionChanged: BehaviorSubject<AppVersion>;

  constructor(private angularFireAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private accessRightsService: AccessRightsService) {
    this.onShowConfigButtonChanged = new BehaviorSubject(false);
    this.onConfigurationUrlChanged = new BehaviorSubject('');
    this.onCurentUserChanged = new BehaviorSubject(null);
    this.onNavigationMenuChanged = new BehaviorSubject(null);
    this.onShowSettingsButtonChanged = new BehaviorSubject(false);
    this.onAppVersionChanged = new BehaviorSubject(null);
    this.angularFireAuth.authState.subscribe(async (result) => {
      if (result) {
        const user = { uid: result.uid, email: result.email, displayName: result.displayName, photoURL: result.photoURL } as User;
        const tokenResult = await result.getIdTokenResult();
        if (tokenResult) {
          user.customClaims = tokenResult.claims;
          this.onShowSettingsButtonChanged.next(user.customClaims.isRoot);
        }
        this.currentUser = user;
        this.onCurentUserChanged.next(this.currentUser);
        this.loadNavigationMenu(this.currentUser);
      } else {
        this.loadNavigationMenu(null);
      }
    });
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
  getLastAppVersion(): Observable<DocumentChangeAction<unknown>[]>{
    return this.angularFirestore.collection(firestoreCollections.appVersions,
                                            query => query.orderBy('versionCode', 'desc')
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
      this.accessRightsService.getKey(moduleIdentifier).then(moduleKey => {
        const habilitation = new Habilitation(claims[moduleKey]);
        resolve(habilitation);
      }, reject);
    });
  }

  setConfigButtonParameters(visible: boolean, configurationUrl: string): void {
    this.onShowConfigButtonChanged.next(visible);
    this.onConfigurationUrlChanged.next(configurationUrl);
  }
}
