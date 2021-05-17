import { Link } from 'react-router-dom';

import EditTaskForm from '../forms/EditTaskForm';

import { Task } from '../../interfaces';

interface Props {
  location: {
    state: Task | undefined
  }
};

const EditTask: React.FC<Props> = (props) => {
  if(props.location.state === undefined) {
    return (
      <div>
        <h1>You look lost</h1>
        <Link to='/'>Back to Tasks</Link>
      </div>
    )
  } else {
    const { state } = props.location;
    return <EditTaskForm state={ state } />
  }
};

export default EditTask;
