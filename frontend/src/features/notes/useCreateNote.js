import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useCreateNote() {
  const queryClient = useQueryClient();
  const { createNote: createNoteApi } = useApiNotes();
  const {
    mutate: createNote,
    data: note,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ note }) => await createNoteApi(note?.title, note?.textContent, note?.tags, note?.colorHex),
    mutationKey: ['notes', 'create'],
    onError: () => {
      toast.error('Cannot create a note');
    },
    onSuccess: ({ note }) => {
      queryClient.setQueryData(['notes', 'all'], oldNotes => (oldNotes ? [note, ...oldNotes] : oldNotes));
      queryClient.refetchQueries({ queryKey: ['notes', 'all'] });
    },
  });

  return { createNote, note, isPending, isSuccess, isError, error };
}
