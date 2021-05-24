import tasksCollection from './tasksCollection';

import { Firebase } from '..';

/**
 * @function - Performs an update in Firestore to notify the original user of the altered task if the last update was performed by another user
 * @param firebase - Instance of Firestore
 * @param userId - User origin for selected task
 * @param taskId - Selected task ID
 */

const latestUpdate = (firebase: Firebase, userId: string, taskId: string) => {
  firebase.user === userId
    ? tasksCollection(firebase, userId).doc(taskId!).update({ lastUpdatedBy: null })
    : tasksCollection(firebase, userId).doc(taskId!).update({ lastUpdatedBy: firebase.user });
}

export default latestUpdate;
