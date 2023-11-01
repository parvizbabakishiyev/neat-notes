import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useApiNotes from '../../services/useApiNotes';

export default function useUnshareNote() {
  const queryClient = useQueryClient();
  const { unshareNote: unshareNoteApi } = useApiNotes();
  const {
    mutate: unshareNote,
    data: note,
    isPending,
  } = useMutation({
    mutationFn: async ({ note, email }) => await unshareNoteApi(note.id, email),
    mutationKey: ['notes', 'unshare'],
    onError: () => {
      toast.error('Cannot unshare the note');
    },
    onSuccess: (_data, { note }) => {
      queryClient.refetchQueries(['notes', note.isArchived ? 'archived' : 'all']);
    },
  });

  return { unshareNote, note, isPending };
}
