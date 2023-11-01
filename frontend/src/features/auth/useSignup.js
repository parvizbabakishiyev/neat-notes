import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContextProvider';
import useApiAuth from '../../services/useApiAuth';

export default function useSignup() {
  const { loginCtx } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { signup: signupApi } = useApiAuth();
  const {
    mutate: signup,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: async ({ firstname, lastname, email, password, passwordConfirm }) =>
      await signupApi(firstname, lastname, email, password, passwordConfirm),
    onSuccess: async data => {
      loginCtx(data.accessToken);
      queryClient.setQueryData(['user'], data.user);
      navigate('/notes', { replace: true });
    },
  });

  return { signup, isPending, error, reset };
}
