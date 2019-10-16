import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize } from 'rxjs/operators';
import { Post } from './models/post';
@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private angularFirestore: AngularFirestore, private angualrFireStorage: AngularFireStorage) { }
  private basePath = '';
  add() {
    this.angularFirestore.collection('categories').add({name: 'FAQ'});
  }
  get(): Observable<any> {
    return this.angularFirestore.collection('/posts').snapshotChanges();
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
