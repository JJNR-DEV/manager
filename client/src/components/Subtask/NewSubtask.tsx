import { Link } from 'react-router-dom';

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
      <div>
        <h1>You look lost</h1>
        <Link to='/'>Back to Tasks</Link>
      </div>
    )
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
