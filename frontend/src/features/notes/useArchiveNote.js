import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useApiNotes from '../../services/useApiNotes';

export default function useTrashNote() {
  const queryClient = useQueryClient();
  const { archiveNote: archiveNoteApi } = useApiNotes();
  const {
    mutate: archiveNote,
    data: note,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async ({ note }) => await archiveNoteApi(note.id),
    mutationKey: ['notes', 'archive'],
    onMutate: async vars => {
      const newNote = { ...vars.note, isArchived: true };
      await queryClient.cancelQueries(['notes', 'all']);
      await queryClient.cancelQueries(['notes', 'archived']);
      const prevDataNotesAll = queryClient.getQueryData(['notes', 'all']);
      const prevDataNotesArchived = queryClient.getQueryData(['notes', 'archived']);

      queryClient.setQueryData(['notes', 'all'], oldNotes =>
        oldNotes ? oldNotes.filter(oldNote => oldNote.id !== vars.note.id) : oldNotes,
      );

      queryClient.setQueryData(['notes', 'archived'], oldNotes => (oldNotes ? [newNote, ...oldNotes] : oldNotes));

      return { prevDataNotesAll, prevDataNotesArchived };
    },
    onError: (_err, _data, ctx) => {
      toast.error('Cannot archive the note');
      queryClient.setQueryData(['notes', 'all'], ctx.prevDataNotesAll);
      queryClient.setQueryData(['notes', 'archived'], ctx.prevDataNotesArchived);
    },
    onSuccess: () => {
      toast.success('Note archived');
      queryClient.refetchQueries({ queryKey: ['notes', 'all'] });
      queryClient.refetchQueries({ queryKey: ['notes', 'archived'] });
    },
  });

  return { archiveNote, note, isPending, isSuccess, isError };
}
