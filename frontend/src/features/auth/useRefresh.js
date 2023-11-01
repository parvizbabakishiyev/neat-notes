import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContextProvider';
import useApiAuth from '../../services/useApiAuth';

export default function useRefresh() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { refreshToken: refreshTokenApi } = useApiAuth();
  const { loginCtx, logoutCtx, refreshMutex } = useAuthContext();
  const {
    data,
    mutate: refreshToken,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ userInfo = false }) => await refreshTokenApi(userInfo),
    onMutate: async () => {
      const release = await refreshMutex.acquire();
      return { release };
    },
    onError: (err, vars) => {
      const loginMessage =
        err.data?.errorCode === 'too_many_requests'
          ? 'Application is too busy, please login later'
          : 'Please login again';
      logoutCtx(); // sync context
      queryClient.clear(); // clear query cache
      navigate('/login', vars?.navOptions || { replace: true, state: { loginMessage } }); // navigate to login page
    },
    onSuccess: ({ data }, vars) => {
      loginCtx(data.accessToken);
      // set query data if user info is requested
      vars.userInfo && queryClient.setQueryData(['user'], data.user);
    },
    onSettled: (_data, _error, _vars, ctx) => {
      ctx.release();
    },
  });

  return { data, refreshToken, isPending, error };
}
