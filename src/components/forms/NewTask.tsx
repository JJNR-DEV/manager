import { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

import { handleChange } from './formHandlers/handleChange';
import { handleSubmit } from './formHandlers/handleSubmit';
import withFirebase from '../../firebase/withFirebase';
import tasksCollection from '../../firebase/utils/tasksCollection';

import { Task } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  firebase: Firebase;
}

const NewTask: React.FC<Props> = ({ firebase }) => {
  const [toDo, setToDo] = useState<Task>({
    name: '',
    description: '',
    taskType: 'Other',
    specialInput: {},
    price: null,
    concluded: false,
    userOrigin: firebase.user!,
  });

  const history = useHistory();

  const deliver = (task: Task) => {
    tasksCollection(firebase, null)
      .add(task)
      .catch((err: Error) =>
        swal('Hmm task was not created', `${err}`, 'error')
      );

    swal('Success!', `Task "${task.name}" has been created`, 'success').then(
      () => history.push('/')
    );
  };

  if (toDo.userOrigin === undefined && firebase.user !== undefined) {
    setToDo({ ...toDo, userOrigin: firebase.user! });
  }

  const nameField = useRef(null);
  const deadlineField = useRef(null);
  const foodCarbsField = useRef(null);
  const foodFatField = useRef(null);
  const foodProteinField = useRef(null);

  return (
    <form
      className='forms'
      onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        handleSubmit(e, toDo, deliver, {
          nameField,
          deadlineField,
          foodCarbsField,
          foodFatField,
          foodProteinField,
        })
      }
    >
      <Link to='/'>
        <span className='exit'>{'\u2716'}</span>
      </Link>

      <h1>Create a new Task</h1>
      <label>
        Name <span className='required'>*</span>
        <input
          type='text'
          name='toDoName'
          placeholder='Task name (required)'
          ref={nameField}
          onChange={(input) => handleChange(input, setToDo, toDo)}
        />
      </label>

      <label>
        Category Type
        <select
          name='toDoType'
          defaultValue='Other'
          onChange={(input) => handleChange(input, setToDo, toDo)}
        >
          <option value='Other'>Other</option>
          <option value='Food'>Food</option>
          <option value='Work'>Work</option>
        </select>
      </label>

      {toDo.taskType === 'Food' && (
        <fieldset>
          <label>
            Carbohydrates <span className='required'>*</span>
            <input
              type='number'
              className='foodCarbs'
              name='foodCarbs'
              placeholder='In grams (required)'
              ref={foodCarbsField}
              onChange={(input) => handleChange(input, setToDo, toDo)}
            />
          </label>

          <label>
            Fat <span className='required'>*</span>
            <input
              type='number'
              className='foodFat'
              name='foodFat'
              placeholder='In grams (required)'
              ref={foodFatField}
              onChange={(input) => handleChange(input, setToDo, toDo)}
            />
          </label>

          <label>
            Protein <span className='required'>*</span>
            <input
              type='number'
              className='foodProtein'
              name='foodProtein'
              placeholder='In grams (required)'
              ref={foodProteinField}
              onChange={(input) => handleChange(input, setToDo, toDo)}
            />
          </label>
        </fieldset>
      )}

      {toDo.taskType === 'Work' && (
        <fieldset>
          <label>
            Deadline <span className='required'>*</span>
            <input
              type='date'
              className='workDeadline'
              name='workDeadline'
              placeholder='Format yyyy-mm-dd (required)'
              ref={deadlineField}
              onChange={(input) => handleChange(input, setToDo, toDo)}
            />
          </label>
        </fieldset>
      )}

      <label>
        Description
        <input
          type='text'
          name='toDoDesc'
          placeholder='Description of your task'
          onChange={(input) => handleChange(input, setToDo, toDo)}
        />
      </label>

      <label>
        Price
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          onChange={(input) => handleChange(input, setToDo, toDo)}
        />
      </label>

      <button className='btn' type='submit'>
        Create Task
      </button>
    </form>
  );
};

export default withFirebase(NewTask);
