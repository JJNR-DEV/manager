import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

import { handleChange } from './formHandlers/handleChange';
import { handleSubmit } from './formHandlers/handleSubmit';
import { withFirebase } from '../../firebase/withFirebase';

import { Task } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  firebase: Firebase
}

const NewTask: React.FC<Props> = (props) => {

  const [ toDo, setToDo ] = useState<Task>({
    name: '',
    description: '',
    taskType: 'Other',
    specialInput: {},
    price: null,
    concluded: false,
    taskId: + `1111${ Date.now() }`,
    userOrigin: 1111
  });

  const history = useHistory();

  const deliver = (task: Task) => {
    props.firebase.userTasks.add(task)
      .catch((err: Error) => console.error(`Hmm task was not created: ${ err }`));

    swal('Success!', `Task "${ task.name }" has been created`, 'success')
      .then(() => history.push('/'));
  };

  return (
    <form className='forms' onSubmit={
      (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, toDo, deliver) }>

      <Link to='/'>
        <span className='exit'>
          {"\u2716"}
        </span>
      </Link>

      <h1>Create a new Task</h1>
      <label>
        Name
        <input type='text' name='toDoName' onChange={ (input) => handleChange(input, setToDo, toDo) } />
      </label>

      <label>
        Type
        <select name='toDoType' defaultValue='Other' onChange={ (input) => handleChange(input, setToDo, toDo) }>
          <option value='Other'>Other</option>
          <option value='Food'>Food</option>
          <option value='Work'>Work</option>
        </select>
      </label>

      {
        toDo.taskType === 'Food' && (
          <fieldset>
            <label>
              Carbohydrates
              <input
                type='number'
                className='foodCarbs'
                name='foodCarbs'
                placeholder='Grams'
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>

            <label>
              Fat
              <input
                type='number'
                className='foodFat'
                name='foodFat'
                placeholder='Grams'
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>

            <label>
              Protein
              <input
                type='number'
                className='foodProtein'
                name='foodProtein'
                placeholder='Grams'
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>
          </fieldset>
        )
      }


      <label>
        Description (optional)
        <input type='text' name='toDoDesc' onChange={ (input) => handleChange(input, setToDo, toDo) } />
      </label>

      {
        toDo.taskType === 'Work' && (
          <fieldset>
            <label>
              Deadline
              <input
                type='date'
                className='workDeadline'
                name='workDeadline'
                placeholder='yyyy-mm-dd'
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>
          </fieldset>
        )
      }

      <label>
        Price (optional)
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          onChange={ (input) => handleChange(input, setToDo, toDo) }
        />
      </label>

      <button className='btn' type='submit'>
        Create Task
      </button>
    </form>
  );
};

export default withFirebase(NewTask);