import { useMutation } from '@tanstack/react-query';
import useApiUsers from '../../services/useApiUsers';

export default function useDeleteOwnUser() {
  const { deleteOwnUser: deleteOwnUserApi } = useApiUsers();
  const {
    mutate: deleteOwnUser,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: async () => await deleteOwnUserApi(),
  });

  return { deleteOwnUser, isPending, isSuccess, isError, error, reset };
}
