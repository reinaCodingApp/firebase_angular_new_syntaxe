import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { BehaviorSubject } from 'rxjs';
import { GroupNotification } from './models/groupNotification';

@Injectable({
  providedIn: 'root'
})
export class GroupNotificationsService {

  onGroupsNotifactionsChanged: BehaviorSubject<GroupNotification[]>;

  constructor(private angularFirestore: AngularFirestore) {
    this.onGroupsNotifactionsChanged = new BehaviorSubject([]);
  }

  getGroups(): void {
    this.angularFirestore.collection(firestoreCollections.groupsNotifications).snapshotChanges().subscribe(data => {
      const groups = data.map(g => ({ id: g.payload.doc.id, ...g.payload.doc.data() as {} } as GroupNotification));
      this.onGroupsNotifactionsChanged.next(groups);
    });
  }

  addGroupNotifications(groupNotificationsName: string): Promise<any> {
    const newGroupNotifications = { name: groupNotificationsName, emails: [] } as GroupNotification;
    return this.angularFirestore.collection(firestoreCollections.groupsNotifications).add(newGroupNotifications);
  }

  updateGroupNotifications(groupNotifications: GroupNotification): Promise<any> {
    const updatedGroupNotifications = { name: groupNotifications.name, emails: groupNotifications.emails } as GroupNotification;
    return this.angularFirestore.collection(firestoreCollections.groupsNotifications).doc(groupNotifications.id).set(updatedGroupNotifications);
  }

  deleteGroupNotifications(groupNotifications: GroupNotification): Promise<any> {
    return this.angularFirestore.collection(firestoreCollections.groupsNotifications).doc(groupNotifications.id).delete();
  }
}
