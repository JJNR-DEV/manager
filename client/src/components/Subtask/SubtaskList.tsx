import { Link } from 'react-router-dom';

import SubtaskItem from './SubtaskItem';

import { Subtask } from '../../interfaces';

interface Props {
  subtasks: Subtask[]
  color: string
  parentId: string | undefined
  parentName: string
  parentTaskId: number
  taskPrice: number | null
};

const SubtaskList: React.FC<Props> = ({
  subtasks,
  color,
  parentId,
  parentName,
  parentTaskId,
  taskPrice
}) => {
  let totalPrice: number = 0;

  return (
    <div className='subtasksList'>
      {
        subtasks !== null && subtasks!.map((subtask: Subtask, i: number) => {
          if(subtask.price !== null && !subtask.done) {
            totalPrice = totalPrice + subtask.price;
          }

          return <SubtaskItem
            key={ i }
            parentId={ parentId }
            subtask={ subtask }
            color={ color } />
        })
      }

      {
        totalPrice !== 0 && taskPrice !== null && totalPrice > taskPrice &&
          <span className='totalPrice'>You went over { totalPrice - taskPrice }kr</span>
      }

      <Link className='addSubtask' to={{
        pathname: '/new-subtask',
        state: {
          parentId,
          parentName,
          parentTaskId
        }
      }}>
        {'\u002B'} Add a subtask
      </Link>
    </div>
  );
};

export default SubtaskList;
