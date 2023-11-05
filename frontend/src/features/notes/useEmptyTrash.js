import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useEmptyTrash() {
  const { emptyTrash: emptyTrashApi } = useApiNotes();
  const queryClient = useQueryClient();
  const {
    mutate: emptyTrash,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async () => await emptyTrashApi(),
    mutationKey: ['notes', 'emptyTrash'],

    onError: () => {
      toast.error('Cannot empty trash');
    },
    onSuccess: () => {
      toast.success('Trash emptied');
      queryClient.refetchQueries({ queryKey: ['notes', 'trashed'] });
    },
  });

  return { emptyTrash, isPending, isSuccess, isError };
}
