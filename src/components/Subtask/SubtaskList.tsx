import { Link } from 'react-router-dom';

import SubtaskItem from './SubtaskItem';

import { Subtask } from '../../interfaces';

interface Props {
  subtasks: Subtask[]
  parentId: string
  parentName: string
  taskPrice: number | null
  parentUserOrigin: string
  parentCategory: string
};

const SubtaskList: React.FC<Props> = ({
  subtasks,
  parentId,
  parentName,
  parentUserOrigin,
  parentCategory,
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
            parentCategory={ parentCategory }
            parentUserOrigin={ parentUserOrigin } />
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
          parentUserOrigin
        }
      }}>{'\u002B'} Add a subtask</Link>
    </div>
  );
};

export default SubtaskList;
