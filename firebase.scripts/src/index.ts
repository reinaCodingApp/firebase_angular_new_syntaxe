import * as admin from 'firebase-admin';
import * as firebaseAccountCredentials from './dev-p00001-firebase-adminsdk-696w4-9487a73e7a.json';
import { firebaseConfig } from '../../src/environments/environment';
import { EmbeddedDatabase } from '../../src/app/data/embeddedDatabase';
import { ModuleIdentifiers } from '../../src/app/data/moduleIdentifiers';
import { firestoreCollections } from '../../src/app/data/firestoreCollections';
import { navigation } from '../../src/app/navigation/navigation';
import { Module } from '../../src/app/main/access-rights/models/module';
import { Post } from '../../src/app/main/webcms/website/components/posts/models/post';

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
export function createAuditPoles() {
  const poles = [{ displayOrder: 0, name: 'Abattoir bovins et ovins' },
  { displayOrder: 0, name: 'Abattoir volailles' }, { displayOrder: 0, name: 'C.E.V' }, { displayOrder: 0, name: 'Administration' },
  { displayOrder: 0, name: 'Traçabilité' }, { displayOrder: 0, name: 'Communication' }, { displayOrder: 0, name: 'Développement' },
  { displayOrder: 0, name: 'Direction' }, { displayOrder: 0, name: 'Service entretien' }
  ];
  let i = 4;
  poles.forEach(pole => {
    pole.displayOrder = i++;
    admin.firestore().collection(firestoreCollections.auditPoles).add(pole);
  });
}
export function initializeWebHomeSettings() {

  const components = {
    featuredPosts: { displayOrder: 8, show: true, title: 'Articles à lire' },
    focus: { displayOrder: 7, show: true, title: 'Focus' },
    highlightPost: { displayOrder: 0, isClickablePost: false, show: true, title: 'Article à la Une' },
    marks: { displayOrder: 5, show: true, title: 'Marques agréées' },
    newsLetter: { displayOrder: 10, show: true, title: 'Newsletter' },
    ourMission: { displayOrder: 2, show: true, title: 'Notre Mission' },
    ourServices: { displayOrder: 3, show: true, title: 'Notre Services' },
    partners: { displayOrder: 6, show: true, title: 'Partenaires' },
    products: { displayOrder: 4, show: true, title: 'Produits certifiés' },
    testimonials: { displayOrder: 9, show: false, title: 'Témoingnages' },
    traceability: { displayOrder: 1, show: true, title: 'Traçabilité' }
  };
  admin.firestore().collection(firestoreCollections.webHomeSettings).add(components);
}

export function createRootUser() {
  const newUser = admin.auth().createUser({
    displayName: 'Mr. Root',
    email: 'the root email',
    password: 'the root pwd',
    emailVerified: true,
  });
  const claims = { employeeId: 1880, isRoot: true, isTechAdmin: true };
  // tslint:disable-next-line: no-floating-promises
  return newUser.then(result => {
    // tslint:disable-next-line: no-floating-promises
    admin.auth().setCustomUserClaims(result.uid, claims).then(() => {
      console.log('#### added claims', claims);
    });
    return result;
  });
}
export function updateUserClaims(): void {
  const uid = 'ArGDFEBzfpQ7DFomIWJDq67TlnY2';
  const claims = {
    employeeId: 1880, isRoot: true, isTechAdmin: true, d: 6, a: 5, h: 6, b1: 7, c: 6, m: 6,
    o: 7, v: 6, y: 6, g: 6, x: 6, w: 6, b: 6, f: 6, e: 6, z: 6, a1: 6, k: 6, j: 7, l: 6, q: 6, p: 6, r: 6, s: 6,
    i: 6, n: 7, u: 6, t: 6
  };
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

export async function updatePostsSrcProperty() {
  // Update Posts
  console.log(`Gettting posts from ${firestoreCollections.posts} to update!`);
  await admin.firestore().collection(firestoreCollections.posts).get().then(async data => {
    const posts = data.docs.map(d => ({ uid: d.id, ...d.data() } as Post));
    await updatePosts(posts, firestoreCollections.posts);
  });

  // Update News Posts
  console.log(`Gettting posts from ${firestoreCollections.webNews} to update!`);
  await admin.firestore().collection(firestoreCollections.webNews).get().then(async data => {
    const posts = data.docs.map(d => ({ uid: d.id, ...d.data() } as Post));
    await updatePosts(posts, firestoreCollections.webNews);
  });

  // Update Disabled Posts
  console.log(`Gettting posts from ${firestoreCollections.deletedPosts} to update!`);
  await admin.firestore().collection(firestoreCollections.deletedPosts).get().then(async data => {
    const posts = data.docs.map(d => ({ uid: d.id, ...d.data() } as Post));
    await updatePosts(posts, firestoreCollections.deletedPosts);
  });

  console.log('END...');
  process.exit();
}

async function updatePosts(posts: Post[], collectionName: string) {
  console.log(`Start updating posts from ${collectionName}....`);
  for (const post of posts) {
    const img = post.src as any;
    if (post.src && typeof img === 'string') {
      console.log(`Update post: ${post.title}!`);
      const postToUpdate = {
        id: post.id,
        title: post.title,
        content: post.content,
        timestamp: post.timestamp,
        excerpt: post.excerpt ? post.excerpt : null,
        src: { big: img, medium: img },
        fileName: post.fileName ? post.fileName : null,
        categoryId: post.categoryId,
        editionDate: post.editionDate ? post.editionDate : null,
      } as Post;
      await updatePost(post.uid, postToUpdate, collectionName);
    }
  }
  console.log(`Update posts from ${collectionName} finished successfully!`);
}

function updatePost(uid: string, post: Post, collectionName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    admin.firestore().collection(collectionName).doc(uid).set(post).then(async data => {
      console.log('Success', data);
      resolve();
    }, err => {
      reject(err);
      console.log('Error', err);
    });
  });
}


