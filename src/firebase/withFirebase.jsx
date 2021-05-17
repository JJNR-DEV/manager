import { FirebaseContext } from '.';

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    { firebase => <Component { ...props } firebase={ firebase } /> }
  </FirebaseContext.Consumer>
);
