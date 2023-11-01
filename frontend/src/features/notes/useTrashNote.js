import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useApiNotes from '../../services/useApiNotes';

export default function useTrashNote() {
  const queryClient = useQueryClient();
  const { trashNote: trashNoteApi } = useApiNotes();
  const {
    mutate: trashNote,
    data: note,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async ({ note }) => await trashNoteApi(note.id),
    mutationKey: ['notes', 'trash'],
    onMutate: async ({ note }) => {
      const newNote = { ...note, isTrashed: true };

      await queryClient.cancelQueries(['notes', 'archived']);
      await queryClient.cancelQueries(['notes', 'trashed']);

      const prevDataNotesFrom = queryClient.getQueryData(['notes', note.isArchived ? 'archived' : 'all']);
      const prevDataNotesTo = queryClient.getQueryData(['notes', 'trashed']);

      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], oldNotes =>
        oldNotes ? oldNotes.filter(oldNote => oldNote.id !== note.id) : oldNotes,
      );
      queryClient.setQueryData(['notes', 'trashed'], oldNotes => (oldNotes ? [newNote, ...oldNotes] : oldNotes));

      return { prevDataNotesFrom, prevDataNotesTo };
    },
    onError: (_err, { note }, ctx) => {
      toast.error('Cannot trash the note');
      queryClient.setQueryData(['notes', note.isArchived ? 'archived' : 'all'], ctx.prevDataNotesFrom);
      queryClient.setQueryData(['notes', 'trashed'], ctx.prevDataNotesTo);
    },
    onSuccess: ({ note }) => {
      toast.success('Note trashed');
      queryClient.refetchQueries(['notes', note.isArchived ? 'archived' : 'all']);
      queryClient.refetchQueries(['notes', 'trashed']);
    },
  });

  return { trashNote, note, isPending, isSuccess, isError };
}
