import { useQuery } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';

export default function useGetArchivedNotes() {
  const { getArchivedNotes } = useApiNotes();
  const {
    data: notes,
    isPending,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['notes', 'archived'],
    queryFn: async () => {
      const data = await getArchivedNotes();
      return data.notes;
    },
  });

  return { notes, isPending, isSuccess, isError };
}
