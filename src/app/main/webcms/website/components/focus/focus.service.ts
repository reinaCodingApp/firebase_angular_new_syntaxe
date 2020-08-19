import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Focus } from './models/focus';
import { FocusDetails } from './models/focusDetails';
import * as moment from 'moment';
import { resizeImage } from 'app/common/tools/main-tools';
import { MatSnackBar } from '@angular/material';

const FOCUS_STORAGE_PATH = 'focus';
const FOCUS_IMAGE_SIZE = { width: 1366, height: 905 };
const INTERLOCUTOR_IMAGE_SIZE = { width: 640, height: 768 };

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private matSnackBar: MatSnackBar
  ) { }

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
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    return resizeImage(file, FOCUS_IMAGE_SIZE.width, FOCUS_IMAGE_SIZE.height).then(blobResult => {
      const filePath = `${FOCUS_STORAGE_PATH}/${fileName}`;
      const storageRef = this.angularFireStorage.ref(filePath);
      const uploadTask = storageRef.put(blobResult);
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

  uploadImageForInterlocutor(focus: Focus, file: File) {
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    return resizeImage(file, INTERLOCUTOR_IMAGE_SIZE.width, INTERLOCUTOR_IMAGE_SIZE.height).then(blobResult => {
      const filePath = `${FOCUS_STORAGE_PATH}/${fileName}`;
      const storageRef = this.angularFireStorage.ref(filePath);
      const uploadTask = storageRef.put(blobResult);
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

  uploadImageForIllustration(focus: Focus, file: File, index: number) {
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    const filePath = `${FOCUS_STORAGE_PATH}/${fileName}`;
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, file);
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
