import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import SubtaskForm from '../forms/NewSubtaskForm';

import { SubtaskParentElements } from '../../interfaces';

interface Props {
  location: {
    state: SubtaskParentElements | undefined
  }
}

const NewSubtask: React.FC<Props> = (props) => {
  const history = useHistory();

  if(props.location.state === undefined) {
    swal({
      title: 'No task selected',
      text: 'You need to click on the "Add subtask" option of the task to which you want to add a subtask',
      icon: 'error'
    }).then(() => history.push('/'));

    return (
      <div>
        <svg className='spinner' viewBox='0 0 50 50'>
          <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
        </svg>
      </div>
    );
  } else {
    const {
      parentId,
      parentName,
      parentUserOrigin
    } = props.location.state;

    return <SubtaskForm
      parentId={ parentId }
      parentName={ parentName }
      parentUserOrigin={ parentUserOrigin } />
  }
};

export default NewSubtask;
