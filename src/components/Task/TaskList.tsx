import TaskItem from './TaskItem';
import { Task } from '../../interfaces';

interface Props {
  tasks: Task[];
}

const TaskList: React.FC<Props> = ({ tasks }) => (
  <>
    <h2>Task List</h2>
    <div className='taskList'>
      {tasks.map((task, i) => (
        <TaskItem key={ i } task={ task } user={ null } />
      ))}
    </div>
  </>
);

export default TaskList;
