import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';

export default function useShareNote() {
  const queryClient = useQueryClient();
  const { shareNote: shareNoteApi } = useApiNotes();
  const {
    mutate: shareNote,
    data: note,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: async ({ note, email }) => await shareNoteApi(note.id, email),
    mutationKey: ['notes', 'share'],
    onSuccess: (_data, { note }) => {
      queryClient.refetchQueries({ queryKey: ['notes', note.isArchived ? 'archived' : 'all'] });
    },
  });

  return { shareNote, note, isPending, error, reset };
}
