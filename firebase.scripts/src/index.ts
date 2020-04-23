import * as admin from 'firebase-admin';
import * as firebaseAccountCredentials from './prod.private.key.json';
import { firebaseConfig } from '../../src/environments/environment';
import { EmbeddedDatabase } from '../../src/app/data/embeddedDatabase';
import { ModuleIdentifiers } from '../../src/app/data/moduleIdentifiers';
import { firestoreCollections } from '../../src/app/data/firestoreCollections';
import { navigation } from '../../src/app/navigation/navigation';
import { Module } from '../../src/app/main/access-rights/models/module';

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

export function initializeModulesKeys(): void {
  console.log('Init modules keys ...');
  const uniqueKeys = [...EmbeddedDatabase.modulesUniqueKeys];
  const moduleIdentifiers = ModuleIdentifiers;
  const writeBatch = admin.firestore().batch();
  let i = 0;
  // tslint:disable-next-line: forin
  for (const moduleIdentifier in moduleIdentifiers) {
    const moduleKey = { key: uniqueKeys[i] };
    const moduleKeyDocument = admin.firestore().collection(firestoreCollections.moduleKeys).doc(moduleIdentifier);
    writeBatch.set(moduleKeyDocument, moduleKey);
    i++;
  }
  writeBatch.commit();
  console.log('initialize modules keys finished successfully');
}

export async function initializeModulesDatabase(): Promise<any> {
  console.log('Init modules databse ...');
  const modules = navigation[0].children;
  const writeBatch = admin.firestore().batch();
  let i = 0;
  for (const m of modules) {
    const newModule: Module = { index: i, id: m.id, title: m.title, key: '', icon: m.icon, type: m.type, exactMatch: true, displayInMenu: m.displayInMenu } as Module;
    if (newModule.type !== 'collapsable') {
      newModule.url = m.url;
      newModule.key = await getKey(m.id);
    }
    if (newModule.type === 'collapsable') {
      newModule.children = [];
      newModule.key = await getKey(m.id);
      let j = 0;
      for (const child of m.children) {
        const childKey = await getKey(child.id);
        newModule.children.push({
          index: j, id: child.id, title: child.title, url: child.url, key: childKey,
          icon: child.icon, type: child.type, exactMatch: true, displayInMenu: child.displayInMenu
        });
        j++;
      }
    }
    const newModuleDocument = admin.firestore().collection(firestoreCollections.modules).doc(newModule.id);
    writeBatch.set(newModuleDocument, newModule);
    i++;
  }
  writeBatch.commit();
  console.log('initialize modules database finished successfully');
}
export function  createRootUser() {
  const newUser = admin.auth().createUser({
    displayName: 'Mr. Root',
    email: 'the root email',
    password: 'the root pwd',
    emailVerified: true,
  });
  const claims = {employeeId: 1880, isRoot: true, isTechAdmin: true };
  // tslint:disable-next-line: no-floating-promises
  return newUser.then(result => {
    // tslint:disable-next-line: no-floating-promises
    admin.auth().setCustomUserClaims(result.uid, claims).then(() => {
      console.log('#### added claims', claims);
    });
    return result;
  });
}
export function updateUserClaims(): void{
  const uid = 'ArGDFEBzfpQ7DFomIWJDq67TlnY2';
  const claims = {employeeId: 1880, isRoot: true, isTechAdmin: true, d: 6, a: 5, h: 6, b1: 7, c: 6, m: 6,
    o: 7, v: 6, y: 6, g: 6, x: 6, w: 6, b: 6, f: 6, e: 6, z: 6, a1: 6, k: 6, j: 7, l: 6, q: 6, p: 6, r: 6, s: 6,
    i: 6, n: 7, u: 6, t: 6 };
  // tslint:disable-next-line: no-floating-promises
  admin.auth().setCustomUserClaims(uid, claims).then(() => {
    console.log('### updated user claims', claims);
  });
}

function getKey(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    admin.firestore().collection(firestoreCollections.moduleKeys).doc(id)
      .get().then(async data => {
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


