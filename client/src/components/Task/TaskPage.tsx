import { useEffect, useState } from 'react';
import { useLocation,  useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import Navigation from '../Navigation';
import { withFirebase } from '../../firebase/withFirebase';
import TaskItem from './TaskItem';

import { Task } from '../../interfaces';
import { Firebase } from '../../firebase';


interface Props {
  firebase: Firebase
}

const TaskPage: React.FC<Props> = ({ firebase }) => {
  const [ task, setTask ] = useState<Task | null>(null);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const params = location.search.split('&');
    let taskId: string | null = null;
    let userId: string | null = null;

    if(params.length !== 2) {
      swal({
        title: 'Wrong link',
        text: 'The link you enter is not on the right format',
        icon: 'error'
      }).then(() => history.push('/'));
      return;
    }

    params.forEach(param => {
      if(param.includes('id')) {
        taskId = param.split('=')[1];
      } else if(param.includes('user')) {
        userId = param.split('=')[1];
      }
    });

    if(taskId !== null && userId !== null) {
      // Unsubscribe to avoid memory leaks
      const unsubscribe = firebase.outsideTask(userId!, taskId!)
        .onSnapshot((doc: any) => {
          doc.exists
            ? setTask({ ...doc.data(), id: taskId })
            : swal({
              title: 'Does not exists',
              text: 'The task you are looking for does not exist',
              icon: 'error'
            }).then(() => history.push('/'));
        });

      return () => unsubscribe();
    } else {
      swal({
        title: 'Wrong link',
        text: 'The link you enter is not on the right format',
        icon: 'error'
      }).then(() => history.push('/'));
    }
  }, [ firebase, history, location ]);

  if(task === null) {
    return (
      <div>
        <svg className="spinner" viewBox="0 0 50 50">
          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </div>
    )
  } else {
    return (
      <div className='taskPage'>
        <Navigation />
        <main className='mainContainer'>
          <TaskItem task={ task } user={ task.userOrigin } />
        </main>
      </div>
    )
  }
}

export default withFirebase(TaskPage);
