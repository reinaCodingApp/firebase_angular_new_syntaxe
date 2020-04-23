import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { Post } from 'app/main/webcms/posts/models/post';
import { finalize, map } from 'rxjs/operators';
import { Resolve, Router } from '@angular/router';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AppService } from 'app/app.service';

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
    private angualrFireStorage: AngularFireStorage,
    private appService: AppService,
    private router: Router
  ) {
    this.onFilterChanged = new Subject();
    this.onPostsChanged = new BehaviorSubject([]);
    this.onPostChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }
  private basePath = '';

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
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

  editPost(post: Post) {
    const post_to_edit = {
      id: this.getPostId(post.title),
      title: post.title,
      content: post.content,
      timestamp: post.timestamp,
      excerpt: post.categoryId !== 'faq' ? this.getExcerpt(post.content) : '',
      src: post.src ? post.src : null,
      fileName: post.fileName ? post.fileName : null,
      categoryId: post.categoryId,
      editionDate: new Date().getTime()
    } as Post;
    console.log('post_to_edit', post_to_edit);
    return this.angularFirestore.collection('posts').doc(post.uid).set(post_to_edit);
  }

  getPost(title: string): Observable<any> {
    const postsRef = this.angularFirestore.collection('/posts', ref => ref.where('title', '==', title));
    return postsRef.snapshotChanges();
  }

  getCategories(): Observable<any> {
    const catRef = this.angularFirestore.collection('/categories');
    return catRef.valueChanges();
  }

  insertPost(post: Post, file: File): Observable<number> {
    post.id = this.getPostId(post.title);
    if (file != null) {
      const filePath = `${this.basePath}/${file.name}`;
      const storageRef = this.angualrFireStorage.ref(filePath);
      const uploadTask = this.angualrFireStorage.upload(filePath, file);
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

  disablePost(post): any {
    const postToAdd = {
      id: this.getPostId(post.title),
      title: post.title,
      content: post.content,
      timestamp: post.timestamp,
      excerpt: post.categoryId !== 'faq' ? this.getExcerpt(post.content) : '',
      src: post.src ? post.src : null,
      fileName: post.fileName ? post.fileName : null,
      categoryId: post.categoryId,
      editionDate: new Date().getTime()
    } as Post;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const doc = this.angularFirestore.collection(firestoreCollections.posts).doc(post.uid);
    writeBatch.delete(doc.ref);
    const deletedPostDoc = this.angularFirestore.collection(firestoreCollections.deletedPosts).ref.doc(post.uid);
    writeBatch.set(deletedPostDoc, postToAdd);
    writeBatch.commit();
  }

  uploadFile(post: Post, file: File) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          post.src = downloadURL;
          post.fileName = file.name;
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  private saveFileData(post: Post) {
    console.log('fileUpload to add', post);
    this.angularFirestore.collection('posts').add({ ...post });
  }
  private getPostId(title: string) {
    const id = title.trim().toLowerCase().replace('?', '').
      replace(/'/g, '').replace(/"/g, '').replace(/!/g, '').replace(/:/g, '').trim().replace(/ /g, '-')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log('id ', id);
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
