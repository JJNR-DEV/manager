import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

import SubtaskList from '../Subtask/SubtaskList';
import TaskSpecialInput from './TaskSpecialInput';
import withFirebase from '../../firebase/withFirebase';
import tasksCollection from '../../firebase/utils/tasksCollection';
import latestUpdate from '../../firebase/utils/latestUpdate';

import { Task, Subtask } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  task: Task;
  firebase: Firebase;
  user: null | string;
}

const TaskItem: React.FC<Props> = ({ task, firebase, user }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  // Visibility for 'Share Link' container
  const [toggle, setToggle] = useState<boolean>(true);

  useEffect(() => {
    // Get collection of subtasks
    if (user === null) {
      const unsubscribe = tasksCollection(firebase, null)
        .doc(task.id)
        .collection('taskSubtasks')
        .onSnapshot((doc: any) => {
          let allSubtasks: Subtask[] = [];
          doc.docs.forEach(
            (d: any) =>
              (allSubtasks = [...allSubtasks, { ...d.data(), subtaskId: d.id }])
          );
          setSubtasks(allSubtasks);
        });
      return () => unsubscribe();
    } else {
      const unsubscribe = tasksCollection(firebase, user)
        .doc(task.id)
        .collection('taskSubtasks')
        .onSnapshot((doc: any) => {
          let allSubtasks: Subtask[] = [];
          doc.docs.forEach(
            (d: any) =>
              (allSubtasks = [...allSubtasks, { ...d.data(), subtaskId: d.id }])
          );
          setSubtasks(allSubtasks);
        });
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    // Method makes use of userOrigin from task to cover external user case
    tasksCollection(firebase, task.userOrigin)
      .doc(task.id)
      .update({ concluded: checked })
      .catch((err: Error) =>
        console.error(`It failed updating the check: ${err.message}`)
      );

    // Keep record of who made the latest update
    latestUpdate(firebase, task.userOrigin, task.id!);

    checked
      ? swal('Yay', `Task "${task.name}" has been concluded!`, 'success')
      : swal(
          'Success',
          `Task "${task.name}" is now in the To Do list`,
          'success'
        );
  };

  const handleDeleteSubmit = () =>
    swal({
      title: `Are you sure you want to erase "${task.name}"?`,
      text: 'Once deleted, there\'s no turning back!',
      icon: 'warning',
      buttons: ['Cancel', true],
      dangerMode: true,
    })
      .then((del) => {
        if (del) {
          tasksCollection(firebase, task.userOrigin)
            .doc(task.id)
            .delete();
          swal('Success!', 'Task has been erased', 'success');
        } else {
          swal('The task is safe');
        }
      })
      .catch((err: Error) =>
        console.error(`Something is not right: ${err.message}`)
      );

  const shareLink = () => {
    // Edge cases
    if (!navigator.onLine)
      return swal('Cannot copy', 'You seem to be offline', 'error');
    if (navigator.clipboard === undefined)
      return swal(
        'Cannot copy',
        'To be able to copy please go to the https version of the website',
        'error'
      );
    if (typeof window !== 'undefined') {
      const path = `${window.location.protocol}//${window.location.host}/task?id=${task.id}&user=${task.userOrigin}`;
      navigator.clipboard
        .writeText(path)
        .then(() =>
          swal('Copied!', 'You copied the link successfully', 'success')
        )
        .catch(() => swal('Opps', 'Could not copy the link', 'error'));
    } else {
      swal(
        'Could not copy the link',
        'Please make sure your browser is up to date',
        'error'
      );
    }
  };

  const exit = () => {
    if (!toggle) setToggle(true);
  };

  return (
    <div className='task' onMouseLeave={exit}>
      <div className='optionsContainer' hidden={toggle} onClick={shareLink}>
        <span>
          Share Link
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 16 16'
            height='1em'
            width='1em'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z'
              clipRule='evenodd'
            ></path>
            <path
              fillRule='evenodd'
              d='M9.5 1h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z'
              clipRule='evenodd'
            ></path>
          </svg>
        </span>
      </div>

      <div className={`${task.taskType} categoryName`}>
        <span>{task.taskType}</span>
        {task.lastUpdatedBy &&
          task.lastUpdatedBy !== null &&
          task.lastUpdatedBy !== firebase.user && (
            <span className='lastUpdate'>Last update by another user</span>
          )}
        <span className='options' onClick={() => setToggle(!toggle)}></span>
      </div>

      <div className='nameStatus'>
        <h2>{task.name}</h2>
        <label>
          <input
            type='checkbox'
            onChange={updateTask}
            checked={task.concluded}
          />
          <span className={task.concluded ? `${task.taskType}Concluded customCheckbox` : 'toConclude customCheckbox'}></span>
        </label>
      </div>

      {task.price !== null && (
        <span className='taskPrice'>Price: {task.price}kr</span>
      )}

      {task.description !== '' && <h3> {task.description} </h3>}

      {Object.keys(task.specialInput!).length > 0 && (
        <div className={`${task.taskType} taskType`}>
          <TaskSpecialInput inputs={task.specialInput} />
        </div>
      )}

      <SubtaskList
        taskPrice={task.price}
        subtasks={subtasks}
        parentId={task.id!}
        parentName={task.name}
        parentUserOrigin={task.userOrigin}
        parentCategory={task.taskType}
      />

      <div className='btnContainer'>
        <Link
          to={{
            pathname: '/edit-task',
            state: task,
          }}
        >
          <button className='editBtn'>Edit</button>
        </Link>

        <button
          name='task-erasure'
          className='taskErasure'
          onClick={handleDeleteSubmit}
          type='submit'
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default withFirebase(TaskItem);
