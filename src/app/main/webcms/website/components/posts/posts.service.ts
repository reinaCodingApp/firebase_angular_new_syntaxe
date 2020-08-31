import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Resolve, Router } from '@angular/router';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AppService } from 'app/app.service';
import { Post } from './models/post';
import { FuseUtils } from '@fuse/utils';
import { resizeImage } from 'app/common/tools/main-tools';
import { MatSnackBar } from '@angular/material/snack-bar';

const POST_STORAGE_PATH = 'posts';
const POST_BIG_IMAGE_SIZE = { width: 1366, height: 905 };
const POST_MEDIUM_IMAGE_SIZE = { width: 640, height: 424 };

@Injectable({
  providedIn: 'root'
})
export class PostsService implements Resolve<any>
{
  onPostsChanged: BehaviorSubject<any>;
  onFilterChanged: Subject<any>;
  onPostChanged: BehaviorSubject<Post>;
  filterBy: string;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.posts;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private appService: AppService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.onFilterChanged = new Subject();
    this.onPostsChanged = new BehaviorSubject([]);
    this.onPostChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }
  private basePath = '';

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                Promise.all([
                  this.getCategories(),
                  this.loadPosts()
                ]).then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  this.onFilterChanged.subscribe(filter => {
                    this.filterBy = filter;
                    this.loadPosts(filter);
                  });
                  resolve();
                }, (err) => {
                  reject(err);
                });
              }
            }, (err) => {
              reject(err);
            });
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  loadPosts(categoryId: string = null) {
    let observable = this.angularFirestore.collection('/posts');
    if (categoryId == null) {
    } else {
      observable = this.angularFirestore.collection('/posts', query => query.where('categoryId', '==', categoryId));
    }
    observable.snapshotChanges().
      pipe(map(data => {
        return data.map(item => {
          const o = item.payload.doc.data() as Post;
          o.uid = item.payload.doc.id;
          return o;
        });

      })).
      subscribe(posts => {
        console.log('filtered', posts);
        this.onPostsChanged.next(posts);
      });
  }

  editPost(post: Post, isNews: boolean = false) {
    const post_to_edit = {
      id: this.getPostId(post.title),
      title: post.title,
      content: post.content,
      timestamp: post.timestamp,
      excerpt: this.getExcerpt(post.content),
      src: { big: post.src.big, medium: post.src.medium },
      fileName: post.fileName ? post.fileName : null,
      categoryId: !isNews ? post.categoryId : null,
      editionDate: new Date().getTime()
    } as Post;
    console.log('post_to_edit', post_to_edit);
    const collection = isNews ? firestoreCollections.webNews : firestoreCollections.posts;
    return this.angularFirestore.collection(collection).doc(post.uid).set(post_to_edit);
  }

  getPost(uid: string, isNews: boolean): Observable<any> {
    const collection = isNews ? firestoreCollections.webNews : firestoreCollections.posts;
    return this.angularFirestore.collection(collection).doc(uid).get();
  }

  getCategories(): Observable<any> {
    const catRef = this.angularFirestore.collection('/categories');
    return catRef.valueChanges();
  }

  addPost(post: Post, file: File, isNews: boolean): Observable<number> {
    post.id = this.getPostId(post.title);
    post.categoryId = isNews ? null : post.categoryId;
    post.src = { big: post.src.big, medium: post.src.medium };
    this.saveFileData(post, isNews);
    return of(100);
  }

  insertPost(post: Post, file: File): Observable<number> {
    post.id = this.getPostId(post.title);
    if (file != null) {
      const filePath = `${this.basePath}/${file.name}`;
      const storageRef = this.angularFireStorage.ref(filePath);
      const uploadTask = this.angularFireStorage.upload(filePath, file);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            console.log('File available at', downloadURL);
            post.src = downloadURL;
            post.fileName = file.name;
            post.excerpt = post.categoryId !== 'faq' ? this.getExcerpt(post.content) : '';
            post.id = this.getPostId(post.title);
            this.saveFileData(post);
          });
        })
      ).subscribe();
      return uploadTask.percentageChanges();
    } else {
      this.saveFileData(post);
      return of(100);
    }
  }

  disablePost(post, isNews: boolean = false): Promise<any> {
    const postToAdd = {
      id: this.getPostId(post.title),
      title: post.title,
      content: post.content,
      timestamp: post.timestamp,
      excerpt: this.getExcerpt(post.content),
      src: { big: post.src.big, medium: post.src.medium },
      fileName: post.fileName ? post.fileName : null,
      categoryId: !isNews ? post.categoryId : null,
      editionDate: new Date().getTime()
    } as Post;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const collection = isNews ? firestoreCollections.webNews : firestoreCollections.posts;
    const doc = this.angularFirestore.collection(collection).doc(post.uid);
    writeBatch.delete(doc.ref);
    const deletedPostDoc = this.angularFirestore.collection(firestoreCollections.deletedPosts).ref.doc(post.uid);
    writeBatch.set(deletedPostDoc, postToAdd);
    return writeBatch.commit();
  }

  uploadFile(post: Post, file: File, type: string) {
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    const width = type === 'big' ? POST_BIG_IMAGE_SIZE.width : POST_MEDIUM_IMAGE_SIZE.width;
    const height = type === 'big' ? POST_BIG_IMAGE_SIZE.height : POST_MEDIUM_IMAGE_SIZE.height;
    return resizeImage(file, width, height).then(blobResult => {
      const filePath = `${POST_STORAGE_PATH}/${fileName}`;
      const storageRef = this.angularFireStorage.ref(filePath);
      const uploadTask = storageRef.put(blobResult);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            console.log('File available at', downloadURL);
            post.src.big = type === 'big' ? downloadURL : post.src.big;
            post.src.medium = type === 'medium' ? downloadURL : post.src.medium;
            post.fileName = file.name;
          });
        })
      ).subscribe();
    }).catch(error => {
      const msg = error.message ? error.message : `La ressource n'a pas pu être traitée, veuillez joindre un fichier PNG ou JPEG`;
      this.matSnackBar.open(msg, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 30000,
        panelClass: 'warn'
      });
      console.log('###### errormessage', error);
    });
  }

  private saveFileData(post: Post, isNews: boolean = false): Promise<any> {
    console.log('fileUpload to add', post);
    const collection = isNews ? firestoreCollections.webNews : firestoreCollections.posts;
    return this.angularFirestore.collection(collection).add({ ...post });
  }
  private getPostId(title: string) {
    const id = FuseUtils.handleize(title);
    return id;
  }
  private getExcerpt(outerHTML: any) {
    let excerpt = null;
    if (outerHTML == null) {
      return excerpt;
    }
    const stripedHtml: string = outerHTML.replace(/<[^>]+>/g, '');
    if (stripedHtml.length >= 500) {
      excerpt = stripedHtml.slice(0, 255);

    } else {
      excerpt = stripedHtml.slice(0, stripedHtml.length / 2);
    }

    const lastIndexOf = excerpt.lastIndexOf(' ');
    excerpt = excerpt.slice(0, lastIndexOf);
    excerpt += '...';
    return excerpt;
  }

}
