import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import io from 'socket.io-client';
import swal from 'sweetalert';

import './styles/globals.scss';
import NewTask from './components/forms/NewTask';
import EditTask from './components/Task/EditTask';
import TaskPage from './components/Task/TaskPage';
import NewSubtask from './components/Subtask/NewSubtask';
import { Firebase } from './firebase';
import { withFirebase } from './firebase/withFirebase';
// Left these as separate links due to latency with state
import ToDo from './components/Task/ToDo';
import Done from './components/Task/Done';

import { Task } from './interfaces';

interface Props {
  firebase: Firebase
};

const App: React.FC<Props> = ({ firebase }) => {
  const [ userTasks, setUserTasks ] = useState<Task[]>([]);
  const [ disableBtn, setDisableBtn ] = useState<boolean>(true);

  console.log('App')
  console.log(userTasks)

  useEffect(() => {
    console.log('App use effect')
    // Still testing
    // Needs to be updated
    // const server = process.env.NODE_ENV === 'production' ?
    //   'http://localhost:8000' : 'http://localhost:8000';
    // io(server);
    const initUser = async () => {
      // Sign in user first
      firebase.signIn()
        .then(() => {
          setDisableBtn(false);

          const unsubscribe = firebase.userTasks.onSnapshot((doc: any) => {
            console.log(doc)
            if(doc.empty) {
              firebase.taskManager.doc(firebase.user).set({});
            } else {
              let allTasks: any[] = [];
              doc.docs.forEach((d: any) => {
                allTasks = [...allTasks, { ...d.data(), id: d.id }]
                setUserTasks(allTasks);
              });
            }
          });

          return () => {
            console.error('Its about to unsubscribe')
            unsubscribe()
          };
        })
        .catch((err: Error) => {
          console.error(err);
          swal('Failed to get data', err.message, 'warning');
        })

      /*
      firebase.taskManager.doc(firebase.user).get()
        .then((doc: any) => {

          if(doc.exists) {
            // Unsubscribe to avoid memory leaks
            const unsubscribe = firebase.userTasks.onSnapshot((doc: any) => {
              let allTasks: any[] = [];
              doc.docs.forEach((d: any) => allTasks = [...allTasks, { ...d.data(), id: d.id }]);
              setUserTasks(allTasks);
            });
            return () => unsubscribe();
          } else {
            // Create document
            firebase.taskManager.doc(firebase.user).set({});
            // Create collection
            const unsubscribe = firebase.userTasks.onSnapshot((doc: any) => {
              let allTasks: any[] = [];
              doc.docs.forEach((d: any) => allTasks = [...allTasks, { ...d.data(), id: d.id }]);
              setUserTasks(allTasks);
            });
            return () => unsubscribe();
          }
        })
        .catch((err: Error) => {
          console.error(err);
          setDisableBtn(true);
          swal('Failed to get data', err.message, 'warning');
        })
      */
    }

    initUser();
  }, [ firebase ]);

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <ToDo allTasks={ userTasks } disable={ disableBtn } />
          </Route>
          <Route exact path='/done'>
            <Done allTasks={ userTasks } disable={ disableBtn } />
          </Route>
          <Route exact path='/new-task'>
            <NewTask />
          </Route>
          <Route exact path='/task'>
            <TaskPage />
          </Route>
          <Route exact path='/new-subtask' render={ (props: any) => <NewSubtask {...props} /> } />
          <Route exact path='/edit-task' render={ (props: any) => <EditTask {...props} /> } />
        </Switch>
      </div>
    </Router>
  );
};

export default withFirebase(App);
