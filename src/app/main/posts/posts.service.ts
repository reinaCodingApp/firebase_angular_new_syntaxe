import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { Post } from 'app/models/post';
import { finalize, map } from 'rxjs/operators';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Contact } from './contact.model';
import { FuseUtils } from '@fuse/utils';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onPostsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPostChanged: BehaviorSubject<Post>;

    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(
        private _httpClient: HttpClient,
        private angularFirestore: AngularFirestore,
        private angualrFireStorage: AngularFireStorage
    )
    {
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onPostsChanged = new BehaviorSubject([]);
        this.onPostChanged = new BehaviorSubject(null);
    }

    private basePath = '';
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getCategories(),
                this.loadPosts()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        // this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.loadPosts(filter);
                    });

                    resolve();

                },
                reject
            );
        });
    }


    loadPosts(categoryId: string = null) {
        console.log('cat filter', categoryId);
        let observable = this.angularFirestore.collection('/posts');
        if (categoryId == null) {
        } else {
          observable = this.angularFirestore.collection('/posts',  query => query.where('categoryId', '==', categoryId));
        }
        observable.snapshotChanges().
        pipe(map(data =>  { return data.map( item =>  {
          const o = item.payload.doc.data() as Post;
          o.uid = item.payload.doc.id;
          return o;
          });

        } )).
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
       excerpt: this.getExcerpt(post.content),
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
  insertPost(post: Post, file: File ): Observable<number> {
    if (file != null) {
      const filePath = `${this.basePath}/${file.name}`;
      const storageRef = this.angualrFireStorage.ref(filePath);
      const uploadTask = this.angualrFireStorage.upload(filePath, file);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            console.log('File available at', downloadURL);
            post.src  = downloadURL;
            post.fileName = file.name;
            post.excerpt = this.getExcerpt(post.content);
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
  uploadFile(post: Post, file: File) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          post.src  = downloadURL;
          post.fileName = file.name;
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  private saveFileData(post: Post) {
    console.log('fileUpload to add', post);
    this.angularFirestore.collection('posts').add({...post});
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
