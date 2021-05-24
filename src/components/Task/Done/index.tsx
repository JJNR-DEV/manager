import Navigation from '../../Navigation';
import TaskList from '../TaskList';
import NewTaskBtn from '../newTaskBtn';

import { Task } from '../../../interfaces';

interface Props {
  allTasks: Task[]
  disable: boolean
};

const ToDo: React.FC<Props> = ({ allTasks, disable }) => {
  const tasksDone = allTasks.filter(task => task.concluded === true);

  return (
    <>
      <Navigation />
      <main className='mainContainer'>
        { tasksDone.length > 0
          ? <TaskList tasks={ tasksDone } />
          : <span className='emptyList'>You have no concluded tasks</span>
        }
      </main>
      <NewTaskBtn disable={ disable }  />
    </>
  )
};

export default ToDo;
