import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { ServiceItem } from './models/serviceItem';
import { MissionItem } from './models/missionItem';
import { Testimonial } from './models/testimonial';

@Injectable()
export class WelcomeService {
  constructor(
    private angularFirestore: AngularFirestore,
  ) { }

  getWebHomeSettings(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webHomeSettings).snapshotChanges();
  }

  updateSettings(settingsId: string, newSettings: any): Promise<any> {
    const updatedSettings =  newSettings  as {};
    const settingsDocument = this.angularFirestore.collection(firestoreCollections.webHomeSettings).doc(settingsId).ref;
    return settingsDocument.update(updatedSettings);
  }

  updateHighlightPostTitle(settingsId: string, highlightPostTitle: string, isClickablePost: boolean, postUrl?): Promise<any> {
    const updatedHghlightPostTitle =
      {
        'highlightPost.highlightPostTitle': highlightPostTitle,
        'highlightPost.isClickablePost': isClickablePost,
        'highlightPost.postUrl': postUrl
      } as {};
    const highlightPostDocument = this.angularFirestore.collection(firestoreCollections.webHomeSettings).doc(settingsId).ref;
    return highlightPostDocument.update(updatedHghlightPostTitle);
  }

  getPosts(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.posts, query => query.orderBy('timestamp', 'desc')).snapshotChanges();
  }

  getOurServices(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webOurServices, query => query.orderBy('displayOrder')).snapshotChanges();
  }

  getOurMission(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webOurMission, query => query.orderBy('displayOrder')).snapshotChanges();
  }

  getTestimonials(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webTestimonials, query => query.orderBy('displayOrder')).snapshotChanges();
  }

  updateOurServices(serviceItem: ServiceItem): Promise<any> {
    const updatedServiceItem =
      {
        title: serviceItem.title,
        description: serviceItem.description,
        icon: serviceItem.icon
      } as ServiceItem;
    const serviceItemDocument = this.angularFirestore.collection(firestoreCollections.webOurServices).doc(serviceItem.uid).ref;
    return serviceItemDocument.update(updatedServiceItem);
  }

  updateOurMission(missionItem: MissionItem): Promise<any> {
    const updatedMissionItem =
      {
        title: missionItem.title,
        description: missionItem.description,
        icon: missionItem.icon
      } as MissionItem;
    const missionItemDocument = this.angularFirestore.collection(firestoreCollections.webOurMission).doc(missionItem.uid).ref;
    return missionItemDocument.update(updatedMissionItem);
  }

  updateTestimonials(testimonial: Testimonial): Promise<any> {
    const updatedTestimonial =
      {
        author: testimonial.author,
        profession: testimonial.profession,
        company: testimonial.company,
        content: testimonial.content
      } as Testimonial;
    const testimonialDocument = this.angularFirestore.collection(firestoreCollections.webTestimonials).doc(testimonial.uid).ref;
    return testimonialDocument.update(updatedTestimonial);
  }

}
