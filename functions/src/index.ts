import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
admin.initializeApp();


export const listUsers = functions.https.onCall((data, context) => {
  const result = new Array<UserRecord>();
  // tslint:disable-next-line: no-floating-promises
  return admin.auth().listUsers().then(list => {
    list.users.forEach((userRecord) => {
      result.push(userRecord);
    });
    return result;
  });
});
export const createUser = functions.https.onCall((data, context) => {
  const newUser = admin.auth().createUser({
    displayName: data.displayName,
    email: data.email,
    password: data.password,
    emailVerified: true,

  });
  const claims = data.customClaims ? data.customClaims : { gest: true };
  console.log('### claims before add', claims);
  // tslint:disable-next-line: no-floating-promises
  return newUser.then(result => {
    console.log('### added user', result);
    // tslint:disable-next-line: no-floating-promises
    admin.auth().setCustomUserClaims(result.uid, claims).then(() => {
      console.log('#### added claims', claims);
    });
    return result;
  });
});
export const updateUser = functions.https.onCall((data, context) => {
  const uid = data.uid;
  const properties = {
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL,
    password: data.password
  };
  console.log('### => ' + uid, properties);
  const updatedUser = admin.auth().updateUser(uid, properties);
  const claims = data.customClaims ? data.customClaims : { gest: true };
  // tslint:disable-next-line: no-floating-promises
  admin.auth().setCustomUserClaims(uid, claims).then(() => {
    console.log('### updated claims', claims);
  });
  // tslint:disable-next-line: no-floating-promises
  return updatedUser.then(result => {
    return result;
  });
});
export const updateUserClaims = functions.https.onCall((data, context) => {
  const uid = data.uid;
  const claims = data.customClaims ? data.customClaims : { gest: true };
  // tslint:disable-next-line: no-floating-promises
  return admin.auth().setCustomUserClaims(uid, claims).then(() => {
    console.log('### updated user claims', claims);
  });
});
export const getUser = functions.https.onCall((data, context) => {
  // tslint:disable-next-line: no-floating-promises
  return admin.auth().getUser(data.uid).then(user => {
    return user;
  });
});

export const sendMessage = functions.https.onCall((data, context) => {
  const message = {
    data: {
      title: 'Notificattion title',
      cotent: 'This is a simple notification'
    },
    token: data.token
  };
  return admin.messaging().send(message)
    .then((res) => {
      console.log('Successfully sent message:', res);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

export const subscribeToTopic = functions.https.onCall((data, context) => {
  return admin.messaging().subscribeToTopic(data.registrationTokens, data.topic)
    .then((res) => {
      console.log('Successfully subscribed to topic:', res);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });
});
