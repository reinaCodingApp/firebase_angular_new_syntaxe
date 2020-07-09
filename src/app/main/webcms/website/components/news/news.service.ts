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
import { Post } from '../posts/models/post';
import { FuseUtils } from '@fuse/utils';

@Injectable({
  providedIn: 'root'
})
export class NewsService
{
  private basePath = '';

  constructor(
    private angularFirestore: AngularFirestore,
    private angualrFireStorage: AngularFireStorage
  ) {  }

  getNews(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webNews, query => query.orderBy('timestamp')).snapshotChanges();
  }

  editNews(post: Post): Promise<any> {
    const updatePost = {
      id: this.getPostId(post.title),
      title: post.title,
      content: post.content,
      timestamp: post.timestamp,
      src: post.src ? post.src : null,
      fileName: post.fileName ? post.fileName : null,
      editionDate: new Date().getTime()
    } as Post;
    const faqDocument = this.angularFirestore.collection(firestoreCollections.webFaq).doc(post.uid).ref;
    return faqDocument.update(updatePost);
  }

  addNews(post: Post, file: File): Observable<number> {
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
    const doc = this.angularFirestore.collection(firestoreCollections.webNews).doc(post.uid);
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
    this.angularFirestore.collection(firestoreCollections.webNews).add({ ...post });
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
