import { Firebase } from '..';

/**
 *
 * @param firebase - Access to Firestore instance
 * @param userOrigin - When receive null it will return the current SignIn user tasks
 * @param userOrigin - Providing a string will happen when a external user is accessing someone's Task
 * @returns - The collection from the user that get's determine by userOrigin param
 */

const taskCollection = (firebase: Firebase, userOrigin: string | null) => {
  return userOrigin === null
    ? firebase.db
        .collection('taskManager')
        .doc(firebase.user!)
        .collection('userTasks')
    : firebase.db
        .collection('taskManager')
        .doc(userOrigin)
        .collection('userTasks');
};

export default taskCollection;
