import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../features/auth/AuthContextProvider';
import useLogout from '../features/auth/useLogout';
import useApiAuth from '../services/useApiAuth';

export default function useFetch() {
  const { logout } = useLogout();
  const { refreshToken } = useApiAuth();
  // get the access token from the context store
  let { accessToken, setAccessToken, refreshMutex } = useAuthContext();

  const fetchInterceptor = async (url, options = {}) => {
    // acquire lock, one refresh to backend at a time
    const release = await refreshMutex.acquire();

    let decoded, isExpired;
    const newOptions = { ...options, credentials: 'include' };

    try {
      // decode the token, calculate the expiry
      decoded = jwtDecode(accessToken.current);
      isExpired = Math.ceil(decoded.exp - new Date().getTime() / 1000) > 1 ? false : true;
    } catch (err) {
      // ignore the jwt decode error
    }

    if (isExpired || !decoded) {
      // refresh the access token, it's expired
      try {
        const { data } = await refreshToken();

        // set access tokens
        setAccessToken(data.accessToken);
        // await new Promise(r => setTimeout(r, 2000));

        // add auth header
        newOptions.headers = { ...newOptions.headers, Authorization: `Bearer ${data.accessToken}` };
      } catch (err) {
        // log out the user
        logout({
          navOptions: {
            replace: true,
            state: {
              loginMessage:
                err.response.status === 429
                  ? 'Application is busy, please try to login later'
                  : 'Session is expired, please re-login',
            },
          },
        });
      }
    } else {
      // add auth header from auth since it's not expired
      newOptions.headers = { ...newOptions.headers, Authorization: `Bearer ${accessToken.current}` };
    }

    // actual fetch and return
    const respOriginal = await fetch(url, newOptions);

    let dataOriginal;
    respOriginal.status === 204 ? (dataOriginal = '') : (dataOriginal = await respOriginal.json());
    if (!respOriginal.ok) {
      const error = new Error('Request is failed');
      error.data = dataOriginal;
      release();
      return Promise.reject(error);
    }

    // release mutex lock
    release();
    return Promise.resolve(dataOriginal);
  };

  return { fetchInterceptor };
}
