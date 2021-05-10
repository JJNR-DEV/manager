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
      <div>Not well done</div>
    )
  } else {
    const { state } = props.location;
    return <EditTaskForm state={ state } />
  }
};

export default EditTask;
