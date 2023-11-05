import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useRestoreNote() {
  const queryClient = useQueryClient();
  const { restoreNote: restoreNoteApi } = useApiNotes();
  const {
    mutate: restoreNote,
    data: note,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async ({ note }) => await restoreNoteApi(note.id),
    mutationKey: ['notes', 'restore'],

    onMutate: async ({ note }) => {
      const newNote = { ...note, isTrashed: false };

      await queryClient.cancelQueries(['notes', note.isArchived ? 'archived' : 'all']);
      await queryClient.cancelQueries(['notes', 'trashed']);

      const prevDataNotesFrom = queryClient.getQueryData(['notes', 'trashed']);
      const prevDataNotesTo = queryClient.getQueryData(['notes', note.isArchived ? 'archived' : 'all']);

      queryClient.setQueryData(['notes', 'trashed'], oldNotes =>
        oldNotes ? oldNotes.filter(oldNote => oldNote.id !== note.id) : oldNotes,
      );
      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], oldNotes =>
        oldNotes ? [newNote, ...oldNotes] : oldNotes,
      );

      return { prevDataNotesFrom, prevDataNotesTo };
    },
    onError: (_err, { note }, ctx) => {
      toast.error('Cannot restore the note');
      queryClient.setQueryData(['notes', 'trashed'], ctx.prevDataNotesFrom);
      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], ctx.prevDataNotesTo);
    },
    onSuccess: ({ note }) => {
      toast.success('Note is restored');
      queryClient.refetchQueries({ queryKey: ['notes', note.isArchived ? 'archived' : 'all'] });
      queryClient.refetchQueries({ queryKey: ['notes', 'trashed'] });
    },
  });

  return { restoreNote, note, isPending, isSuccess, isError };
}
