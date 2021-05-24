import { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

import { handleChange } from './formHandlers/handleChange';
import { handleSubmit } from './formHandlers/handleSubmit';
import withFirebase from '../../firebase/withFirebase';
import tasksCollection from '../../firebase/utils/tasksCollection';
import latestUpdate from '../../firebase/utils/latestUpdate';

import { Task } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  firebase: Firebase
  state: Task
}

const EditTask: React.FC<Props> = ({ firebase, state }) => {
  const [ toDo, setToDo ] = useState<Task>({
    id: state.id,
    name: state.name,
    description: state.description,
    taskType: state.taskType,
    specialInput: state.specialInput,
    price: state.price,
    concluded: state.concluded,
    userOrigin: state.userOrigin
  });

  const history = useHistory();

  const deliver = (task: Task) => {
    tasksCollection(firebase, toDo.userOrigin).doc(toDo.id).update(toDo)
      .catch((err: Error) => console.error(`Hmm task was not edited: ${ err }`));

    // Keep record of who made the latest update
    latestUpdate(firebase, toDo.userOrigin, toDo.id!);

    swal('Success!', `Task "${ task.name }" has been edited`, 'success')
      .then(() => history.goBack());
  };

  const nameField = useRef(null);
  const deadlineField = useRef(null);
  const foodCarbsField = useRef(null);
  const foodFatField = useRef(null);
  const foodProteinField = useRef(null);

  return (
    <form className='forms' onSubmit={
      (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, toDo, deliver, {
        nameField,
        deadlineField,
        foodCarbsField,
        foodFatField,
        foodProteinField
      }) }>

      <Link to='/'>
        <span className='exit'>{ '\u2716' }</span>
      </Link>

      <h1>Edit Task { `"${ state!.name }"` }</h1>
      <label>
        Name <span className='required'>*</span>
        <input
          type='text'
          name='toDoName'
          defaultValue={ toDo.name }
          placeholder='Task name (required)'
          ref={ nameField }
          onChange={ (input) => handleChange(input, setToDo, toDo) } />
      </label>

      <label>
        Type
        <select
          name='toDoType'
          defaultValue={ toDo.taskType }
          onChange={ (input) => handleChange(input, setToDo, toDo) }>
            <option value='Other'>Other</option>
            <option value='Food'>Food</option>
            <option value='Work'>Work</option>
        </select>
      </label>

      {
        toDo.taskType === 'Food' && (
          <fieldset>
            <label>
              Carbohydrates <span className='required'>*</span>
              <input
                type='number'
                className='foodCarbs'
                name='foodCarbs'
                placeholder='In grams (required)'
                defaultValue={ toDo.specialInput!.foodCarbs }
                ref={ foodCarbsField }
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>

            <label>
              Fat <span className='required'>*</span>
              <input
                type='number'
                className='foodFat'
                name='foodFat'
                placeholder='In grams (required)'
                defaultValue={ toDo.specialInput!.foodFat }
                ref={ foodFatField }
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>

            <label>
              Protein <span className='required'>*</span>
              <input
                type='number'
                className='foodProtein'
                name='foodProtein'
                placeholder='In grams (required)'
                defaultValue={ toDo.specialInput!.foodProtein }
                ref={ foodProteinField }
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>
          </fieldset>
        )
      }

      {
        toDo.taskType === 'Work' && (
          <fieldset>
            <label>
              Deadline <span className='required'>*</span>
              <input
                type='date'
                className='workDeadline'
                name='workDeadline'
                placeholder='Format yyyy-mm-dd (required)'
                ref={ deadlineField }
                defaultValue={ `${ toDo.specialInput!.workDeadline }` }
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>
          </fieldset>
        )
      }

      <label>
        Description
        <input
          type='text'
          name='toDoDesc'
          placeholder='Description of your task'
          defaultValue={ toDo.description }
          onChange={ (input) => handleChange(input, setToDo, toDo) } />
      </label>

      <label>
        Price
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          defaultValue={ toDo.price! }
          onChange={ (input) => handleChange(input, setToDo, toDo) }
        />
      </label>

      <button className='btn' type='submit'>Edit Task</button>
    </form>
  );
};

export default withFirebase(EditTask);
