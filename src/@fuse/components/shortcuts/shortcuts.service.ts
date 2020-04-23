import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { firestoreCollections } from 'app/data/firestoreCollections';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {
  constructor(private angularFirestore: AngularFirestore) {
  }

  getShortcuts(uid: string): any{
    return this.angularFirestore.collection(firestoreCollections.shortcuts).doc(uid).valueChanges();
  }
  setShortcuts(uid: string, shortcuts: any[]): any{
    const obj = {items: shortcuts};
    return this.angularFirestore.collection(firestoreCollections.shortcuts).doc(uid).set(obj);
  }
}
