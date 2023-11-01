import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from './AuthContextProvider';
import useApiAuth from '../../services/useApiAuth';

export default function useLogin() {
  const queryClient = useQueryClient();
  const { loginCtx } = useAuthContext();
  const { login: loginApi } = useApiAuth();
  const navigate = useNavigate();
  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => await loginApi(email, password),
    onSuccess: data => {
      loginCtx(data.accessToken);
      queryClient.setQueryData(['user'], data.user);
      navigate('/notes', { replace: true });
    },
  });

  return { login, isPending, error };
}
