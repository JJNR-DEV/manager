import { createContext } from 'react';
import FirebaseApp from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import swal from 'sweetalert';

import { firebaseConfig } from './config';

class Firebase {
  db;
  taskManager;
  fieldVal;

  signIn: Function;

  user: string | undefined = undefined;
  userTasks: any | undefined;

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
    // If there is already an anonymous user signed in, that user will be returned
    this.signIn = async () => await FirebaseApp.auth().signInAnonymously()
      .then((d) => {
        // this.user = d.user!.uid;
        this.user = '1111';
        this.userTasks = this.taskManager.doc(this.user).collection('userTasks');
      })
      .catch((err) => swal('Could not sign in user', err.message, 'error'));
  }
}

// To share this Firebase instance "globaly" in the app
const FirebaseContext: React.Context<any> = createContext(null);

export { Firebase, FirebaseContext, FirebaseApp };
