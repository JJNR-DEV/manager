import Navigation from '../../Navigation';
import TaskList from '../TaskList';
import NewTaskBtn from '../newTaskBtn';

import { Task } from '../../../interfaces';

interface Props {
  allTasks: Task[]
  disable: boolean
};

const ToDo: React.FC<Props> = ({ allTasks, disable }) => {
  const tasksTodo = allTasks.filter(task => task.concluded === false);

  return (
    <>
      <Navigation />
      <main className='mainContainer'>
        { tasksTodo.length > 0
          ? <TaskList tasks={ tasksTodo } />
          : <span className='emptyList'>You have no tasks to do</span>
        }
      </main>
      <NewTaskBtn disable={ disable } />
    </>
  )
};

export default ToDo;
