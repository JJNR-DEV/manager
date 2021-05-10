import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import swal from 'sweetalert';

import { handleChange } from './formHandlers/handleChange';
import { withFirebase } from '../../firebase/withFirebase';
import { emptyFields } from './formHandlers/formValidations';

import { Subtask } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  firebase: Firebase
  parentId: string | undefined
  parentName: string
  parentTaskId: number
};

const NewSubtask: React.FC<Props> = (props) => {
  const [ subtask, setSubtask ] = useState<Subtask>({
    name: '',
    price: null,
    done: false
  });

  const history = useHistory();

  const deliver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emptyFields(subtask.name.toString())) return;

    props.firebase.userTasks.doc(props.parentId).collection('taskSubtasks').add(subtask)
      .then(() => {
        swal('Success!', `Subtask "${ subtask.name }" has been added to "${ props.parentName }"`, 'success')
          .then(() => history.goBack());
      })
      .catch((err: Error) => console.error(`Hmm subtask was not created: ${ err }`));
  };

  return (
    <form className='forms' onSubmit={ deliver }>

      <Link to='/'>
        <span className='exit'>
          { '\u2716' }
        </span>
      </Link>

      <h1>Add a Subtask</h1>
      <span style={{ textAlign: 'center' }}>This will be added to the "{ props.parentName }" task</span>
      <br />
      <label>
        Name
        <input type='text' name='toDoName' onChange={ (input) => handleChange(input, setSubtask, subtask) } />
      </label>

      <label>
        Price (optional)
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          onChange={ (input) => handleChange(input, setSubtask, subtask) }
        />
      </label>

      <button className='btn' type='submit'>
        Add Subtask
      </button>
    </form>
  );
};

export default withFirebase(NewSubtask);
