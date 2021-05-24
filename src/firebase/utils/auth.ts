import FirebaseApp from 'firebase/app';
import 'firebase/auth';
import swal from 'sweetalert';

import { Firebase } from '..';

const auth = (firebase: Firebase) => FirebaseApp.auth().signInAnonymously()
  .then(({ user }) => {
    // firebase.user = '1112'; // Test user
    firebase.user = user!.uid;
  })
  .catch((err) => swal('Could not sign in user', err.message, 'error'));

export default auth;
