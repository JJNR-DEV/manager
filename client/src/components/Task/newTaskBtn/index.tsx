import { useHistory } from 'react-router-dom';

interface Props {
  disable: boolean
}

const NewTaskBtn: React.FC<Props> = ({ disable }) => {
  const history = useHistory();
  const handleRedirect = () => history.push('/new-task');

  return (
    <footer className='newTaskBtn'>
      <button
        className='linkBtn'
        disabled={ disable }
        onClick={ handleRedirect }>
          Create Task
      </button>
    </footer>
  )
}

export default NewTaskBtn;
