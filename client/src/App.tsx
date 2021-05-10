import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';
import swal from 'sweetalert';

import './styles/globals.scss';
import ToDo from './components/Task/ToDo';
import Done from './components/Task/Done';
import NewTask from './components/forms/NewTask';
import EditTask from './components/Task/EditTask';
import NewSubtask from './components/Subtask/NewSubtask';
import { Firebase } from './firebase';
import { withFirebase } from './firebase/withFirebase';

import { Task } from './interfaces';

interface Props {
  firebase: Firebase
};

const App: React.FC<Props> = ({ firebase }) => {
  const [ userTasks, setUserTasks ] = useState<Task[]>([]);
  const [ disableBtn, setDisableBtn ] = useState<boolean>(false);

  useEffect(() => {
    // Needs to be updated
    const server = process.env.NODE_ENV === 'production' ?
      'http://localhost:8000' : 'http://localhost:8000';

    io(server);

    // const user = `1111`; // Reference user cookie perhaps

    firebase.taskManager.doc(firebase.user).get()
      .then((doc: any) => {
        setDisableBtn(false);

        console.log(doc);
        console.log(firebase.user);

        if(doc.exists) {
          const unsubscribe = firebase.userTasks.onSnapshot((doc: any) => {
            let allTasks: any[] = [];
            doc.docs.forEach((d: any) => allTasks = [...allTasks, { ...d.data(), id: d.id }]);
            setUserTasks(allTasks);
          });

          return () => unsubscribe();
        } else {
          // Create document and collection for user
          firebase.taskManager.doc(firebase.user).set({});
          const unsubscribe = firebase.userTasks.onSnapshot((doc: any) => {
            let allTasks: any[] = [];
            doc.docs.forEach((d: any) => allTasks = [...allTasks, { ...d.data(), id: d.id }]);
            setUserTasks(allTasks);
          });

          return () => unsubscribe();
        }
      })
      .catch((err: Error) => {
        setDisableBtn(true);
        swal('Failed to get data', err.message, 'warning');
      })
  }, [firebase]);

  return (
    <Router>
      <div className="App">
        <Switch>

          <Route exact path="/">
            <ToDo allTasks={ userTasks } disable={ disableBtn } />
          </Route>

          <Route exact path="/done">
            <Done allTasks={ userTasks } disable={ disableBtn } />
          </Route>

          <Route exact path="/new-task">
            <NewTask />
          </Route>

          <Route exact path="/new-subtask" render={ (props: any) => <NewSubtask {...props} /> } />

          <Route exact path="/edit-task" render={ (props: any) => <EditTask {...props} /> } />

        </Switch>
      </div>
    </Router>
  );
}

export default withFirebase(App);
