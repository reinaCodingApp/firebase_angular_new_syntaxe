import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firebaseCloudMessagingKey } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FcmMessagingService {

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private angularFireFunctions: AngularFireFunctions,
    private httpClient: HttpClient) {
    // todo : manage messaging with fcm
    // this.angularFireMessaging.messaging.subscribe(
    //   (messaging) => {
    //     messaging.onMessage = messaging.onMessage.bind(messaging);
    //     messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    //   }
    // );
  }

  requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.subscribeToTopic(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
      });
  }

  sendMessage(token: string): void {
      // todo :
    // const sendMessageFn = this.angularFireFunctions.functions.httpsCallable('sendMessage');
    // sendMessageFn({ token: token }).then(response => {
    //   console.log('message sent');
    // });
  }

  subscribeToTopic(token: string): void {
      // todo :
    // const sendNotificationFn = this.angularFireFunctions.functions.httpsCallable('subscribeToTopic');
    // sendNotificationFn({ registrationTokens: [token], topic: 'allDevices' }).then(response => {
    //   console.log('subscribe done');
    // });
  }

  sendNotification(notification: any): Observable<any> {
    const FCM_SEND_NOTIFICATION_URI = 'https://fcm.googleapis.com/fcm/send';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `key=${firebaseCloudMessagingKey}`
      })
    };
    return this.httpClient.post(FCM_SEND_NOTIFICATION_URI, notification, httpOptions);
  }

}
