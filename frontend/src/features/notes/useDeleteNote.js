import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiNotes from '../../services/useApiNotes';
import toast from 'react-hot-toast';

export default function useDeleteNote() {
  const { deleteNote: deleteNoteApi } = useApiNotes();
  const queryClient = useQueryClient();
  const { mutate: deleteNote } = useMutation({
    mutationFn: async ({ note }) => await deleteNoteApi(note.id),
    mutationKey: ['notes', 'delete'],
    onMutate: async ({ note }) => {
      await queryClient.cancelQueries(['notes', 'trashed']);

      const prevDataNotesTrashed = queryClient.getQueryData(['notes', 'trashed']);

      queryClient.setQueryData(['notes', 'trashed'], oldNotes =>
        oldNotes ? oldNotes.filter(oldNote => oldNote.id !== note.id) : oldNotes,
      );

      return { prevDataNotesTrashed };
    },
    onError: (_err, _vars, ctx) => {
      toast.error('Cannot delete the note');
      queryClient.setQueryData(['notes', 'trashed'], ctx.prevDataNotesTrashed);
    },
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.refetchQueries({ queryKey: ['notes', 'trashed'] });
    },
  });

  return { deleteNote };
}
