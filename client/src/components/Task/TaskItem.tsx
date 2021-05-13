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
};

const TaskItem: React.FC<Props> = (props) => {
  const [ subtasks, setSubtasks ] = useState<Subtask[]>([]);

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
    const unsubscribe = props.firebase.userTasks.doc(props.task.id).collection('taskSubtasks').onSnapshot((doc: any) => {
      let allSubtasks: Subtask[] = [];
      doc.docs.forEach((d: any) => allSubtasks = [...allSubtasks, { ...d.data(), subtaskId: d.id }]);
      setSubtasks(allSubtasks);
    });
    return () => unsubscribe();
  }, [ props.firebase.userTasks, props.task.id, props.task.taskId ]);


  const updateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    props.firebase.userTasks.doc(props.task.id).update({
      concluded: checked
    }).catch((err: Error) => console.error(`It failed updating the check: ${ err }`));

    checked
      ? swal('Yay', `You have done your "${ props.task.name }" task!`, 'success')
      : swal('Success', `Your task "${ props.task.name }" is now on your To Do list`, 'success')
  };

  const handleDeleteSubmit = () => swal({
      title: `Are you sure you want to erase "${ props.task.name }"?`,
      text: 'Once deleted, there\'s no turning back!',
      icon: 'warning',
      buttons: ['Cancel', true],
      dangerMode: true,
    }).then((del) => {
        if(del) {
          props.firebase.userTasks.doc(props.task.id).delete();
          swal('Success!', 'Your task has been erased', 'success');
        } else {
          swal('Your task is safe');
        }
      })
      .catch((err: Error) => console.error(`Something is not right: ${ err }`));

  const style = {
    backgroundColor: props.task.concluded ? color : '#fff',
    borderColor: props.task.concluded ? '#fff' : '#000'
  };

  return (
    <div className='task'>
      <div className='categoryName' style={{ color }}>
        <span>{ props.task.taskType }</span>
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

      {
        props.task.price !== null && <span className='taskPrice'>Price: { props.task.price }kr</span>
      }

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
        parentTaskId={ props.task.taskId }
        parentId={ props.task.id }
        parentName={ props.task.name }
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
