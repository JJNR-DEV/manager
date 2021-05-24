import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import swal from 'sweetalert';

import './styles/globals.scss';
import NewTask from './components/forms/NewTask';
import EditTask from './components/Task/EditTask';
import TaskPage from './components/Task/TaskPage';
import NewSubtask from './components/Subtask/NewSubtask';
// Left these as separate links due to latency with state
import ToDo from './components/Task/ToDo';
import Done from './components/Task/Done';

import { Firebase } from './firebase';
import withFirebase from './firebase/withFirebase';
import tasksCollection from './firebase/utils/tasksCollection';
import auth from './firebase/utils/auth';

import { Task } from './interfaces';

interface Props {
  firebase: Firebase;
}

const App: React.FC<Props> = ({ firebase }) => {
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [disableBtn, setDisableBtn] = useState<boolean>(true);

  useEffect(() => {
    // Sign in user first
    auth(firebase)
      .then(() => {
        setDisableBtn(false);

        const unsubscribe = tasksCollection(firebase, null).onSnapshot(
          (doc: any) => {
            if (doc.empty) {
              firebase.taskManager.doc(firebase.user!).set({});
              setUserTasks([]);
            } else {
              let allTasks: any[] = [];
              doc.docs.forEach((d: any) => {
                allTasks = [...allTasks, { ...d.data(), id: d.id }];
                setUserTasks(allTasks);
              });
            }
          }
        );

        return () => unsubscribe();
      })
      .catch((err: Error) => {
        console.error(err);
        swal('Failed to get data', err.message, 'warning');
      });
  }, [firebase]);

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <ToDo allTasks={userTasks} disable={disableBtn} />
          </Route>
          <Route exact path='/done'>
            <Done allTasks={userTasks} disable={disableBtn} />
          </Route>
          <Route exact path='/new-task'>
            <NewTask />
          </Route>
          <Route exact path='/task'>
            <TaskPage disableBtn={disableBtn} />
          </Route>
          <Route
            exact
            path='/new-subtask'
            render={(props: any) => <NewSubtask {...props} />}
          />
          <Route
            exact
            path='/edit-task'
            render={(props: any) => <EditTask {...props} />}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default withFirebase(App);
