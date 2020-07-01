import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { FaqPost } from './models/faqPost';

@Injectable()
export class FaqService {
  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  getFaqsPosts(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webFaq, query => query.orderBy('displayOrder')).snapshotChanges();
  }

  addFaq(faq: FaqPost): Promise<any> {
    const newFaq =
      {
        title: faq.title,
        content: faq.content,
        displayOrder: faq.displayOrder
      } as FaqPost;
    return this.angularFirestore.collection(firestoreCollections.webFaq).add(newFaq);
  }

  updateFaq(faq: FaqPost): Promise<any> {
    const updatedFaq =
      {
        title: faq.title,
        content: faq.content,
      } as FaqPost;
    const faqDocument = this.angularFirestore.collection(firestoreCollections.webFaq).doc(faq.uid).ref;
    return faqDocument.update(updatedFaq);
  }

  deleteFaq(faq: FaqPost): Promise<any> {
    const faqDocument = this.angularFirestore.collection(firestoreCollections.webFaq).doc(faq.uid).ref;
    return faqDocument.delete();
  }
}
