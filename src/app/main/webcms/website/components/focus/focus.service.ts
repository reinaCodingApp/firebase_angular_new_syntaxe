import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Focus } from './models/focus';
import { FocusDetails } from './models/focusDetails';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  private basePath = 'focus';

  constructor(
    private angularFirestore: AngularFirestore,
    private angualrFireStorage: AngularFireStorage
  ) {
  }

  getFocuses(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webFocus).snapshotChanges();
  }

  addFocus(focus: Focus) {
    const newFocus =
      {
        title: focus.title,
        subTitle: focus.subTitle,
        excerpt: focus.excerpt,
        images: focus.images,
        date: moment(focus.date).valueOf(),
        displayOrder: focus.displayOrder,
        published: focus.published
      } as Focus;

    const newFocusDetails =
      {
        descriptionsBlock: JSON.parse(JSON.stringify(focus.focusDetails.descriptionsBlock)),
        location: JSON.parse(JSON.stringify(focus.focusDetails.location)),
        address: focus.focusDetails.address,
        city: focus.focusDetails.city,
        zipCode: focus.focusDetails.zipCode,
        country: focus.focusDetails.country,
        phone: focus.focusDetails.phone,
        email: focus.focusDetails.email,
        webSite: focus.focusDetails.webSite,
        twitter: focus.focusDetails.twitter,
        facebook: focus.focusDetails.facebook,
        instagram: focus.focusDetails.instagram,
        interlocutor: JSON.parse(JSON.stringify(focus.focusDetails.interlocutor)),
        illustrations: JSON.parse(JSON.stringify(focus.focusDetails.illustrations)),
        videos: focus.focusDetails.videos,
      } as FocusDetails;

    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const focusDocument = this.angularFirestore.collection(firestoreCollections.webFocus).ref.doc();
    writeBatch.set(focusDocument, newFocus);
    const focusDetailsDocument = this.angularFirestore.collection(firestoreCollections.webFocusDetails).doc(focusDocument.id).ref;
    writeBatch.set(focusDetailsDocument, newFocusDetails);
    return writeBatch.commit();
  }

  updateFocus(focus: Focus) {
    const updatedFocus =
      {
        title: focus.title,
        subTitle: focus.subTitle,
        excerpt: focus.excerpt,
        images: focus.images,
        date: moment(focus.date).valueOf(),
        displayOrder: focus.displayOrder,
        published: focus.published
      } as Focus;

    const updatedFocusDetails =
      {
        descriptionsBlock: JSON.parse(JSON.stringify(focus.focusDetails.descriptionsBlock)),
        location: JSON.parse(JSON.stringify(focus.focusDetails.location)),
        address: focus.focusDetails.address,
        city: focus.focusDetails.city,
        zipCode: focus.focusDetails.zipCode,
        country: focus.focusDetails.country,
        phone: focus.focusDetails.phone,
        email: focus.focusDetails.email,
        webSite: focus.focusDetails.webSite,
        twitter: focus.focusDetails.twitter,
        facebook: focus.focusDetails.facebook,
        instagram: focus.focusDetails.instagram,
        interlocutor: JSON.parse(JSON.stringify(focus.focusDetails.interlocutor)),
        illustrations: JSON.parse(JSON.stringify(focus.focusDetails.illustrations)),
        videos: focus.focusDetails.videos,
      } as FocusDetails;

    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const focusDocument = this.angularFirestore.collection(firestoreCollections.webFocus).doc(focus.uid).ref;
    writeBatch.update(focusDocument, updatedFocus);
    const focusDetailsDocument = this.angularFirestore.collection(firestoreCollections.webFocusDetails).doc(focus.uid).ref;
    writeBatch.update(focusDetailsDocument, updatedFocusDetails);
    return writeBatch.commit();
  }

  getFocus(uid: string): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webFocus).doc(uid).get();
  }

  getFocusDetails(uid: string): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webFocusDetails).doc(uid).get();
  }

  uploadImageForFocus(focus: Focus, file: File) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          focus.images.push(downloadURL);
          if (focus.uid) {
            this.updateFocus(focus);
          }
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  uploadImageForInterlocutor(focus: Focus, file: File) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          focus.focusDetails.interlocutor.image = downloadURL;
          if (focus.uid) {
            this.updateFocus(focus);
          }
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  uploadImageForIllustration(focus: Focus, file: File, index: number) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          focus.focusDetails.illustrations[index].image = downloadURL;
          if (focus.uid) {
            this.updateFocus(focus);
          }
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

}
