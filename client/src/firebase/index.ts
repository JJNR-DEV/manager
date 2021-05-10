import React, { createContext } from 'react';
import FirebaseApp from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from './config';

class Firebase {
  db;
  taskManager;
  fieldVal;

  user: string | undefined = undefined;
  userTasks: any;

  constructor() {
    if (!FirebaseApp.apps.length) {
      FirebaseApp.initializeApp(firebaseConfig);
      FirebaseApp.firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch(err => console.log(err))
    }

    // instance variables
    this.db = FirebaseApp.firestore();
    this.taskManager = this.db.collection('taskManager');

    // methods
    this.fieldVal = FirebaseApp.firestore.FieldValue;

    // Sign In user
    FirebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.uid;

        console.log('blah')
        console.log(user.uid)
        this.userTasks = this.taskManager.doc(this.user).collection('userTasks');
        // ...
      } else {
        console.log('blah')
        console.log('no user')
        // User is signed out
        // ...
        FirebaseApp.auth().signInAnonymously()
          .then((d) => {
            console.log('Sign In ')
            console.log(d.user!.uid)
            this.user = d.user!.uid;
            this.userTasks = this.taskManager.doc(this.user).collection('userTasks');
          })
          .catch((err) => {
            console.error('Could not sign in')
            console.error(err)
          });
      }
    });
  }
}

const FirebaseContext: React.Context<any> = createContext(null);

export { Firebase, FirebaseContext, FirebaseApp };
