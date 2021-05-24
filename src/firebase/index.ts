import { createContext } from 'react';
import FirebaseApp from 'firebase/app';

import 'firebase/firestore';

import { firebaseConfig } from '../firebaseConfig';

class Firebase {
  db;
  taskManager;
  user: string | null = null;

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
  }
}

// To share this Firebase instance "globaly" in the app
const FirebaseContext: React.Context<any> = createContext(null);

export { Firebase, FirebaseContext, FirebaseApp };
