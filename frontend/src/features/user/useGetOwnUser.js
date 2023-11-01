import { useQuery } from '@tanstack/react-query';
import useApiUsers from '../../services/useApiUsers';

export default function useGetOwnUser() {
  const { getOwnUser } = useApiUsers();
  const {
    data: user,
    isPending,
    isSuccess,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryFn: async () => await getOwnUser(),
    queryKey: ['user'],
  });

  return {
    user,
    isPending,
    isSuccess,
    isError,
    isFetching,
    error,
    refetch,
  };
}
