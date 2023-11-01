import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiUsers from '../../services/useApiUsers';

export default function useUpdateOwnUser() {
  const queryClient = useQueryClient();
  const { updateOwnUser: updateOwnUserApi } = useApiUsers();
  const {
    mutate: updateOwnUser,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async ({ firstname, lastname, email }) => await updateOwnUserApi(firstname, lastname, email),
    onSuccess: () => {
      queryClient.refetchQueries(['user']);
    },
  });

  return { updateOwnUser, isPending, isSuccess, error };
}
