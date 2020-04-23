import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from 'app/common/services/common.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { PublicMessage } from '../models/public-message';
import { News } from '../models/news';
import { NewsDetail } from '../models/news-detail';
import { Attachment } from 'app/common/models/attachment';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { MainTools } from 'app/common/tools/main-tools';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TimelineService {
  onPublicMessagesChanged: BehaviorSubject<PublicMessage[]>;
  onNewsChanged: BehaviorSubject<News[]>;
  onNewsDetailsChanged: BehaviorSubject<NewsDetail>;
  onAttachmentUploaded: BehaviorSubject<{ action: StoredAttachmentAction, attachment: Attachment }>;
  onHabilitationLoaded: BehaviorSubject<Habilitation>;

  constructor(
    private commonService: CommonService,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage) {
    this.onPublicMessagesChanged = new BehaviorSubject(null);
    this.onNewsChanged = new BehaviorSubject(null);
    this.onAttachmentUploaded = new BehaviorSubject(null);
    this.onNewsDetailsChanged = new BehaviorSubject(null);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  getPublicMessages() {
    this.angularFirestore.collection(firestoreCollections.publicMessages, query =>
      query.orderBy('pinned', 'desc').orderBy('isClosed', 'asc').orderBy('date', 'desc')
      .where('archived', '==', false)
      .limit(10))
      .snapshotChanges()
      .subscribe(response => {
        if (response) {
          const publicMessages = response.map(message => ({ uid: message.payload.doc.id, ...message.payload.doc.data() } as PublicMessage));
          publicMessages.forEach(m => {
            this.angularFirestore.collection(firestoreCollections.publicComments, query => query.where('parentId', '==', m.uid))
              .snapshotChanges()
              .subscribe(comments => {
                if (comments && comments.length > 0) {
                  m.comments = comments.map(c => (c.payload.doc.data() as PublicMessage)).sort((a, b) => a.date - b.date);
                }
              });
          });
          this.onPublicMessagesChanged.next(publicMessages);
        }
      });
  }
  storeAttachment(file: File, action: StoredAttachmentAction): Observable<number> {
    const filePath = file.name;
    const size = MainTools.getFileSizeToString(file.size);
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          const attachemnt = { url: downloadURL, fileName: file.name, size: size } as Attachment;
          console.log('');
          this.onAttachmentUploaded.next({ action: action, attachment: { ...attachemnt } });
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }
  addPublicaMessage(publicMessage: PublicMessage): Promise<DocumentReference> {
    return this.angularFirestore.collection(firestoreCollections.publicMessages).add(publicMessage);
  }
  addCommentPublicaMessage(publicMessage: PublicMessage) {
    return this.angularFirestore.collection(firestoreCollections.publicComments).add(publicMessage);
  }
  addNews(title: string, content: string, author: any): Promise<void> {
    const newsToAdd = { title: title, date: new Date().getTime(), author: author } as News;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const newsDocument = this.angularFirestore.collection(firestoreCollections.news).ref.doc();
    writeBatch.set(newsDocument, newsToAdd);
    const newsDetailsDocument = this.angularFirestore.collection(firestoreCollections.newsDetails).doc(newsDocument.id).ref;
    const detailToAdd = { content: content } as NewsDetail;
    writeBatch.set(newsDetailsDocument, detailToAdd);
    return writeBatch.commit();
  }
  updateNewsDetail(detail: NewsDetail, title: string): Promise<void> {
    const newsToUpdate = { title: title } as News;
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const newsDocument = this.angularFirestore.collection(firestoreCollections.newsDetails).doc(detail.uid).ref;
    writeBatch.update(newsDocument, newsToUpdate);
    const newsDetailsDocument = this.angularFirestore.collection(firestoreCollections.newsDetails).doc(detail.uid).ref;
    const detailToAdd = { content: detail.content } as NewsDetail;
    writeBatch.update(newsDetailsDocument, detailToAdd);
    return writeBatch.commit();
  }
  getNewsDetail(uid: string): Promise<NewsDetail> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.newsDetails).doc(uid)
        .get()
        .subscribe(data => {
          if (data.exists) {
            const newsDetail = { uid: data.id, content: data.data().content } as NewsDetail;
            resolve(newsDetail);
          }
        });
    });

  }
  getNews() {
    this.angularFirestore.collection(firestoreCollections.news, query => query.orderBy('date', 'desc'))
      .snapshotChanges()
      .subscribe(data => {
        const news = data.map(i => ({ uid: i.payload.doc.id, ...i.payload.doc.data() } as News));
        this.onNewsChanged.next(news);
      });
  }

  closeDiscussion(messageId: string): Promise<any> {
    const message = { isClosed: true } as PublicMessage;
    const messageDocument = this.angularFirestore.collection(firestoreCollections.publicMessages).doc(messageId).ref;
    return messageDocument.update(message);
  }
  pinDiscussion(messageId: string, pin: boolean): Promise<any> {
    const message = { pinned: pin } as PublicMessage;
    const messageDocument = this.angularFirestore.collection(firestoreCollections.publicMessages).doc(messageId).ref;
    return messageDocument.update(message);
  }
  archiveDiscussion(messageId: string): Promise<any> {
    const message = { isClosed: true, archived: true } as PublicMessage;
    const messageDocument = this.angularFirestore.collection(firestoreCollections.publicMessages).doc(messageId).ref;
    return messageDocument.update(message);
  }


}

export type StoredAttachmentAction = 'message' | 'comment';

