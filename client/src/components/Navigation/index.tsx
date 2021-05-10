import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const Navigation: React.FC<RouteComponentProps> = (props) => {
  const current = props.location.pathname;

  return (
    <nav className='navigationParent'>
        <div className={ current === '/' ?
          'navigationCurrent' :
          'navigationElement' }
          style={{ borderLeft: 'none' }}>
            <Link to="/">
              To Do
            </Link>
        </div>

        <div className={ current === '/done' ?
          'navigationCurrent' :
          'navigationElement' }
          style={{ borderRight: 'none' }}>
            <Link to="/done">
              Done
            </Link>
        </div>
    </nav>
  )
}

export default withRouter(Navigation);
