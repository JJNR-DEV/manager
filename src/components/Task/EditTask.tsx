import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import EditTaskForm from '../forms/EditTaskForm';

import { Task } from '../../interfaces';

interface Props {
  location: {
    state: Task | undefined
  }
};

const EditTask: React.FC<Props> = (props) => {
  const history = useHistory();
  const { state } = props.location;

  if(state === undefined) {
    swal({
      title: 'No task selected',
      text: 'You need to click on the edit button of the task you want to edit',
      icon: 'error'
    }).then(() => history.push('/'));

    return (
      <div>
        <svg className="spinner" viewBox="0 0 50 50">
          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </div>
    );
  } else {
    return <EditTaskForm state={ state } />
  }
};

export default EditTask;
