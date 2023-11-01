import { useQuery } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';

export default function useGetTrashedNotes() {
  const { getTrashedNotes } = useApiNotes();
  const {
    data: notes,
    isPending,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['notes', 'trashed'],
    queryFn: async () => {
      const data = await getTrashedNotes();
      return data.notes;
    },
  });

  return { notes, isPending, isSuccess, isError };
}
