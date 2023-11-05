import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useRestoreNote() {
  const queryClient = useQueryClient();
  const { unarchiveNote: unarchiveNoteApi } = useApiNotes();
  const {
    mutate: unarchiveNote,
    data: note,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async ({ note }) => await unarchiveNoteApi(note.id),
    mutationKey: ['notes', 'unarchive'],
    onMutate: async vars => {
      const newNote = { ...vars.note, isArchived: false };
      await queryClient.cancelQueries(['notes', 'all']);
      await queryClient.cancelQueries(['notes', 'archived']);
      const prevDataNotesAll = queryClient.getQueryData(['notes', 'all']);
      const prevDataNotesArchived = queryClient.getQueryData(['notes', 'archived']);

      queryClient.setQueryData(['notes', 'archived'], oldNotes =>
        oldNotes ? oldNotes.filter(oldNote => oldNote.id !== vars.note.id) : oldNotes,
      );

      queryClient.setQueryData(['notes', 'all'], oldNotes => (oldNotes ? [newNote, ...oldNotes] : oldNotes));

      return { prevDataNotesAll, prevDataNotesArchived };
    },
    onError: (_err, _data, ctx) => {
      toast.error('Cannot unarchive the note');
      queryClient.setQueryData(['notes', 'all'], ctx.prevDataNotesAll);
      queryClient.setQueryData(['notes', 'archived'], ctx.prevDataNotesArchived);
    },
    onSuccess: () => {
      toast.success('Note is unarchived');
      queryClient.refetchQueries({ queryKey: ['notes', 'all'] });
      queryClient.refetchQueries({ queryKey: ['notes', 'archived'] });
    },
  });

  return { unarchiveNote, note, isPending, isSuccess, isError };
}
