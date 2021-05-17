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
  state: Task | undefined
}

const EditTask: React.FC<Props> = (props) => {
  const [ toDo, setToDo ] = useState<Task>({
    id: props.state!.id,
    name: props.state!.name,
    description: props.state!.description,
    taskType: props.state!.taskType,
    specialInput: props.state!.specialInput,
    price: props.state!.price,
    concluded: props.state!.concluded,
    userOrigin: props.state!.userOrigin
  });

  const history = useHistory();

  const deliver = (task: Task) => {
    props.firebase.userTasks(toDo.userOrigin).doc(toDo.id).update(toDo)
      .catch((err: Error) => console.error(`Hmm task was not edited: ${ err }`));

    swal('Success!', `Task "${ task.name }" has been edited`, 'success')
      .then(() => history.goBack());
  };

  return (
    <form className='forms' onSubmit={
      (e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, toDo, deliver) }>

      <Link to='/'>
        <span className='exit'>
          {"\u2716"}
        </span>
      </Link>

      <h1>Edit Task { `"${ props.state!.name }"` }</h1>
      <label>
        Name
        <input
          type='text'
          name='toDoName'
          defaultValue={ toDo.name }
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
              Carbohydrates
              <input
                type='number'
                className='foodCarbs'
                name='foodCarbs'
                placeholder='Grams'
                defaultValue={ toDo.specialInput!.foodCarbs }
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
                defaultValue={ toDo.specialInput!.foodFat }
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
                defaultValue={ toDo.specialInput!.foodProtein }
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
              Deadline
              <input
                type='date'
                className='workDeadline'
                name='workDeadline'
                placeholder='yyyy-mm-dd'
                defaultValue={ `${ toDo.specialInput!.workDeadline }` }
                onChange={ (input) => handleChange(input, setToDo, toDo) }
              />
            </label>
          </fieldset>
        )
      }

      <label>
        Description (optional)
        <input
          type='text'
          name='toDoDesc'
          defaultValue={ toDo.description }
          onChange={ (input) => handleChange(input, setToDo, toDo) } />
      </label>

      <label>
        Price (optional)
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          defaultValue={ toDo.price! }
          onChange={ (input) => handleChange(input, setToDo, toDo) }
        />
      </label>

      <button className='btn' type='submit'>
        Edit Task
      </button>
    </form>
  );
};

export default withFirebase(EditTask);
