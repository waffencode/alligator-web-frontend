import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import ApiContext from '../../features/api-context';

type Props = {
  children: any;
  rejectNavigateTo: string;
};

const Authenticated = (props: Props) => {
  const { api } = useContext(ApiContext);

  const isAuthenticated = api.isLoggedIn();

  function _Content() {
    if (isAuthenticated) {
      return props.children;
    }
    return <Navigate to={props.rejectNavigateTo} replace />;
  }

  return _Content();
};

export default Authenticated;
