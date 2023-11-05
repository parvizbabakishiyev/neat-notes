import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useUpdateNote() {
  const queryClient = useQueryClient();
  const { updateNote: updateNoteApi } = useApiNotes();
  const {
    mutate: updateNote,
    data: note,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ note }) =>
      await updateNoteApi(note.id, note?.title, note?.textContent, note?.tags, note?.colorHex),
    mutationKey: ['notes', 'update'],
    onMutate: async ({ note }) => {
      await queryClient.cancelQueries(['notes', note.isArchived ? 'archived' : 'all']);

      const oldNotes = queryClient.getQueryData(['notes', note.isArchived ? 'archived' : 'all']);

      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], oldNotes =>
        oldNotes ? oldNotes.map(oldNote => (oldNote.id === note.id ? { ...oldNote, ...note } : oldNote)) : oldNotes,
      );
      return { oldNotes };
    },
    onError: (_err, { note }, ctx) => {
      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], ctx.oldNotes);
      toast.error('Cannot update the note');
    },
    onSuccess: (_data, { note }) => {
      queryClient.refetchQueries({ queryKey: ['notes', note.isArchived ? 'archived' : 'all'] });
    },
  });

  return { updateNote, note, isPending, isSuccess, isError, error };
}
