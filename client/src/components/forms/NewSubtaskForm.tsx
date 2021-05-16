import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import { handleChange } from './formHandlers/handleChange';
import { withFirebase } from '../../firebase/withFirebase';
import { emptyFields } from './formHandlers/formValidations';

import { Subtask } from '../../interfaces';
import { Firebase } from '../../firebase';

interface Props {
  firebase: Firebase
  parentId: string
  parentName: string
  parentUserOrigin: string
};

const NewSubtask: React.FC<Props> = ({
  firebase,
  parentId,
  parentName,
  parentUserOrigin
}) => {
  const [ subtask, setSubtask ] = useState<Subtask>({
    name: '',
    price: null,
    done: false
  });

  const history = useHistory();

  const deliver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emptyFields(subtask.name.toString())) return;

    firebase.userTasks(parentUserOrigin).doc(parentId).collection('taskSubtasks').add(subtask)
      .catch((err: Error) => console.error(`Hmm subtask was not created: ${ err }`));

    swal('Success!', `Subtask "${ subtask.name }" has been added to "${ parentName }"`, 'success')
      .then(() => history.goBack());
  };

  return (
    <form className='forms' onSubmit={ deliver }>
      <span className='exit' onClick={ () => history.goBack() }>{ '\u2716' }</span>

      <h1>Add a Subtask</h1>
      <span style={{ textAlign: 'center' }}>This will be added to the "{ parentName }" task</span>
      <br />

      <label>
        Subtask Name
        <input
          type='text'
          name='toDoName'
          onChange={ (input) => handleChange(input, setSubtask, subtask) } />
      </label>

      <label>
        Price (optional)
        <input
          type='number'
          name='toDoPrice'
          placeholder='Value in SEK'
          onChange={ (input) => handleChange(input, setSubtask, subtask) } />
      </label>

      <button className='btn' type='submit'>Add Subtask</button>
    </form>
  );
};

export default withFirebase(NewSubtask);
