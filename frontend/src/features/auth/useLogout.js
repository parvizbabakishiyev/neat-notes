import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from './AuthContextProvider';
import useApiAuth from '../../services/useApiAuth';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
  const { logoutCtx } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout: logoutApi } = useApiAuth();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => await logoutApi(),
    onSettled: (_data, _error, vars) => {
      logoutCtx(); // sync context
      queryClient.clear(); // clear query cache
      queryClient.cancelQueries();
      queryClient.removeQueries();
      navigate('/login', vars?.navOptions); // navigate to login page
    },
  });

  return { logout, isPending };
}
