import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of, observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize } from 'rxjs/operators';
import { Post } from './models/post';
@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private angularFirestore: AngularFirestore, private angualrFireStorage: AngularFireStorage) { }
  private basePath = '';
  getPosts(): Observable<any> {
    const postsRef = this.angularFirestore.collection('/posts');
    return postsRef.snapshotChanges();
  }
  getPost(title: string): Observable<any> {
    const postsRef = this.angularFirestore.collection('/posts', ref => ref.where('title', '==', title));
    return postsRef.snapshotChanges();
  }
  getCategories(): Observable<any> {
    const catRef = this.angularFirestore.collection('/categories');
    return catRef.snapshotChanges();
  }
  getFiles(): Observable<any> {
    return this.angualrFireStorage.ref('Welcome Scan.jpg').getDownloadURL();
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
  private saveFileData(post: Post) {
    console.log('fileUpload to add', post);
    this.angularFirestore.collection('posts').add({...post});
  }
}
