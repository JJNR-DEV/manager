import { FirebaseContext } from '.';

const withFirebase = (Component: React.FC<any>) => (props: any) =>
  (
    <FirebaseContext.Consumer>
      {(firebase: any) => (
        <Component {...props} firebase={ firebase } />
      )}
    </FirebaseContext.Consumer>
  );

export default withFirebase;
