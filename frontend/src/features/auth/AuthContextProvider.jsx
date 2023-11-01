import { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Mutex } from 'async-mutex';
import { useLocalStorageState } from '../../hooks/useLocaleStorage';

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const accessToken = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState('isAuthenticated');
  const refreshMutex = new Mutex();

  const setAccessToken = newAccessToken => {
    accessToken.current = newAccessToken;
  };

  const loginCtx = accessToken => {
    setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  const logoutCtx = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        loginCtx,
        logoutCtx,
        setAccessToken,
        refreshMutex,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'AuthContext was used outside of its provider, wrap your component with the AuthContextProvider to use the context',
    );
  }
  return context;
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};
