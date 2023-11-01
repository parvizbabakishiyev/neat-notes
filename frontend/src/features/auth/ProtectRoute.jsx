import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContextProvider';

export default function ProtectRoute({ children }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
}

ProtectRoute.propTypes = {
  children: PropTypes.node,
};
