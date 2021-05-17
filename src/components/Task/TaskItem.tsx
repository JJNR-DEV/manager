import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

import SubtaskList from '../Subtask/SubtaskList';
import TaskSpecialInput from './TaskSpecialInput';
import { withFirebase } from '../../firebase/withFirebase';

import { Task, Subtask } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  task: Task
  firebase: Firebase
  user: null | string
};

const TaskItem: React.FC<Props> = (props) => {
  const [ subtasks, setSubtasks ] = useState<Subtask[]>([]);
  // Visibility for "Share Link" container
  const [ toggle, setToggle ] = useState<boolean>(true);

  let color: string;
  switch(props.task.taskType){
    case 'Food':
      color = '#f99457';
      break;
    case 'Work':
      color = '#a05ce8';
      break;
    default:
      color = '#3AA652';
  };

  useEffect(() => {
    // Get collection of subtasks
    if(props.user === null) {
      const unsubscribe = props.firebase.userTasks(null).doc(props.task.id).collection('taskSubtasks').onSnapshot((doc: any) => {
        let allSubtasks: Subtask[] = [];
        doc.docs.forEach((d: any) => allSubtasks = [...allSubtasks, { ...d.data(), subtaskId: d.id }]);
        setSubtasks(allSubtasks);
      });
      return () => unsubscribe();
    } else {
      const unsubscribe = props.firebase.userTasks(props.user).doc(props.task.id).collection('taskSubtasks').onSnapshot((doc: any) => {
        let allSubtasks: Subtask[] = [];
        doc.docs.forEach((d: any) => allSubtasks = [...allSubtasks, { ...d.data(), subtaskId: d.id }]);
        setSubtasks(allSubtasks);
      });
      return () => unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    // Method makes use of userOrigin from task to cover external user case
    props.firebase.userTasks(props.task.userOrigin).doc(props.task.id).update({ concluded: checked })
      .catch((err: Error) => console.error(`It failed updating the check: ${ err }`));

    checked
      ? swal('Yay', `Task "${ props.task.name }" has been concluded!`, 'success')
      : swal('Success', `Task "${ props.task.name }" is now in the To Do list`, 'success')
  };

  const handleDeleteSubmit = () => swal({
      title: `Are you sure you want to erase "${ props.task.name }"?`,
      text: 'Once deleted, there\'s no turning back!',
      icon: 'warning',
      buttons: ['Cancel', true],
      dangerMode: true,
    }).then((del) => {
        if(del) {
          props.firebase.userTasks(props.task.userOrigin).doc(props.task.id).delete();
          swal('Success!', 'Task has been erased', 'success');
        } else {
          swal('The task is safe');
        }
      })
      .catch((err: Error) => console.error(`Something is not right: ${ err }`));

  const style = {
    backgroundColor: props.task.concluded ? color : '#fff',
    borderColor: props.task.concluded ? '#fff' : '#000'
  };

  const shareLink = () => {
    // Edge cases
    if(!navigator.onLine) return swal('Cannot copy', 'You seem to be offline', 'error');
    if(navigator.clipboard === undefined) return swal('Cannot copy', 'To be able to copy please go to the https version of the website', 'error');
    if (typeof window !== 'undefined') {
      const path = `${ window.location.protocol }//${ window.location.host }/task?id=${ props.task.id }&user=${ props.firebase.user }`;
      navigator.clipboard.writeText(path)
        .then(() => swal('Copied!', 'You copied the link successfully', 'success'))
        .catch(() => swal('Opps', 'Could not copy the link', 'error'))
    } else {
      swal('Could not copy the link', 'Please make sure your browser is up to date', 'error');
    }
  };

  const exit = () => {
    if(!toggle) setToggle(true);
  };

  return (
    <div className='task' onMouseLeave={ exit }>
      <div
        className='optionsContainer'
        hidden={ toggle }
        onClick={ shareLink }>
        <span>
          Share Link
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clipRule="evenodd"></path>
            <path fillRule="evenodd" d="M9.5 1h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z" clipRule="evenodd"></path>
          </svg>
        </span>
      </div>

      <div className='categoryName' style={{ color }}>
        <span>{ props.task.taskType }</span>
        <span className='options' onClick={ () => setToggle(!toggle) }></span>
      </div>

      <div className='nameStatus'>
        <h2>{ props.task.name }</h2>
        <label>
          <input
            type="checkbox"
            onChange={ updateTask }
            // onClick={blockPropagation}
            checked={ props.task.concluded }
            />
          <span className='customCheckbox' style={ style }></span>

        </label>
      </div>

      { props.task.price !== null && <span className='taskPrice'>Price: { props.task.price }kr</span> }

      {
        props.task.description !== '' &&
          <h3> { props.task.description } </h3>
      }

      {
        Object.keys(props.task.specialInput!).length > 0 && (
          <div className='taskType' style={{ color }}>
            <TaskSpecialInput inputs={ props.task.specialInput } />
          </div>
        )
      }

      <SubtaskList
        taskPrice={ props.task.price }
        subtasks={ subtasks }
        parentId={ props.task.id! }
        parentName={ props.task.name }
        parentUserOrigin={ props.task.userOrigin }
        color={ color } />

      <div className='btnContainer'>
        <Link to={{
          pathname: '/edit-task',
          state: props.task
        }}>
          <button className='editBtn'>
            Edit
          </button>
        </Link>

        <button
          name="task-erasure"
          className='taskErasure'
          onClick={ handleDeleteSubmit }
          type="submit">
            Delete
        </button>
      </div>
    </div>
  );
};

export default withFirebase(TaskItem);
