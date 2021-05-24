import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const Navigation: React.FC<RouteComponentProps> = (props) => {
  const current = props.location.pathname;

  return (
    <nav className='navigationParent'>
      <div className={ current === '/' ?
        'navigationCurrent' :
        'navigationElement' }>
          <Link to="/">To Do</Link>
      </div>

      <div className={ current === '/done' ?
        'navigationCurrent' :
        'navigationElement' }>
          <Link to="/done">Done</Link>
      </div>
    </nav>
  )
}

export default withRouter(Navigation);
