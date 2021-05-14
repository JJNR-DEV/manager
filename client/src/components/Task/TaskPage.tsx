import { useEffect, useState } from 'react';
import { useLocation, Link,  useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import { withFirebase } from '../../firebase/withFirebase';
import TaskItem from './TaskItem';

import { Task } from '../../interfaces';
import { Firebase } from '../../firebase';


interface Props {
  firebase: Firebase
}

const TaskPage: React.FC<Props> = ({ firebase }) => {
  const [ task, setTask ] = useState<Task | null | object>(null);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    console.log('use effect')
    const params = location.search.split('&');
    let task: string = '';
    let user: string = '';

    params.forEach(param => {
      if(param.includes('id')) {
        task = param.split('=')[1];
      } else if(param.includes('user')) {
        user = param.split('=')[1];
      }
    });

    if(task === '' || user === '') {
      setTask({ })
      return;
    } else {
      firebase.taskManager.doc(user).collection('userTasks').doc(task).get()
        .then((doc) => {
          if(doc.exists) {
            // Unsubscribe to avoid memory leaks
            const unsubscribe = firebase.taskManager.doc(user).collection('userTasks').doc(task)
              .onSnapshot((doc: any) => setTask(doc.data()));
            return () => unsubscribe();
          } else {
            swal({
              title: 'Could not find task',
              text: 'The task you are looking for might have been removed',
              icon: 'error'
            }).then(() => history.push('/'))
          }
        })
        .catch((err: Error) => swal('Could not fetch data', err.message, 'error'))
    }
  }, [ firebase.taskManager, location.search, history ])

  if(location.search === '') {
    return (
      <div>
        <h1>You look lost</h1>
        <Link to='/'>Landing Page</Link>
      </div>
    )
  } else {
    if(task === null) {
      return (
        <div>
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
          </svg>
        </div>
      )
    } else if(Object.keys(task).length === 0) {
      return (
        <div>
          <h1>The link provided is not in the right format</h1>
          <Link to='/'>Landing Page</Link>
        </div>
      )
    }  else {
      return <TaskItem task={ task } />
    }
  }
}

export default withFirebase(TaskPage);
