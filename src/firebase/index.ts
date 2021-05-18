import { createContext } from 'react';
import FirebaseApp from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import swal from 'sweetalert';

import { firebaseConfig } from './config';

class Firebase {
  db;
  taskManager;

  signIn: Function;
  user: string | undefined = undefined;

  constructor() {
    // Only one instance
    if (!FirebaseApp.apps.length) {
      FirebaseApp.initializeApp(firebaseConfig);
      // Caching for offline use
      FirebaseApp.firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch(err => console.error(err))
    }

    // instance variables
    this.db = FirebaseApp.firestore();
    this.taskManager = this.db.collection('taskManager');

    // Sign In user
    // If there is already an anonymous user signed in, that user will be returned
    this.signIn = () => FirebaseApp.auth().signInAnonymously()
      .then((d) => {
        // this.user = '1112'; // Test user
        this.user = d.user!.uid;
      })
      .catch((err) => swal('Could not sign in user', err.message, 'error'));
  }

  // Collection 'userTasks' in method for sign in user or for access from external user
  userTasks(user: string | null) {
    return user === null
      ? this.taskManager.doc(this.user).collection('userTasks')
      : this.taskManager.doc(user).collection('userTasks');
  }

  // External user on Task Page
  outsideTask(userId: string, taskId: string) {
    return this.userTasks(userId).doc(taskId!);
  }

  // Pick up who made the latest update
  latestUpdate(userId: string, taskId: string) {
    this.user === userId
      ? this.userTasks(userId).doc(taskId!).update({ lastUpdatedBy: null })
      : this.userTasks(userId).doc(taskId!).update({ lastUpdatedBy: this.user });
  }
}

// To share this Firebase instance "globaly" in the app
const FirebaseContext: React.Context<any> = createContext(null);

export { Firebase, FirebaseContext, FirebaseApp };
