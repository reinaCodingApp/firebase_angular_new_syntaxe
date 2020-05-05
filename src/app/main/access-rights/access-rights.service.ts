import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { Module } from 'app/main/access-rights/models/module';
import { BehaviorSubject } from 'rxjs';
import { navigation } from 'app/navigation/navigation';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from 'app/main/settings/models/user';
import { MatDialog } from '@angular/material';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AccessRightsService implements Resolve<any> {
  onModulesChanged: BehaviorSubject<Module[]>;
  onUserChanged: BehaviorSubject<User>;
  onFilteredModuleschanged: BehaviorSubject<Module[]>;
  onAvailableKeysChanged: BehaviorSubject<string[]>;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireFunctions: AngularFireFunctions,
    private matDialog: MatDialog,
    private appService: AppService,
    private router: Router) {
    this.onModulesChanged = new BehaviorSubject(null);
    this.onUserChanged = new BehaviorSubject(null);
    this.onFilteredModuleschanged = new BehaviorSubject(null);
    this.onAvailableKeysChanged = new BehaviorSubject([]);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          if (user.customClaims.isRoot || user.customClaims.isTechAdmin) {
            if (route.params.userId) {
              const userId = route.params.userId;
              this.loadUserAccessRights(userId).then(() => {
                resolve();
              }, (err) => {
                reject(err);
              });
            } else {
              if (user.customClaims.isRoot) {
                this.loadModules().then(() => {
                  resolve();
                }, (err) => {
                  reject(err);
                });
              } else {
                this.router.navigateByUrl('/home');
                resolve();
              }
            }
          }
          else {
            this.router.navigateByUrl('/home');
            resolve();
          }
        } else {
          this.router.navigateByUrl('/login');
          resolve();
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  loadModules() {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.modules)
        .get()
        .subscribe(data => {
          if (data && data.size > 0) {
            const modules = data.docs.map(d => ({ id: d.id, ...d.data() } as Module));
            this.onModulesChanged.next(modules);
            resolve(modules);
          } else { resolve([]); }
        });
    });
  }
  updateUserClaims(user: User) {
    const updateUserClaimsFn = this.angularFireFunctions.functions.httpsCallable('updateUserClaims');
    return updateUserClaimsFn({ uid: user.uid, customClaims: user.customClaims });
  }
  loadUserAccessRights(uid: string) {
    const getUserFn = this.angularFireFunctions.functions.httpsCallable('getUser');
    return new Promise((resolve, reject) => {
      getUserFn({ uid: uid }).then(response => {
        console.log('response from srv', response);
        const data = response.data;
        const user = { uid: data.uid, email: data.email, displayName: data.displayName, photoURL: data.photoURL } as User;
        if (data.customClaims) {
          user.customClaims = data.customClaims;
        }
        this.angularFirestore.collection(firestoreCollections.modules)
          .get()
          .subscribe(result => {
            if (result && result.size > 0) {
              const modules = result.docs.map(d => ({ id: d.id, ...d.data() } as Module));
              const claims = user.customClaims;
              let filteredModules: Module[] = [];
              modules.forEach(m => {
                if (m.type === 'collapsable' && m.children && m.children.length > 0) {
                  m.children.forEach(child => {
                    filteredModules.push(child);
                  });
                } else if (m.key && m.key.length > 0) {
                  filteredModules.push(m);
                }
              });
              filteredModules.forEach(m => {
                m.grantedAccess = claims[m.key] ? claims[m.key] : 0;
              });
              filteredModules = filteredModules.sort((a, b) => a.title.localeCompare(b.title));
              this.onFilteredModuleschanged.next(filteredModules);
              this.onUserChanged.next(user);
              resolve(modules);
            } else { resolve([]); }
          });
        resolve();
      }, reject);
    });
  }

  loadAccessRightsToClone(uid: string) {
    const getUserFn = this.angularFireFunctions.functions.httpsCallable('getUser');
    return new Promise((resolve, reject) => {
      getUserFn({ uid: uid }).then(response => {
        console.log('response from srv', response);
        const data = response.data;
        const user = { uid: data.uid, email: data.email, displayName: data.displayName, photoURL: data.photoURL } as User;
        if (data.customClaims) {
          user.customClaims = data.customClaims;
        }
        this.angularFirestore.collection(firestoreCollections.modules)
          .get()
          .subscribe(result => {
            if (result && result.size > 0) {
              const modules = result.docs.map(d => ({ id: d.id, ...d.data() } as Module));
              const claims = user.customClaims;
              let filteredModules: Module[] = [];
              modules.forEach(m => {
                if (m.type === 'collapsable' && m.children && m.children.length > 0) {
                  m.children.forEach(child => {
                    filteredModules.push(child);
                  });
                } else if (m.key && m.key.length > 0) {
                  filteredModules.push(m);
                }
              });
              filteredModules.forEach(m => {
                m.grantedAccess = claims[m.key] ? claims[m.key] : 0;
              });
              filteredModules = filteredModules.sort((a, b) => a.title.localeCompare(b.title));
              this.onFilteredModuleschanged.next(filteredModules);
              resolve(modules);
            } else { resolve([]); }
          });
        resolve();
      }, reject);
    });
  }

  async initializeModulesDatabase(): Promise<any> {
    const modules = navigation[0].children;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    let i = 0;
    for (const m of modules) {
      const newModule: Module = { index: i, id: m.id, title: m.title, key: '', icon: m.icon, type: m.type, exactMatch: true, displayInMenu: m.displayInMenu } as Module;
      if (newModule.type !== 'collapsable') {
        newModule.url = m.url;
        newModule.key = await this.appService.getKey(m.id);
      }
      if (newModule.type === 'collapsable') {
        newModule.children = [];
        newModule.key = await this.appService.getKey(m.id);
        let j = 0;
        for (const child of m.children) {
          const childKey = await this.appService.getKey(child.id);
          newModule.children.push({
            index: j, id: child.id, title: child.title, url: child.url, key: childKey,
            icon: child.icon, type: child.type, exactMatch: true, displayInMenu: child.displayInMenu
          });
          j++;
        }
      }
      console.log(newModule);
      const newModuleDocument = this.angularFirestore.collection(firestoreCollections.modules).doc(newModule.id);
      writeBatch.set(newModuleDocument.ref, newModule);
      i++;
    }
    writeBatch.commit();
  }



  initializeModulesKeys(): void {
    const uniqueKeys = [...EmbeddedDatabase.modulesUniqueKeys];
    const moduleIdentifiers = ModuleIdentifiers;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    let i = 0;
    // tslint:disable-next-line: forin
    for (const moduleIdentifier in moduleIdentifiers) {
      const moduleKey = { key: uniqueKeys[i] };
      const moduleKeyDocument = this.angularFirestore.collection(firestoreCollections.moduleKeys).doc(moduleIdentifier);
      writeBatch.set(moduleKeyDocument.ref, moduleKey);
      i++;
    }
    writeBatch.commit();
  }

  // modules
  async addParentModule(currentModule: Module): Promise<any> {
    const writeBatch = this.angularFirestore.firestore.batch();
    currentModule.exactMatch = true;
    currentModule.id = this.getModuleId(currentModule.key);
    currentModule.index = await this.getParentModuleIndex();
    const newModule = this.angularFirestore.collection(firestoreCollections.modules).doc(currentModule.id);
    writeBatch.set(newModule.ref, JSON.parse(JSON.stringify(currentModule)));
    writeBatch.commit();
    this.loadModules();
    this.matDialog.closeAll();
  }

  async addChildModule(currentModule: Module, parentModule: Module): Promise<any> {
    currentModule.exactMatch = true;
    currentModule.id = this.getModuleId(currentModule.key);
    currentModule.index = await this.getChildModuleIndex(parentModule.id);
    currentModule.type = 'item';
    if (!parentModule.children) {
      parentModule['children'] = [];
    }
    parentModule.children.push(currentModule);
    this.angularFirestore.collection(firestoreCollections.modules).doc(parentModule.id).set(JSON.parse(JSON.stringify(parentModule)));
    this.matDialog.closeAll();
  }

  updateParentModule(currentModule: Module): void {
    this.angularFirestore.collection(firestoreCollections.modules).doc(currentModule.id).set(JSON.parse(JSON.stringify(currentModule)));
    this.matDialog.closeAll();
  }

  updateChildModule(currentModule: Module, parentModule: Module): void {
    parentModule.children.forEach((child, index) => {
      if (child.id === currentModule.id) {
        parentModule.children[index] = currentModule;
      }
    });
    this.angularFirestore.collection(firestoreCollections.modules).doc(parentModule.id).set(JSON.parse(JSON.stringify(parentModule)));
    this.matDialog.closeAll();
  }

  private getModuleId(moduleKey: string): string {
    return `id_${moduleKey}`;
  }

  private getParentModuleIndex(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.modules)
        .get().subscribe(async data => {
          resolve(data.docs.length);
        }, err => {
          reject();
          console.log(err);
        });
    });
  }

  private getChildModuleIndex(id: string): Promise<any> {
    let length = 0;
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.modules)
        .get().subscribe(async data => {
          const modules = data.docs.map(d => ({ id: d.id, ...d.data() } as Module));
          modules.forEach((parentModule, index) => {
            if (parentModule.id === id) {
              if (modules[index].children) {
                length = modules[index].children.length;
              }
              resolve(length);
            }
          });
        }, err => {
          reject();
          console.log(err);
        });
    });
  }

  getAvailableKeys(): void {
    const uniqueKeys = [...EmbeddedDatabase.modulesUniqueKeys];
    const reservedKeys: string[] = [];
    let availableKeys: string[] = [];
    this.angularFirestore.collection(firestoreCollections.modules)
      .get().subscribe(async data => {
        const modules = data.docs.map(d => ({ id: d.id, ...d.data() } as Module));
        modules.forEach(parentModule => {
          reservedKeys.push(parentModule.key);
          if (parentModule.children) {
            parentModule.children.forEach(childModule => {
              reservedKeys.push(childModule.key);
            });
          }
        });
        availableKeys = uniqueKeys.filter((el) => {
          return reservedKeys.indexOf(el) < 0;
        });
        this.onAvailableKeysChanged.next(availableKeys);
      }, err => {
        console.log(err);
      });
  }

}
