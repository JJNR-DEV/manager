import SubtaskForm from '../forms/NewSubtaskForm';

import { SubtaskParentElements } from '../../interfaces';

interface Props {
  location: {
    state: SubtaskParentElements | undefined
  }
};

const NewSubtask: React.FC<Props> = (props) => {
  if(props.location.state === undefined) {
    return (
      <div>You seem lost</div>
    )
  } else {
    const {
      parentId,
      parentName,
      parentTaskId
    } = props.location.state;

    return <SubtaskForm
      parentId={ parentId }
      parentName={ parentName }
      parentTaskId={ parentTaskId } />
  }
};

export default NewSubtask;
